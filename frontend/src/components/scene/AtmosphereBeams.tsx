'use client'
import { useRef } from 'react'
import {
  AdditiveBlending,
  DoubleSide,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
} from 'three'
import { useFrame } from '@react-three/fiber'

interface AtmosphereBeamsProps {
  glowIntensity: number
}

export default function AtmosphereBeams({ glowIntensity }: AtmosphereBeamsProps) {
  const beamA = useRef<Mesh>(null)
  const beamB = useRef<Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()

    if (beamA.current) {
      beamA.current.rotation.z = MathUtils.damp(beamA.current.rotation.z, -0.08 + Math.sin(t * 0.45) * 0.03, 2.5, delta)
      const mat = beamA.current.material as MeshBasicMaterial
      mat.opacity = MathUtils.damp(mat.opacity, 0.06 + glowIntensity * 0.08, 3, delta)
    }

    if (beamB.current) {
      beamB.current.rotation.z = MathUtils.damp(beamB.current.rotation.z, 0.1 + Math.sin(t * 0.38 + 1) * 0.04, 2.5, delta)
      const mat = beamB.current.material as MeshBasicMaterial
      mat.opacity = MathUtils.damp(mat.opacity, 0.04 + glowIntensity * 0.07, 3, delta)
    }
  })

  return (
    <group position={[0, 1.55, -1.85]}>
      <mesh ref={beamA} position={[-0.8, 0.2, 0.4]} rotation={[0.1, 0.34, -0.08]}>
        <planeGeometry args={[1.7, 5.6]} />
        <meshBasicMaterial
          color="#6ee7ff"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>

      <mesh ref={beamB} position={[0.95, 0.05, 0.2]} rotation={[0.1, -0.26, 0.1]}>
        <planeGeometry args={[1.4, 5]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
