'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

interface CelebrationBannerProps {
  title: string
  message: string
  onDismiss?: () => void
  autoClose?: boolean
  autoCloseDuration?: number
}

export function CelebrationBanner({
  title,
  message,
  onDismiss,
  autoClose = true,
  autoCloseDuration = 5000,
}: CelebrationBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!autoClose) return

    const timeout = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, autoCloseDuration)

    return () => clearTimeout(timeout)
  }, [autoClose, autoCloseDuration, onDismiss])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="pointer-events-auto">
        <div className="card-dark max-w-md mx-auto relative overflow-hidden border-2 border-sage-500 shadow-2xl">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-sage-500/10 via-ochre-400/10 to-sage-500/10 animate-pulse" />

          {/* Content */}
          <div className="relative p-6 text-center">
            {/* Confetti emoji animation */}
            <div className="mb-4 flex justify-center gap-2 animate-bounce">
              {['🎉', '✨', '🌟', '💫', '🎊'].map((emoji, i) => (
                <span
                  key={i}
                  className="text-3xl"
                  style={{
                    animation: `bounce 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-sage-400 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="text-ochre-400" size={24} />
              {title}
              <Sparkles className="text-ochre-400" size={24} />
            </h2>

            {/* Message */}
            <p className="text-white/80 text-sm leading-relaxed mb-4">{message}</p>

            {/* Button */}
            <button
              onClick={() => {
                setIsVisible(false)
                onDismiss?.()
              }}
              className="btn-primary mx-auto mb-3"
            >
              Celebrate! 🎊
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                setIsVisible(false)
                onDismiss?.()
              }}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition"
              aria-label="Close celebration"
            >
              <X size={20} />
            </button>
          </div>

          {/* Bottom accent line */}
          <div className="h-1 bg-gradient-to-r from-sage-500 via-ochre-400 to-sage-500" />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
