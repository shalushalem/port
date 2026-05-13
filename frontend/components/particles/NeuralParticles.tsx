"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NeuralParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1400;
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      values[i * 3 + 2] = radius * Math.cos(phi);
    }
    return values;
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7de6ff" size={0.035} transparent opacity={0.7} />
    </points>
  );
}
