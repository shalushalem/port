# Digital Consciousness Portfolio

Production-style starter for a cinematic AI portfolio:

- `frontend/`: Next.js + TypeScript + Tailwind + Framer Motion + React Three Fiber
- `backend/`: FastAPI + WebSocket + event engine + voice capture endpoints

## 1. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 2. Run Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`

## 3. Environment

- Copy `frontend/.env.example` -> `frontend/.env.local`
- Copy `backend/.env.example` -> `backend/.env`

Backend defaults to local Ollama (`llama3.1:8b`) in `.env.example`.
You can run in fully local mock mode by setting `USE_MOCK_AI=true`.

## 4. What Is Implemented

- Full-screen cinematic intro shell
- Brain scene + neural particles (R3F)
- 2.5D avatar layer with floating/voice-reactive glow
- Voice record/upload flow (browser MediaRecorder -> FastAPI)
- Realtime orchestration websocket (`/ws/orchestrate`) with streamed `speech_chunk` + `event_batch` + `final`
- Intent + event engine (`SHOW_AVATAR`, `HIGHLIGHT_PROJECT`, `BACKGROUND_CHANGE`, `CONTACT_INTENT`)
- Dynamic project and contact overlays
- SEO pages (`/ai-developer`, `/freelance-ai-engineer`, `/full-stack-ai-developer`, `/projects`, `/case-studies`, `/blog`)

## 5. Next Build Steps

- Replace mock AI response with OpenAI realtime orchestration
- Add Whisper transcription + TTS playback
- Add Redis conversation memory + Supabase storage
- Add calendly/resend production contact workflow

## 6. GLB Avatar Drop-In

- Put your character file at: `frontend/public/assets/avatar/shalem.glb`
- Scene auto-detects this file and switches from fallback hologram to your full 3D avatar.
- Set `NEXT_PUBLIC_AVATAR_MODE=3d` to render GLB avatar mode.
- Default `NEXT_PUBLIC_AVATAR_MODE=2d` uses the cinematic layered PNG avatar system.
