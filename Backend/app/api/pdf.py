from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
import os
import pypdf
import io
import json
from app.auth.dependency import get_current_user
from app.services.translation_service import translate_text, clean_lang_code
from app.services.tts_service import TTSService
from app.core.config import BACKEND_URL

router = APIRouter(
    prefix="/pdf",
    tags=["PDF Reading Assistant"]
)

def split_text_into_chunks(text: str, max_size: int = 5000) -> list[str]:
    # Splits text by paragraph/sentence borders without splitting words in the middle
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = []
    current_length = 0
    
    for para in paragraphs:
        if len(para) > max_size:
            # First append what we have so far
            if current_chunk:
                chunks.append("\n\n".join(current_chunk))
                current_chunk = []
                current_length = 0
            
            # Split the long paragraph by sentences
            sentences = []
            current_sent = []
            for word in para.split(" "):
                current_sent.append(word)
                if word.endswith((".", "?", "!")):
                    sentences.append(" ".join(current_sent))
                    current_sent = []
            if current_sent:
                sentences.append(" ".join(current_sent))
                
            for sent in sentences:
                if len(sent) > max_size:
                    # Break sentence by word counts
                    words = sent.split(" ")
                    temp_sent = []
                    temp_len = 0
                    for w in words:
                        if temp_len + len(w) + 1 > max_size:
                            chunks.append(" ".join(temp_sent))
                            temp_sent = [w]
                            temp_len = len(w)
                        else:
                            temp_sent.append(w)
                            temp_len += len(w) + 1
                    if temp_sent:
                        chunks.append(" ".join(temp_sent))
                else:
                    if current_length + len(sent) + 2 > max_size:
                        if current_chunk:
                            chunks.append("\n\n".join(current_chunk))
                        current_chunk = [sent]
                        current_length = len(sent)
                    else:
                        current_chunk.append(sent)
                        current_length += len(sent) + 2
        else:
            if current_length + len(para) + 2 > max_size:
                chunks.append("\n\n".join(current_chunk))
                current_chunk = [para]
                current_length = len(para)
            else:
                current_chunk.append(para)
                current_length += len(para) + 2
                
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))
        
    return [c.strip() for c in chunks if c.strip()]

def merge_mp3_files(file_paths: list[str], output_path: str):
    # Combines standard MP3 chunks sequentially using simple file streams
    with open(output_path, "wb") as outfile:
        for path in file_paths:
            if os.path.exists(path):
                with open(path, "rb") as infile:
                    outfile.write(infile.read())

@router.post("/translate")
async def translate_pdf(
    file: UploadFile = File(...),
    source_lang: str = Form("en-US"),
    target_lang: str = Form("hi-IN"),
    current_user = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    # Check file size (10 MB limit)
    pdf_bytes = await file.read()
    if len(pdf_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="PDF size exceeds the maximum limit of 10 MB."
        )

    # Re-verify matching source & target languages
    if clean_lang_code(source_lang) == clean_lang_code(target_lang):
        raise HTTPException(
            status_code=400,
            detail="Source and target language cannot be the same."
        )

    # Initial page count parsing (fails fast if page count is exceeded or PDF is invalid)
    pdf_file = io.BytesIO(pdf_bytes)
    try:
        reader = pypdf.PdfReader(pdf_file)
        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Encrypted PDFs are not supported."
            )
        num_pages = len(reader.pages)
        if num_pages > 100:
            raise HTTPException(
                status_code=400,
                detail="PDF exceeds the maximum page limit of 100 pages."
            )
    except HTTPException as he:
        raise he
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Failed to parse PDF. The file may be invalid, corrupted, or unsupported."
        )

    async def event_generator():
        try:
            # Yield initial status
            yield json.dumps({"status": "processing", "message": "Reading page 1..."}) + "\n"

            # Re-read and extract text page-by-page
            pdf_file_stream = io.BytesIO(pdf_bytes)
            reader_obj = pypdf.PdfReader(pdf_file_stream)
            
            extracted_text = ""
            for idx, page in enumerate(reader_obj.pages):
                page_num = idx + 1
                if page_num > 1:
                    yield json.dumps({
                        "status": "processing",
                        "message": f"Reading page {page_num}..."
                    }) + "\n"
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

            extracted_text = extracted_text.strip()
            if not extracted_text:
                yield json.dumps({
                    "status": "error",
                    "message": "No extractable text found in this PDF."
                }) + "\n"
                return

            # Yield translation step
            yield json.dumps({"status": "processing", "message": "Translating text..."}) + "\n"

            translated_text = translate_text(
                text=extracted_text,
                source_lang=source_lang,
                target_lang=target_lang
            )

            # Split translated text into 3000-5000 character chunks
            chunks = split_text_into_chunks(translated_text, max_size=5000)
            total_chunks = len(chunks)
            
            chunk_files = []
            audio_failed = False
            
            for idx, chunk_text in enumerate(chunks):
                part_num = idx + 1
                yield json.dumps({
                    "status": "processing",
                    "message": f"Generating audio part {part_num}/{total_chunks}..."
                }) + "\n"
                
                chunk_file_path = f"pdf_chunk_{part_num}.mp3"
                try:
                    TTSService.generate_speech(chunk_text, chunk_file_path)
                    chunk_files.append(chunk_file_path)
                except Exception as tts_err:
                    print(f"❌ ElevenLabs chunk generation error: {tts_err}")
                    audio_failed = True
                    break

            if audio_failed:
                # Clean up any partial files
                for f in chunk_files:
                    if os.path.exists(f):
                        os.remove(f)
                yield json.dumps({
                    "status": "warning",
                    "extracted_text": extracted_text,
                    "translated_text": translated_text,
                    "warning": "ElevenLabs API Limit Over: The document was translated successfully, but audio generation failed."
                }) + "\n"
                return

            # Finalize audio merging
            yield json.dumps({"status": "processing", "message": "Finalizing audio..."}) + "\n"
            
            output_file = "output.mp3"
            try:
                merge_mp3_files(chunk_files, output_file)
                # Cleanup temporary chunk files
                for f in chunk_files:
                    if os.path.exists(f):
                        os.remove(f)
            except Exception as merge_err:
                print(f"❌ Failed merging chunked mp3 files: {merge_err}")
                yield json.dumps({
                    "status": "warning",
                    "extracted_text": extracted_text,
                    "translated_text": translated_text,
                    "warning": "The document was translated successfully, but audio joining failed."
                }) + "\n"
                return

            audio_url = f"{BACKEND_URL}/speech/output-audio"

            # Final response
            yield json.dumps({
                "status": "completed",
                "extracted_text": extracted_text,
                "translated_text": translated_text,
                "audio_url": audio_url
            }) + "\n"

        except Exception as e:
            yield json.dumps({"status": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")
