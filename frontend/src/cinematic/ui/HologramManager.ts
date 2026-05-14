import { ChamberContentItem, ChamberContentKind } from '@/store/chamberContentStore'
import { OverlayEntry } from '@/cinematic/ui/OverlaySequencer'

const KIND_BY_TONE: Record<OverlayEntry['tone'], ChamberContentKind> = {
  memory: 'mediaReveal',
  vision: 'holographicPanel',
  invitation: 'projectCard',
}

export class HologramManager {
  toChamberItems(overlays: OverlayEntry[]): ChamberContentItem[] {
    return overlays.map((overlay) => ({
      id: overlay.id,
      kind: KIND_BY_TONE[overlay.tone],
      anchor: overlay.anchor,
      payload: {
        label: overlay.label,
        tone: overlay.tone,
        mediaSrc: overlay.mediaSrc,
      },
    }))
  }
}
