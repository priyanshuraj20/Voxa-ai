from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
import os
import traceback
import json
from app.core.config import BACKEND_URL
from app.services.postprocess_service import improve_transcript

from app.services.speech_service import transcribe_audio
from app.services.translation_service import (
    translate_text,
    clean_lang_code,
)
from app.services.tts_service import TTSService
from fastapi import Depends
from app.auth.dependency import get_current_user


router = APIRouter(
    prefix="/speech",
    tags=["Speech"]
)


# ==========================================================
# Serve Generated Audio
# ==========================================================
@router.get("/output-audio")
async def get_output_audio():
    file_path = "output.mp3"

    if os.path.exists(file_path):
        return FileResponse(
            file_path,
            media_type="audio/mpeg"
        )

    raise HTTPException(
        status_code=404,
        detail="Audio file not found"
    )


# ==========================================================
# Speech → STT → Translation → TTS
# ==========================================================
@router.post("/translate-and-speak")
async def translate_and_speak(
    current_user=Depends(get_current_user),
    file: UploadFile = File(...),
    source_lang: str = Form("en"),
    target_lang: str = Form("hi-IN"),
):

    # ---------------------------------------
    # Validate Languages
    # ---------------------------------------
    if clean_lang_code(source_lang) == clean_lang_code(target_lang):
        raise HTTPException(
            status_code=400,
            detail="Source and target language cannot be the same."
        )

    def event_generator():
        try:
            # Step 1: Uploading/Uplink completed, starting Speech Recognition (Groq Whisper)
            yield json.dumps({"step": 2}) + "\n"

            # =====================================
            # STEP 1 : Speech To Text
            # =====================================
            transcript = transcribe_audio(file, language=source_lang)

            # Step 2: Speech Recognition completed, starting Transcript Correction (Claude Sonnet 4)
            yield json.dumps({"step": 3}) + "\n"
            
            transcript = improve_transcript(transcript)

            # Step 3: Transcript Correction completed, starting Translation (Azure)
            yield json.dumps({"step": 4}) + "\n"

            # =====================================
            # STEP 2 : Translation
            # =====================================
            translated = translate_text(
                text=transcript,
                source_lang=source_lang,
                target_lang=target_lang,
            )
#             await save_translation(

#                 current_user=current_user,

#                  source_text=transcript,

#                 translated_text=translated,

#                 source_language=source_lang,

#                 target_language=target_lang,

# # )

            print("\n" + "=" * 100)
            print("TRANSCRIPT")
            print(transcript)
            print("-" * 100)
            print("TRANSLATED")
            print(translated)
            print("=" * 100 + "\n")

            # Step 4: Translation completed, starting Voice Synthesis (ElevenLabs)
            yield json.dumps({"step": 5}) + "\n"

            # =====================================
            # STEP 3 : Text To Speech
            # =====================================
            output_audio_url = None

            try:
                print("\n" + "=" * 100)
                print("TEXT SENT TO TTS")
                print(translated)
                print("=" * 100 + "\n")

                audio_file = TTSService.generate_speech(translated)

                if audio_file and os.path.exists(audio_file):
                    print(f"✅ Audio Generated Successfully : {audio_file}")
                    print(f"📦 Size : {os.path.getsize(audio_file)} bytes")
                    output_audio_url = f"{BACKEND_URL}/speech/output-audio"
                else:
                    print("❌ output.mp3 was not generated.")

            except Exception as tts_error:
                print("\n❌ TTS ERROR")
                traceback.print_exc()
                output_audio_url = None

            # Step 5: Completed
            yield json.dumps({
                "step": 6,
                "success": True,
                "transcript": transcript,
                "translated_text": translated,
                "output_audio_url": output_audio_url,
            }) + "\n"

        except Exception as e:
            print("\n❌ PIPELINE FAILED")
            traceback.print_exc()
            yield json.dumps({
                "step": 0,
                "success": False,
                "error": str(e)
            }) + "\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")