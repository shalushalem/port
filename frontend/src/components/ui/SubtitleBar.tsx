'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface SubtitleBarProps {
  text: string
  isActive: boolean
  isSpeaking: boolean
  speechLevel?: number
  layout?: 'center' | 'splitLeft'
  className?: string
}

export default function SubtitleBar({
  text,
  isActive,
  isSpeaking,
  speechLevel = 0,
  layout = 'center',
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
    const speed = 14

    const type = () => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i))
        setCharIndex(i)
        i++
        timerRef.current = setTimeout(type, speed)
      }
    }

    timerRef.current = setTimeout(type, 0)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text])

  if (!text && !isActive) return null

  const layoutClassName =
    layout === 'splitLeft'
      ? 'left-[6vw] w-[88vw] max-w-[560px] translate-x-0 px-0 md:w-[min(560px,40vw)]'
      : 'left-1/2 w-full max-w-[760px] -translate-x-1/2 px-5'

  return (
    <motion.div
      className={`fixed z-40 ${layoutClassName} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: layout === 'splitLeft' ? [0, -4, 0] : 0,
        x: layout === 'splitLeft' ? [0, 4, 0] : 0,
      }}
      transition={{
        opacity: { duration: 0.7 },
        x: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={text.slice(0, 24)}
            className="relative overflow-visible px-1 py-1"
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isSpeaking ? 1 + speechLevel * 0.016 : 0.995,
            }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.45 }}
          >
            <motion.div
              className="mb-2 h-[6px] w-[92px] rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(34,211,238,0.42), rgba(34,211,238,0.08))',
                boxShadow: '0 0 12px rgba(34, 211, 238, 0.22)',
              }}
              animate={{
                opacity: isSpeaking ? [0.36, 0.9, 0.42] : [0.2, 0.45, 0.22],
                scaleX: isSpeaking ? [0.7, 1.05, 0.75] : [0.52, 0.7, 0.56],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <p
              className="text-base leading-relaxed text-slate-100/95 md:text-[1.1rem]"
              style={{ textShadow: '0 0 18px rgba(34, 211, 238, 0.34)' }}
            >
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
              className="pointer-events-none absolute -left-2 -right-2 top-[55%] -z-10 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.44) 50%, transparent 100%)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
              }}
              animate={{ opacity: [0.18, 0.52, 0.22], scaleX: [0.55, 1, 0.62] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
