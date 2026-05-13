'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface SubtitleBarProps {
  text: string
  isActive: boolean
  isSpeaking: boolean
}

export default function SubtitleBar({ text, isActive, isSpeaking }: SubtitleBarProps) {
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
    const speed = 28 // ms per character

    const type = () => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i))
        setCharIndex(i)
        i++
        timerRef.current = setTimeout(type, speed)
      }
    }

    timerRef.current = setTimeout(type, 100)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text])

  if (!text && !isActive) return null

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full"
      style={{ maxWidth: '680px', padding: '0 24px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 1, ease: [0.23, 1, 0.32, 1] }}
    >
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text.substring(0, 20)}
            className="glass rounded-2xl px-6 py-4 relative overflow-hidden"
            style={{
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Accent line top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)',
              }}
            />

            {/* Speaker label */}
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className="status-dot rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  background: isSpeaking ? '#06b6d4' : 'rgba(96,165,250,0.4)',
                }}
              />
              <span
                className="text-xs tracking-widest uppercase"
                style={{
                  color: 'rgba(96,165,250,0.45)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                }}
              >
                Shalem · AI
              </span>
            </div>

            {/* Text */}
            <p
              className="text-base leading-relaxed"
              style={{
                color: 'rgba(219,234,254,0.92)',
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                letterSpacing: '0.01em',
              }}
            >
              {displayText}
              {charIndex < text.length && (
                <span
                  className="inline-block ml-0.5"
                  style={{
                    width: '2px',
                    height: '14px',
                    background: '#06b6d4',
                    verticalAlign: 'middle',
                    animation: 'blink-cursor 0.8s step-end infinite',
                  }}
                />
              )}
            </p>

            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.03) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% center', '-200% center'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle prompt */}
      <AnimatePresence>
        {!text && (
          <motion.p
            className="text-center"
            style={{
              color: 'rgba(96,165,250,0.3)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
          >
            · · · ask me anything · · ·
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
