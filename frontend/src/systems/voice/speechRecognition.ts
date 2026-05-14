export interface BrowserSpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onresult: ((event: any) => void) | null
  onend: (() => void) | null
  onerror: ((event: any) => void) | null
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

export interface RecognitionHandlers {
  onStart?: () => void
  onTranscript?: (text: string, isFinal: boolean) => void
  onEnd?: () => void
  onError?: (message: string) => void
}

export function getSpeechRecognitionCtor() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function isSpeechRecognitionSupported() {
  return Boolean(getSpeechRecognitionCtor())
}

export function createSpeechRecognizer(handlers: RecognitionHandlers) {
  const RecognitionCtor = getSpeechRecognitionCtor()
  if (!RecognitionCtor) return null

  const recognition = new RecognitionCtor()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = 'en-US'

  recognition.onstart = () => {
    handlers.onStart?.()
  }

  recognition.onresult = (event: any) => {
    const joined = Array.from(event.results)
      .map((result: any) => result[0]?.transcript ?? '')
      .join('')
      .trim()

    const isFinal = Array.from(event.results).some((result: any) => result.isFinal)
    handlers.onTranscript?.(joined, isFinal)
  }

  recognition.onend = () => {
    handlers.onEnd?.()
  }

  recognition.onerror = (event: any) => {
    handlers.onError?.(event?.error ?? 'speech_recognition_error')
  }

  return recognition
}
