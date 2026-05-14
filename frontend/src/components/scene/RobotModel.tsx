'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Group, MathUtils, Mesh, Object3D } from 'three'
import { AnimationController } from '@/lib/animationController'
import { AvatarState, ROBOT_MODEL_PATH } from '@/lib/constants'

interface RobotModelProps {
  state: AvatarState
  glowIntensity: number
  isSpeaking: boolean
  speechLevel: number
}

interface EmissiveMaterial {
  emissiveIntensity: number
}

const MODEL_BASE_TRANSFORM = {
  x: 0,
  y: -2.04,
  z: -2.92,
  yaw: 0.06,
}

export default function RobotModel({
  state,
  glowIntensity,
  isSpeaking,
  speechLevel,
}: RobotModelProps) {
  const gltf = useGLTF(ROBOT_MODEL_PATH)
  const clonedScene = useMemo(
    () => SkeletonUtils.clone(gltf.scene) as Group,
    [gltf.scene],
  )

  const groupRef = useRef<Group>(null)
  const controllerRef = useRef<AnimationController | null>(null)
  const headNodeRef = useRef<Object3D | null>(null)
  const torsoNodeRef = useRef<Object3D | null>(null)
  const jawNodeRef = useRef<Object3D | null>(null)
  const eyeNodesRef = useRef<Array<{ node: Object3D; baseScaleY: number }>>([])
  const emissiveMaterialsRef = useRef<Array<{ mat: EmissiveMaterial; base: number }>>([])

  const baseHeadRotation = useRef({ x: 0, y: 0 })
  const baseTorsoRotation = useRef({ x: 0, y: 0 })
  const baseJawRotation = useRef(0)
  const blinkRef = useRef({
    active: false,
    start: 0,
    duration: 0.12,
    nextAt: 2.5,
  })

  const playProceduralIdle = () => {
    controllerRef.current?.stopAll()
  }

  useEffect(() => {
    const emissiveMaterials: Array<{ mat: EmissiveMaterial; base: number }> = []
    const eyes: Array<{ node: Object3D; baseScaleY: number }> = []

    clonedScene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]

        materials.forEach((material) => {
          if (
            material &&
            typeof material === 'object' &&
            'emissiveIntensity' in material &&
            typeof material.emissiveIntensity === 'number'
          ) {
            emissiveMaterials.push({
              mat: material as EmissiveMaterial,
              base: material.emissiveIntensity,
            })
          }
        })
      }

      const loweredName = node.name.toLowerCase()
      if (!headNodeRef.current && /(head|neck)/.test(loweredName)) {
        headNodeRef.current = node
      }
      if (!torsoNodeRef.current && /(spine|chest|torso|upperbody)/.test(loweredName)) {
        torsoNodeRef.current = node
      }
      if (!jawNodeRef.current && /(jaw|mouth|chin)/.test(loweredName)) {
        jawNodeRef.current = node
      }
      if (/(eye|eyeball|eyelid)/.test(loweredName)) {
        eyes.push({ node, baseScaleY: node.scale.y })
      }
    })

    emissiveMaterialsRef.current = emissiveMaterials
    eyeNodesRef.current = eyes

    if (headNodeRef.current) {
      baseHeadRotation.current = {
        x: headNodeRef.current.rotation.x,
        y: headNodeRef.current.rotation.y,
      }
    }

    if (torsoNodeRef.current) {
      baseTorsoRotation.current = {
        x: torsoNodeRef.current.rotation.x,
        y: torsoNodeRef.current.rotation.y,
      }
    }
    if (jawNodeRef.current) {
      baseJawRotation.current = jawNodeRef.current.rotation.x
    }

    const controller = new AnimationController(clonedScene, gltf.animations)
    controllerRef.current = controller

    const strictIdle = controller.findBestClipByState(AvatarState.IDLE)
    if (strictIdle) {
      controller.play(strictIdle, { fadeDuration: 0.55, timeScale: 0.72 })
    } else {
      const calmFallback = controller.findCalmFallbackClip()
      if (calmFallback) {
        controller.play(calmFallback, { fadeDuration: 0.55, timeScale: 0.42 })
      } else {
        playProceduralIdle()
      }
    }

    return () => {
      controller.dispose()
      controllerRef.current = null
    }
  }, [clonedScene, gltf.animations])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return

    if (state === AvatarState.TALKING) {
      const talkClip = controller.findBestClipByState(AvatarState.TALKING)
      if (talkClip) {
        controller.play(talkClip, { fadeDuration: 0.3, timeScale: 1 })
      }
      return
    }

    const relaxedClip =
      controller.findBestClipByState(state) ??
      controller.findBestClipByState(AvatarState.IDLE) ??
      controller.findCalmFallbackClip()

    if (relaxedClip) {
      controller.play(relaxedClip, {
        fadeDuration: 0.5,
        timeScale:
          state === AvatarState.LISTENING
            ? 0.55
            : state === AvatarState.THINKING
              ? 0.48
              : 0.4,
      })
      return
    }

    playProceduralIdle()
  }, [state])

  useFrame(({ clock, pointer }, delta) => {
    const controller = controllerRef.current
    controller?.update(delta)

    if (groupRef.current) {
      const t = clock.getElapsedTime()
      const floatY = Math.sin(t * 1.15) * 0.065
      const floatX = Math.sin(t * 0.68) * 0.03
      groupRef.current.position.y = MathUtils.damp(
        groupRef.current.position.y,
        MODEL_BASE_TRANSFORM.y + floatY,
        4.8,
        delta,
      )
      groupRef.current.position.x = MathUtils.damp(
        groupRef.current.position.x,
        MODEL_BASE_TRANSFORM.x + floatX,
        3.8,
        delta,
      )
      groupRef.current.position.z = MathUtils.damp(
        groupRef.current.position.z,
        MODEL_BASE_TRANSFORM.z,
        4.2,
        delta,
      )
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        MODEL_BASE_TRANSFORM.yaw + Math.sin(t * 0.28) * 0.02,
        2.8,
        delta,
      )
    }

    const headNode = headNodeRef.current
    if (headNode) {
      const targetY = baseHeadRotation.current.y + pointer.x * 0.32
      const targetX = baseHeadRotation.current.x + pointer.y * 0.14
      headNode.rotation.y = MathUtils.damp(headNode.rotation.y, targetY, 5.8, delta)
      headNode.rotation.x = MathUtils.damp(headNode.rotation.x, targetX, 5.8, delta)
    }

    const torsoNode = torsoNodeRef.current
    if (torsoNode) {
      const targetY = baseTorsoRotation.current.y + pointer.x * 0.14
      const targetX = baseTorsoRotation.current.x + pointer.y * 0.05
      torsoNode.rotation.y = MathUtils.damp(torsoNode.rotation.y, targetY, 4.2, delta)
      torsoNode.rotation.x = MathUtils.damp(torsoNode.rotation.x, targetX, 4.2, delta)
    }

    const jawNode = jawNodeRef.current
    if (jawNode) {
      const talkMod = isSpeaking ? speechLevel : 0
      const targetJaw = baseJawRotation.current + talkMod * 0.22 + Math.sin(clock.elapsedTime * 16) * talkMod * 0.035
      jawNode.rotation.x = MathUtils.damp(jawNode.rotation.x, targetJaw, 13, delta)
    } else if (headNodeRef.current && isSpeaking) {
      const subtleTalkNod = baseHeadRotation.current.x + speechLevel * 0.06
      headNodeRef.current.rotation.x = MathUtils.damp(
        headNodeRef.current.rotation.x,
        subtleTalkNod,
        8,
        delta,
      )
    }

    const blinkState = blinkRef.current
    const t = clock.getElapsedTime()
    if (!blinkState.active && t >= blinkState.nextAt) {
      blinkState.active = true
      blinkState.start = t
      blinkState.duration = 0.11 + Math.random() * 0.06
    }
    if (blinkState.active) {
      const progress = (t - blinkState.start) / blinkState.duration
      if (progress >= 1) {
        blinkState.active = false
        blinkState.nextAt = t + 2 + Math.random() * 3
      } else {
        const blinkAmount = Math.sin(progress * Math.PI)
        eyeNodesRef.current.forEach(({ node, baseScaleY }) => {
          const targetY = baseScaleY * (1 - blinkAmount * 0.86)
          node.scale.y = MathUtils.damp(node.scale.y, targetY, 30, delta)
        })
      }
    } else {
      eyeNodesRef.current.forEach(({ node, baseScaleY }) => {
        node.scale.y = MathUtils.damp(node.scale.y, baseScaleY, 20, delta)
      })
    }

    emissiveMaterialsRef.current.forEach(({ mat, base }) => {
      const target = base + glowIntensity * 0.35
      mat.emissiveIntensity = MathUtils.damp(mat.emissiveIntensity, target, 6, delta)
    })
  })

  return (
    <group
      ref={groupRef}
      position={[MODEL_BASE_TRANSFORM.x, MODEL_BASE_TRANSFORM.y, MODEL_BASE_TRANSFORM.z]}
      rotation={[0, MODEL_BASE_TRANSFORM.yaw, 0]}
      scale={0.96}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload(ROBOT_MODEL_PATH)
