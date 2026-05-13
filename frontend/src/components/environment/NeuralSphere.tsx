'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1
    }
    if (matRef.current) {
      matRef.current.distort = 0.25 + Math.sin(clock.getElapsedTime() * 0.5) * 0.08
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1}>
        <MeshDistortMaterial
          ref={matRef}
          color="#0a1628"
          emissive="#2563eb"
          emissiveIntensity={0.12}
          roughness={0.1}
          metalness={0.9}
          wireframe={false}
          transparent
          opacity={0.6}
          distort={0.25}
          speed={1.5}
        />
      </Sphere>

      {/* Wireframe outer shell */}
      <Sphere args={[1.04, 32, 32]} scale={1}>
        <meshBasicMaterial
          color="#2563eb"
          wireframe
          transparent
          opacity={0.04}
        />
      </Sphere>
    </Float>
  )
}

function RingSystem() {
  const ringsRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z = clock.getElapsedTime() * 0.06
      ringsRef.current.rotation.y = clock.getElapsedTime() * 0.04
    }
  })

  const rings = useMemo(() => [
    { radius: 1.4, tube: 0.004, rotation: [Math.PI / 2, 0, 0], opacity: 0.2 },
    { radius: 1.7, tube: 0.003, rotation: [Math.PI / 3, Math.PI / 4, 0], opacity: 0.12 },
    { radius: 2.0, tube: 0.002, rotation: [Math.PI / 6, Math.PI / 3, 0], opacity: 0.08 },
  ], [])

  return (
    <group ref={ringsRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.rotation as [number, number, number]}>
          <torusGeometry args={[ring.radius, ring.tube, 8, 128]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  )
}

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const count = 200
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.5 + Math.random() * 1.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#93c5fd"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

export default function NeuralSphere() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <div className="w-[500px] h-[500px] opacity-50">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[5, 5, 5]} color="#2563eb" intensity={0.8} />
          <pointLight position={[-5, -5, -5]} color="#06b6d4" intensity={0.4} />
          <CoreSphere />
          <RingSystem />
          <AmbientParticles />
        </Canvas>
      </div>
    </div>
  )
}
