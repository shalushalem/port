import { MathUtils, Vector2 } from 'three'

export class EyeTracking {
  private smoothed = new Vector2(0, 0)

  update(pointerX: number, pointerY: number, intensity: number, deltaSec: number) {
    const clampedIntensity = MathUtils.clamp(intensity, 0, 1)
    const targetX = pointerX * clampedIntensity
    const targetY = pointerY * clampedIntensity
    this.smoothed.x = MathUtils.damp(this.smoothed.x, targetX, 8, deltaSec)
    this.smoothed.y = MathUtils.damp(this.smoothed.y, targetY, 8, deltaSec)
    return this.smoothed
  }
}
