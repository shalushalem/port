'use client'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { PerspectiveCamera } from 'three'
import { AvatarState } from '@/lib/constants'
import { CameraController } from '@/cinematic/camera/CameraController'
import { resolveCameraPreset } from '@/cinematic/camera/CameraPresets'
import { resolveAtmosphereProfile } from '@/cinematic/environment/AtmosphereController'
import { resolveLightingProfile } from '@/cinematic/environment/LightingDirector'
import { resolveParticleProfile } from '@/cinematic/environment/ParticleManager'
import {
  AtmosphereProfileId,
  CameraPresetId,
  LightingProfileId,
} from '@/cinematic/types'
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
  cameraPresetId: CameraPresetId
  lightingProfileId: LightingProfileId
  atmosphereProfileId: AtmosphereProfileId
}

function CameraRig({
  cameraPresetId,
}: {
  cameraPresetId: CameraPresetId
}) {
  const controllerRef = useRef<CameraController | null>(null)

  useEffect(() => {
    controllerRef.current = new CameraController(cameraPresetId)
    return () => {
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    controllerRef.current?.setPresetById(cameraPresetId)
  }, [cameraPresetId])

  useFrame(({ camera, clock, pointer }, delta) => {
    if (!controllerRef.current) return
    controllerRef.current.update(
      camera as PerspectiveCamera,
      delta,
      clock.getElapsedTime(),
      pointer,
    )
  })

  return null
}

export default function RobotScene({
  state,
  glowIntensity,
  isSpeaking,
  speechLevel,
  activationLevel,
  cameraPresetId,
  lightingProfileId,
  atmosphereProfileId,
}: RobotSceneProps) {
  const initialCameraPreset = useMemo(
    () => resolveCameraPreset(cameraPresetId),
    [cameraPresetId],
  )
  const lightingProfile = useMemo(
    () => resolveLightingProfile(lightingProfileId),
    [lightingProfileId],
  )
  const atmosphereProfile = useMemo(
    () => resolveAtmosphereProfile(atmosphereProfileId),
    [atmosphereProfileId],
  )
  const particleProfile = useMemo(
    () => resolveParticleProfile(atmosphereProfileId),
    [atmosphereProfileId],
  )
  const profiledGlow = glowIntensity * particleProfile.glowMultiplier
  const profiledSpeech =
    speechLevel * particleProfile.speechMultiplier + particleProfile.ambientPulse

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows={false}
        dpr={[1, 1.2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.2
          gl.setClearAlpha(0)
        }}
        camera={{
          position: initialCameraPreset.position,
          fov: initialCameraPreset.fov,
          near: 0.1,
          far: 40,
        }}
      >
        <Suspense fallback={null}>
          <fog
            attach="fog"
            args={[
              atmosphereProfile.fogColor,
              atmosphereProfile.fogNear,
              atmosphereProfile.fogFar,
            ]}
          />

          <AdaptiveDpr pixelated />
          <CameraRig cameraPresetId={cameraPresetId} />
          <Lights
            glowIntensity={profiledGlow}
            speechLevel={profiledSpeech}
            activationLevel={activationLevel}
            profile={lightingProfile}
          />
          <BackgroundParticles glowIntensity={profiledGlow} speechLevel={profiledSpeech} />
          <FloatingGrid glowIntensity={profiledGlow} speechLevel={profiledSpeech} />
          <FloorGlow glowIntensity={profiledGlow} speechLevel={profiledSpeech} />
          <RobotModel
            state={state}
            glowIntensity={profiledGlow}
            isSpeaking={isSpeaking}
            speechLevel={profiledSpeech}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
