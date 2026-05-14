'use client'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, MathUtils, Points } from 'three'
import { useFrame } from '@react-three/fiber'
import { PARTICLE_COUNT } from '@/lib/constants'

interface BackgroundParticlesProps {
  glowIntensity: number
  speechLevel: number
}

export default function BackgroundParticles({
  glowIntensity,
  speechLevel,
}: BackgroundParticlesProps) {
  const pointsRef = useRef<Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 5.4 + Math.random() * 4.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.9
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return array
  }, [])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    pointsRef.current.rotation.y = t * 0.02 + speechLevel * 0.015
    pointsRef.current.position.y = MathUtils.damp(
      pointsRef.current.position.y,
      Math.sin(t * 0.28) * 0.06 + speechLevel * 0.04,
      2.2,
      delta,
    )
    pointsRef.current.rotation.x = MathUtils.damp(
      pointsRef.current.rotation.x,
      Math.sin(t * 0.12) * 0.04,
      2.8,
      delta,
    )
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#6ee7ff"
        size={0.014 + glowIntensity * 0.003 + speechLevel * 0.002}
        sizeAttenuation
        transparent
        opacity={0.08 + glowIntensity * 0.06 + speechLevel * 0.05}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
