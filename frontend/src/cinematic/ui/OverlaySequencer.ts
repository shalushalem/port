import { NormalizedAnchor } from '@/cinematic/types'

export type OverlayTone = 'memory' | 'vision' | 'invitation'

export interface OverlayEntry {
  id: string
  label: string
  tone: OverlayTone
  anchor: NormalizedAnchor
  mediaSrc?: string
  ttlMs: number
  ageMs: number
}

interface AddOverlayInput {
  id: string
  label: string
  tone: OverlayTone
  anchor?: NormalizedAnchor
  mediaSrc?: string
  ttlMs?: number
}

export class OverlaySequencer {
  private readonly overlays: OverlayEntry[] = []

  add(input: AddOverlayInput) {
    const next: OverlayEntry = {
      id: input.id,
      label: input.label,
      tone: input.tone,
      anchor: input.anchor ?? { x: 0.5, y: 0.5 },
      mediaSrc: input.mediaSrc,
      ttlMs: input.ttlMs ?? 7200,
      ageMs: 0,
    }
    const existingIndex = this.overlays.findIndex((overlay) => overlay.id === next.id)
    if (existingIndex >= 0) {
      this.overlays[existingIndex] = next
      return
    }
    this.overlays.push(next)
  }

  tick(deltaMs: number) {
    let changed = false
    for (let index = this.overlays.length - 1; index >= 0; index -= 1) {
      const overlay = this.overlays[index]
      overlay.ageMs += deltaMs
      if (overlay.ageMs >= overlay.ttlMs) {
        this.overlays.splice(index, 1)
        changed = true
      }
    }
    return changed
  }

  getOverlays() {
    return [...this.overlays]
  }
}
