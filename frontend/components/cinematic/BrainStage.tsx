"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import NeuralParticles from "@/components/particles/NeuralParticles";
import BrainCore from "@/components/holograms/BrainCore";

export default function BrainStage() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={["#050914"]} />
        <fog attach="fog" args={["#050914", 8, 22]} />
        <ambientLight intensity={0.65} />
        <pointLight position={[3, 2, 4]} intensity={4} color="#5fd9ff" />
        <pointLight position={[-4, -2, -3]} intensity={2.5} color="#70ffd5" />
        <NeuralParticles />
        <BrainCore />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.1} />
      </Canvas>
    </div>
  );
}
