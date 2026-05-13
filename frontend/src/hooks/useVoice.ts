'use client'
import { useState, useRef, useCallback, useEffect } from 'react'

interface VoiceState {
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  response: string
  error: string | null
}

interface UseVoiceOptions {
  onTranscript?: (text: string) => void
  onResponse?: (text: string) => void
}

export function useVoice(options: UseVoiceOptions = {}) {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    response: '',
    error: null,
  })

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1

    // Try to find a good voice
    const voices = synthRef.current.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Enhanced')
    )
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setState(s => ({ ...s, isSpeaking: true }))
    utterance.onend = () => setState(s => ({ ...s, isSpeaking: false }))
    utterance.onerror = () => setState(s => ({ ...s, isSpeaking: false }))

    synthRef.current.speak(utterance)
    setState(s => ({ ...s, response: text }))
    options.onResponse?.(text)
  }, [options])

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setState(s => ({ ...s, error: 'Speech recognition not supported in this browser.' }))
      return
    }

    if (synthRef.current?.speaking) synthRef.current.cancel()

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setState(s => ({ ...s, isListening: true, transcript: '', error: null }))
    }

    recognition.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('')
      setState(s => ({ ...s, transcript: current }))
    }

    recognition.onend = () => {
      setState(s => {
        options.onTranscript?.(s.transcript)
        return { ...s, isListening: false }
      })
    }

    recognition.onerror = (e: any) => {
      setState(s => ({ ...s, isListening: false, error: e.error }))
    }

    recognition.start()
  }, [options])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setState(s => ({ ...s, isListening: false }))
  }, [])

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel()
    setState(s => ({ ...s, isSpeaking: false }))
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  }
}
