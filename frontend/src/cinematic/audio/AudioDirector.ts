import { EmotionalState } from '@/cinematic/types'

export interface AudioMixSnapshot {
  ambienceLevel: number
  droneLevel: number
  pulseLevel: number
}

const MIX_BY_EMOTION: Record<EmotionalState, AudioMixSnapshot> = {
  DORMANT: { ambienceLevel: 0.22, droneLevel: 0.32, pulseLevel: 0.1 },
  AWARENESS: { ambienceLevel: 0.35, droneLevel: 0.4, pulseLevel: 0.18 },
  CONNECTION: { ambienceLevel: 0.45, droneLevel: 0.42, pulseLevel: 0.28 },
  MEMORY: { ambienceLevel: 0.38, droneLevel: 0.34, pulseLevel: 0.2 },
  VISION: { ambienceLevel: 0.5, droneLevel: 0.48, pulseLevel: 0.3 },
  INVITATION: { ambienceLevel: 0.32, droneLevel: 0.28, pulseLevel: 0.14 },
}

export class AudioDirector {
  private emotion: EmotionalState = 'DORMANT'
  private voiceActive = false

  setEmotion(emotion: EmotionalState) {
    this.emotion = emotion
  }

  setVoiceActive(active: boolean) {
    this.voiceActive = active
  }

  getSnapshot(): AudioMixSnapshot {
    const mix = MIX_BY_EMOTION[this.emotion]
    if (!this.voiceActive) return mix
    return {
      ambienceLevel: mix.ambienceLevel * 0.9,
      droneLevel: mix.droneLevel * 0.85,
      pulseLevel: Math.min(1, mix.pulseLevel + 0.18),
    }
  }
}
