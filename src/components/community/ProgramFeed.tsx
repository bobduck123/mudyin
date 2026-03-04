'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Loader2, Users, TrendingUp } from 'lucide-react'
import { MilestoneTracker } from './MilestoneTracker'

interface Post {
  id: string
  content: string
  author: {
    name: string
    profile?: {
      avatar?: string
      badges?: string[]
    }
  }
  likeCount: number
  commentCount: number
  createdAt: string
  isFeatured?: boolean
}

interface ProgramFeedProps {
  program: string
  userId?: string
  userBadges?: string[]
  initialPosts?: Post[]
}

export function ProgramFeed({
  program,
  userId,
  userBadges = [],
  initialPosts,
}: ProgramFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || [])
  const [sort, setSort] = useState<'newest' | 'trending' | 'most-commented'>('newest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(!initialPosts)
  const [memberCount, setMemberCount] = useState(0)

  useEffect(() => {
    if (initialPosts) return
    loadPosts()
    loadMemberCount()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPosts])

  async function loadMemberCount() {
    try {
      const response = await fetch(
        `/api/community/programs/${encodeURIComponent(program)}/members?limit=1`
      )
      if (response.ok) {
        const data = await response.json()
        setMemberCount(data.total)
      }
    } catch (error) {
      console.error('Error loading member count:', error)
    }
  }

  async function loadPosts(pageNum = 1, reset = false) {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(pageNum),
        sort,
      })

      const response = await fetch(
        `/api/community/programs/${encodeURIComponent(program)}/feed?${params}`
      )

      if (!response.ok) throw new Error('Failed to fetch posts')

      const data = await response.json()

      setPosts(reset ? data.posts : [...posts, ...data.posts])
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (newSort: 'newest' | 'trending' | 'most-commented') => {
    setSort(newSort)
    setPage(1)
    setPosts([])
    loadPosts(1, true)
  }

  const handleLoadMore = () => {
    loadPosts(page + 1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main feed */}
      <div className="lg:col-span-2 space-y-4">
        {/* Sort controls */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleSort('newest')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sort === 'newest'
                ? 'bg-sage-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => handleSort('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              sort === 'trending'
                ? 'bg-ochre-400 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <TrendingUp size={16} />
            Trending
          </button>
          <button
            onClick={() => handleSort('most-commented')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sort === 'most-commented'
                ? 'bg-sage-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Most Discussed
          </button>
        </div>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-sage-500" size={32} />
          </div>
        ) : posts.length === 0 ? (
          <div className="card-dark p-8 text-center">
            <p className="text-white/60 mb-4">No posts yet in this program</p>
            <Link href="/community/create">
              <button className="btn-primary">Share Something</button>
            </Link>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <Link key={post.id} href={`/community/posts/${post.id}`}>
                <div className="card-dark p-6 hover:bg-white/5 transition cursor-pointer group border-l-4 border-sage-500">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-ochre-400 font-semibold group-hover:text-ochre-300 transition">
                        {post.author.name}
                      </p>
                      <p className="text-white/40 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {post.isFeatured && (
                      <span className="bg-ochre-400/20 text-ochre-300 text-xs font-medium px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-white/90 line-clamp-3 group-hover:text-white transition">
                    {post.content}
                  </p>

                  {/* Engagement */}
                  <div className="flex gap-4 mt-4 text-white/60 text-sm">
                    <span>❤️ {post.likeCount} Likes</span>
                    <span>💬 {post.commentCount} Comments</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Program info */}
        <div className="card-dark p-4">
          <p className="text-white/60 text-sm">Community Members</p>
          <p className="text-3xl font-bold text-sage-400 mt-1">{memberCount}</p>
          <Link href={`/community/programs/${program}/members`}>
            <button className="btn-ghost w-full mt-3 flex items-center justify-center gap-2">
              <Users size={18} />
              View All
            </button>
          </Link>
        </div>

        {/* Milestone tracker */}
        {userId && (
          <MilestoneTracker
            userId={userId}
            program={program}
            earnedBadges={userBadges}
          />
        )}

        {/* Quick actions */}
        <div className="card-dark p-4 space-y-2">
          <p className="text-white/60 text-xs uppercase tracking-wide mb-3">Quick Links</p>
          <Link href="/community/create">
            <button className="btn-primary w-full text-sm">Create Post</button>
          </Link>
          <Link href={`/community/programs/${program}/members`}>
            <button className="btn-ghost w-full text-sm">Browse Members</button>
          </Link>
        </div>

        {/* Program description */}
        <div className="card-dark p-4 text-sm">
          <p className="text-white/70">{getProgramDescription(program)}</p>
        </div>
      </div>
    </div>
  )
}

function getProgramDescription(program: string): string {
  const descriptions: Record<string, string> = {
    YSMP: 'Young Spirit Mentoring Program - Dedicated support for young people on their personal growth journey.',
    'Thrive Tribe': 'Community-focused program celebrating resilience, connection, and collective growth.',
    'Healing Centre': 'Culturally-grounded space for wellness, healing, and inner peace.',
  }
  return descriptions[program] || ''
}
