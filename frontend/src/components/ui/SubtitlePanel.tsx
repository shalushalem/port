'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AvatarState } from '@/lib/constants'

interface SubtitlePanelProps {
  text: string
  state: AvatarState
}

export default function SubtitlePanel({ text, state }: SubtitlePanelProps) {
  const [visibleText, setVisibleText] = useState('')
  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setVisibleText('')
    setIndex(0)

    if (!text) return

    let cursor = 0
    const step = () => {
      if (cursor <= text.length) {
        setVisibleText(text.slice(0, cursor))
        setIndex(cursor)
        cursor += 1
        timerRef.current = setTimeout(step, 22)
      }
    }

    timerRef.current = setTimeout(step, 60)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text])

  return (
    <motion.div
      className="pointer-events-none fixed bottom-24 left-1/2 z-30 w-[min(860px,94vw)] -translate-x-1/2"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          className="rounded-2xl border border-cyan-300/28 bg-slate-950/52 px-5 py-4 backdrop-blur-xl"
          style={{ boxShadow: '0 14px 50px rgba(2, 6, 23, 0.55)' }}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/60">
              Shalem // Conscious Channel
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-blue-100/35">
              {state}
            </p>
          </div>

          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-100/92 md:text-base">
            {visibleText}
            {index < text.length && (
              <span className="ml-1 inline-block h-[14px] w-[2px] animate-pulse bg-cyan-300 align-middle" />
            )}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
