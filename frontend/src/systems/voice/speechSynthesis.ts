export interface SynthesisHandlers {
  onStart?: () => void
  onEnd?: () => void
  onWordBoundary?: (word: string, charIndex: number) => void
  onError?: (message: string) => void
}

let activeUtterance: SpeechSynthesisUtterance | null = null

const MALE_HINTS = [
  'male',
  'guy',
  'davis',
  'david',
  'mark',
  'george',
  'james',
  'thomas',
  'daniel',
  'lee',
]

const FEMALE_HINTS = [
  'female',
  'zira',
  'hazel',
  'susan',
  'sara',
  'aria',
  'katya',
  'jenny',
  'emma',
  'linda',
]

function includesAny(source: string, hints: string[]) {
  const normalized = source.toLowerCase()
  return hints.some((hint) => normalized.includes(hint))
}

function scoreVoice(voice: SpeechSynthesisVoice) {
  let score = 0
  const identity = `${voice.name} ${voice.lang}`.toLowerCase()
  if (voice.lang.toLowerCase().startsWith('en')) score += 4
  if (identity.includes('google')) score += 1.5
  if (identity.includes('microsoft')) score += 1.5
  if (includesAny(identity, MALE_HINTS)) score += 7
  if (includesAny(identity, FEMALE_HINTS)) score -= 8
  return score
}

function pickBestVoice(voices: SpeechSynthesisVoice[]) {
  if (voices.length === 0) return null

  const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a))
  const nonFemale = sorted.filter(
    (voice) => !includesAny(`${voice.name} ${voice.lang}`, FEMALE_HINTS),
  )
  return nonFemale[0] ?? sorted[0] ?? null
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
  // Chrome occasionally gets stuck after heavy render frames.
  synth.cancel()
  synth.resume()
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1.02
  utterance.pitch = 1
  utterance.volume = 1

  const assignBestVoice = () => {
    const best = pickBestVoice(synth.getVoices())
    if (best) utterance.voice = best
  }
  assignBestVoice()

  utterance.onstart = () => {
    activeUtterance = utterance
    handlers.onStart?.()
  }

  utterance.onend = () => {
    activeUtterance = null
    handlers.onEnd?.()
  }

  utterance.onerror = (event: any) => {
    activeUtterance = null
    handlers.onError?.(event?.error ?? 'speech_synthesis_error')
  }

  utterance.onboundary = (event: any) => {
    if (event?.name !== 'word') return
    const word = text.substring(event.charIndex, event.charIndex + event.charLength)
    handlers.onWordBoundary?.(word, event.charIndex)
  }

  window.setTimeout(() => {
    assignBestVoice()
    synth.speak(utterance)
  }, 60)
  return utterance
}
