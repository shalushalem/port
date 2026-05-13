'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

type MouthShape = 'closed' | 'slightly-open' | 'open' | 'wide'

export function useLipSync(isSpeaking: boolean) {
  const [mouthShape, setMouthShape] = useState<MouthShape>('closed')
  const [mouthOpenness, setMouthOpenness] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameRef = useRef<number>(0)

  const getMouthShape = useCallback((): MouthShape => {
    const r = Math.random()
    if (r < 0.3) return 'closed'
    if (r < 0.6) return 'slightly-open'
    if (r < 0.85) return 'open'
    return 'wide'
  }, [])

  const getOpenness = (shape: MouthShape): number => {
    switch (shape) {
      case 'closed': return 0
      case 'slightly-open': return 0.2 + Math.random() * 0.15
      case 'open': return 0.4 + Math.random() * 0.2
      case 'wide': return 0.7 + Math.random() * 0.3
    }
  }

  useEffect(() => {
    if (isSpeaking) {
      const animate = () => {
        const shape = getMouthShape()
        setMouthShape(shape)
        setMouthOpenness(getOpenness(shape))
        const nextDelay = 80 + Math.random() * 100
        intervalRef.current = setTimeout(animate, nextDelay)
      }
      animate()
    } else {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      // Smooth close
      setMouthShape('closed')
      setMouthOpenness(0)
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [isSpeaking, getMouthShape])

  return { mouthShape, mouthOpenness }
}
