import { getAIResponse } from '@/lib/ai'
import { AvatarTransitionEvent } from '@/systems/avatar/avatarStateMachine'
import {
  INITIAL_VOICE_PIPELINE_STATE,
  VoicePipelineStage,
  VoicePipelineState,
} from '@/systems/voice/audioState'
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  BrowserSpeechRecognition,
} from '@/systems/voice/speechRecognition'
import {
  isSpeechSynthesisSupported,
  speakWithSynthesis,
  stopSynthesis,
} from '@/systems/voice/speechSynthesis'

export interface VoiceManagerCallbacks {
  onPipelineChange?: (state: VoicePipelineState) => void
  onAvatarTransition?: (event: AvatarTransitionEvent) => void
  onSubtitle?: (text: string) => void
  onListeningChange?: (listening: boolean) => void
  onSpeakingChange?: (speaking: boolean) => void
  onSpeechLevel?: (level: number) => void
}

export interface VoiceManagerOptions extends VoiceManagerCallbacks {
  generateResponse?: (input: string) => Promise<string>
}

export class VoiceManager {
  private recognition: BrowserSpeechRecognition | null = null
  private transcriptBuffer = ''
  private speechPulseTimer: number | null = null
  private pipeline: VoicePipelineState = { ...INITIAL_VOICE_PIPELINE_STATE }
  private generateResponse: (input: string) => Promise<string>
  private callbacks: VoiceManagerCallbacks
  private disposed = false

  constructor(options: VoiceManagerOptions = {}) {
    this.callbacks = options
    this.generateResponse = options.generateResponse ?? ((input) => getAIResponse(input))
  }

  getPipelineState() {
    return this.pipeline
  }

  boot() {
    this.emitAvatarTransition('boot')
    this.updatePipeline({ stage: VoicePipelineStage.IDLE, error: null })
    this.callbacks.onSubtitle?.('Voice core online. Press V to talk.')
  }

  async runTextRound(input: string) {
    if (!input.trim()) return
    await this.processTranscript(input.trim())
  }

  startListening() {
    if (this.disposed) return

    if (!isSpeechRecognitionSupported()) {
      this.emitError('Speech recognition is not available in this browser.')
      return
    }

    stopSynthesis()
    this.stopSpeechPulse()
    this.callbacks.onSpeakingChange?.(false)
    this.callbacks.onSpeechLevel?.(0)
    this.transcriptBuffer = ''

    this.recognition = createSpeechRecognizer({
      onStart: () => {
        this.updatePipeline({
          stage: VoicePipelineStage.LISTENING,
          transcript: '',
          error: null,
        })
        this.callbacks.onListeningChange?.(true)
        this.callbacks.onSubtitle?.('Listening...')
        this.emitAvatarTransition('startListening')
      },
      onTranscript: (text) => {
        this.transcriptBuffer = text
        this.updatePipeline({ transcript: text })
        if (text) this.callbacks.onSubtitle?.(text)
      },
      onError: (message) => {
        this.callbacks.onListeningChange?.(false)
        this.emitError(message)
      },
      onEnd: () => {
        this.callbacks.onListeningChange?.(false)
        const spoken = this.transcriptBuffer.trim()
        if (!spoken) {
          this.emitAvatarTransition('stopListening')
          this.updatePipeline({ stage: VoicePipelineStage.IDLE })
          return
        }
        void this.processTranscript(spoken)
      },
    })

    this.recognition?.start()
  }

  stopListening() {
    this.recognition?.stop()
    this.callbacks.onListeningChange?.(false)
    this.emitAvatarTransition('stopListening')
    this.updatePipeline({ stage: VoicePipelineStage.IDLE })
  }

  toggleListening() {
    if (this.pipeline.stage === VoicePipelineStage.LISTENING) {
      this.stopListening()
      return
    }
    this.startListening()
  }

  replayIntro() {
    this.speak('Hello. I am Devarapalli Shalem Raju. Press V and speak with me.')
  }

  dispose() {
    this.disposed = true
    this.recognition?.stop()
    stopSynthesis()
    this.stopSpeechPulse()
    this.callbacks.onListeningChange?.(false)
    this.callbacks.onSpeakingChange?.(false)
    this.callbacks.onSpeechLevel?.(0)
  }

  private async processTranscript(text: string) {
    this.updatePipeline({
      stage: VoicePipelineStage.TRANSCRIBING,
      transcript: text,
      error: null,
    })
    this.emitAvatarTransition('startThinking')
    this.callbacks.onSubtitle?.('Processing voice input...')

    try {
      const normalized = await this.runFutureVadHook(text)

      this.updatePipeline({ stage: VoicePipelineStage.THINKING })
      const response = await this.generateResponse(normalized)
      this.updatePipeline({
        stage: VoicePipelineStage.SYNTHESIZING,
        response,
      })
      this.speak(response)
    } catch {
      this.emitError("I hit a processing issue. Let's try that again.")
    }
  }

  private speak(text: string) {
    if (!isSpeechSynthesisSupported()) {
      this.emitError('Speech synthesis is not available in this browser.')
      return
    }

    this.callbacks.onSubtitle?.(text)
    this.startSpeechPulse()

    const utterance = speakWithSynthesis(text, {
      onStart: () => {
        this.updatePipeline({
          stage: VoicePipelineStage.SPEAKING,
          response: text,
        })
        this.callbacks.onSpeakingChange?.(true)
        this.emitAvatarTransition('startTalking')
      },
      onWordBoundary: () => {
        this.callbacks.onSpeechLevel?.(0.85 + Math.random() * 0.15)
      },
      onEnd: () => {
        this.stopSpeechPulse()
        this.callbacks.onSpeakingChange?.(false)
        this.emitAvatarTransition('finishTalking')
        this.updatePipeline({ stage: VoicePipelineStage.IDLE })
      },
      onError: (message) => {
        this.callbacks.onSpeakingChange?.(false)
        this.stopSpeechPulse()
        this.emitError(message)
      },
    })

    if (!utterance) {
      this.stopSpeechPulse()
      this.callbacks.onSpeakingChange?.(false)
      this.emitAvatarTransition('finishTalking')
      this.updatePipeline({ stage: VoicePipelineStage.IDLE })
    }
  }

  private startSpeechPulse() {
    this.stopSpeechPulse()
    this.callbacks.onSpeechLevel?.(0.52)
    this.speechPulseTimer = window.setInterval(() => {
      this.callbacks.onSpeechLevel?.(0.35 + Math.random() * 0.65)
    }, 88)
  }

  private stopSpeechPulse() {
    if (this.speechPulseTimer) {
      window.clearInterval(this.speechPulseTimer)
      this.speechPulseTimer = null
    }
    this.callbacks.onSpeechLevel?.(0)
  }

  private emitAvatarTransition(event: AvatarTransitionEvent) {
    this.callbacks.onAvatarTransition?.(event)
  }

  private emitError(message: string) {
    this.updatePipeline({
      stage: VoicePipelineStage.ERROR,
      error: message,
    })
    this.emitAvatarTransition('error')
    this.callbacks.onSubtitle?.(message)
  }

  private updatePipeline(partial: Partial<VoicePipelineState>) {
    this.pipeline = { ...this.pipeline, ...partial }
    this.callbacks.onPipelineChange?.(this.pipeline)
  }

  private async runFutureVadHook(text: string) {
    // Expansion point for VAD / denoise / confidence scoring.
    return text
  }
}
