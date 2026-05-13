'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useBlink } from '@/hooks/useBlink'

interface AvatarEyesProps {
  isSpeaking?: boolean
  className?: string
}

export default function AvatarEyes({ isSpeaking = false, className = '' }: AvatarEyesProps) {
  const { isBlinking } = useBlink()

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Eye blink overlay — covers avatar eyes area */}
      <AnimatePresence>
        {isBlinking && (
          <motion.div
            className="absolute"
            style={{
              top: '28%',
              left: '30%',
              width: '40%',
              height: '6%',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.08, ease: 'easeInOut' }}
          >
            {/* Left eye close */}
            <div
              className="absolute rounded-full"
              style={{
                left: '10%',
                width: '28%',
                height: '100%',
                background: 'rgba(4, 13, 26, 0.95)',
                borderRadius: '50%',
              }}
            />
            {/* Right eye close */}
            <div
              className="absolute rounded-full"
              style={{
                right: '10%',
                width: '28%',
                height: '100%',
                background: 'rgba(4, 13, 26, 0.95)',
                borderRadius: '50%',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle eye glow when speaking */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            className="absolute"
            style={{
              top: '26%',
              left: '28%',
              width: '44%',
              height: '10%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.2) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
