'use client'
import { useEffect, useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface ParallaxLayerProps {
  children: ReactNode
  depth?: number // 0.0 (no movement) to 1.0 (full movement)
  className?: string
}

export function ParallaxLayer({ children, depth = 0.3, className = '' }: ParallaxLayerProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 40, damping: 20 })
  const springY = useSpring(y, { stiffness: 40, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const moveX = (e.clientX - centerX) * depth * 0.03
      const moveY = (e.clientY - centerY) * depth * 0.03
      x.set(moveX)
      y.set(moveY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [depth, x, y])

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  )
}

export default function ParallaxController({ children }: { children: ReactNode }) {
  return <>{children}</>
}
