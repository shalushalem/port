'use client'

import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { SubtitleTone } from '@/cinematic/ui/SubtitleEngine'
import {
  speakWithSynthesis,
  stopSynthesis,
} from '@/systems/voice/speechSynthesis'

interface UseCinematicNarrationOptions {
  text: string
  tone: SubtitleTone
  enabled: boolean
  onSpeakingChange: (speaking: boolean) => void
  onSpeechLevel: (level: number) => void
}

export function useCinematicNarration({
  text,
  tone,
  enabled,
  onSpeakingChange,
  onSpeechLevel,
}: UseCinematicNarrationOptions) {
  const lastStartedNarrationRef = useRef('')
  const pulseTimerRef = useRef<number | null>(null)
  const [unlockTick, setUnlockTick] = useState(0)

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        window.clearInterval(pulseTimerRef.current)
        pulseTimerRef.current = null
      }
      stopSynthesis()
      onSpeakingChange(false)
      onSpeechLevel(0)
    }
  }, [onSpeechLevel, onSpeakingChange])

  useEffect(() => {
    const unlock = () => {
      setUnlockTick((prev) => prev + 1)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('touchend', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchend', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const line = text.trim()
    if (!line) return
    if (tone === 'system') return
    const cueKey = `${tone}:${line}`
    if (lastStartedNarrationRef.current === cueKey) return

    const stopPulse = () => {
      if (pulseTimerRef.current) {
        window.clearInterval(pulseTimerRef.current)
        pulseTimerRef.current = null
      }
      onSpeechLevel(0)
    }

    const utterance = speakWithSynthesis(line, {
      onStart: () => {
        lastStartedNarrationRef.current = cueKey
        onSpeakingChange(true)
        onSpeechLevel(0.45)
        stopPulse()
        pulseTimerRef.current = window.setInterval(() => {
          onSpeechLevel(0.35 + Math.random() * 0.6)
        }, 84)
      },
      onWordBoundary: () => {
        onSpeechLevel(0.76 + Math.random() * 0.22)
      },
      onEnd: () => {
        stopPulse()
        onSpeakingChange(false)
      },
      onError: () => {
        lastStartedNarrationRef.current = ''
        stopPulse()
        onSpeakingChange(false)
      },
    })

    if (!utterance) {
      lastStartedNarrationRef.current = ''
      stopPulse()
      onSpeakingChange(false)
    }

    return () => {
      stopPulse()
      onSpeakingChange(false)
    }
  }, [
    enabled,
    onSpeechLevel,
    onSpeakingChange,
    text,
    tone,
    unlockTick,
  ])
}
