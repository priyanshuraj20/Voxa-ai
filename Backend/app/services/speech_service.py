import os
import tempfile
from groq import Groq
from app.core.config import GROQ_API_KEY

# Initialize the Groq cloud instance
client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio(file, language: str = "en"):
    # Reset file cursor to 0 in case it was advanced during multipart form parsing
    file.file.seek(0)

    # Extract ISO-639-1 code from locale codes (e.g., 'hi-IN' -> 'hi', 'en-US' -> 'en')
    whisper_lang = language.split("-")[0].lower() if language else "en"
    
    # 1. Create a safe temporary file on the host machine disk
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        temp_file.write(file.file.read())
        temp_path = temp_file.name

    # 2. Use try/finally to guarantee file deletion even if Groq crashes
    try:
        # 3. Open the newly created physical file track from disk
        with open(temp_path, "rb") as audio_file:
            try:
                # 4. Stream payload directly into Groq Cloud Whisper API (with source language)
                transcription = client.audio.transcriptions.create(
                    file=audio_file,
                    model="whisper-large-v3",
                    response_format="json",
                    language=whisper_lang
                )
            except Exception as lang_err:
                # Fallback: if language= param causes SDK error, retry without it (auto-detect)
                print(f"⚠️ Whisper language='{whisper_lang}' failed ({lang_err}), falling back to auto-detect.")
                with open(temp_path, "rb") as fallback_file:
                    transcription = client.audio.transcriptions.create(
                        file=fallback_file,
                        model="whisper-large-v3",
                        response_format="json"
                    )
        
        # 5. Return the clean text payload string back to the API service layer
        return transcription.text

    finally:
        # 6. Always execute this to keep server disk space completely empty
        if os.path.exists(temp_path):
            os.remove(temp_path)
