'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'
import { BadgeDisplay } from './BadgeDisplay'

interface Member {
  userId: string
  name: string
  avatar?: string
  bio?: string
  badges: string[]
  enrolledAt: string
  postCount: number
  followerCount: number
}

interface ProgramMembersProps {
  program: string
  initialMembers?: Member[]
}

export function ProgramMembers({ program, initialMembers }: ProgramMembersProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers || [])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'newest' | 'most-posts'>('newest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(!initialMembers)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    if (initialMembers) return

    loadMembers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMembers])

  async function loadMembers(pageNum = 1, reset = false) {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: String(pageNum),
        sort,
        ...(search && { search }),
      })

      const response = await fetch(
        `/api/community/programs/${encodeURIComponent(program)}/members?${params}`
      )

      if (!response.ok) throw new Error('Failed to fetch members')

      const data = await response.json()

      setMembers(reset ? data.members : [...members, ...data.members])
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setSearchLoading(true)
    setPage(1)
    setMembers([])
    // Debounce search
    const timer = setTimeout(() => {
      loadMembers(1, true)
    }, 300)
    return () => clearTimeout(timer)
  }

  const handleSort = (newSort: 'newest' | 'most-posts') => {
    setSort(newSort)
    setPage(1)
    setMembers([])
    loadMembers(1, true)
  }

  const handleLoadMore = () => {
    loadMembers(page + 1)
  }

  if (loading && members.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="card-dark p-4 animate-pulse">
            <div className="w-12 h-12 bg-white/10 rounded-full mb-3" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSort('newest')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              sort === 'newest'
                ? 'bg-sage-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => handleSort('most-posts')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              sort === 'most-posts'
                ? 'bg-sage-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Members grid */}
      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">No members found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <Link
                key={member.userId}
                href={`/community/members/${member.userId}`}
              >
                <div className="card-dark p-4 hover:bg-white/5 transition cursor-pointer group">
                  {/* Avatar */}
                  <div className="mb-3">
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-sage-500 transition"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ochre-400 to-sage-500 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-white group-hover:text-ochre-400 transition">
                    {member.name}
                  </h3>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-white/60 text-sm line-clamp-2 mt-1">{member.bio}</p>
                  )}

                  {/* Badges */}
                  {member.badges && member.badges.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <BadgeDisplay badges={member.badges.slice(0, 2)} size="sm" />
                      {member.badges.length > 2 && (
                        <span className="text-xs text-sage-400">
                          +{member.badges.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-2 text-xs text-white/60 mt-3 pt-3 border-t border-white/10">
                    <span>{member.postCount} posts</span>
                    <span>•</span>
                    <span>{member.followerCount} followers</span>
                  </div>

                  {/* Joined date */}
                  <p className="text-xs text-white/40 mt-2">
                    Joined {new Date(member.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loading || searchLoading}
                className="btn-primary flex items-center gap-2"
              >
                {loading || searchLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Members'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
