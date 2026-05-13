'use client'
import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import RobotScene from '@/components/scene/RobotScene'
import { getAIResponse } from '@/lib/ai'
import { speakText, stopSpeech } from '@/lib/speech'
import { useAvatarStore } from '@/store/avatarStore'

type BrowserSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onresult: ((event: any) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

type BrowserSpeechRecognitionCtor = new () => BrowserSpeechRecognition

declare global {
  interface Window {
    webkitSpeechRecognition?: BrowserSpeechRecognitionCtor
    SpeechRecognition?: BrowserSpeechRecognitionCtor
  }
}

export default function HomePage() {
  const state = useAvatarStore((store) => store.state)
  const glowIntensity = useAvatarStore((store) => store.glowIntensity)
  const setState = useAvatarStore((store) => store.setState)
  const setSubtitle = useAvatarStore((store) => store.setSubtitle)
  const setListening = useAvatarStore((store) => store.setListening)
  const setSpeaking = useAvatarStore((store) => store.setSpeaking)
  const setSpeechLevel = useAvatarStore((store) => store.setSpeechLevel)
  const resetToIdle = useAvatarStore((store) => store.resetToIdle)

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const transcriptRef = useRef('')
  const speechPulseTimerRef = useRef<number | null>(null)
  const introPlayedRef = useRef(false)

  const stopSpeechPulse = useCallback(() => {
    if (speechPulseTimerRef.current) {
      window.clearInterval(speechPulseTimerRef.current)
      speechPulseTimerRef.current = null
    }
    setSpeechLevel(0)
  }, [setSpeechLevel])

  const startSpeechPulse = useCallback(() => {
    stopSpeechPulse()
    setSpeechLevel(0.6)
    speechPulseTimerRef.current = window.setInterval(() => {
      setSpeechLevel(0.35 + Math.random() * 0.65)
    }, 88)
  }, [setSpeechLevel, stopSpeechPulse])

  const speakReply = useCallback((text: string) => {
    setSubtitle(text)
    stopSpeech()
    startSpeechPulse()

    const utterance = speakText(
      text,
      () => {
        setSpeaking(true)
        setState('talking')
      },
      () => {
        stopSpeechPulse()
        setSpeaking(false)
        window.setTimeout(() => {
          resetToIdle()
        }, 140)
      },
      () => {
        setSpeechLevel(0.92)
      },
    )

    if (!utterance) {
      stopSpeechPulse()
      setSpeaking(false)
      resetToIdle()
    }
  }, [resetToIdle, setSpeaking, setSpeechLevel, setState, setSubtitle, startSpeechPulse, stopSpeechPulse])

  const runVoiceRound = useCallback(async (heardText: string) => {
    setState('thinking')
    setSubtitle('Processing voice input...')
    try {
      const response = await getAIResponse(heardText)
      speakReply(response)
    } catch {
      speakReply("I hit a processing issue. Let's try that again.")
    }
  }, [setState, setSubtitle, speakReply])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return
    const RecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!RecognitionCtor) {
      speakReply('Speech recognition is not available in this browser.')
      return
    }

    stopSpeech()
    stopSpeechPulse()
    transcriptRef.current = ''

    const recognition = new RecognitionCtor()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setListening(true)
      setState('listening')
      setSubtitle('Listening...')
    }

    recognition.onresult = (event: any) => {
      const joined = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? '')
        .join('')
        .trim()
      transcriptRef.current = joined
      if (joined) setSubtitle(joined)
    }

    recognition.onerror = () => {
      setListening(false)
      resetToIdle()
    }

    recognition.onend = () => {
      setListening(false)
      const heard = transcriptRef.current.trim()
      if (heard) {
        runVoiceRound(heard)
      } else {
        resetToIdle()
      }
    }

    recognition.start()
  }, [resetToIdle, runVoiceRound, setListening, setState, setSubtitle, speakReply, stopSpeechPulse])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [setListening])

  useEffect(() => {
    setState('idle')
    setSubtitle('Voice core online. Press V to talk.')

    const onPointerDown = () => {
      if (introPlayedRef.current) return
      introPlayedRef.current = true
      speakReply('Hello. I am Devarapalli Shalem Raju. Press V and speak with me.')
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      const key = event.key.toLowerCase()
      if (key === 'v') {
        event.preventDefault()
        if (useAvatarStore.getState().isListening) {
          stopListening()
        } else {
          startListening()
        }
      }
      if (key === 'r') {
        event.preventDefault()
        runVoiceRound('hello')
      }
    }

    window.addEventListener('pointerdown', onPointerDown, { once: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
      recognitionRef.current?.stop()
      stopSpeech()
      stopSpeechPulse()
    }
  }, [runVoiceRound, setState, setSubtitle, speakReply, startListening, stopListening, stopSpeechPulse])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 bg-neural-chamber" />
      <div className="absolute inset-0 chamber-grid" />
      <div className="absolute inset-0 chamber-orbits" />
      <div className="absolute inset-0 chamber-neon-shadow" />
      <div className="absolute inset-0 chamber-haze" />
      <div className="absolute inset-0 chamber-scanlines opacity-8" />
      <div className="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-cyan-300/12" />

      <RobotScene state={state} glowIntensity={Math.max(glowIntensity, 0.72)} />

      <motion.section
        className="pointer-events-none absolute left-1/2 top-8 z-30 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <h1 className="holo-text text-[clamp(22px,2.8vw,40px)] font-semibold tracking-[0.09em]">
          DEVARAPALLI SHALEM RAJU
        </h1>
      </motion.section>
    </main>
  )
}
