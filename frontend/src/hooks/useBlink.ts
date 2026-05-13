'use client'
import { useState, useEffect, useRef } from 'react'

export function useBlink() {
  const [isBlinking, setIsBlinking] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const blink = () => {
    setIsBlinking(true)
    setTimeout(() => setIsBlinking(false), 150)
  }

  useEffect(() => {
    const scheduleNextBlink = () => {
      // Random interval between 2.5s and 6s — feels natural
      const delay = 2500 + Math.random() * 3500
      timeoutRef.current = setTimeout(() => {
        blink()
        // Double blink occasionally (20% chance)
        if (Math.random() < 0.2) {
          setTimeout(() => blink(), 300)
        }
        scheduleNextBlink()
      }, delay)
    }

    scheduleNextBlink()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { isBlinking }
}
