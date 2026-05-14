'use client'
import { useRef } from 'react'
import { MathUtils, Mesh, AdditiveBlending } from 'three'
import { useFrame } from '@react-three/fiber'

interface AtmosphereVolumeProps {
  speechLevel: number
  activationLevel: number
}

export default function AtmosphereVolume({
  speechLevel,
  activationLevel,
}: AtmosphereVolumeProps) {
  const layerARef = useRef<Mesh>(null)
  const layerBRef = useRef<Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    const pulse = 0.45 + speechLevel * 0.4 + activationLevel * 0.25

    if (layerARef.current) {
      const material = layerARef.current.material as any
      material.opacity = MathUtils.damp(material.opacity, 0.14 + pulse * 0.18, 3, delta)
      layerARef.current.position.y = MathUtils.damp(
        layerARef.current.position.y,
        -0.5 + Math.sin(t * 0.22) * 0.1,
        2.5,
        delta,
      )
      layerARef.current.rotation.z = MathUtils.damp(
        layerARef.current.rotation.z,
        Math.sin(t * 0.1) * 0.08,
        2.2,
        delta,
      )
    }

    if (layerBRef.current) {
      const material = layerBRef.current.material as any
      material.opacity = MathUtils.damp(material.opacity, 0.1 + pulse * 0.12, 2.6, delta)
      layerBRef.current.position.y = MathUtils.damp(
        layerBRef.current.position.y,
        0.2 + Math.sin(t * 0.18 + 1.8) * 0.08,
        2.5,
        delta,
      )
      layerBRef.current.rotation.z = MathUtils.damp(
        layerBRef.current.rotation.z,
        Math.sin(t * 0.08 + 1.2) * 0.06,
        2.2,
        delta,
      )
    }
  })

  return (
    <group position={[0, 0.85, -3.6]}>
      <mesh ref={layerARef} rotation={[0, 0, 0]}>
        <circleGeometry args={[3.2, 72]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={layerBRef} rotation={[0, 0, 0]} position={[0, 0, -0.2]}>
        <circleGeometry args={[2.3, 72]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
