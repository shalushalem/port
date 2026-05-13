'use client'
import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import VoiceOrb from '@/components/VoiceOrb'

interface ChatInterfaceProps {
  isReady: boolean
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  onStartListening: () => void
  onStopListening: () => void
  onStopSpeaking: () => void
  onSend: (text: string) => Promise<void> | void
}

export default function ChatInterface({
  isReady,
  isListening,
  isSpeaking,
  transcript,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onSend,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      onStopSpeaking()
      return
    }
    if (isListening) {
      onStopListening()
      return
    }
    onStartListening()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const text = message.trim()
    if (!text || isSending) return

    setIsSending(true)
    try {
      await onSend(text)
      setMessage('')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <motion.div
      className="fixed bottom-5 left-1/2 z-50 w-[min(940px,94vw)] -translate-x-1/2"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isReady ? 0.2 : 0.8, duration: 0.8 }}
    >
      <div className="glass-console rounded-3xl px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center gap-3">
          <VoiceOrb isListening={isListening} isSpeaking={isSpeaking} onClick={handleVoiceToggle} />

          <form className="flex min-w-0 flex-1 items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isReady || isSending}
              placeholder={isReady ? 'Talk to me. Ask about projects, hiring, or collaboration.' : 'Consciousness booting...'}
              className="h-12 w-full rounded-2xl border border-blue-300/20 bg-slate-950/40 px-4 text-sm text-slate-100 outline-none transition focus:border-cyan-300/55 focus:bg-slate-950/70"
            />
            <button
              type="submit"
              disabled={!isReady || isSending || !message.trim()}
              className="h-12 rounded-2xl border border-cyan-300/35 bg-cyan-400/15 px-4 text-xs font-semibold tracking-[0.16em] text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSending ? 'SENDING' : 'SEND'}
            </button>
          </form>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-blue-200/40">
            {isListening
              ? transcript || 'Listening for your voice...'
              : isSpeaking
                ? 'AI response streaming'
                : 'Mic or text input available'}
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/35">
            Space to speak
          </p>
        </div>
      </div>
    </motion.div>
  )
}
