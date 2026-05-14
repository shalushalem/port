import { AvatarState } from '@/systems/avatar/avatarStateMachine'
import { AvatarEmotionId, EmotionalState } from '@/cinematic/types'

export interface AvatarEmotionProfile {
  id: AvatarEmotionId
  avatarState: AvatarState
  glowBias: number
  eyeContact: number
  breathTempo: number
}

const AVATAR_EMOTIONS: Record<AvatarEmotionId, AvatarEmotionProfile> = {
  dormant: {
    id: 'dormant',
    avatarState: AvatarState.SLEEPING,
    glowBias: -0.14,
    eyeContact: 0.12,
    breathTempo: 0.72,
  },
  awareness: {
    id: 'awareness',
    avatarState: AvatarState.IDLE,
    glowBias: 0.05,
    eyeContact: 0.58,
    breathTempo: 0.9,
  },
  connection: {
    id: 'connection',
    avatarState: AvatarState.LISTENING,
    glowBias: 0.12,
    eyeContact: 0.78,
    breathTempo: 1,
  },
  memory: {
    id: 'memory',
    avatarState: AvatarState.THINKING,
    glowBias: 0.08,
    eyeContact: 0.64,
    breathTempo: 0.88,
  },
  vision: {
    id: 'vision',
    avatarState: AvatarState.TALKING,
    glowBias: 0.18,
    eyeContact: 0.82,
    breathTempo: 1.05,
  },
  invitation: {
    id: 'invitation',
    avatarState: AvatarState.IDLE,
    glowBias: 0.1,
    eyeContact: 0.74,
    breathTempo: 0.94,
  },
}

const EMOTION_MAP: Record<EmotionalState, AvatarEmotionId> = {
  DORMANT: 'dormant',
  AWARENESS: 'awareness',
  CONNECTION: 'connection',
  MEMORY: 'memory',
  VISION: 'vision',
  INVITATION: 'invitation',
}

export function resolveAvatarEmotion(emotionalState: EmotionalState) {
  return AVATAR_EMOTIONS[EMOTION_MAP[emotionalState]]
}
