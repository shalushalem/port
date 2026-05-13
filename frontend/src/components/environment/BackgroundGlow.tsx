'use client'
import { motion } from 'framer-motion'

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary deep glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.07) 0%, rgba(37,99,235,0.02) 40%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Cyan accent glow top */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3"
        style={{
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{
          y: [0, 20, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Bottom ambient */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3"
        style={{
          width: '700px',
          height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Far-left nebula */}
      <motion.div
        className="absolute top-1/3 -left-32"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{ x: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Far-right nebula */}
      <motion.div
        className="absolute top-1/3 -right-32"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
        animate={{ x: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Horizontal scan line */}
      <div className="scanline" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,4,8,0.7) 100%)',
        }}
      />
    </div>
  )
}
