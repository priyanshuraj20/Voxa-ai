import requests

from app.core.config import OPENROUTER_API_KEY


def improve_transcript(transcript: str) -> str:
    """
    Cleans ASR transcript while preserving meaning.
    """

    if not transcript.strip():
        return transcript

    print("\n" + "=" * 80)
    print("POST PROCESSING STARTED")
    print("=" * 80)

    print("\nRAW TRANSCRIPT:")
    print(transcript)

    prompt = f"""
You are an expert Automatic Speech Recognition (ASR) transcript correction engine.

Your job is ONLY to improve the transcript.

Correct ONLY:
- speech recognition mistakes
- punctuation
- capitalization
- spelling mistakes
- proper nouns if obvious from context

Examples:
Parul univercity -> Parul University
vadodra -> Vadodara
gujrat -> Gujarat

DO NOT:
- translate
- summarize
- rewrite
- shorten
- expand
- change the meaning
- answer the user

Return ONLY the corrected transcript.

Transcript:
{transcript}
"""

    try:

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "anthropic/claude-sonnet-4",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "temperature": 0,
            },
            timeout=60,
        )

        response.raise_for_status()

        data = response.json()

        corrected = data["choices"][0]["message"]["content"].strip()

        print("\nCORRECTED TRANSCRIPT:")
        print(corrected)

        print("=" * 80)

        return corrected

    except Exception as e:

        print("\nPOST PROCESSING FAILED")
        print(e)

        print("\nReturning original transcript...\n")

        return transcript