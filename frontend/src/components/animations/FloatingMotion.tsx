'use client'
import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingMotionProps extends MotionProps {
  children: ReactNode
  className?: string
  yRange?: number
  duration?: number
  delay?: number
}

export default function FloatingMotion({
  children,
  className = '',
  yRange = 14,
  duration = 6,
  delay = 0,
  ...rest
}: FloatingMotionProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yRange, 0],
        scale: [1, 1.008, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: [0.45, 0.05, 0.55, 0.95],
        delay,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function FadeInMotion({
  children,
  className = '',
  delay = 0,
  y = 20,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
