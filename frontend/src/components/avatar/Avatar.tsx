'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import AvatarEyes from './AvatarEyes'
import AvatarMouth from './AvatarMouth'
import { ParallaxLayer } from '@/components/animations/ParallaxController'

interface AvatarProps {
  isSpeaking: boolean
  isListening: boolean
  isVisible: boolean
}

export default function Avatar({ isSpeaking, isListening, isVisible }: AvatarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <ParallaxLayer depth={0.2} className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.6, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
          >
            {/* Glow rings behind avatar */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[280, 340, 400, 460].map((size, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    border: `1px solid rgba(37, 99, 235, ${0.18 - i * 0.04})`,
                  }}
                  animate={{
                    scale: [1, 1 + i * 0.02, 1],
                    opacity: [0.8, 0.3, 0.8],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Volumetric glow behind avatar */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '320px',
                height: '420px',
                background: 'radial-gradient(ellipse at 50% 60%, rgba(37,99,235,0.22) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              animate={{
                opacity: isSpeaking ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
                scale: isSpeaking ? [1, 1.06, 1] : [1, 1.02, 1],
              }}
              transition={{
                duration: isSpeaking ? 1.2 : 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Listening ring */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: '280px',
                    height: '280px',
                    border: '2px solid rgba(6, 182, 212, 0.6)',
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </AnimatePresence>

            {/* Avatar image container */}
            <motion.div
              className="relative avatar-float"
              style={{ width: '260px', height: '380px' }}
              animate={{
                y: [0, -14, 0],
                scale: isSpeaking ? [1, 1.012, 1] : [1, 1.006, 1],
              }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] },
                scale: { duration: isSpeaking ? 1.2 : 4, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {/* Use the Pixar-style avatar image */}
              <div
                className="relative w-full h-full avatar-glow"
                style={{ position: 'relative' }}
              >
                <Image
                  src="/avatar/shalem.png"
                  alt="Shalem - AI Engineer"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'center top' }}
                  priority
                  unoptimized
                />
              </div>

              {/* Eye and mouth overlays */}
              <AvatarEyes isSpeaking={isSpeaking} />
              <AvatarMouth isSpeaking={isSpeaking} />

              {/* Speaking particle burst */}
              <AnimatePresence>
                {isSpeaking && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: 3,
                          height: 3,
                          background: '#06b6d4',
                          left: '50%',
                          bottom: '20%',
                        }}
                        initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
                        animate={{
                          x: (Math.random() - 0.5) * 80,
                          y: -(20 + Math.random() * 60),
                          opacity: 0,
                          scale: 0,
                        }}
                        transition={{
                          duration: 0.8 + Math.random() * 0.4,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Name plate */}
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <p
                className="text-xs tracking-[0.35em] uppercase"
                style={{
                  color: 'rgba(147, 197, 253, 0.4)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                AI · Engineer · Developer
              </p>
            </motion.div>
          </motion.div>
        </ParallaxLayer>
      )}
    </AnimatePresence>
  )
}
