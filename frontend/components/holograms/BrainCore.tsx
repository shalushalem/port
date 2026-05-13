"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BrainCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.22;
      meshRef.current.rotation.x = Math.sin(t * 0.35) * 0.15;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.6 + Math.sin(t * 2.1) * 0.25;
    }
    if (auraRef.current) {
      auraRef.current.scale.setScalar(1.25 + Math.sin(t * 1.5) * 0.03);
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#1b2e45"
          emissive="#39efff"
          emissiveIntensity={0.7}
          roughness={0.3}
          metalness={0.85}
          wireframe
        />
      </mesh>
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.22, 32, 32]} />
        <meshBasicMaterial color="#2cf1ff" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
