'use client'
import { useMemo } from 'react'
import { SCENE_COLORS } from '@/lib/constants'

interface LightsProps {
  glowIntensity: number
  speechLevel: number
  activationLevel: number
}

export default function Lights({
  glowIntensity,
  speechLevel,
  activationLevel,
}: LightsProps) {
  const dynamic = 0.85 + speechLevel * 0.42 + activationLevel * 0.28
  const rimIntensity = useMemo(
    () => (1.05 + glowIntensity * 0.94) * dynamic,
    [dynamic, glowIntensity],
  )
  const keyIntensity = useMemo(
    () => (1.52 + glowIntensity * 0.52) * dynamic,
    [dynamic, glowIntensity],
  )
  const fillIntensity = useMemo(
    () => (0.82 + glowIntensity * 0.42) * dynamic,
    [dynamic, glowIntensity],
  )

  return (
    <>
      <ambientLight intensity={0.46 + glowIntensity * 0.16 + activationLevel * 0.2} color="#93c5fd" />

      <directionalLight
        castShadow
        position={[3.2, 5.2, 4.8]}
        intensity={keyIntensity}
        color="#f8fbff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
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
        intensity={0.95 + glowIntensity * 0.7 + speechLevel * 0.45}
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
        args={['#a5f3fc', '#020617', 0.24 + glowIntensity * 0.1 + activationLevel * 0.1]}
      />
    </>
  )
}
