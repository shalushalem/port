'use client'
import { motion } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import { AvatarState } from '@/lib/constants'

interface VoiceOrbProps {
  state: AvatarState
  onToggle: () => void
}

export default function VoiceOrb({ state, onToggle }: VoiceOrbProps) {
  const isListening = state === 'listening'
  const isTalking = state === 'talking'
  const isThinking = state === 'thinking'
  const active = isListening || isTalking || isThinking

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-500/10 text-cyan-100 md:h-14 md:w-14"
      style={{
        boxShadow: active
          ? '0 0 28px rgba(0,217,255,0.55), inset 0 0 18px rgba(110,231,255,0.3)'
          : '0 0 14px rgba(59,130,246,0.26), inset 0 0 10px rgba(56,189,248,0.15)',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      aria-label={isListening ? 'Stop listening' : 'Activate listening'}
    >
      <motion.span
        className="absolute inset-0 rounded-full border border-cyan-300/30"
        animate={
          isListening
            ? { scale: [1, 1.32, 1], opacity: [0.72, 0.02, 0.72] }
            : active
              ? { scale: [1, 1.24, 1], opacity: [0.62, 0.04, 0.62] }
              : { opacity: 0 }
        }
        transition={{ duration: isListening ? 1.05 : 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.span
        className="absolute inset-2 rounded-full bg-gradient-to-b from-cyan-300/40 to-cyan-500/10"
        animate={
          isTalking
            ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }
            : isThinking
              ? { opacity: [0.55, 0.85, 0.55] }
              : isListening
                ? { scale: [1, 1.08, 1], opacity: [0.7, 0.95, 0.7] }
                : { opacity: 0.55 }
        }
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />

      <span className="relative z-10">
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </span>
    </motion.button>
  )
}
