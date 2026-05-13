'use client'
import { motion } from 'framer-motion'
import { useLipSync } from '@/hooks/useLipSync'

interface AvatarMouthProps {
  isSpeaking: boolean
  className?: string
}

export default function AvatarMouth({ isSpeaking, className = '' }: AvatarMouthProps) {
  const { mouthOpenness } = useLipSync(isSpeaking)

  if (!isSpeaking) return null

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Mouth area overlay */}
      <motion.div
        className="absolute"
        style={{
          bottom: '26%',
          left: '38%',
          width: '24%',
          height: `${mouthOpenness * 5}%`,
          background: 'rgba(4, 13, 26, 0.7)',
          borderRadius: '0 0 50% 50%',
          transformOrigin: 'top center',
          minHeight: '2px',
        }}
        animate={{
          height: `${Math.max(mouthOpenness * 5, 0.3)}%`,
          opacity: mouthOpenness > 0 ? 0.8 : 0,
        }}
        transition={{ duration: 0.06, ease: 'linear' }}
      />
    </div>
  )
}
