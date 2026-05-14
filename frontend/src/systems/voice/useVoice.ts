'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAvatarStore } from '@/store/avatarStore'
import {
  INITIAL_VOICE_PIPELINE_STATE,
  VoicePipelineState,
} from '@/systems/voice/audioState'
import { VoiceManager } from '@/systems/voice/voiceManager'

interface UseVoiceSystemOptions {
  enableKeyboardShortcuts?: boolean
  autoIntroOnFirstPointer?: boolean
}

export function useVoice(options: UseVoiceSystemOptions = {}) {
  const {
    enableKeyboardShortcuts = true,
    autoIntroOnFirstPointer = true,
  } = options

  const transitionState = useAvatarStore((store) => store.transitionState)
  const setSubtitle = useAvatarStore((store) => store.setSubtitle)
  const setListening = useAvatarStore((store) => store.setListening)
  const setSpeaking = useAvatarStore((store) => store.setSpeaking)
  const setSpeechLevel = useAvatarStore((store) => store.setSpeechLevel)

  const [pipeline, setPipeline] = useState<VoicePipelineState>(
    INITIAL_VOICE_PIPELINE_STATE,
  )

  const managerRef = useRef<VoiceManager | null>(null)
  const introPlayedRef = useRef(false)

  useEffect(() => {
    const manager = new VoiceManager({
      onPipelineChange: setPipeline,
      onAvatarTransition: transitionState,
      onSubtitle: setSubtitle,
      onListeningChange: setListening,
      onSpeakingChange: setSpeaking,
      onSpeechLevel: setSpeechLevel,
    })
    managerRef.current = manager
    manager.boot()

    const onKeyDown = (event: KeyboardEvent) => {
      if (!enableKeyboardShortcuts || event.repeat) return
      const key = event.key.toLowerCase()
      if (key === 'v') {
        event.preventDefault()
        manager.toggleListening()
      }
      if (key === 'r') {
        event.preventDefault()
        void manager.runTextRound('hello')
      }
    }

    const onPointerDown = () => {
      if (!autoIntroOnFirstPointer || introPlayedRef.current) return
      introPlayedRef.current = true
      manager.replayIntro()
    }

    if (enableKeyboardShortcuts) {
      window.addEventListener('keydown', onKeyDown)
    }
    if (autoIntroOnFirstPointer) {
      window.addEventListener('pointerdown', onPointerDown, { once: true })
    }

    return () => {
      if (enableKeyboardShortcuts) {
        window.removeEventListener('keydown', onKeyDown)
      }
      window.removeEventListener('pointerdown', onPointerDown)
      manager.dispose()
      managerRef.current = null
    }
  }, [
    autoIntroOnFirstPointer,
    enableKeyboardShortcuts,
    setListening,
    setSpeaking,
    setSpeechLevel,
    setSubtitle,
    transitionState,
  ])

  const startListening = useCallback(() => {
    managerRef.current?.startListening()
  }, [])

  const stopListening = useCallback(() => {
    managerRef.current?.stopListening()
  }, [])

  const toggleListening = useCallback(() => {
    managerRef.current?.toggleListening()
  }, [])

  const runTextRound = useCallback((text: string) => {
    return managerRef.current?.runTextRound(text)
  }, [])

  return {
    pipeline,
    startListening,
    stopListening,
    toggleListening,
    runTextRound,
  }
}
