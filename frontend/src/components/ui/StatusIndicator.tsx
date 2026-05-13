'use client'
import { motion } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'
import { AvatarState, STATE_LABELS } from '@/lib/constants'

interface StatusIndicatorProps {
  state: AvatarState
  clipName: string | null
}

export default function StatusIndicator({ state, clipName }: StatusIndicatorProps) {
  const normalizedClip = clipName ?? 'Detecting clip'

  return (
    <div className="pointer-events-none absolute left-5 top-5 z-30 rounded-2xl border border-cyan-300/25 bg-slate-950/40 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <motion.span
          className="h-2.5 w-2.5 rounded-full bg-cyan-300"
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.92, 1.05, 0.92] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <p className="text-[10px] uppercase tracking-[0.26em] text-cyan-100/75">
          {STATE_LABELS[state]}
        </p>
      </div>

      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-blue-100/45">
        Animation: {normalizedClip}
      </p>

      <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-blue-200/35">
        <BrainCircuit size={12} />
        Neural Runtime
      </div>
    </div>
  )
}
