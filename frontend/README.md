# 🧠 Shalem AI Portfolio — World-First AI Consciousness Portfolio

## Setup in 3 steps

### 1. Install dependencies
```bash
cd portfolio
npm install
```

### 2. Add your avatar image
Put your Pixar-style avatar PNG as:
```
public/avatar/shalem.png
```
Use the Gemini-generated image you showed earlier!

### 3. Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## What happens on load

1. **0.8s** — Dark cinematic screen, particles begin, neural sphere glows
2. **1.8s** — Avatar floats in from center with glow rings
3. **2s** — AI voice starts intro: *"Hello. I'm Shalem..."*
4. **~12s** — Intro completes, voice bar appears, project cards fade in
5. **Forever** — User can speak, ask questions, hear responses

---

## Voice commands that work out of the box

| User says | Avatar responds |
|-----------|----------------|
| "Who are you?" | Introduction |
| "What are your skills?" | Tech stack |
| "Show me your projects" | Project description |
| "How do I hire you?" | Contact info |
| "What's your rate?" | Booking info |
| Anything else | Contextual fallback |

---

## Customization

### Change intro speech
Edit `src/lib/ai.ts` → `getIntroSequence()` array

### Add your projects
Edit `PROJECTS` array in `src/app/page.tsx`

### Change AI persona
Edit `SHALEM_PERSONA` in `src/lib/ai.ts`

### Connect real AI (optional)
In `src/lib/ai.ts`, replace the keyword matching with a real API call:
```ts
const res = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userMessage, history })
})
const { reply } = await res.json()
return reply
```

### Use ElevenLabs voice (optional)
Replace `voice.speak()` calls with ElevenLabs API for a cloned voice.

---

## Folder structure
```
src/
├── app/
│   ├── page.tsx          ← Main page, orchestrates everything
│   ├── layout.tsx        ← SEO metadata, fonts
│   └── globals.css       ← Design tokens, animations
│
├── components/
│   ├── avatar/
│   │   ├── Avatar.tsx        ← Floating avatar with glow rings
│   │   ├── AvatarEyes.tsx    ← Blinking overlay
│   │   └── AvatarMouth.tsx   ← Lip sync overlay
│   │
│   ├── environment/
│   │   ├── ParticleField.tsx  ← tsParticles neural background
│   │   ├── NeuralSphere.tsx   ← Three.js rotating 3D sphere
│   │   └── BackgroundGlow.tsx ← Volumetric ambient glow
│   │
│   ├── ui/
│   │   ├── VoiceBar.tsx       ← Top mic button + status
│   │   ├── SubtitleBar.tsx    ← Bottom typewriter subtitles
│   │   └── FloatingCard.tsx   ← Project holographic cards
│   │
│   └── animations/
│       ├── FloatingMotion.tsx     ← Reusable float wrapper
│       └── ParallaxController.tsx ← Mouse parallax depth
│
├── hooks/
│   ├── useVoice.ts    ← Speech recognition + synthesis
│   ├── useBlink.ts    ← Natural eye blink timing
│   └── useLipSync.ts  ← Mouth animation system
│
└── lib/
    ├── ai.ts      ← AI persona + response engine
    └── speech.ts  ← Speech utility functions
```

---

## Deploy to Vercel
```bash
npx vercel
```
That's it. Auto-deploys with Next.js optimizations.

---

## SEO built-in
- Schema.org Person markup
- OpenGraph tags
- Keywords: AI engineer, freelancer India, full stack developer
- Server-side rendered metadata
- Sitemap ready
