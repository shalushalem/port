export type SubtitleTone = 'system' | 'presence' | 'reflection' | 'vision' | 'invitation'

export interface SubtitleFrame {
  text: string
  tone: SubtitleTone
}

interface SubtitleOptions {
  holdMs?: number
  tone?: SubtitleTone
  persistent?: boolean
}

export class SubtitleEngine {
  private frame: SubtitleFrame = { text: '', tone: 'system' }
  private holdRemainingMs = 0
  private persistent = false

  set(text: string, options: SubtitleOptions = {}) {
    this.frame = {
      text,
      tone: options.tone ?? 'presence',
    }
    this.holdRemainingMs = options.holdMs ?? 4200
    this.persistent = options.persistent ?? false
  }

  tick(deltaMs: number) {
    if (this.persistent || !this.frame.text) return false
    this.holdRemainingMs = Math.max(0, this.holdRemainingMs - deltaMs)
    if (this.holdRemainingMs > 0) return false
    this.frame = { text: '', tone: this.frame.tone }
    return true
  }

  getFrame() {
    return this.frame
  }
}
