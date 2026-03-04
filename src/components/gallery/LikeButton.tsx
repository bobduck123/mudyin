'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  photoId: string
  initialLikes: number
  initialLiked?: boolean
  onLikeChange?: (liked: boolean, count: number) => void
}

export function LikeButton({
  photoId,
  initialLikes,
  initialLiked = false,
  onLikeChange,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!userId) return
    setIsLoading(true)

    const newLikedState = !isLiked
    // Optimistic update
    setIsLiked(newLikedState)
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1))

    try {
      const response = await fetch(`/api/gallery/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          action: isLiked ? 'unlike' : 'like',
        }),
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newLikedState)
        setLikeCount((prev) => (!newLikedState ? prev + 1 : prev - 1))
      } else if (onLikeChange) {
        onLikeChange(newLikedState, newLikedState ? likeCount + 1 : likeCount - 1)
      }
    } catch (error) {
      console.error('Like action error:', error)
      setIsLiked(!newLikedState)
      setLikeCount((prev) => (!newLikedState ? prev + 1 : prev - 1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading || !userId}
      title={!userId ? 'Sign in to like' : undefined}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      style={{
        backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(210, 168, 85, 0.1)',
        color: isLiked ? '#ef4444' : 'var(--color-ochre-400)',
        border: `1px solid ${isLiked ? '#ef4444' : 'var(--color-ochre-400)'}`,
      }}
    >
      <Heart
        size={18}
        fill={isLiked ? 'currentColor' : 'none'}
        style={{ stroke: isLiked ? '#ef4444' : 'var(--color-ochre-400)' }}
      />
      {likeCount > 0 && <span>{likeCount}</span>}
    </button>
  )
}
