import { MathUtils } from 'three'

export class LipSyncEngine {
  private level = 0

  update(rawSpeechLevel: number, deltaSec: number) {
    const target = MathUtils.clamp(rawSpeechLevel, 0, 1)
    this.level = MathUtils.damp(this.level, target, 12, deltaSec)
    return this.level
  }

  reset() {
    this.level = 0
  }
}
