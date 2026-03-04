'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface StoryFrame {
  id: string
  imageUrl: string
  caption?: string
  duration: number
  frameOrder: number
}

interface Story {
  id: string
  title: string
  frames: StoryFrame[]
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
}

interface StoryCarouselProps {
  story: Story
  onClose?: () => void
  autoPlay?: boolean
}

export function StoryCarousel({
  story,
  onClose,
  autoPlay = true,
}: StoryCarouselProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const _autoPlayIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const touchStartRef = useRef<number | null>(null)

  const currentFrame = story.frames[currentFrameIndex]
  const frameDuration = currentFrame?.duration || 5

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 100 / (frameDuration * 10) // Update every 100ms
      })
    }, 100)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, frameDuration])

  // Auto-advance to next frame
  useEffect(() => {
    if (!isPlaying || progress < 100) return

    /* eslint-disable react-hooks/set-state-in-effect */
    if (currentFrameIndex < story.frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1)
      setProgress(0)
    } else {
      // Story ended
      setIsPlaying(false)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [progress, currentFrameIndex, isPlaying, story.frames.length])

  const handleNextFrame = () => {
    if (currentFrameIndex < story.frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1)
      setProgress(0)
    }
  }

  const handlePrevFrame = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1)
      setProgress(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touchEnd = e.changedTouches[0].clientX
    const difference = touchStartRef.current - touchEnd

    // Swipe left = next frame
    if (difference > 50) {
      handleNextFrame()
    }
    // Swipe right = prev frame
    else if (difference < -50) {
      handlePrevFrame()
    }

    touchStartRef.current = null
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNextFrame()
    if (e.key === 'ArrowLeft') handlePrevFrame()
    if (e.key === ' ') {
      e.preventDefault()
      setIsPlaying(!isPlaying)
    }
    if (e.key === 'Escape' && onClose) onClose()
  }

  return (
    <div
      className="relative bg-charcoal-900 w-full h-screen flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Story viewer"
    >
      {/* Progress bars */}
      <div className="flex gap-1 p-3 bg-gradient-to-b from-black/50 to-transparent">
        {story.frames.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={
              index === currentFrameIndex
                ? Math.round(progress)
                : index < currentFrameIndex
                  ? 100
                  : 0
            }
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: `${
                  index === currentFrameIndex
                    ? progress
                    : index < currentFrameIndex
                      ? 100
                      : 0
                }%`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {story.author.avatar && (
            <Image
              src={story.author.avatar}
              alt={story.author.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-white text-sm font-medium">{story.author.name}</p>
            <p className="text-white/60 text-xs">
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
            aria-label="Close story"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Main content */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentFrame && (
          <>
            {/* Frame image */}
            <Image
              src={currentFrame.imageUrl}
              alt={`Story frame ${currentFrame.frameOrder}`}
              fill
              className="object-cover"
              priority
            />

            {/* Caption overlay */}
            {currentFrame.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-sm">{currentFrame.caption}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={handlePrevFrame}
        disabled={currentFrameIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-2 transition"
        aria-label="Previous frame"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={handleNextFrame}
        disabled={currentFrameIndex === story.frames.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-2 transition"
        aria-label="Next frame"
      >
        <ChevronRight size={32} />
      </button>

      {/* Frame counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {currentFrameIndex + 1} / {story.frames.length}
      </div>

      {/* Tap to play/pause hint */}
      <div
        className="absolute inset-0 flex items-center justify-center text-white/60 pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <p className="text-sm">Press space to {isPlaying ? 'pause' : 'play'}</p>
      </div>
    </div>
  )
}
