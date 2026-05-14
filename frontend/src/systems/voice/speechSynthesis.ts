export interface SynthesisHandlers {
  onStart?: () => void
  onEnd?: () => void
  onWordBoundary?: (word: string, charIndex: number) => void
  onError?: (message: string) => void
}

function pickBestVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) =>
    voice.name.includes('Google UK English Male') ||
    voice.name.includes('Microsoft Guy') ||
    voice.name.includes('Premium') ||
    voice.name.includes('Enhanced') ||
    voice.lang === 'en-GB'
  ) ?? null
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopSynthesis() {
  if (!isSpeechSynthesisSupported()) return
  window.speechSynthesis.cancel()
}

export function speakWithSynthesis(
  text: string,
  handlers: SynthesisHandlers = {},
) {
  if (!isSpeechSynthesisSupported()) return null

  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1
  utterance.volume = 1

  const voices = synth.getVoices()
  const best = pickBestVoice(voices)
  if (best) utterance.voice = best

  utterance.onstart = () => {
    handlers.onStart?.()
  }

  utterance.onend = () => {
    handlers.onEnd?.()
  }

  utterance.onerror = (event: any) => {
    handlers.onError?.(event?.error ?? 'speech_synthesis_error')
  }

  utterance.onboundary = (event: any) => {
    if (event?.name !== 'word') return
    const word = text.substring(event.charIndex, event.charIndex + event.charLength)
    handlers.onWordBoundary?.(word, event.charIndex)
  }

  synth.speak(utterance)
  return utterance
}
