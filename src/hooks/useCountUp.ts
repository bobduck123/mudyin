'use client'

import { useEffect, useRef, useState } from 'react'

interface Options {
  end: number
  duration?: number
  start?: number
  enabled?: boolean
}

export function useCountUp({ end, duration = 2000, start = 0, enabled = false }: Options) {
  const [count, setCount] = useState(start)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(end)
      return
    }

    const startTime = performance.now()
    const range = end - start

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const current = Math.round(start + range * easedProgress)

      setCount(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [enabled, end, start, duration])

  return count
}
