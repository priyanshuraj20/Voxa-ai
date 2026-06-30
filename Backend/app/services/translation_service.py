import os
import requests
import uuid
from dotenv import load_dotenv


from app.core.config import (
    AZURE_TRANSLATOR_KEY,
    AZURE_TRANSLATOR_REGION,
    AZURE_TRANSLATOR_ENDPOINT,
)

def clean_lang_code(lang: str) -> str:
    """
    Cleans local lang codes (like 'hi-IN' or 'en-US') to Azure compatible language codes.
    """
    if not lang:
        return "hi"
    
    lang_lower = lang.lower().strip()
    
    # Handle Chinese Simplified/Traditional explicitly
    if "zh-cn" in lang_lower or "zh-hans" in lang_lower:
        return "zh-Hans"
    if "zh-tw" in lang_lower or "zh-hk" in lang_lower or "zh-hant" in lang_lower:
        return "zh-Hant"
        
    # Standard splitting (e.g. 'hi-IN' -> 'hi')
    return lang_lower.split("-")[0]

def translate_text(text: str,source_lang: str = "en", target_lang: str = "hi") -> str:
    """
    Translates source text into the target language using the Azure Cognitive Translator API.
    """
    if not text or not text.strip():
        return ""
        
    try:
        cleaned_source = clean_lang_code(source_lang)
        cleaned_target = clean_lang_code(target_lang)
        
        # Build routing path
        path = '/translate'
        constructed_url = f"{AZURE_TRANSLATOR_ENDPOINT.rstrip('/')}{path}"
        
        params = {
            'api-version': '3.0',
            "from": clean_lang_code(source_lang),
            "to": clean_lang_code(target_lang),
        }
        
        headers = {
            'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
            'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
            'Content-type': 'application/json',
            'X-ClientTraceId': str(uuid.uuid4())
        }
        
        body = [{
            'text': text
        }]
        
        response = requests.post(constructed_url, params=params, headers=headers, json=body, timeout=5)
        response.raise_for_status()
        
        translations = response.json()
        if translations and len(translations) > 0:
            return translations[0]['translations'][0]['text']
            
        return text
    except Exception as e:
        print(f"❌ Error during Azure translation: {e}")
        # Return fallback original text if API fails to prevent system crash
        return text