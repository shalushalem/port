'use client'
import { useRef } from 'react'
import { AdditiveBlending, MathUtils, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

interface FloorGlowProps {
  glowIntensity: number
  speechLevel: number
}

export default function FloorGlow({ glowIntensity, speechLevel }: FloorGlowProps) {
  const primaryRef = useRef<Mesh>(null)
  const secondaryRef = useRef<Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    const pulse = 0.6 + speechLevel * 0.5 + Math.sin(t * 0.9) * 0.08

    if (primaryRef.current) {
      const mat = primaryRef.current.material as any
      mat.opacity = MathUtils.damp(mat.opacity, 0.12 + glowIntensity * 0.16 + pulse * 0.1, 4, delta)
      primaryRef.current.scale.x = MathUtils.damp(primaryRef.current.scale.x, 1 + pulse * 0.03, 2.5, delta)
      primaryRef.current.scale.z = MathUtils.damp(primaryRef.current.scale.z, 1 + pulse * 0.03, 2.5, delta)
    }

    if (secondaryRef.current) {
      const mat = secondaryRef.current.material as any
      mat.opacity = MathUtils.damp(mat.opacity, 0.08 + glowIntensity * 0.09 + pulse * 0.06, 4, delta)
      secondaryRef.current.rotation.z = MathUtils.damp(
        secondaryRef.current.rotation.z,
        Math.sin(t * 0.22) * 0.05,
        1.8,
        delta,
      )
    }
  })

  return (
    <group position={[0, -2.08, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={primaryRef}>
        <ringGeometry args={[1.35, 2.95, 96]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.18}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={secondaryRef}>
        <ringGeometry args={[0.95, 1.25, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.11}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
