from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import os
import wave
import tempfile
import traceback
from app.services.speech_service import client as groq_client
from app.services.translation_service import translate_text
from app.services.tts_service import TTSService
from app.services.postprocess_service import improve_transcript

def safe_print(msg: str):
    try:
        print(msg)
    except UnicodeEncodeError:
        print(msg.encode('ascii', errors='replace').decode('ascii'))

router = APIRouter()

# 16kHz mono 16-bit PCM configuration
SAMPLE_RATE = 16000
SAMPLE_WIDTH = 2  # 2 bytes = 16-bit
CHANNELS = 1

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, source_lang: str = "en", target_lang: str = "hi-IN", voice_id: str = "EXAVITQu4vr4xnSDxMaL"):
    """
    Handles streaming PCM audio from the Chrome extension, processes it in chunks,
    and returns transcripts and translations.
    """
    safe_print(f"[WS] Connection requested. Source: {source_lang}, Target: {target_lang}, Voice: {voice_id}")
    await websocket.accept()
    safe_print("[WS] Connection accepted.")
    
    import array
    import math
    
    # Voice Activity Detection (VAD) state parameters
    SILENCE_THRESHOLD = 350.0  # RMS amplitude threshold
    SILENCE_LIMIT = 5          # Chunks of silence to trigger end-of-phrase (~1.2s)
    MIN_AUDIO_BYTES = 16000    # Minimum audio accumulated (~0.5s) to process
    MAX_AUDIO_BYTES = 256000   # Maximum audio length (~8.0s) to force split
    
    audio_buffer = bytearray()
    is_speaking = False
    silence_counter = 0
    
    try:
        while True:
            # Receive incoming frame (can be binary audio or JSON configuration commands)
            message = await websocket.receive()
            
            if message.get("type") == "websocket.disconnect":
                break
            
            if "bytes" in message:
                data = message["bytes"]
                if not data:
                    continue
            elif "text" in message:
                try:
                    import json
                    cmd = json.loads(message["text"])
                    if cmd.get("action") == "switch_languages":
                        source_lang = cmd.get("source_lang", source_lang)
                        target_lang = cmd.get("target_lang", target_lang)
                        voice_id = cmd.get("voice_id", voice_id)
                        safe_print(f"[WS] Dynamic Language Switch: Source={source_lang}, Target={target_lang}, Voice={voice_id}")
                except Exception as json_ex:
                    safe_print(f"Failed to parse text command frame: {json_ex}")
                continue
            else:
                continue
            
            # Calculate Root Mean Square (RMS) amplitude of this chunk
            shorts = array.array('h', data)
            rms = math.sqrt(sum(s*s for s in shorts) / len(shorts)) if shorts else 0
            
            if rms > SILENCE_THRESHOLD:
                # User is speaking
                if not is_speaking:
                    is_speaking = True
                    safe_print(f"[VAD] Voice activity started... (RMS: {rms:.1f})")
                audio_buffer.extend(data)
                silence_counter = 0
            else:
                # User is silent
                if is_speaking:
                    audio_buffer.extend(data)
                    silence_counter += 1
            
            # Check if we need to trigger processing
            should_process = False
            chunk_to_process = None
            
            # Condition A: Silence limit reached after active speaking
            if is_speaking and silence_counter >= SILENCE_LIMIT:
                if len(audio_buffer) >= MIN_AUDIO_BYTES:
                    safe_print(f"[VAD] Voice activity ended (~1.2s silence). Processing buffer ({len(audio_buffer)} bytes)...")
                    should_process = True
                else:
                    # Too short, discard and reset
                    safe_print(f"[VAD] Discarded short noise chunk ({len(audio_buffer)} bytes)")
                    audio_buffer.clear()
                    is_speaking = False
                    silence_counter = 0
            
            # Condition B: Max buffer duration exceeded to prevent long latency
            elif is_speaking and len(audio_buffer) >= MAX_AUDIO_BYTES:
                safe_print(f"[VAD] Max speaking buffer duration reached ({len(audio_buffer)} bytes). Splitting stream...")
                should_process = True
            
            if should_process:
                chunk_to_process = bytes(audio_buffer)
                audio_buffer.clear()
                is_speaking = False
                silence_counter = 0
                
                # Process the captured speech chunk
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
                        # Refine transcript using Claude via OpenRouter
                        transcript = improve_transcript(transcript)
                        safe_print(f"[ASR] Refined Transcript: {transcript}")
                        
                        # 2. Translate using Azure Translation API
                        translated = translate_text(transcript, source_lang=source_lang, target_lang=target_lang)
                        safe_print(f"[Translator] Translated: {translated}")
                        
                        # 3. Synthesize Speech using ElevenLabs directly to base64
                        import base64
                        try:
                            audio_bytes = TTSService.generate_speech_bytes(translated, voice_id=voice_id)
                            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
                        except Exception as tts_ex:
                            safe_print(f"[TTS] ElevenLabs WebSocket synthesis failed: {tts_ex}")
                            audio_base64 = None
                        
                        # Send JSON result back to the extension
                        await websocket.send_json({
                            "transcript": transcript,
                            "translation": translated,
                            "audio": audio_base64
                        })
                except Exception as ex:
                    safe_print(f"[WS] Error during WebSocket chunk processing: {ex}")
                    traceback.print_exc()
                finally:
                    # Clean up the temporary audio file
                    if os.path.exists(temp_wav_path):
                        os.remove(temp_wav_path)
                        
    except WebSocketDisconnect:
        safe_print("[WS] Disconnected cleanly.")
    except Exception as e:
        safe_print(f"[WS] Error: {e}")
    finally:
        safe_print("INFO:     connection closed")
