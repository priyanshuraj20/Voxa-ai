# 🌍 Voxa AI — Real-Time Multilingual Speech Translation Platform

Voxa AI is a real-time speech translation platform that captures live audio from browser tabs (Google Meet, Udemy, YouTube) or microphone input, transcribes it using Whisper ASR, corrects it with Claude LLM, translates it using Azure Neural Machine Translation, and synthesizes natural voice output using ElevenLabs TTS — all in under 2 seconds per utterance.

🔗 **Live:** [voxa-ai-pi.vercel.app](https://voxa-ai-pi.vercel.app/)

---

## ⚡ Key Features

| Feature | Description |
|---|---|
| **Real-Time Voice Translation** | Speak into mic → Hear translated voice output with 6-step progress tracking |
| **WebSocket Streaming + VAD** | Continuous audio streaming with Voice Activity Detection — no fixed timers, processes on natural speech pauses |
| **Chrome Extension (MV3)** | Captures tab audio from any website (Meet, YouTube, Udemy) via Offscreen Document architecture |
| **PDF Translation + Audio** | Upload PDF → Extract text → Translate → Generate full audio narration with chunked TTS |
| **Dynamic Language Switching** | Switch languages mid-stream without dropping the WebSocket connection |
| **LLM Transcript Correction** | Claude Sonnet 4 corrects Whisper ASR errors (spelling, punctuation, proper nouns) |
| **API Credits Dashboard** | Live monitoring of ElevenLabs, Groq, Azure, and OpenRouter API usage |
| **JWT Authentication** | Full auth system with register, login, refresh tokens, OTP-based password reset |

---

## 🏗️ Architecture

Voxa AI operates two primary translation flows:

### 1. REST Streaming Pipeline (Web Dashboard)

```
[User Mic / File Upload]
        │
        ▼
POST /speech/translate-and-speak (multipart/form-data + JWT)
        │
        ├──► Step 2: Groq Whisper Large-v3 (ASR transcription)
        │
        ├──► Step 3: OpenRouter Claude Sonnet 4 (transcript correction)
        │
        ├──► Step 4: Azure Cognitive Translator (neural machine translation)
        │
        ├──► Step 5: ElevenLabs TTS (voice synthesis, optimize_streaming_latency=3)
        │
        └──► Step 6: Returns JSON with transcript + translation + audio URL
```

Progress updates are streamed to the client via **Server-Sent Events (SSE)** — the frontend shows real-time checkmarks as each pipeline stage completes.

### 2. WebSocket Streaming Pipeline (Chrome Extension + Web App)

```
[Tab Audio / Microphone]
        │
        ▼
Chrome Offscreen Document captures audio
        │
        ▼
Downsamples: 48kHz Float32 Stereo → 16kHz Int16 Mono (12x bandwidth reduction)
        │
        ▼
WebSocket ws://backend/ws?source_lang=en&target_lang=hi-IN
        │
        ▼
FastAPI VAD Engine (RMS amplitude analysis)
        │
        ├── RMS > 350: Speech detected → accumulate in buffer
        ├── RMS < 350 for ~1.2s: Pause → trigger processing
        ├── Buffer > 256KB (~8s): Force-split → prevent latency buildup
        └── Buffer < 16KB: Too short → discard (prevents Whisper hallucinations)
        │
        ▼
Groq Whisper → Claude → Azure → ElevenLabs → Base64 audio
        │
        ▼
JSON response: {"transcript": "...", "translation": "...", "audio": "<base64>"}
```

### 3. Dynamic Language Switching

Users can change source/target language mid-meeting. The client sends a JSON control frame over the existing WebSocket:
```json
{"action": "switch_languages", "source_lang": "en", "target_lang": "ja", "voice_id": "..."}
```
The backend updates local state variables — no reconnection needed.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend Framework** | FastAPI (Python) | REST APIs, WebSocket endpoints, SSE streaming |
| **Speech Recognition** | Groq Whisper Large-v3 | ASR transcription (~200ms on LPU hardware) |
| **LLM Post-Processing** | Claude Sonnet 4 via OpenRouter | Transcript correction (spelling, grammar, proper nouns) |
| **Translation** | Azure Cognitive Translator | Neural Machine Translation (130+ languages) |
| **Voice Synthesis** | ElevenLabs Multilingual v2 | Natural TTS with streaming latency optimization |
| **Database** | MongoDB Atlas + Motor (async) | User profiles, auth tokens, preferences |
| **Auth** | JWT (python-jose) + bcrypt | Access/refresh tokens, OTP password reset |
| **Email** | Resend API | OTP delivery for password reset |
| **Frontend** | React + Vite + TypeScript | SPA dashboard with responsive design |
| **Extension** | Chrome Manifest V3 | Tab capture, offscreen audio processing, Shadow DOM overlay |

---

## 📁 Project Structure

```
Voxa-ai/
├── Backend/                          # FastAPI Server + AI Pipeline
│   ├── .env                          # API keys (Groq, ElevenLabs, Azure, OpenRouter, MongoDB)
│   ├── requirements.txt              # Python dependencies
│   └── app/
│       ├── main.py                   # App factory, CORS, router registration
│       ├── database.py               # MongoDB async connection (Motor)
│       ├── core/
│       │   └── config.py             # Environment variable loader
│       ├── auth/
│       │   ├── router.py             # /register, /login, /me, /logout, /forgot-password, etc.
│       │   ├── service.py            # Auth business logic
│       │   ├── dependency.py         # JWT verification + in-memory user cache
│       │   ├── jwt.py                # Token creation/verification (HS256)
│       │   ├── password.py           # bcrypt hashing
│       │   ├── schemas.py            # Pydantic request validation
│       │   ├── models.py             # MongoDB document factories
│       │   ├── email.py              # Resend OTP sender
│       │   └── otp.py                # 6-digit OTP generator
│       ├── api/
│       │   ├── speech.py             # POST /speech/translate-and-speak + GET /speech/credits
│       │   ├── websocket_api.py      # WebSocket /ws with VAD + dynamic lang switching
│       │   ├── pdf.py                # POST /pdf/translate (chunk + merge audio)
│       │   └── health.py             # Health check
│       └── services/
│           ├── speech_service.py     # Groq Whisper wrapper
│           ├── postprocess_service.py # Claude transcript correction
│           ├── translation_service.py # Azure NMT wrapper
│           └── tts_service.py        # ElevenLabs TTS (file + bytes methods)
│
├── Frontend/my-app/                  # Vite + React Dashboard
│   ├── .env                          # VITE_BACKEND_URL
│   ├── public/
│   │   └── voxa_extension/           # Chrome Extension source files
│   │       ├── manifest.json         # MV3 permissions + service worker
│   │       ├── background.js         # Tab capture + offscreen lifecycle
│   │       ├── content.js            # Shadow DOM overlay (glassmorphic UI)
│   │       ├── offscreen.html/.js    # Audio capture + WebSocket streaming
│   │       └── assets/               # Extension icons
│   └── src/
│       ├── app/
│       │   ├── workspace/page.tsx    # Main translation workspace
│       │   ├── pdf-reader/page.tsx   # PDF upload + translation
│       │   └── install/page.tsx      # Extension download page
│       └── components/               # Reusable UI components
```

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas cluster
- API keys: Groq, ElevenLabs, Azure Translator, OpenRouter, Resend

### Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Create .env with required keys (see .env.example)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd Frontend/my-app
npm install

# Create .env with VITE_BACKEND_URL=http://localhost:8000
npm run dev
```

### Chrome Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `Frontend/my-app/public/voxa_extension/`

---

## 🌐 Deployment

| Component | Platform | Root Directory | Build Command | Start Command |
|---|---|---|---|---|
| **Backend** | Render | `Backend/` | `pip install -r requirements.txt` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Frontend** | Vercel | `Frontend/my-app/` | `npm run build` | (auto-detected by Vercel) |

### Environment Variables

**Backend (.env)**:
```
GROQ_API_KEY=
ELEVENLABS_API_KEY=
AZURE_TRANSLATOR_KEY=
AZURE_TRANSLATOR_REGION=centralindia
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
OPENROUTER_API_KEY=
MONGODB_URI=
DATABASE_NAME=
USERS_COLLECTION=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
RESEND_API_KEY=
BACKEND_URL=https://your-render-url.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend (.env)**:
```
VITE_BACKEND_URL=https://your-render-url.onrender.com
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Create account |
| `POST` | `/auth/login` | ❌ | Get access + refresh tokens |
| `GET` | `/auth/me` | ✅ | Get current user profile |
| `POST` | `/auth/logout` | ✅ | Invalidate refresh token |
| `POST` | `/auth/refresh` | ✅ | Get new access token |
| `POST` | `/auth/change-password` | ✅ | Update password |
| `POST` | `/auth/forgot-password` | ❌ | Send OTP email |
| `POST` | `/auth/verify-otp` | ❌ | Verify OTP code |
| `POST` | `/auth/reset-password` | ❌ | Reset password with OTP |
| `PUT` | `/auth/preferences` | ✅ | Update language preferences |
| `POST` | `/speech/translate-and-speak` | ✅ | Full translation pipeline (SSE) |
| `GET` | `/speech/credits` | ✅ | API usage dashboard data |
| `GET` | `/speech/output-audio/{filename}` | ❌ | Serve generated audio files |
| `WS` | `/ws` | ❌ | Real-time streaming translation |
| `POST` | `/pdf/translate` | ✅ | PDF translation with audio |

---

## 👤 Author

**Priyanshu Raj** — Computer Science Engineer
