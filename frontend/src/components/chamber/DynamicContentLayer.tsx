'use client'
import { useChamberContentStore } from '@/store/chamberContentStore'

export default function DynamicContentLayer() {
  const items = useChamberContentStore((store) => store.items)

  // Intentionally renders nothing until conversation/narration injects content.
  if (items.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute h-0 w-0"
          style={{
            left: `${item.anchor.x * 100}%`,
            top: `${item.anchor.y * 100}%`,
          }}
          data-content-kind={item.kind}
        />
      ))}
    </div>
  )
}
