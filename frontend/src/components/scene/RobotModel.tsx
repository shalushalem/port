'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Group, MathUtils, Mesh, Object3D } from 'three'
import { AnimationController } from '@/lib/animationController'
import { AvatarState, ROBOT_MODEL_PATH } from '@/lib/constants'
import { useAvatarStore } from '@/store/avatarStore'

interface RobotModelProps {
  state: AvatarState
  glowIntensity: number
}

interface EmissiveMaterial {
  emissiveIntensity: number
}

export default function RobotModel({ state, glowIntensity }: RobotModelProps) {
  const gltf = useGLTF(ROBOT_MODEL_PATH)
  const clonedScene = useMemo(
    () => SkeletonUtils.clone(gltf.scene) as Group,
    [gltf.scene],
  )

  const groupRef = useRef<Group>(null)
  const controllerRef = useRef<AnimationController | null>(null)
  const headNodeRef = useRef<Object3D | null>(null)
  const torsoNodeRef = useRef<Object3D | null>(null)
  const emissiveMaterialsRef = useRef<Array<{ mat: EmissiveMaterial; base: number }>>([])
  const setActiveClip = useAvatarStore((store) => store.setActiveClip)

  const baseHeadRotation = useRef({ x: 0, y: 0 })
  const baseTorsoRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const emissiveMaterials: Array<{ mat: EmissiveMaterial; base: number }> = []

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
    })

    emissiveMaterialsRef.current = emissiveMaterials

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

    const controller = new AnimationController(clonedScene, gltf.animations)
    controllerRef.current = controller

    const idleClip = controller.getIdleClipName()
    if (idleClip) {
      controller.play(idleClip, { fadeDuration: 0.55 })
      setActiveClip(idleClip)
    }

    return () => {
      controller.dispose()
      controllerRef.current = null
    }
  }, [clonedScene, gltf.animations, setActiveClip])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return

    const nextClip = controller.transitionToState(state, {
      fadeDuration: state === 'talking' ? 0.32 : 0.48,
    })

    if (nextClip) {
      setActiveClip(nextClip)
    }
  }, [state, setActiveClip])

  useFrame(({ clock, pointer }, delta) => {
    const controller = controllerRef.current
    controller?.update(delta)

    if (groupRef.current) {
      const t = clock.getElapsedTime()
      const floatY = Math.sin(t * 1.2) * 0.045
      const floatX = Math.sin(t * 0.75) * 0.02
      groupRef.current.position.y = MathUtils.damp(groupRef.current.position.y, floatY, 4.8, delta)
      groupRef.current.position.x = MathUtils.damp(groupRef.current.position.x, floatX, 3.8, delta)
    }

    const headNode = headNodeRef.current
    if (headNode) {
      const targetY = baseHeadRotation.current.y + pointer.x * 0.42
      const targetX = baseHeadRotation.current.x + pointer.y * 0.18
      headNode.rotation.y = MathUtils.damp(headNode.rotation.y, targetY, 5.8, delta)
      headNode.rotation.x = MathUtils.damp(headNode.rotation.x, targetX, 5.8, delta)
    }

    const torsoNode = torsoNodeRef.current
    if (torsoNode) {
      const targetY = baseTorsoRotation.current.y + pointer.x * 0.18
      const targetX = baseTorsoRotation.current.x + pointer.y * 0.08
      torsoNode.rotation.y = MathUtils.damp(torsoNode.rotation.y, targetY, 4.2, delta)
      torsoNode.rotation.x = MathUtils.damp(torsoNode.rotation.x, targetX, 4.2, delta)
    }

    emissiveMaterialsRef.current.forEach(({ mat, base }) => {
      const target = base + glowIntensity * 0.35
      mat.emissiveIntensity = MathUtils.damp(mat.emissiveIntensity, target, 6, delta)
    })
  })

  return (
    <group ref={groupRef} position={[0, -1.18, 0]} rotation={[0, 0, 0]} scale={1.45}>
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload(ROBOT_MODEL_PATH)
