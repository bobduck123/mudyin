'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Heart, MessageCircle, Share2, Flag, Trash2, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

interface Author {
  id: string
  name: string
  profile: {
    avatar?: string | null
    program?: string | null
  } | null
}

interface FeedPostProps {
  id: string
  content: string
  images?: string[]
  tags: string[]
  author: Author
  likeCount: number
  commentCount: number
  createdAt: string
  onDelete?: () => void
  onComment?: () => void
}

export function FeedPost({
  id,
  content,
  images,
  tags,
  author,
  likeCount,
  commentCount,
  createdAt,
  onDelete,
  onComment,
}: FeedPostProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isOwnPost = userId === author.id

  const handleLike = async () => {
    if (!userId || isLoadingLike) return

    setIsLoadingLike(true)
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setCurrentLikeCount(newIsLiked ? currentLikeCount + 1 : currentLikeCount - 1)

    try {
      const response = await fetch(`/api/community/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newIsLiked)
        setCurrentLikeCount(!newIsLiked ? currentLikeCount + 1 : currentLikeCount - 1)
      }
    } catch (error) {
      console.error('Like error:', error)
      setIsLiked(!newIsLiked)
      setCurrentLikeCount(!newIsLiked ? currentLikeCount + 1 : currentLikeCount - 1)
    } finally {
      setIsLoadingLike(false)
    }
  }

  const handleDelete = async () => {
    if (!userId || !confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/community/posts/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      })

      if (response.ok && onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/community/posts/${id}`)
    }
  }

  const avatarUrl = author.profile?.avatar
    ? author.profile.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid rgba(210, 168, 85, 0.2)',
        borderLeft: '3px solid rgba(157, 193, 131, 0.6)',
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between border-b"
        style={{ borderColor: 'rgba(210, 168, 85, 0.1)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={avatarUrl}
            alt={author.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <Link href={`/community/members/${author.id}`}>
              <span
                className="font-semibold hover:opacity-80 transition-opacity block truncate"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                {author.name}
              </span>
            </Link>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
          {author.profile?.program && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
              style={{
                backgroundColor: 'rgba(157, 193, 131, 0.2)',
                color: 'var(--color-sage-500)',
              }}
            >
              {author.profile.program}
            </span>
          )}
        </div>

        {/* Post Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal size={18} className="text-gray-400" />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 mt-1 w-36 rounded-lg shadow-xl z-10 py-1"
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.99)',
                border: '1px solid rgba(65, 70, 72, 0.5)',
              }}
            >
              {isOwnPost && (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                style={{ color: 'var(--color-ochre-400)' }}
                onClick={() => setShowMenu(false)}
              >
                <Flag size={14} /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/community/hashtags/${encodeURIComponent(tag)}`}
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Images */}
        {images && images.length > 0 && (
          <div
            className={clsx('grid gap-2', {
              'grid-cols-1': images.length === 1,
              'grid-cols-2': images.length >= 2,
            })}
          >
            {images.slice(0, 4).map((image, idx) => (
              <div
                key={idx}
                className="rounded-lg overflow-hidden bg-gray-700 aspect-square"
              >
                <img
                  src={image}
                  alt={`Post image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: 'rgba(210, 168, 85, 0.1)' }}
      >
        <div className="flex gap-3 text-sm text-gray-400 mb-3">
          <span>{currentLikeCount} likes</span>
          <span>{commentCount} comments</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLike}
            disabled={isLoadingLike || !userId}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm',
              { 'opacity-50 cursor-not-allowed': isLoadingLike || !userId }
            )}
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
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm"
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
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
