'use client'
import { motion } from 'framer-motion'

interface VoiceOrbProps {
  isListening: boolean
  isSpeaking: boolean
  onClick: () => void
}

export default function VoiceOrb({ isListening, isSpeaking, onClick }: VoiceOrbProps) {
  const active = isListening || isSpeaking

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-500/10"
      style={{
        boxShadow: active
          ? '0 0 32px rgba(34, 211, 238, 0.45), inset 0 0 24px rgba(6, 182, 212, 0.25)'
          : '0 0 14px rgba(37, 99, 235, 0.25), inset 0 0 16px rgba(15, 23, 42, 0.4)',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      {active && (
        <motion.span
          className="absolute inset-0 rounded-full border border-cyan-300/40"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <motion.span
        className="absolute inset-2 rounded-full bg-gradient-to-b from-cyan-300/35 to-blue-500/10"
        animate={active ? { opacity: [0.65, 1, 0.65] } : { opacity: 0.55 }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />

      {isListening ? (
        <span className="z-10 flex items-center gap-[3px]">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="wave-bar inline-block w-[3px] rounded-full bg-cyan-200"
              style={{ height: 6 }}
            />
          ))}
        </span>
      ) : (
        <svg className="z-10" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="9" y="2" width="6" height="12" rx="3" fill="rgba(186, 230, 253, 0.95)" />
          <path
            d="M5 10c0 3.866 3.134 7 7 7s7-3.134 7-7"
            stroke="rgba(186, 230, 253, 0.95)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line x1="12" y1="17" x2="12" y2="21" stroke="rgba(186, 230, 253, 0.95)" strokeWidth="1.5" />
          <line x1="9" y1="21" x2="15" y2="21" stroke="rgba(186, 230, 253, 0.95)" strokeWidth="1.5" />
        </svg>
      )}
    </motion.button>
  )
}
