'use client'
import { useMemo } from 'react'
import { SCENE_COLORS } from '@/lib/constants'

interface LightsProps {
  glowIntensity: number
}

export default function Lights({ glowIntensity }: LightsProps) {
  const rimIntensity = useMemo(() => 1.15 + glowIntensity * 1.05, [glowIntensity])
  const keyIntensity = useMemo(() => 1.75 + glowIntensity * 0.62, [glowIntensity])
  const fillIntensity = useMemo(() => 0.95 + glowIntensity * 0.5, [glowIntensity])

  return (
    <>
      <ambientLight intensity={0.6 + glowIntensity * 0.22} color="#93c5fd" />

      <directionalLight
        castShadow
        position={[3.6, 5.8, 4.6]}
        intensity={keyIntensity}
        color="#f8fbff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />

      <directionalLight
        position={[-3.2, 3.9, -2.1]}
        intensity={rimIntensity}
        color={SCENE_COLORS.cyan}
      />

      <pointLight
        position={[-1.4, 1.9, 3.6]}
        intensity={fillIntensity}
        distance={10}
        color="#dbeafe"
      />

      <pointLight
        position={[0, 2.1, 2.9]}
        intensity={1.15 + glowIntensity * 0.9}
        distance={9}
        color={SCENE_COLORS.softCyan}
      />

      <pointLight
        position={[0.6, 2.5, -3]}
        intensity={0.48 + glowIntensity * 0.32}
        distance={11}
        color={SCENE_COLORS.violet}
      />

      <hemisphereLight
        args={['#a5f3fc', '#020617', 0.34 + glowIntensity * 0.12]}
      />
    </>
  )
}
