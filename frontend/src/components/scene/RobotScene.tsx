'use client'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Preload } from '@react-three/drei'
import { MathUtils, Vector3 } from 'three'
import { AvatarState, CAMERA_DEFAULT, SCENE_COLORS } from '@/lib/constants'
import Lights from '@/components/scene/Lights'
import RobotModel from '@/components/scene/RobotModel'
import BackgroundParticles from '@/components/scene/BackgroundParticles'
import FloatingGrid from '@/components/scene/FloatingGrid'
import FloorGlow from '@/components/scene/FloorGlow'

interface RobotSceneProps {
  state: AvatarState
  glowIntensity: number
  isSpeaking: boolean
  speechLevel: number
  activationLevel: number
}

function CameraRig({
  state,
  speechLevel,
}: {
  state: AvatarState
  speechLevel: number
}) {
  const lookAtTarget = useRef(new Vector3(...CAMERA_DEFAULT.target))

  useFrame(({ camera, clock, pointer }, delta) => {
    const t = clock.getElapsedTime()
    const talkWeight = state === AvatarState.TALKING ? 1 : 0
    const listenWeight = state === AvatarState.LISTENING ? 1 : 0
    const boost = 0.055 + talkWeight * 0.04 + listenWeight * 0.02

    const targetX = Math.sin(t * 0.18) * 0.05 + pointer.x * boost
    const targetY = CAMERA_DEFAULT.position[1] + Math.sin(t * 0.22) * 0.025 + pointer.y * 0.04
    const zoomBias = talkWeight * -0.16 + speechLevel * -0.1
    const targetZ = CAMERA_DEFAULT.position[2] + Math.sin(t * 0.15) * 0.05 + zoomBias

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 1.45, delta)
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 1.45, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 1.45, delta)

    lookAtTarget.current.x = MathUtils.damp(lookAtTarget.current.x, pointer.x * 0.12, 2.2, delta)
    lookAtTarget.current.y = MathUtils.damp(
      lookAtTarget.current.y,
      CAMERA_DEFAULT.target[1] + pointer.y * 0.05 + speechLevel * 0.03,
      2.2,
      delta,
    )
    lookAtTarget.current.z = 0

    camera.lookAt(lookAtTarget.current)
  })

  return null
}

export default function RobotScene({
  state,
  glowIntensity,
  isSpeaking,
  speechLevel,
  activationLevel,
}: RobotSceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.2
          gl.setClearAlpha(0)
        }}
        camera={{
          position: CAMERA_DEFAULT.position,
          fov: CAMERA_DEFAULT.fov,
          near: 0.1,
          far: 40,
        }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={[SCENE_COLORS.base, 6.8, 20]} />

          <AdaptiveDpr pixelated />
          <CameraRig state={state} speechLevel={speechLevel} />
          <Lights
            glowIntensity={glowIntensity}
            speechLevel={speechLevel}
            activationLevel={activationLevel}
          />
          <BackgroundParticles glowIntensity={glowIntensity} speechLevel={speechLevel} />
          <FloatingGrid glowIntensity={glowIntensity} speechLevel={speechLevel} />
          <FloorGlow glowIntensity={glowIntensity} speechLevel={speechLevel} />
          <RobotModel
            state={state}
            glowIntensity={glowIntensity}
            isSpeaking={isSpeaking}
            speechLevel={speechLevel}
          />

          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.24}
            scale={6.2}
            blur={2.35}
            far={4.6}
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
