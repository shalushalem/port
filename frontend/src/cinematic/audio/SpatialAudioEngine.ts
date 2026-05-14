import { MathUtils, Vector3 } from 'three'

export class SpatialAudioEngine {
  private listenerFocus = new Vector3(0, 1.1, 0)

  updateTarget(target: Vector3, deltaSec: number) {
    this.listenerFocus.x = MathUtils.damp(this.listenerFocus.x, target.x, 4, deltaSec)
    this.listenerFocus.y = MathUtils.damp(this.listenerFocus.y, target.y, 4, deltaSec)
    this.listenerFocus.z = MathUtils.damp(this.listenerFocus.z, target.z, 4, deltaSec)
    return this.listenerFocus
  }
}
