'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface VoiceBarProps {
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  onStartListening: () => void
  onStopListening: () => void
  onStopSpeaking: () => void
}

export default function VoiceBar({
  isListening,
  isSpeaking,
  transcript,
  onStartListening,
  onStopListening,
  onStopSpeaking,
}: VoiceBarProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (isSpeaking) {
      onStopSpeaking()
      return
    }
    if (isListening) {
      onStopListening()
    } else {
      onStartListening()
    }
  }

  const getStatus = () => {
    if (isListening) return 'Listening...'
    if (isSpeaking) return 'Speaking — tap to interrupt'
    return 'Tap to speak'
  }

  const getMicIcon = () => {
    if (isListening) {
      return (
        // Waveform when listening
        <div className="flex items-center gap-[3px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="wave-bar rounded-full"
              style={{
                width: '3px',
                background: '#06b6d4',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )
    }
    if (isSpeaking) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4" width="4" height="16" rx="2" fill="rgba(147,197,253,0.8)" />
          <rect x="14" y="4" width="4" height="16" rx="2" fill="rgba(147,197,253,0.8)" />
        </svg>
      )
    }
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="rgba(147,197,253,0.8)" />
        <path d="M5 10c0 3.866 3.134 7 7 7s7-3.134 7-7" stroke="rgba(147,197,253,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="17" x2="12" y2="21" stroke="rgba(147,197,253,0.8)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9" y1="21" x2="15" y2="21" stroke="rgba(147,197,253,0.8)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.button
        className="glass-bright flex items-center gap-3 px-5 py-2.5 rounded-full cursor-none"
        style={{
          boxShadow: isListening
            ? '0 0 20px rgba(6,182,212,0.3), 0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* Mic / wave icon */}
        <motion.div
          className="flex items-center justify-center"
          animate={{
            scale: isListening ? [1, 1.15, 1] : 1,
          }}
          transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
        >
          {getMicIcon()}
        </motion.div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '14px',
            background: 'rgba(56,139,253,0.25)',
          }}
        />

        {/* Status / transcript text */}
        <div className="overflow-hidden" style={{ maxWidth: '200px' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={isListening ? transcript || 'listening' : getStatus()}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs whitespace-nowrap overflow-hidden text-ellipsis"
              style={{
                color: isListening
                  ? 'rgba(6,182,212,0.9)'
                  : 'rgba(147,197,253,0.6)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}
            >
              {isListening && transcript ? transcript : getStatus()}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Outer pulse when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(6,182,212,0.4)' }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Keyboard hint */}
      <AnimatePresence>
        {hovered && (
          <motion.p
            className="text-center mt-2 text-xs"
            style={{
              color: 'rgba(96,165,250,0.4)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            press space to speak
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
