'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  CinematicDirector,
  CinematicDirectorSnapshot,
  createInitialCinematicSnapshot,
} from '@/cinematic/director/CinematicDirector'
import { resolveAvatarEmotion } from '@/cinematic/avatar/AvatarEmotionController'
import RobotScene from '@/components/scene/RobotScene'
import SubtitleBar from '@/components/ui/SubtitleBar'
import { useAvatarStore } from '@/store/avatarStore'
import { useChamberContentStore } from '@/store/chamberContentStore'
import { AVATAR_GLOW_BY_STATE } from '@/lib/constants'
import { useVoice } from '@/systems/voice/useVoice'
import { VoicePipelineStage } from '@/systems/voice/audioState'
import MicOrbButton from '@/components/ui/MicOrbButton'
import DynamicContentLayer from '@/components/chamber/DynamicContentLayer'
import { useImmersiveFullscreen } from '@/hooks/useImmersiveFullscreen'
import { useCinematicNarration } from '@/hooks/useCinematicNarration'

export default function HomePage() {
  useImmersiveFullscreen()

  const voiceState = useAvatarStore((store) => store.state)
  const subtitle = useAvatarStore((store) => store.subtitle)
  const glowIntensity = useAvatarStore((store) => store.glowIntensity)
  const isSpeaking = useAvatarStore((store) => store.isSpeaking)
  const speechLevel = useAvatarStore((store) => store.speechLevel)
  const setSpeaking = useAvatarStore((store) => store.setSpeaking)
  const setSpeechLevel = useAvatarStore((store) => store.setSpeechLevel)
  const addChamberItem = useChamberContentStore((store) => store.addItem)
  const clearChamberItems = useChamberContentStore((store) => store.clearItems)
  const [hasAwakened, setHasAwakened] = useState(false)
  const [activationPulse, setActivationPulse] = useState(0)
  const [cinematic, setCinematic] = useState<CinematicDirectorSnapshot>(
    createInitialCinematicSnapshot,
  )

  const { pipeline, toggleListening } = useVoice({
    enableKeyboardShortcuts: false,
    autoIntroOnFirstPointer: false,
  })

  const directorRef = useRef<CinematicDirector | null>(null)

  useEffect(() => {
    const director = new CinematicDirector()
    directorRef.current = director
    const unsubscribe = director.subscribe(setCinematic)
    director.start()

    return () => {
      unsubscribe()
      director.stop()
      directorRef.current = null
    }
  }, [])

  useEffect(() => {
    const interactive =
      pipeline.stage !== VoicePipelineStage.IDLE &&
      pipeline.stage !== VoicePipelineStage.ERROR
    directorRef.current?.notifyVoiceActivity(interactive)
  }, [pipeline.stage])

  useEffect(() => {
    clearChamberItems()
    cinematic.holograms.forEach((item) => addChamberItem(item))
  }, [addChamberItem, cinematic.holograms, clearChamberItems])

  const emotionalAvatar = useMemo(
    () => resolveAvatarEmotion(cinematic.emotion),
    [cinematic.emotion],
  )

  const sceneState =
    pipeline.stage === VoicePipelineStage.IDLE
      ? emotionalAvatar.avatarState
      : voiceState

  const sceneGlow = useMemo(() => {
    const emotionalGlow =
      AVATAR_GLOW_BY_STATE[emotionalAvatar.avatarState] + emotionalAvatar.glowBias
    const combined =
      pipeline.stage === VoicePipelineStage.IDLE
        ? emotionalGlow
        : Math.max(glowIntensity, emotionalGlow * 0.9)
    return Math.max(0.12, Math.min(1.4, combined))
  }, [emotionalAvatar.avatarState, emotionalAvatar.glowBias, glowIntensity, pipeline.stage])

  const narrativeSubtitle =
    pipeline.stage === VoicePipelineStage.IDLE
      ? cinematic.subtitle || subtitle
      : subtitle

  const isNameSplitShot =
    cinematic.cameraPresetId === 'awarenessSplit' &&
    pipeline.stage === VoicePipelineStage.IDLE
  const splitPortraitLive =
    cinematic.splitPortraitVisible && pipeline.stage === VoicePipelineStage.IDLE

  useCinematicNarration({
    text: cinematic.subtitle,
    tone: cinematic.subtitleTone,
    enabled:
      pipeline.stage === VoicePipelineStage.IDLE && !cinematic.interactiveReady,
    onSpeakingChange: setSpeaking,
    onSpeechLevel: setSpeechLevel,
  })

  const activationLevel = useMemo(
    () => (hasAwakened ? 1 : 0.72) + activationPulse * 0.18 + cinematic.activationBias,
    [activationPulse, cinematic.activationBias, hasAwakened],
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
      {!isNameSplitShot && <div className="absolute inset-0 chamber-orbits" />}
      <div className="absolute inset-0 chamber-scanlines opacity-[0.06]" />
      <motion.div
        className="chamber-brand"
        animate={{ opacity: isNameSplitShot ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <span className="chamber-brand__text">DEVARAPALLI SHALEM RAJU</span>
        <span className="chamber-brand__tag">FOUNDER OF OFG - FULL STACK DEVELOPER</span>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-cyan-300/8" />
      <motion.div
        className="pointer-events-none absolute inset-0 chamber-awakening"
        animate={{ opacity: 0.06 + activationPulse * 0.16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />

      {cinematic.emotion === 'DORMANT' && !isNameSplitShot && (
        <motion.div
          className="pointer-events-none fixed left-6 top-6 z-40"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0.32, 0.62, 0.4], y: [0, -3, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p
            className="text-[9px] uppercase tracking-[0.24em] text-cyan-100/55"
            style={{ textShadow: '0 0 14px rgba(125, 211, 252, 0.35)' }}
          >
            {cinematic.emotion}
          </p>
          <div className="mt-1 space-y-1">
            {cinematic.bootLines.map((line) => (
              <p
                key={line}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-100/56"
                style={{ textShadow: '0 0 12px rgba(125, 211, 252, 0.3)' }}
              >
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      )}

      <RobotScene
        state={sceneState}
        glowIntensity={Math.max(sceneGlow, 0.7)}
        isSpeaking={isSpeaking}
        speechLevel={speechLevel}
        activationLevel={activationLevel}
        cameraPresetId={cinematic.cameraPresetId}
        lightingProfileId={cinematic.lightingProfileId}
        atmosphereProfileId={cinematic.atmosphereProfileId}
      />

      <motion.div
        className="pointer-events-none fixed right-[4.5vw] top-1/2 z-40 hidden -translate-y-1/2 md:block"
        initial={false}
        animate={{
          opacity: splitPortraitLive ? 1 : 0,
          x: splitPortraitLive ? 0 : 28,
          scale: splitPortraitLive ? 1 : 0.97,
          y: splitPortraitLive ? [0, -5, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.62, delay: splitPortraitLive ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] },
          x: { duration: 0.62, delay: splitPortraitLive ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.62, delay: splitPortraitLive ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 4, repeat: splitPortraitLive ? Infinity : 0, ease: 'easeInOut' },
        }}
      >
        <div className="relative h-[48vh] min-h-[340px] w-[37vw] min-w-[360px] max-w-[520px] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-slate-950/38" />
          <Image
            src="/avatar/shalem.png"
            alt="Shalem portrait"
            fill
            sizes="(min-width: 768px) 520px, 0px"
            className="object-contain object-bottom drop-shadow-[0_0_32px_rgba(34,211,238,0.24)]"
            priority
          />
        </div>
      </motion.div>

      <SubtitleBar
        text={narrativeSubtitle}
        isActive={Boolean(narrativeSubtitle) || cinematic.paused}
        isSpeaking={isSpeaking}
        speechLevel={speechLevel}
        layout={isNameSplitShot ? 'splitLeft' : 'center'}
        className={isNameSplitShot ? 'bottom-[11vh]' : 'bottom-[5.5rem]'}
      />
      {(cinematic.emotion !== 'DORMANT' ||
        cinematic.interactiveReady ||
        pipeline.stage !== VoicePipelineStage.IDLE) && (
        <MicOrbButton stage={pipeline.stage} onToggle={toggleListening} />
      )}
      {!isNameSplitShot && <DynamicContentLayer />}
    </main>
  )
}
