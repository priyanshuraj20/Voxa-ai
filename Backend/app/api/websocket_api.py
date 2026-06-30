from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import os
import wave
import tempfile
import traceback
from app.services.speech_service import client as groq_client
from app.services.translation_service import translate_text
from app.services.tts_service import TTSService

router = APIRouter()

# 16kHz mono 16-bit PCM configuration
SAMPLE_RATE = 16000
SAMPLE_WIDTH = 2 # 2 bytes = 16-bit
CHANNELS = 1

# Process audio every 3 seconds
# 16000 samples/sec * 2 bytes/sample * 3 seconds = 96000 bytes
CHUNK_THRESHOLD = 96000

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, target_lang: str = "hi-IN"):
    """
    Handles streaming PCM audio from the Chrome extension, processes it in chunks,
    and returns transcripts and translations.
    """
    print(f"🔌 WebSocket connection requested. Target language: {target_lang}")
    await websocket.accept()
    print("✅ WebSocket connection accepted.")
    
    audio_buffer = bytearray()
    
    try:
        while True:
            # Receive binary PCM audio data from the extension
            data = await websocket.receive_bytes()
            if not data:
                continue
                
            audio_buffer.extend(data)
            
            # When we have enough audio accumulated, process it
            if len(audio_buffer) >= CHUNK_THRESHOLD:
                # Extract the chunk to process and keep the remainder (none in this simple sliding window)
                chunk_to_process = bytes(audio_buffer)
                audio_buffer.clear()
                
                # Write PCM data to a temporary WAV container
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_wav:
                    with wave.open(temp_wav.name, 'wb') as wav_file:
                        wav_file.setnchannels(CHANNELS)
                        wav_file.setsampwidth(SAMPLE_WIDTH)
                        wav_file.setframerate(SAMPLE_RATE)
                        wav_file.writeframes(chunk_to_process)
                    temp_wav_path = temp_wav.name
                
                try:
                    # 1. Speech-to-Text via Groq Whisper API
                    with open(temp_wav_path, "rb") as audio_file:
                        transcription = groq_client.audio.transcriptions.create(
                            file=audio_file,
                            model="whisper-large-v3",
                            response_format="json"
                        )
                    transcript = transcription.text
                    
                    if transcript and transcript.strip():
                        print(f"🗣️ Transcript: {transcript}")
                        
                        # 2. Translate using Azure Translation API
                        translated = translate_text(transcript,source_lang="en",target_lang=target_lang)
                        print(f"🌍 Translated: {translated}")
                        
                        # 3. Synthesize Speech using ElevenLabs (Write to output.mp3 in-place)
                        TTSService.generate_speech(translated)
                        
                        # Send JSON result back to the extension
                        await websocket.send_json({
                            "transcript": transcript,
                            "translation": translated
                        })
                except Exception as ex:
                    print(f"❌ Error during WebSocket chunk processing: {ex}")
                    traceback.print_exc()
                finally:
                    # Clean up the temporary audio file
                    if os.path.exists(temp_wav_path):
                        os.remove(temp_wav_path)
                        
    except WebSocketDisconnect:
        print("🔌 WebSocket disconnected cleanly.")
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        traceback.print_exc()
