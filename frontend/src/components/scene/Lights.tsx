'use client'
import { useMemo } from 'react'
import { SCENE_COLORS } from '@/lib/constants'

interface LightsProps {
  glowIntensity: number
}

export default function Lights({ glowIntensity }: LightsProps) {
  const rimIntensity = useMemo(() => 1.1 + glowIntensity * 1.2, [glowIntensity])
  const keyIntensity = useMemo(() => 1.4 + glowIntensity * 0.6, [glowIntensity])

  return (
    <>
      <ambientLight intensity={0.35 + glowIntensity * 0.22} color="#7dd3fc" />

      <directionalLight
        castShadow
        position={[3.2, 4.6, 3.5]}
        intensity={keyIntensity}
        color="#dbeafe"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />

      <directionalLight
        position={[-3.5, 2.8, -2.2]}
        intensity={rimIntensity}
        color={SCENE_COLORS.cyan}
      />

      <pointLight
        position={[0, 1.8, 2.6]}
        intensity={1 + glowIntensity * 0.9}
        distance={8}
        color={SCENE_COLORS.softCyan}
      />

      <pointLight
        position={[0, 2.2, -2.8]}
        intensity={0.6 + glowIntensity * 0.45}
        distance={10}
        color={SCENE_COLORS.violet}
      />
    </>
  )
}
