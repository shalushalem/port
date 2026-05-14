'use client'
import { useMemo } from 'react'
import { SCENE_COLORS } from '@/lib/constants'
import { LightingProfile } from '@/cinematic/environment/LightingDirector'

interface LightsProps {
  glowIntensity: number
  speechLevel: number
  activationLevel: number
  profile: LightingProfile
}

export default function Lights({
  glowIntensity,
  speechLevel,
  activationLevel,
  profile,
}: LightsProps) {
  const dynamic =
    profile.ambientFloor +
    speechLevel * (0.32 + profile.speechBoost) +
    (activationLevel + profile.activationBias) * 0.3
  const rimIntensity = useMemo(
    () => (1.05 + glowIntensity * 0.94 * profile.glowMultiplier) * dynamic,
    [dynamic, glowIntensity, profile.glowMultiplier],
  )
  const keyIntensity = useMemo(
    () => (1.52 + glowIntensity * 0.52 * profile.glowMultiplier) * dynamic,
    [dynamic, glowIntensity, profile.glowMultiplier],
  )
  const fillIntensity = useMemo(
    () => (0.82 + glowIntensity * 0.42 * profile.glowMultiplier) * dynamic,
    [dynamic, glowIntensity, profile.glowMultiplier],
  )

  return (
    <>
      <ambientLight
        intensity={
          0.42 +
          glowIntensity * 0.14 * profile.glowMultiplier +
          (activationLevel + profile.activationBias) * 0.18
        }
        color="#93c5fd"
      />

      <directionalLight
        position={[3.2, 5.2, 4.8]}
        intensity={keyIntensity}
        color="#f8fbff"
      />

      <directionalLight
        position={[-3.5, 3.8, -2.3]}
        intensity={rimIntensity}
        color={SCENE_COLORS.cyan}
      />

      <pointLight
        position={[-1.8, 2.1, 3.4]}
        intensity={fillIntensity}
        distance={10}
        color="#dbeafe"
      />

      <pointLight
        position={[0, 2, 2.6]}
        intensity={0.95 + glowIntensity * 0.7 + speechLevel * (0.22 + profile.speechBoost)}
        distance={8}
        color={SCENE_COLORS.softCyan}
      />

      <pointLight
        position={[0.6, 2.5, -3]}
        intensity={0.32 + glowIntensity * 0.18}
        distance={11}
        color={SCENE_COLORS.violet}
      />

      <hemisphereLight
        args={[
          '#a5f3fc',
          '#020617',
          0.24 +
            glowIntensity * 0.1 * profile.glowMultiplier +
            (activationLevel + profile.activationBias) * 0.1,
        ]}
      />
    </>
  )
}
