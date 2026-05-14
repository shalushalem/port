'use client'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { VoicePipelineStage } from '@/systems/voice/audioState'

interface MicOrbButtonProps {
  stage: VoicePipelineStage
  onToggle: () => void
}

export default function MicOrbButton({ stage, onToggle }: MicOrbButtonProps) {
  const listening = stage === VoicePipelineStage.LISTENING
  const active =
    listening ||
    stage === VoicePipelineStage.THINKING ||
    stage === VoicePipelineStage.SPEAKING ||
    stage === VoicePipelineStage.SYNTHESIZING

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center">
      <motion.button
        type="button"
        onClick={onToggle}
        className="pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/35 bg-slate-950/56 text-cyan-100 backdrop-blur-xl"
        style={{
          boxShadow: active
            ? '0 0 42px rgba(34,211,238,0.32), inset 0 0 18px rgba(34,211,238,0.24)'
            : '0 0 22px rgba(59,130,246,0.18), inset 0 0 12px rgba(34,211,238,0.16)',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-label={listening ? 'Stop listening' : 'Start listening'}
      >
        <motion.span
          className="absolute inset-0 rounded-full border border-cyan-200/40"
          animate={
            active
              ? { scale: [1, 1.35, 1], opacity: [0.65, 0.06, 0.65] }
              : { scale: 1, opacity: 0.24 }
          }
          transition={{ duration: listening ? 0.9 : 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute inset-[7px] rounded-full bg-cyan-400/10"
          animate={active ? { opacity: [0.35, 0.9, 0.35] } : { opacity: 0.26 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Mic size={20} className="relative z-10" />
      </motion.button>
    </div>
  )
}
