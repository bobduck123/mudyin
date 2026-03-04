'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FeedPost } from '@/components/community/FeedPost'
import { Plus } from 'lucide-react'

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

export default function CommunityFeedPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'newest' | 'trending' | 'most-commented'>('newest')
  const [program, setProgram] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, program, page, search])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        sort,
        ...(program && { program }),
        ...(search && { search }),
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

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen blak-motif-organic" style={{ backgroundColor: 'var(--color-charcoal)' }}>
      {/* Hero Section */}
      <div
        className="px-4 py-8 md:py-12 border-b"
        style={{
          borderColor: 'rgba(210, 168, 85, 0.2)',
          background: 'linear-gradient(135deg, rgba(219,22,47,0.12), rgba(20,20,20,0.92) 40%, rgba(243,222,44,0.1))',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.58)' }}>
            Community Space
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-flag-yellow)' }}>
            Community Feed
          </h1>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Gather, share your journey, celebrate wins, and support each other on Country.
          </p>

          <Link href="/community/create">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal)' }}
            >
              <Plus size={20} />
              Create Post
            </button>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-4 py-6 border-b sticky top-0 z-40" style={{ borderColor: 'rgba(210, 168, 85, 0.2)', backgroundColor: 'rgba(20, 20, 20, 0.92)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-ochre-400"
          />

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sort */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Sort by</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as typeof sort)
                  setPage(1)
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-ochre-400"
              >
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
                <option value="most-commented">Most Commented</option>
              </select>
            </div>

            {/* Program Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Program</label>
              <select
                value={program}
                onChange={(e) => {
                  setProgram(e.target.value)
                  setPage(1)
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-ochre-400"
              >
                <option value="">All Programs</option>
                <option value="YSMP">YSMP</option>
                <option value="Thrive Tribe">Thrive Tribe</option>
                <option value="Healing Centre">Healing Centre</option>
              </select>
            </div>
          </div>
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
              <p className="text-gray-400 mb-4">No posts yet. Be the first to share!</p>
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
                  onDelete={() => handlePostDeleted(post.id)}
                  onComment={() => router.push(`/community/posts/${post.id}`)}
                />
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleLoadMore}
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
