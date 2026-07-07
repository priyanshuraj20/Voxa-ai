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
from app.services.tts_service import client as elevenlabs_client


router = APIRouter(
    prefix="/speech",
    tags=["Speech"]
)



@router.get("/credits")
async def get_credits(current_user=Depends(get_current_user)):
    # 1. ElevenLabs (TTS)
    try:
        sub = elevenlabs_client.user.subscription.get()
        elevenlabs_data = {
            "limit": sub.character_limit,
            "count": sub.character_count,
            "left": sub.character_limit - sub.character_count,
            "source": "api"
        }
    except Exception:
        elevenlabs_data = {
            "limit": 10000,
            "count": 4250,
            "left": 5750,
            "source": "mock"
        }

    # 2. OpenRouter (Claude LLM)
    try:
        import requests
        from app.core.config import OPENROUTER_API_KEY
        res = requests.get(
            "https://openrouter.ai/api/v1/auth/key",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
            timeout=5
        )
        if res.status_code == 200:
            data = res.json().get("data", {})
            openrouter_data = {
                "is_free_tier": data.get("is_free_tier", False),
                "limit_usd": data.get("limit"),
                "usage_usd": data.get("usage"),
                "source": "api"
            }
        else:
            openrouter_data = {
                "is_free_tier": True,
                "limit_usd": None,
                "usage_usd": 0.0,
                "source": "mock"
            }
    except Exception:
        openrouter_data = {
            "is_free_tier": True,
            "limit_usd": None,
            "usage_usd": 0.0,
            "source": "mock"
        }

    # 3. Azure Translation (Neural Machine Translation)
    azure_data = {
        "limit": 2000000,
        "count": 142800,
        "left": 1857200,
        "source": "mock"
    }

    # 4. Groq Whisper (ASR Speech Recognition)
    groq_data = {
        "status": "Active",
        "limit_rpd": 14400,
        "used_rpd": 248,
        "left_rpd": 14152,
        "source": "mock"
    }

    return {
        "elevenlabs": elevenlabs_data,
        "openrouter": openrouter_data,
        "azure": azure_data,
        "groq": groq_data
    }

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

@router.post("/translate-and-speak")
async def translate_and_speak(
    current_user=Depends(get_current_user),
    file: UploadFile = File(...),
    source_lang: str = Form("en"),
    target_lang: str = Form("hi-IN"),
):

    # Validate Languages
   
    if clean_lang_code(source_lang) == clean_lang_code(target_lang):
        raise HTTPException(
            status_code=400,
            detail="Source and target language cannot be the same."
        )

    def event_generator():
        try:
           #Uploading completed strting speech recognization
            yield json.dumps({"step": 2}) + "\n"

            # STEP 1 : Speech To Text
      
            transcript = transcribe_audio(file, language=source_lang)

            # Step 2: Speech Recognition completed, starting Transcript Correction
            yield json.dumps({"step": 3}) + "\n"
            
            transcript = improve_transcript(transcript)

            # Step 3: Transcript Correction completed, starting Translation (Azure)
            yield json.dumps({"step": 4}) + "\n"

            # STEP 2 : Translation
        
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
                    print(f" Audio Generated Successfully : {audio_file}")
                    print(f" Size : {os.path.getsize(audio_file)} bytes")
                    output_audio_url = f"{BACKEND_URL}/speech/output-audio"
                else:
                    print(" output.mp3 was not generated.")

            except Exception as tts_error:
                print("\n TTS ERROR")
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
            print("\n PIPELINE FAILED")
            traceback.print_exc()
            yield json.dumps({
                "step": 0,
                "success": False,
                "error": str(e)
            }) + "\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
