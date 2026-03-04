'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Send, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  content: string
  createdAt: string | Date
  author: {
    id: string
    name: string
    profile?: {
      avatar?: string | null
    } | null
  }
}

interface CommentSectionProps {
  photoId: string
  initialComments: Comment[]
  onCommentAdded?: () => void
}

export function CommentSection({
  photoId,
  initialComments,
  onCommentAdded,
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || !session?.user) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `/api/gallery/photos/${photoId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newComment,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      const result = await response.json()
      setComments([result.comment, ...comments])
      setNewComment('')

      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error('Add comment error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    setDeletingId(commentId)
    try {
      const response = await fetch(
        `/api/gallery/photos/${photoId}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      setComments(comments.filter(c => c.id !== commentId))
    } catch (error) {
      console.error('Delete comment error:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {session?.user ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={2000}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {newComment.length}/2000
            </span>
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-ochre-400)' }}
            >
              <Send size={16} />
              Post
            </button>
          </div>
        </form>
      ) : (
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: 'rgba(210, 168, 85, 0.05)' }}
        >
          <p className="text-sm text-gray-600">
            <Link href="/auth/signin" className="font-semibold text-ochre-400 hover:underline" style={{ color: 'var(--color-ochre-400)' }}>
              Sign in
            </Link>
            {' '}to comment on this photo
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => {
            const initials = comment.author.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()

            return (
              <div
                key={comment.id}
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'rgba(210, 168, 85, 0.05)' }}
              >
                <div className="flex gap-3 mb-2">
                  {/* Avatar */}
                  {comment.author.profile?.avatar ? (
                    <img
                      src={comment.author.profile.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-ochre-400)' }}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Comment Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link
                          href={`/community/members/${comment.author.id}`}
                          className="font-semibold text-sm hover:underline"
                        >
                          {comment.author.name}
                        </Link>
                        <p className="text-xs text-gray-600">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {/* Delete Button */}
                      {session?.user?.id === comment.author.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deletingId === comment.id}
                          className="p-1 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                          title="Delete comment"
                        >
                          <Trash2 size={16} style={{ color: '#ef4444' }} />
                        </button>
                      )}
                    </div>

                    {/* Comment Text */}
                    <p className="text-sm mt-2 break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
