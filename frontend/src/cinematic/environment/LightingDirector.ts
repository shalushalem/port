import { EmotionalState, LightingProfileId } from '@/cinematic/types'

export interface LightingProfile {
  id: LightingProfileId
  glowMultiplier: number
  activationBias: number
  speechBoost: number
  ambientFloor: number
}

const LIGHTING_PROFILES: Record<LightingProfileId, LightingProfile> = {
  dormant: {
    id: 'dormant',
    glowMultiplier: 0.72,
    activationBias: -0.12,
    speechBoost: 0.14,
    ambientFloor: 0.3,
  },
  awareness: {
    id: 'awareness',
    glowMultiplier: 0.92,
    activationBias: 0.08,
    speechBoost: 0.2,
    ambientFloor: 0.42,
  },
  connection: {
    id: 'connection',
    glowMultiplier: 1.02,
    activationBias: 0.12,
    speechBoost: 0.24,
    ambientFloor: 0.48,
  },
  memory: {
    id: 'memory',
    glowMultiplier: 0.95,
    activationBias: 0.05,
    speechBoost: 0.18,
    ambientFloor: 0.4,
  },
  vision: {
    id: 'vision',
    glowMultiplier: 1.15,
    activationBias: 0.16,
    speechBoost: 0.3,
    ambientFloor: 0.52,
  },
  invitation: {
    id: 'invitation',
    glowMultiplier: 1,
    activationBias: 0.1,
    speechBoost: 0.2,
    ambientFloor: 0.46,
  },
}

const PROFILE_BY_STATE: Record<EmotionalState, LightingProfileId> = {
  DORMANT: 'dormant',
  AWARENESS: 'awareness',
  CONNECTION: 'connection',
  MEMORY: 'memory',
  VISION: 'vision',
  INVITATION: 'invitation',
}

export function resolveLightingProfile(id: LightingProfileId) {
  return LIGHTING_PROFILES[id]
}

export function resolveLightingProfileForState(state: EmotionalState) {
  return resolveLightingProfile(PROFILE_BY_STATE[state])
}
