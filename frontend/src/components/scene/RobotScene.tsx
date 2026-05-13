'use client'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Preload } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import type { AvatarState } from '@/lib/constants'
import { CAMERA_DEFAULT, SCENE_COLORS } from '@/lib/constants'
import Lights from '@/components/scene/Lights'
import RobotModel from '@/components/scene/RobotModel'
import BackgroundParticles from '@/components/scene/BackgroundParticles'
import FloatingGrid from '@/components/scene/FloatingGrid'

interface RobotSceneProps {
  state: AvatarState
  glowIntensity: number
}

function CameraRig({ state }: { state: AvatarState }) {
  const lookAtTarget = useRef(new Vector3(...CAMERA_DEFAULT.target))

  useFrame(({ camera, clock, pointer }, delta) => {
    const t = clock.getElapsedTime()
    const talkingBoost = state === 'talking' ? 0.18 : state === 'listening' ? 0.12 : 0.08

    const targetX = Math.sin(t * 0.22) * 0.1 + pointer.x * talkingBoost
    const targetY = CAMERA_DEFAULT.position[1] + Math.sin(t * 0.32) * 0.04 + pointer.y * 0.08
    const targetZ = CAMERA_DEFAULT.position[2] + Math.sin(t * 0.16) * 0.09

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 1.8, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 1.8, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 1.8, delta)

    lookAtTarget.current.x = MathUtils.damp(lookAtTarget.current.x, pointer.x * 0.22, 2.4, delta)
    lookAtTarget.current.y = MathUtils.damp(
      lookAtTarget.current.y,
      CAMERA_DEFAULT.target[1] + pointer.y * 0.08,
      2.4,
      delta,
    )
    lookAtTarget.current.z = 0

    camera.lookAt(lookAtTarget.current)
  })

  return null
}

export default function RobotScene({ state, glowIntensity }: RobotSceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: CAMERA_DEFAULT.position,
          fov: CAMERA_DEFAULT.fov,
          near: 0.1,
          far: 40,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={[SCENE_COLORS.base]} />
          <fog attach="fog" args={[SCENE_COLORS.base, 5.4, 13.5]} />

          <AdaptiveDpr pixelated />
          <CameraRig state={state} />
          <Lights glowIntensity={glowIntensity} />
          <BackgroundParticles glowIntensity={glowIntensity} />
          <FloatingGrid glowIntensity={glowIntensity} />
          <RobotModel state={state} glowIntensity={glowIntensity} />

          <ContactShadows
            position={[0, -1.12, 0]}
            opacity={0.34}
            scale={5}
            blur={1.9}
            far={3.6}
            resolution={512}
            color="#061225"
            frames={1}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
