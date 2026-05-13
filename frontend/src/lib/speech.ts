export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined') return []
  return window.speechSynthesis.getVoices()
}

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onWord?: (word: string, charIndex: number) => void
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined') return null

  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.88
  utterance.pitch = 1.0
  utterance.volume = 1.0

  const voices = synth.getVoices()
  const best = voices.find(v =>
    v.name.includes('Google UK English Male') ||
    v.name.includes('Microsoft Guy') ||
    v.name.includes('Premium') ||
    v.lang === 'en-GB'
  )
  if (best) utterance.voice = best

  if (onStart) utterance.onstart = onStart
  if (onEnd) utterance.onend = onEnd
  if (onWord) utterance.onboundary = (e) => {
    if (e.name === 'word') {
      const word = text.substring(e.charIndex, e.charIndex + e.charLength)
      onWord(word, e.charIndex)
    }
  }

  synth.speak(utterance)
  return utterance
}

export function stopSpeech() {
  if (typeof window !== 'undefined') {
    window.speechSynthesis.cancel()
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}
