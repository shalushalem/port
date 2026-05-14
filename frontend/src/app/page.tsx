'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import RobotScene from '@/components/scene/RobotScene'
import { useAvatarStore } from '@/store/avatarStore'
import { useVoice } from '@/systems/voice/useVoice'
import { VoicePipelineStage } from '@/systems/voice/audioState'
import MicOrbButton from '@/components/ui/MicOrbButton'
import DynamicContentLayer from '@/components/chamber/DynamicContentLayer'

export default function HomePage() {
  const state = useAvatarStore((store) => store.state)
  const glowIntensity = useAvatarStore((store) => store.glowIntensity)
  const isSpeaking = useAvatarStore((store) => store.isSpeaking)
  const speechLevel = useAvatarStore((store) => store.speechLevel)
  const [hasAwakened, setHasAwakened] = useState(false)
  const [activationPulse, setActivationPulse] = useState(0)

  const { pipeline, toggleListening } = useVoice({
    enableKeyboardShortcuts: false,
    autoIntroOnFirstPointer: false,
  })

  const activationLevel = useMemo(
    () => (hasAwakened ? 1 : 0.72) + activationPulse * 0.18,
    [activationPulse, hasAwakened],
  )

  const lastStageRef = useRef<VoicePipelineStage>(VoicePipelineStage.IDLE)

  useEffect(() => {
    const stage = pipeline.stage
    if (!hasAwakened && stage !== VoicePipelineStage.IDLE) {
      setHasAwakened(true)
      setActivationPulse(1)
    }

    if (
      lastStageRef.current !== VoicePipelineStage.SPEAKING &&
      stage === VoicePipelineStage.SPEAKING
    ) {
      setActivationPulse(1)
    }

    lastStageRef.current = stage
  }, [hasAwakened, pipeline.stage])

  useEffect(() => {
    if (activationPulse <= 0) return
    const timer = window.setTimeout(() => {
      setActivationPulse((prev) => Math.max(0, prev - 0.08))
    }, 60)
    return () => window.clearTimeout(timer)
  }, [activationPulse])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 bg-neural-chamber" />
      <div className="absolute inset-0 chamber-grid" />
      <div className="absolute inset-0 chamber-orbits" />
      <div className="absolute inset-0 chamber-neon-shadow" />
      <div className="absolute inset-0 chamber-haze" />
      <div className="absolute inset-0 chamber-core-light" />
      <div className="absolute inset-0 chamber-scanlines opacity-[0.06]" />
      <div className="chamber-brand">
        <span className="chamber-brand__text">DEVARAPALLI SHALEM RAJU</span>
        <span className="chamber-brand__tag">FOUNDER OF OFG • FULL STACK DEVELOPER</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-cyan-300/8" />
      <motion.div
        className="pointer-events-none absolute inset-0 chamber-awakening"
        animate={{ opacity: 0.16 + activationPulse * 0.3 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />

      <RobotScene
        state={state}
        glowIntensity={Math.max(glowIntensity, 0.7)}
        isSpeaking={isSpeaking}
        speechLevel={speechLevel}
        activationLevel={activationLevel}
      />

      <MicOrbButton stage={pipeline.stage} onToggle={toggleListening} />
      <DynamicContentLayer />
    </main>
  )
}
