import { PerspectiveCamera, Vector3 } from 'three'
import { MathUtils } from 'three'
import { CameraPreset } from '@/cinematic/camera/CameraPresets'

interface PointerLike {
  x: number
  y: number
}

export class CameraBlendSystem {
  private activePreset: CameraPreset
  private sourcePreset: CameraPreset
  private targetPreset: CameraPreset
  private blendDurationSec = 1.2
  private blendProgressSec = 1.2
  private lookAtTarget = new Vector3()

  constructor(initialPreset: CameraPreset) {
    this.activePreset = initialPreset
    this.sourcePreset = initialPreset
    this.targetPreset = initialPreset
    this.lookAtTarget.set(...initialPreset.target)
  }

  setPreset(nextPreset: CameraPreset, immediate = false) {
    if (nextPreset.id === this.targetPreset.id && !immediate) return
    this.sourcePreset = this.activePreset
    this.targetPreset = nextPreset
    this.blendDurationSec = immediate ? 0.001 : 1.2
    this.blendProgressSec = 0
    if (immediate) {
      this.activePreset = nextPreset
      this.lookAtTarget.set(...nextPreset.target)
    }
  }

  update(
    camera: PerspectiveCamera,
    deltaSec: number,
    elapsedSec: number,
    pointer: PointerLike,
  ) {
    this.blendProgressSec = Math.min(
      this.blendDurationSec,
      this.blendProgressSec + deltaSec,
    )
    const blendT = MathUtils.clamp(
      this.blendDurationSec <= 0
        ? 1
        : this.blendProgressSec / this.blendDurationSec,
      0,
      1,
    )
    const eased = MathUtils.smoothstep(blendT, 0, 1)

    const blendedPosition: [number, number, number] = [
      MathUtils.lerp(this.sourcePreset.position[0], this.targetPreset.position[0], eased),
      MathUtils.lerp(this.sourcePreset.position[1], this.targetPreset.position[1], eased),
      MathUtils.lerp(this.sourcePreset.position[2], this.targetPreset.position[2], eased),
    ]
    const blendedTarget: [number, number, number] = [
      MathUtils.lerp(this.sourcePreset.target[0], this.targetPreset.target[0], eased),
      MathUtils.lerp(this.sourcePreset.target[1], this.targetPreset.target[1], eased),
      MathUtils.lerp(this.sourcePreset.target[2], this.targetPreset.target[2], eased),
    ]
    const blendedFov = MathUtils.lerp(
      this.sourcePreset.fov,
      this.targetPreset.fov,
      eased,
    )
    const damping = MathUtils.lerp(
      this.sourcePreset.positionDamping,
      this.targetPreset.positionDamping,
      eased,
    )
    const targetDamping = MathUtils.lerp(
      this.sourcePreset.targetDamping,
      this.targetPreset.targetDamping,
      eased,
    )
    const noiseAmplitude = MathUtils.lerp(
      this.sourcePreset.noiseAmplitude,
      this.targetPreset.noiseAmplitude,
      eased,
    )
    const noiseSpeed = MathUtils.lerp(
      this.sourcePreset.noiseSpeed,
      this.targetPreset.noiseSpeed,
      eased,
    )
    const parallaxX = MathUtils.lerp(
      this.sourcePreset.parallax.x,
      this.targetPreset.parallax.x,
      eased,
    )
    const parallaxY = MathUtils.lerp(
      this.sourcePreset.parallax.y,
      this.targetPreset.parallax.y,
      eased,
    )
    const breathingAmplitude = MathUtils.lerp(
      this.sourcePreset.breathingAmplitude,
      this.targetPreset.breathingAmplitude,
      eased,
    )
    const breathingSpeed = MathUtils.lerp(
      this.sourcePreset.breathingSpeed,
      this.targetPreset.breathingSpeed,
      eased,
    )

    const driftX = Math.sin(elapsedSec * noiseSpeed + 0.43) * noiseAmplitude
    const driftY = Math.sin(elapsedSec * noiseSpeed * 0.87 + 1.3) * noiseAmplitude * 0.6
    const driftZ = Math.cos(elapsedSec * noiseSpeed * 0.62 + 0.9) * noiseAmplitude * 1.2
    const breathingY = Math.sin(elapsedSec * breathingSpeed) * breathingAmplitude
    const breathingZ = Math.cos(elapsedSec * breathingSpeed * 0.8) * breathingAmplitude * 0.5

    const desiredX = blendedPosition[0] + driftX + pointer.x * parallaxX
    const desiredY = blendedPosition[1] + driftY + breathingY + pointer.y * parallaxY
    const desiredZ = blendedPosition[2] + driftZ + breathingZ

    camera.position.x = MathUtils.damp(camera.position.x, desiredX, damping, deltaSec)
    camera.position.y = MathUtils.damp(camera.position.y, desiredY, damping, deltaSec)
    camera.position.z = MathUtils.damp(camera.position.z, desiredZ, damping, deltaSec)

    this.lookAtTarget.x = MathUtils.damp(
      this.lookAtTarget.x,
      blendedTarget[0] + pointer.x * parallaxX * 0.55,
      targetDamping,
      deltaSec,
    )
    this.lookAtTarget.y = MathUtils.damp(
      this.lookAtTarget.y,
      blendedTarget[1] + pointer.y * parallaxY * 0.45,
      targetDamping,
      deltaSec,
    )
    this.lookAtTarget.z = MathUtils.damp(
      this.lookAtTarget.z,
      blendedTarget[2],
      targetDamping,
      deltaSec,
    )

    camera.fov = MathUtils.damp(camera.fov, blendedFov, damping * 0.9, deltaSec)
    camera.updateProjectionMatrix()
    camera.lookAt(this.lookAtTarget)

    if (blendT >= 1) {
      this.activePreset = this.targetPreset
    }
  }
}
