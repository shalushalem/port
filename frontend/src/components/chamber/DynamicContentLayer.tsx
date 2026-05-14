'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useChamberContentStore } from '@/store/chamberContentStore'

type OverlayTone = 'memory' | 'vision' | 'invitation'

function extractPrimaryWord(label: string) {
  const cleaned = label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 4)
  const choice = cleaned[cleaned.length - 1] ?? cleaned[0] ?? label
  return choice.toUpperCase()
}

export default function DynamicContentLayer() {
  const items = useChamberContentStore((store) => store.items)

  if (items.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {items.map((item, index) => {
        const tone = (item.payload?.tone as OverlayTone | undefined) ?? 'vision'
        const label =
          typeof item.payload?.label === 'string' ? item.payload.label : item.kind
        const mediaSrc =
          typeof item.payload?.mediaSrc === 'string' ? item.payload.mediaSrc : ''
        const showImage = mediaSrc.length > 0
        const imageKeyword = extractPrimaryWord(label)

        return (
          <motion.div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${item.anchor.x * 100}%`,
              top: `${item.anchor.y * 100}%`,
            }}
            data-content-kind={item.kind}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{
              opacity: [0.4, 0.78, 0.48],
              y: [0, -11, 0],
              x: [0, 4, 0],
              scale: [0.99, 1.02, 0.99],
            }}
            transition={{
              duration: 6.8,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: index * 0.18,
            }}
          >
            <div className="relative">
              {showImage && (
                <motion.div
                  className="relative mb-2 h-20 w-32 overflow-hidden rounded-md"
                  animate={{ opacity: [0.4, 0.65, 0.45] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-slate-950/45" />
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-cyan-200/8 to-transparent" />
                  <Image
                    src={mediaSrc}
                    alt={label}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  <motion.p
                    className="pointer-events-none absolute bottom-1 left-1 z-30 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/86"
                    style={{ textShadow: '0 0 12px rgba(34, 211, 238, 0.52)' }}
                    animate={{ opacity: [0.45, 0.96, 0.54] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {imageKeyword}
                  </motion.p>
                </motion.div>
              )}
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/86"
                style={{
                  textShadow:
                    tone === 'memory'
                      ? '0 0 14px rgba(125, 211, 252, 0.55)'
                      : tone === 'invitation'
                        ? '0 0 14px rgba(52, 211, 153, 0.48)'
                        : '0 0 14px rgba(96, 165, 250, 0.5)',
                }}
              >
                {label}
              </p>
              <motion.div
                className="mt-1 h-px w-full origin-left"
                style={{
                  background:
                    tone === 'memory'
                      ? 'linear-gradient(90deg, rgba(125,211,252,0.62), transparent)'
                      : tone === 'invitation'
                        ? 'linear-gradient(90deg, rgba(52,211,153,0.58), transparent)'
                        : 'linear-gradient(90deg, rgba(96,165,250,0.6), transparent)',
                }}
                animate={{ scaleX: [0.35, 1, 0.52], opacity: [0.42, 0.9, 0.36] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
