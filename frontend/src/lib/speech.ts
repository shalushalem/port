import {
  isSpeechSynthesisSupported,
  speakWithSynthesis,
  stopSynthesis,
} from '@/systems/voice/speechSynthesis'
import { isSpeechRecognitionSupported } from '@/systems/voice/speechRecognition'

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !isSpeechSynthesisSupported()) return []
  return window.speechSynthesis.getVoices()
}

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onWord?: (word: string, charIndex: number) => void,
) {
  return speakWithSynthesis(text, {
    onStart,
    onEnd,
    onWordBoundary: onWord,
  })
}

export function stopSpeech() {
  stopSynthesis()
}

export function isSpeechSupported() {
  return isSpeechSynthesisSupported() && isSpeechRecognitionSupported()
}
