from elevenlabs.client import ElevenLabs
from app.core.config import ELEVENLABS_API_KEY
print("ElevenLabs initialized.")


client = ElevenLabs(
    api_key=ELEVENLABS_API_KEY
)


class TTSService:

    @staticmethod
    def generate_speech(text: str, output_path: str = "output.mp3"):

        audio = client.text_to_speech.convert(

            voice_id="EXAVITQu4vr4xnSDxMaL",

            output_format="mp3_44100_128",

            text=text,

            model_id="eleven_multilingual_v2"

        )

        with open(output_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)

        return output_path