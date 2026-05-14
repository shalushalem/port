import { AtmosphereProfileId, EmotionalState } from '@/cinematic/types'

export interface AtmosphereProfile {
  id: AtmosphereProfileId
  fogColor: string
  fogNear: number
  fogFar: number
  hazeOpacity: number
}

const ATMOSPHERE_PROFILES: Record<AtmosphereProfileId, AtmosphereProfile> = {
  dormant: {
    id: 'dormant',
    fogColor: '#040912',
    fogNear: 7.4,
    fogFar: 23,
    hazeOpacity: 0.42,
  },
  awareness: {
    id: 'awareness',
    fogColor: '#050b17',
    fogNear: 7,
    fogFar: 21,
    hazeOpacity: 0.56,
  },
  connection: {
    id: 'connection',
    fogColor: '#050d1a',
    fogNear: 6.4,
    fogFar: 19.5,
    hazeOpacity: 0.68,
  },
  memory: {
    id: 'memory',
    fogColor: '#081225',
    fogNear: 6.8,
    fogFar: 18.8,
    hazeOpacity: 0.74,
  },
  vision: {
    id: 'vision',
    fogColor: '#061427',
    fogNear: 6.2,
    fogFar: 17.8,
    hazeOpacity: 0.8,
  },
  invitation: {
    id: 'invitation',
    fogColor: '#071120',
    fogNear: 6.6,
    fogFar: 19,
    hazeOpacity: 0.64,
  },
}

const PROFILE_BY_STATE: Record<EmotionalState, AtmosphereProfileId> = {
  DORMANT: 'dormant',
  AWARENESS: 'awareness',
  CONNECTION: 'connection',
  MEMORY: 'memory',
  VISION: 'vision',
  INVITATION: 'invitation',
}

export function resolveAtmosphereProfile(id: AtmosphereProfileId) {
  return ATMOSPHERE_PROFILES[id]
}

export function resolveAtmosphereProfileForState(state: EmotionalState) {
  return resolveAtmosphereProfile(PROFILE_BY_STATE[state])
}
