'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Waves } from 'lucide-react'
import RobotScene from '@/components/scene/RobotScene'
import SubtitlePanel from '@/components/ui/SubtitlePanel'
import ControlPanel from '@/components/ui/ControlPanel'
import StatusIndicator from '@/components/ui/StatusIndicator'
import {
  AvatarState,
  INITIAL_SUBTITLE,
  SCENE_COLORS,
} from '@/lib/constants'
import { useAvatarStore } from '@/store/avatarStore'

function getCinematicReply(command: string) {
  const normalized = command.toLowerCase()

  if (normalized.includes('project')) {
    return 'I architect cinematic AI experiences, production web systems, and intelligent automations. I can open any project node on command.'
  }
  if (normalized.includes('hire') || normalized.includes('work')) {
    return 'Mission accepted. I am available for freelance AI engineering and full-stack product builds. Let us design your next system.'
  }
  if (normalized.includes('stack') || normalized.includes('tech')) {
    return 'Core stack: Next.js, TypeScript, Python, React Three Fiber, and agentic AI orchestration. Built for speed, scale, and cinematic presence.'
  }
  if (normalized.includes('hello') || normalized.includes('hi')) {
    return 'Hello. Neural handshake complete. Tell me what you want to build and I will map the path.'
  }

  return 'Command received. I can discuss architecture, product strategy, and implementation details in real time. Continue when ready.'
}

export default function HomePage() {
  const {
    state,
    glowIntensity,
    subtitle,
    commandInput,
    isTyping,
    activeClip,
    setState,
    setSubtitle,
    setCommandInput,
    setTyping,
    resetToIdle,
  } = useAvatarStore()

  useEffect(() => {
    setSubtitle(INITIAL_SUBTITLE)
    setState('idle')
  }, [setState, setSubtitle])

  const runNarrativeState = (
    nextState: AvatarState,
    message: string,
    delay: number,
  ) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setState(nextState)
        setSubtitle(message)
        resolve()
      }, delay)
    })

  const handleSubmitCommand = async (command: string) => {
    const trimmed = command.trim()
    if (!trimmed) return

    setCommandInput('')
    setTyping(true)
    setState('thinking')
    setSubtitle(`Analyzing command: ${trimmed}`)

    await runNarrativeState('thinking', 'Neural processors are evaluating your request...', 600)
    await runNarrativeState('talking', getCinematicReply(trimmed), 850)

    setTimeout(() => {
      setTyping(false)
      resetToIdle()
    }, 2800)
  }

  const handleVoiceToggle = async () => {
    if (state === 'listening') {
      setTyping(true)
      setState('thinking')
      setSubtitle('Voice stream captured. Interpreting intent...')
      await runNarrativeState(
        'talking',
        'Voice channel is online. In the next phase, this connects to live speech-to-text and streaming LLM responses.',
        900,
      )
      setTimeout(() => {
        setTyping(false)
        resetToIdle()
      }, 2800)
      return
    }

    if (state === 'thinking' || state === 'talking') return

    setState('listening')
    setSubtitle('Listening. Speak your command to the consciousness core.')
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 bg-neural-chamber" />
      <div className="absolute inset-0 chamber-haze" />
      <div className="absolute inset-0 chamber-scanlines opacity-20" />

      <RobotScene state={state} glowIntensity={glowIntensity} />

      <StatusIndicator state={state} clipName={activeClip} />

      <motion.div
        className="pointer-events-none absolute right-5 top-5 z-30 rounded-2xl border border-cyan-300/22 bg-slate-950/40 px-4 py-3 backdrop-blur-xl"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cyan-100/65">
          <Sparkles size={12} />
          Consciousness Chamber
        </div>
        <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-blue-100/55">
          Real GLB animations. Stateful AI persona. Ready for live voice, lip sync, and streaming backend.
        </p>
      </motion.div>

      <motion.section
        className="pointer-events-none absolute left-1/2 top-8 z-30 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
      >
        <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/44">AI Digital Consciousness</p>
        <h1 className="holo-text mt-2 text-[clamp(30px,4vw,56px)] font-semibold tracking-[0.08em]">
          SHALEM
        </h1>
        <p className="mt-2 text-sm text-blue-100/70 md:text-base">
          Cinematic AI engineer portfolio powered by a real-time avatar core.
        </p>
      </motion.section>

      <motion.div
        className="pointer-events-none absolute left-5 bottom-36 z-30 rounded-2xl border border-cyan-300/18 bg-slate-950/35 px-4 py-3 backdrop-blur-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-100/62">
          <Waves size={12} />
          Neural Atmosphere
        </p>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-blue-100/40">
          <span>State</span>
          <span>{state}</span>
          <span>Glow</span>
          <span>{glowIntensity.toFixed(2)}</span>
        </div>
      </motion.div>

      <SubtitlePanel text={subtitle} state={state} />

      <ControlPanel
        state={state}
        commandInput={commandInput}
        isTyping={isTyping}
        onCommandChange={setCommandInput}
        onSubmitCommand={handleSubmitCommand}
        onVoiceToggle={handleVoiceToggle}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${SCENE_COLORS.base} 100%)`,
        }}
      />
    </main>
  )
}
