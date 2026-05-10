'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart, MessageCircle, Share2, Flag } from 'lucide-react'

interface PostActionsProps {
  postId: string
  initialLikeCount?: number
  initialCommentCount?: number
  isLiked?: boolean
  onLike?: (liked: boolean) => void
  onComment?: () => void
  onShare?: () => void
  onFlag?: () => void
}

export function PostActions({
  postId,
  initialLikeCount = 0,
  initialCommentCount = 0,
  isLiked: initialIsLiked = false,
  onLike,
  onComment,
  onShare,
  onFlag,
}: PostActionsProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleLike = async () => {
    if (!userId || isLoadingLike) return

    setIsLoadingLike(true)
    const newIsLiked = !isLiked
    const previousLikeCount = likeCount

    setIsLiked(newIsLiked)
    setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1)

    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        setIsLiked(!newIsLiked)
        setLikeCount(previousLikeCount)
      } else if (onLike) {
        onLike(newIsLiked)
      }
    } catch (error) {
      console.error('Like error:', error)
      setIsLiked(!newIsLiked)
      setLikeCount(previousLikeCount)
    } finally {
      setIsLoadingLike(false)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(
        `${window.location.origin}/community/posts/${postId}`
      )
    }
  }

  return (
    <div className="space-y-2">
      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-400 px-4">
        <span>{likeCount} likes</span>
        <span>{initialCommentCount} comments</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 px-4">
        <button
          onClick={handleLike}
          disabled={isLoadingLike || !userId}
          title={!userId ? 'Sign in to like' : undefined}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all disabled:opacity-50 text-sm font-medium"
          style={{
            backgroundColor: isLiked
              ? 'rgba(210, 168, 85, 0.2)'
              : 'rgba(255, 255, 255, 0.05)',
            color: isLiked
              ? 'var(--color-ochre-400)'
              : 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          Like
        </button>

        <button
          onClick={onComment}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <MessageCircle size={16} />
          Comment
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm font-medium"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <Share2 size={16} />
          Share
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="More options"
          >
            <span className="text-base text-gray-400">⋮</span>
          </button>
          {showMenu && (
            <div
              className="absolute right-0 mt-1 w-32 rounded-lg shadow-xl z-10 py-1"
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.99)',
                border: '1px solid rgba(65, 70, 72, 0.5)',
              }}
            >
              <button
                onClick={() => {
                  setShowMenu(false)
                  if (onFlag) onFlag()
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors rounded-lg flex items-center gap-2"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                <Flag size={14} /> Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
