# 🌍 Voxa AI — Real-Time Browser Audio Translator

Voxa AI is a real-time speech translation system that captures browser or microphone audio, processes it through sequential AI pipeline stages, and delivers punctuated text, translated output, and synthetic voice synthesis back to the client in under 1 second.

---

## 📸 Product Showcases

### 💻 Real-Time Workspace Dashboard
The core Next.js application workspace allows local microphone recording, uploading WebM audio files to the translation REST API, and rendering the pipeline progress status alongside original and translated speech outputs.
<p align="left">
  <img src="assets/workspace.png" alt="Voxa AI Workspace" width="90%" style="border-radius: 8px; border: 1px solid #1f1f1f;" />
</p>

### 🌍 Google Meet Active Integration
When inside a Google Meet call, clicking the pinned extension icon opens our side panel. Live translated transcripts stream directly into the panel, while a floating subtitle overlay renders translations directly on top of the browser meeting tab.
<p align="left">
  <img src="assets/google_meet.png" alt="Google Meet Translation" width="90%" style="border-radius: 8px; border: 1px solid #1f1f1f;" />
</p>

---

## 🚀 The Voxa Pipeline Architecture

Voxa supports two primary translation flows: **REST-Based File Upload with Streaming Status Updates** and **Real-Time WebSocket Streaming**.

### 1. REST Streaming Pipeline Flow (Workspace Web App)
When you record or upload an audio file in the Workspace web app, the backend translates it through a streaming REST connection (`POST /speech/translate-and-speak`). Instead of a single blocking response, the server yields incremental progress updates using a `StreamingResponse` (Server-Sent Events) to keep the client UI in sync.

```
[User Mic Input] ──► [WebM Recording Blob] ──► [POST /speech/translate-and-speak]
                                                           │
                                                           ├──► Step 2: Groq Whisper ASR transcription start
                                                           │
                                                           ├──► Step 3: OpenRouter Claude Sonnet 4 correction start
                                                           │
                                                           ├──► Step 4: Azure Neural Translation start
                                                           │
                                                           ├──► Step 5: ElevenLabs synthetic voice generation start
                                                           │
                                                           └──► Step 6: Returns final JSON payload with audio URL
```

### 2. WebSocket Streaming Flow (Chrome Extension)
The Chrome Extension captures internal Google Meet/browser tab audio, downsamples it to a clean 16kHz mono 16-bit PCM feed in the background, and streams raw binary chunks to the server in 3-second windows for instant processing.

```
[Google Meet Tab Audio] ──► (Captured via Chrome Offscreen Document)
                                       │
                                       ▼
[Audio Resampler]       ──► (Converts Float32 to 16kHz Mono 16-Bit PCM)
                                       │
                                       ▼
[WebSocket Channel]     ──► (Streams binary chunks to ws://localhost:8000/ws)
                                       │
                                       ▼
[FastAPI Buffer]        ──► (Accumulates chunks in 3-second sliding window)
                                       │
                                       ▼
[Groq Whisper ASR]      ──► (Transcribes raw audio using whisper-large-v3)
                                       │
                                       ▼
[Azure Translator]      ──► (Translates transcript contextually into target language)
                                       │
                                       ▼
[ElevenLabs TTS]        ──► (Synthesizes translated speech voice playback)
                                       │
                                       ▼
[JSON Response]         ──► (Sends transcripts & translations back to client)
```

---

## ✨ Key Features

* **WebSocket PCM Streaming:** The Chrome Extension downsamples browser tab audio to 16kHz mono PCM and streams it continuously to bypass typical REST polling latencies.
* **SSE Progress Updates:** The workspace REST API uses a generator-based Server-Sent Events flow to trigger visual checklist checkmarks in real time as ASR, correction, translation, and TTS synthesis complete.
* **ASR Transcript Correction:** Raw transcriptions from Whisper large-v3 are sent through an LLM layer (Claude Sonnet 4 via OpenRouter) to clean up homophones, restore boundary punctuation, and fix capitalization errors.
* **Azure Translation Layer:** Fully contextual translation into 45+ supported target locales using Azure Cognitive Services.
* **Expressive Synthesizer:** Incorporates ElevenLabs Voice Synthesis (using `eleven_multilingual_v2`) to generate realistic voice playbacks of the translated sentences.
* **Floating subtitle injection:** Injects a secure floating overlay widget directly into Meet/Zoom tabs without performance impact.

---

## 🛠️ Project Directory Tree

```
Voxa-ai/
├── Backend/                 # Python FastAPI Web Server & AI Engine
│   └── app/
│       ├── api/             # API Router Endpoints (REST & WebSockets)
│       │   ├── health.py    # Health checks
│       │   ├── speech.py    # REST Translation & serving output-audio
│       │   └── websocket_api.py # WebSocket Stream Gateway
│       ├── core/            # Config variables & settings
│       ├── services/        # Logic Handlers (STT, Postprocess, Translation, TTS)
│       │   ├── speech_service.py      # Groq Whisper
│       │   ├── postprocess_service.py # OpenRouter Claude 3.5 Sonnet
│       │   ├── translation_service.py # Azure Translator API
│       │   └── tts_service.py         # ElevenLabs TTS
│       └── main.py          # FastAPI server loader
│
├── Frontend/my-app/         # Next.js 16 Web Dashboard
│   ├── public/              # Static assets & Packed voxa_entension.zip
│   └── src/
│       ├── app/             # Page routing & pages (Landing, workspace, tech)
│       └── components/      # Responsive design systems
│
└── Extension/               # Chrome Extension source
    ├── background/          # Background worker capturing tab streams
    ├── content/             # Floating subtitles DOM injection scripts
    ├── offscreen/           # Offscreen audio context recorder
    └── sidepanel/           # sidepanel settings & logs layout
```

---

## ⚙️ Local Setup & Configuration

### 1. Configure Backend Environment
Create a `.env` file in `Backend/app/.env` with your API credentials:
```env
# Groq API Key (Used for Whisper STT)
GROQ_API_KEY=your_groq_api_key_here

# OpenRouter API Key (Used for Claude Sonnet 4 post-processing)
OPENROUTER_API_KEY=your_openrouter_key_here

# Azure Translator Details (Used for text translation)
AZURE_TRANSLATOR_KEY=your_azure_translator_key_here
AZURE_TRANSLATOR_REGION=centralindia
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/

# ElevenLabs API Key (Used for voice synthesis playback)
ELEVENLABS_API_KEY=your_eleven_labs_key_here

BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### 2. Startup Backend
```bash
cd Backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Startup Frontend
```bash
cd Frontend/my-app
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the web workspace.

### 4. Load the Extension
1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer Mode** on in the top-right.
3. Click **Load Unpacked** in the top-left.
4. Select the `Extension` directory in the root of this project.
5. Use the shortcut `Ctrl + Shift + U` or click the Voxa icon to start translating your meetings!

---

## 👥 Authors
* **Priyanshu Raj** - Computer Science Engineer & Architect.
