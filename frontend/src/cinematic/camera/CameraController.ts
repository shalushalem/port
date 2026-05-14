import { PerspectiveCamera } from 'three'
import { CameraBlendSystem } from '@/cinematic/camera/CameraBlendSystem'
import {
  CameraPreset,
  resolveCameraPreset,
} from '@/cinematic/camera/CameraPresets'
import { CameraPresetId } from '@/cinematic/types'

interface PointerLike {
  x: number
  y: number
}

export class CameraController {
  private readonly blendSystem: CameraBlendSystem

  constructor(initialPresetId: CameraPresetId) {
    this.blendSystem = new CameraBlendSystem(resolveCameraPreset(initialPresetId))
  }

  setPresetById(id: CameraPresetId, immediate = false) {
    this.blendSystem.setPreset(resolveCameraPreset(id), immediate)
  }

  setPreset(preset: CameraPreset, immediate = false) {
    this.blendSystem.setPreset(preset, immediate)
  }

  update(
    camera: PerspectiveCamera,
    deltaSec: number,
    elapsedSec: number,
    pointer: PointerLike,
  ) {
    this.blendSystem.update(camera, deltaSec, elapsedSec, pointer)
  }
}
