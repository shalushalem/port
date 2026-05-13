'use client'
import { useMemo, useRef } from 'react'
import { LineSegments, MathUtils } from 'three'
import { useFrame } from '@react-three/fiber'

interface FloatingGridProps {
  glowIntensity: number
}

function buildGridPositions() {
  const positions: number[] = []
  const ringCount = 11
  const ringSegments = 72
  const maxRadius = 3.6

  for (let ringIndex = 1; ringIndex <= ringCount; ringIndex++) {
    const radius = (ringIndex / ringCount) * maxRadius
    for (let segment = 0; segment < ringSegments; segment++) {
      const a1 = (segment / ringSegments) * Math.PI * 2
      const a2 = ((segment + 1) / ringSegments) * Math.PI * 2
      positions.push(
        Math.cos(a1) * radius,
        0,
        Math.sin(a1) * radius,
        Math.cos(a2) * radius,
        0,
        Math.sin(a2) * radius,
      )
    }
  }

  const spokes = 24
  for (let i = 0; i < spokes; i++) {
    const angle = (i / spokes) * Math.PI * 2
    positions.push(
      0,
      0,
      0,
      Math.cos(angle) * maxRadius,
      0,
      Math.sin(angle) * maxRadius,
    )
  }

  return new Float32Array(positions)
}

export default function FloatingGrid({ glowIntensity }: FloatingGridProps) {
  const gridRef = useRef<LineSegments>(null)

  const positions = useMemo(() => buildGridPositions(), [])

  useFrame(({ clock }, delta) => {
    if (!gridRef.current) return

    const t = clock.getElapsedTime()
    gridRef.current.rotation.y = t * 0.03
    gridRef.current.position.y = MathUtils.damp(
      gridRef.current.position.y,
      0.06 + Math.sin(t * 0.8) * 0.015,
      4,
      delta,
    )
  })

  return (
    <lineSegments ref={gridRef} position={[0, 0.04, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.1 + glowIntensity * 0.16}
      />
    </lineSegments>
  )
}
