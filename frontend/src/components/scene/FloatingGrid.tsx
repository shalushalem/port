'use client'
import { useMemo, useRef } from 'react'
import { LineSegments, MathUtils } from 'three'
import { useFrame } from '@react-three/fiber'

interface FloatingGridProps {
  glowIntensity: number
}

function buildGridPositions() {
  const positions: number[] = []
  const halfSize = 6
  const divisions = 18
  const step = (halfSize * 2) / divisions

  for (let i = -divisions / 2; i <= divisions / 2; i++) {
    const offset = i * step

    // Grid lines parallel to Z
    positions.push(offset, 0, -halfSize, offset, 0, halfSize)
    // Grid lines parallel to X
    positions.push(-halfSize, 0, offset, halfSize, 0, offset)
  }

  return new Float32Array(positions)
}

export default function FloatingGrid({ glowIntensity }: FloatingGridProps) {
  const gridRef = useRef<LineSegments>(null)

  const positions = useMemo(() => buildGridPositions(), [])

  useFrame(({ clock }, delta) => {
    if (!gridRef.current) return

    const t = clock.getElapsedTime()
    gridRef.current.rotation.y = MathUtils.damp(
      gridRef.current.rotation.y,
      Math.sin(t * 0.12) * 0.02,
      2.2,
      delta,
    )
    gridRef.current.position.y = MathUtils.damp(
      gridRef.current.position.y,
      -2.08 + Math.sin(t * 0.55) * 0.02,
      4,
      delta,
    )
  })

  return (
    <lineSegments ref={gridRef} position={[0, -2.08, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.035 + glowIntensity * 0.045}
      />
    </lineSegments>
  )
}
