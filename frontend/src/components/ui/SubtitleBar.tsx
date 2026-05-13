'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface SubtitleBarProps {
  text: string
  isActive: boolean
  isSpeaking: boolean
  className?: string
}

export default function SubtitleBar({
  text,
  isActive,
  isSpeaking,
  className = '',
}: SubtitleBarProps) {
  const [displayText, setDisplayText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!text) {
      setDisplayText('')
      setCharIndex(0)
      return
    }

    setDisplayText('')
    setCharIndex(0)

    let i = 0
    const speed = 24

    const type = () => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i))
        setCharIndex(i)
        i++
        timerRef.current = setTimeout(type, speed)
      }
    }

    timerRef.current = setTimeout(type, 80)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text])

  if (!text && !isActive) return null

  return (
    <motion.div
      className={`fixed left-1/2 z-40 w-full max-w-[760px] -translate-x-1/2 px-5 ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text.slice(0, 24)}
            className="glass rounded-2xl px-5 py-4 relative overflow-hidden"
            style={{ boxShadow: '0 12px 44px rgba(2, 6, 23, 0.5)' }}
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.45 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.52), transparent)',
              }}
            />

            <div className="mb-2 flex items-center gap-2">
              <motion.span
                className="status-dot rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: isSpeaking ? '#22d3ee' : 'rgba(125, 211, 252, 0.45)',
                }}
              />
              <span className="text-[10px] uppercase tracking-[0.24em] text-blue-200/45">
                Shalem // AI Channel
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-100/90 md:text-base">
              {displayText}
              {charIndex < text.length && (
                <span
                  className="ml-1 inline-block align-middle"
                  style={{
                    width: 2,
                    height: 14,
                    background: '#22d3ee',
                    animation: 'blink-cursor 0.8s step-end infinite',
                  }}
                />
              )}
            </p>

            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.04) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
