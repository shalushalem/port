'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Avatar from '@/components/avatar/Avatar'
import VoiceBar from '@/components/ui/VoiceBar'
import SubtitleBar from '@/components/ui/SubtitleBar'
import FloatingCard, { Project } from '@/components/ui/FloatingCard'
import BackgroundGlow from '@/components/environment/BackgroundGlow'
import { FadeInMotion } from '@/components/animations/FloatingMotion'
import { useVoice } from '@/hooks/useVoice'
import { getAIResponse, getIntroSequence } from '@/lib/ai'

// Dynamically import 3D + particle (avoids SSR issues)
const NeuralSphere = dynamic(() => import('@/components/environment/NeuralSphere'), { ssr: false })
const ParticleField = dynamic(() => import('@/components/environment/ParticleField'), { ssr: false })

// Custom cursor
function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX - 4}px`
        cursorRef.current.style.top = `${e.clientY - 4}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX - 16}px`
        ringRef.current.style.top = `${e.clientY - 16}px`
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

// Projects data
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'AI Portfolio',
    description: 'World-first AI consciousness portfolio with voice interface and 3D avatar.',
    tags: ['Next.js', 'Three.js', 'AI'],
    icon: '🧠',
    year: '2025',
    status: 'Live',
  },
  {
    id: '2',
    title: 'Voice Assistant',
    description: 'Intelligent voice-first web assistant with real-time NLP responses.',
    tags: ['React', 'Whisper', 'LLM'],
    icon: '🎙️',
    year: '2025',
    status: 'Live',
  },
  {
    id: '3',
    title: 'Neural Commerce',
    description: 'AI-personalized e-commerce with predictive UX and dynamic pricing.',
    tags: ['Python', 'ML', 'FastAPI'],
    icon: '⚡',
    year: '2024',
    status: 'Beta',
  },
  {
    id: '4',
    title: 'AutoFlow',
    description: 'Visual automation builder for business workflows using AI suggestions.',
    tags: ['React', 'Node.js', 'GPT'],
    icon: '🔄',
    year: '2024',
    status: 'Building',
  },
]

// Intro sequence sentences
const INTRO = getIntroSequence()

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [introIndex, setIntroIndex] = useState(0)
  const [showIntroOverlay, setShowIntroOverlay] = useState(true)
  const [avatarVisible, setAvatarVisible] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([])

  const voice = useVoice({
    onTranscript: async (text) => {
      if (!text.trim()) return
      const reply = await getAIResponse(text, conversationHistory)
      setConversationHistory(h => [
        ...h,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ])
      voice.speak(reply)
    },
  })

  // GSAP-style intro sequence using Web Speech + timeouts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAvatarVisible(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Intro speech sequence
  useEffect(() => {
    if (!avatarVisible || introComplete) return

    const playIntro = async () => {
      for (let i = 0; i < INTRO.length; i++) {
        await new Promise<void>((resolve) => {
          setIntroIndex(i)
          voice.speak(INTRO[i])
          // Estimate duration from text length
          const duration = Math.max(1800, INTRO[i].length * 65)
          setTimeout(resolve, duration)
        })
      }
      setIntroComplete(true)
      setTimeout(() => setShowIntroOverlay(false), 600)
    }

    const t = setTimeout(playIntro, 1000)
    return () => clearTimeout(t)
  }, [avatarVisible]) // eslint-disable-line

  // Space bar shortcut to speak
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && introComplete && !voice.isListening && !voice.isSpeaking) {
        e.preventDefault()
        voice.startListening()
      }
      if (e.code === 'Escape' && voice.isListening) {
        voice.stopListening()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [introComplete, voice])

  const currentSubtitle = introComplete
    ? voice.response
    : INTRO[introIndex] ?? ''

  const leftProjects = PROJECTS.filter((_, i) => i % 2 === 0)
  const rightProjects = PROJECTS.filter((_, i) => i % 2 === 1)

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-cinematic">
      <Cursor />

      {/* === ENVIRONMENT LAYERS === */}
      <ParticleField />
      <BackgroundGlow />

      {/* Neural sphere behind avatar */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <NeuralSphere />
      </div>

      {/* === INTRO OVERLAY === */}
      <AnimatePresence>
        {showIntroOverlay && !introComplete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Top corner identifier */}
            <motion.div
              className="absolute top-8 left-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgba(96,165,250,0.3)',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                }}
              >
                CONSCIOUSNESS.INIT
              </p>
            </motion.div>

            {/* Bottom right system text */}
            <motion.div
              className="absolute bottom-8 right-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgba(96,165,250,0.2)',
                  letterSpacing: '0.2em',
                  textAlign: 'right',
                  lineHeight: 1.8,
                }}
              >
                v2.4.1 · NEURAL ACTIVE<br />
                VIJAYAWADA · INDIA
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === VOICE BAR (TOP) === */}
      {introComplete && (
        <VoiceBar
          isListening={voice.isListening}
          isSpeaking={voice.isSpeaking}
          transcript={voice.transcript}
          onStartListening={voice.startListening}
          onStopListening={voice.stopListening}
          onStopSpeaking={voice.stopSpeaking}
        />
      )}

      {/* === MAIN CONTENT LAYER === */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">

        {/* LEFT PROJECT CARDS */}
        <FadeInMotion
          className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4"
          delay={3}
        >
          {leftProjects.map((project, i) => (
            <FloatingCard
              key={project.id}
              project={project}
              index={i}
              position="left"
            />
          ))}
        </FadeInMotion>

        {/* AVATAR CENTER */}
        <Avatar
          isSpeaking={voice.isSpeaking}
          isListening={voice.isListening}
          isVisible={avatarVisible}
        />

        {/* RIGHT PROJECT CARDS */}
        <FadeInMotion
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4"
          delay={3.2}
        >
          {rightProjects.map((project, i) => (
            <FloatingCard
              key={project.id}
              project={project}
              index={i}
              position="right"
            />
          ))}
        </FadeInMotion>

        {/* CENTER NAME — appears after intro */}
        <AnimatePresence>
          {introComplete && (
            <motion.div
              className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1
                className="holo-text"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px, 2vw, 28px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                SHALEM
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: 'rgba(96,165,250,0.3)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                AI Engineer · Full Stack
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* === SUBTITLE BAR (BOTTOM) === */}
      <SubtitleBar
        text={currentSubtitle}
        isActive={voice.isSpeaking || !introComplete}
        isSpeaking={voice.isSpeaking}
      />

      {/* === POST-INTRO INSTRUCTIONS === */}
      <AnimatePresence>
        {introComplete && !voice.isListening && !voice.isSpeaking && !voice.response && (
          <motion.div
            className="fixed bottom-28 left-1/2 -translate-x-1/2 text-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'rgba(96,165,250,0.25)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              tap mic or press <span style={{ color: 'rgba(6,182,212,0.4)' }}>space</span> to speak
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner grid lines */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2563eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </main>
  )
}
