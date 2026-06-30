from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import os
import traceback

from app.services.speech_service import transcribe_audio
from app.services.translation_service import (
    translate_text,
    clean_lang_code,
)
from app.services.tts_service import TTSService

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

    try:

        # =====================================
        # STEP 1 : Speech To Text
        # =====================================
        transcript = transcribe_audio(file)

        # =====================================
        # STEP 2 : Translation
        # =====================================
        translated = translate_text(
            text=transcript,
            source_lang=source_lang,
            target_lang=target_lang,
        )

        print("\n" + "=" * 100)
        print("TRANSCRIPT")
        print(transcript)
        print("-" * 100)
        print("TRANSLATED")
        print(translated)
        print("=" * 100 + "\n")

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

                output_audio_url = (
                    "http://localhost:8000/speech/output-audio"
                )

            else:
                print("❌ output.mp3 was not generated.")

        except Exception as tts_error:

            print("\n❌ TTS ERROR")
            traceback.print_exc()

            # Continue returning transcript + translation
            output_audio_url = None

        # =====================================
        # STEP 4 : Response
        # =====================================
        return {
            "success": True,
            "transcript": transcript,
            "translated_text": translated,
            "output_audio_url": output_audio_url,
        }

    except Exception as e:

        print("\n❌ PIPELINE FAILED")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )