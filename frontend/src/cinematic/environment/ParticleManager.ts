import { AtmosphereProfileId } from '@/cinematic/types'

export interface ParticleProfile {
  glowMultiplier: number
  speechMultiplier: number
  ambientPulse: number
}

const PARTICLE_PROFILES: Record<AtmosphereProfileId, ParticleProfile> = {
  dormant: { glowMultiplier: 0.7, speechMultiplier: 0.35, ambientPulse: 0.04 },
  awareness: { glowMultiplier: 0.88, speechMultiplier: 0.55, ambientPulse: 0.06 },
  connection: { glowMultiplier: 1, speechMultiplier: 0.72, ambientPulse: 0.08 },
  memory: { glowMultiplier: 1.06, speechMultiplier: 0.62, ambientPulse: 0.07 },
  vision: { glowMultiplier: 1.2, speechMultiplier: 0.85, ambientPulse: 0.1 },
  invitation: { glowMultiplier: 0.95, speechMultiplier: 0.58, ambientPulse: 0.06 },
}

export function resolveParticleProfile(atmosphereProfileId: AtmosphereProfileId) {
  return PARTICLE_PROFILES[atmosphereProfileId]
}
