'use client'
import { motion } from 'framer-motion'
import Avatar from '@/components/avatar/Avatar'

interface HeroSectionProps {
  introComplete: boolean
  avatarVisible: boolean
  isListening: boolean
  isSpeaking: boolean
}

export default function HeroSection({
  introComplete,
  avatarVisible,
  isListening,
  isSpeaking,
}: HeroSectionProps) {
  return (
    <section className="relative z-20 flex min-h-[70vh] flex-col items-center justify-center px-4 pt-6 md:pt-12">
      <motion.div
        className="pointer-events-none absolute top-8 text-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: introComplete ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/40">Neural Presence Active</p>
      </motion.div>

      <div className="relative h-[420px] w-full max-w-3xl">
        <Avatar
          isSpeaking={isSpeaking}
          isListening={isListening}
          isVisible={avatarVisible}
          showPlate={false}
        />
      </div>

      <motion.div
        className="relative z-30 mt-2 text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 14 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      >
        <h1 className="holo-text text-[clamp(28px,4vw,52px)] font-semibold tracking-[0.03em]">SHALEM</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-blue-100/70 md:text-base">
          Your AI engineer, builder, and digital collaborator.
        </p>
      </motion.div>
    </section>
  )
}
