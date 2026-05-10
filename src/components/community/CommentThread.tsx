'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { createCommentSchema, type CreateCommentInput } from '@/lib/validators'
import { Trash2, Send, LogIn } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface CommentAuthor {
  id: string
  name: string
  profile: { avatar?: string | null } | null
}

interface Comment {
  id: string
  content: string
  author: CommentAuthor
  createdAt: string
}

interface CommentThreadProps {
  postId: string
}

export function CommentThread({ postId }: CommentThreadProps) {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: '' },
  })

  const loadComments = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/community/posts/${postId}/comments?page=${pageNum}`
      )

      if (!response.ok) throw new Error('Failed to load comments')

      const data = await response.json()
      setComments((prev) => (replace ? data.comments : [...prev, ...data.comments]))
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    loadComments(1, true)
  }, [loadComments])

  const onSubmit: SubmitHandler<CreateCommentInput> = async (data) => {
    if (!userId) return

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to add comment')
      }

      const result = await response.json()
      setComments((prev) => [result.comment, ...prev])
      reset()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!userId || !confirm('Delete this comment?')) return

    try {
      const response = await fetch(
        `/api/community/posts/${postId}/comments/${commentId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) throw new Error('Failed to delete comment')

      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadComments(nextPage, false)
  }

  const avatarUrl = (name: string, avatar?: string | null) =>
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      {userId ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <textarea
            {...register('content')}
            placeholder="Add a comment..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-ochre-400 resize-none"
            rows={3}
          />
          {errors.content && (
            <p className="text-xs text-red-400">{errors.content.message}</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
              style={{
                backgroundColor: 'var(--color-ochre-400)',
                color: 'var(--color-charcoal)',
              }}
            >
              <Send size={16} />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
          <p className="text-sm text-gray-400 mb-2">Sign in to comment</p>
          <Link href="/auth/signin">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal)' }}
            >
              <LogIn size={16} /> Sign In
            </button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading && comments.length === 0 ? (
          <p className="text-center text-gray-400 py-4 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400 py-4 text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <Link href={`/community/members/${comment.author.id}`}>
                  <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Image
                      src={avatarUrl(comment.author.name, comment.author.profile?.avatar)}
                      alt={comment.author.name}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover"
                      unoptimized
                    />
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: 'var(--color-ochre-400)' }}
                      >
                        {comment.author.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Link>

                {userId === comment.author.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1 hover:bg-red-500/10 rounded transition-colors text-red-400 hover:text-red-300 flex-shrink-0"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full py-2 text-sm hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
          style={{ color: 'var(--color-ochre-400)' }}
        >
          {isLoading ? 'Loading...' : 'Load More Comments'}
        </button>
      )}
    </div>
  )
}
