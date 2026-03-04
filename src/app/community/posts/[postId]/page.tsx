'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FeedPost } from '@/components/community/FeedPost'
import { CommentThread } from '@/components/community/CommentThread'

interface Post {
  id: string
  content: string
  images: string[]
  tags: string[]
  author: {
    id: string
    name: string
    profile: {
      avatar?: string
      program?: string
      badges: string[]
    }
  }
  likeCount: number
  commentCount: number
  createdAt: string
}

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.postId as string

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPost()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const loadPost = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/community/posts/${postId}`)
      if (!response.ok) {
        throw new Error('Post not found')
      }

      const data = await response.json()
      setPost(data.post)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-charcoal)' }}>
        <p className="text-gray-400">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-charcoal)' }}>
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/community/feed">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={20} />
                Back to Feed
              </button>
            </Link>

            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error || 'Post not found'}</p>
              <Link href="/community/feed">
                <button
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal)' }}
                >
                  Return to Feed
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-charcoal)' }}>
      <div className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/community/feed">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={20} />
              Back to Feed
            </button>
          </Link>

          {/* Post Detail */}
          <div className="space-y-6">
            {/* Main Post */}
            <FeedPost
              id={post.id}
              content={post.content}
              images={post.images}
              tags={post.tags}
              author={post.author}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
              createdAt={post.createdAt}
            />

            {/* Comment Section */}
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(210, 168, 85, 0.2)',
              }}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-ochre-400)' }}>
                Comments ({post.commentCount})
              </h2>

              <CommentThread postId={postId} />
            </div>

            {/* Related Posts Sidebar (Optional) */}
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'rgba(20, 20, 20, 0.95)', border: '1px solid rgba(210, 168, 85, 0.2)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--color-ochre-400)' }}>
                More from {post.author.name}
              </h3>
              <p className="text-sm text-gray-400">
                Check out other posts from this member to continue the conversation.
              </p>
              <Link href={`/community/members/${post.author.id}`}>
                <button className="mt-3 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'rgba(210, 168, 85, 0.2)', color: 'var(--color-ochre-400)' }}>
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
