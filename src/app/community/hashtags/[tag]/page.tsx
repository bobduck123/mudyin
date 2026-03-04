'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FeedPost } from '@/components/community/FeedPost'

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
    }
  }
  likeCount: number
  commentCount: number
  createdAt: string
}

export default function HashtagPage() {
  const params = useParams()
  const tag = decodeURIComponent(params.tag as string)

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sort, setSort] = useState<'newest' | 'trending' | 'most-commented'>('trending')

  useEffect(() => {
    loadPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        search: tag,
        page: page.toString(),
        sort,
      })

      const response = await fetch(`/api/community/posts?${params}`)
      if (!response.ok) throw new Error('Failed to load posts')

      const data = await response.json()

      if (page === 1) {
        setPosts(data.posts)
      } else {
        setPosts((prev) => [...prev, ...data.posts])
      }

      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-charcoal)' }}>
      {/* Hero Section */}
      <div className="px-4 py-8 md:py-12 border-b" style={{ borderColor: 'rgba(210, 168, 85, 0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/community/feed">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={20} />
              Back to Feed
            </button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-ochre-400)' }}>
            #{tag}
          </h1>
          <p className="text-gray-400">
            Explore posts tagged with #{tag}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-6 border-b sticky top-0 z-40" style={{ borderColor: 'rgba(210, 168, 85, 0.2)', backgroundColor: 'rgba(20, 20, 20, 0.98)' }}>
        <div className="max-w-4xl mx-auto">
          <label className="block text-xs font-medium text-gray-400 mb-2">Sort by</label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as typeof sort)
              setPage(1)
            }}
            className="w-full md:w-48 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-ochre-400"
          >
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
            <option value="most-commented">Most Commented</option>
          </select>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoading && posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No posts found with this hashtag yet</p>
              <Link href="/community/create">
                <button
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal)' }}
                >
                  Create Post
                </button>
              </Link>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <FeedPost
                  key={post.id}
                  id={post.id}
                  content={post.content}
                  images={post.images}
                  tags={post.tags}
                  author={post.author}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  createdAt={post.createdAt}
                  onComment={() => {
                    window.location.href = `/community/posts/${post.id}`
                  }}
                />
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                    style={{ backgroundColor: 'rgba(210, 168, 85, 0.2)', color: 'var(--color-ochre-400)' }}
                  >
                    {isLoading ? 'Loading...' : 'Load More Posts'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
