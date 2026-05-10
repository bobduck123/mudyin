'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { BadgeDisplay } from '@/components/community/BadgeDisplay'

interface Member {
  id: string
  name: string
  createdAt: string
  profile: {
    bio: string | null
    avatar: string | null
    program: string | null
    badges: string[]
  }
  _count: {
    followers: number
  }
}

interface SearchResponse {
  members: Member[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export default function MembersDirectoryPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [program, setProgram] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchMembers = async (searchTerm: string, selectedProgram: string, pageNum: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedProgram) params.append('program', selectedProgram)
      params.append('page', pageNum.toString())

      const response = await fetch(`/api/community/profiles?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch members')

      const data: SearchResponse = await response.json()
      setMembers(data.members)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1)
      fetchMembers(search, program, 1)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, program])

  useEffect(() => {
    fetchMembers(search, program, page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <>
      {/* Page Hero */}
      <section
        className="section-spacing container-wide"
        style={{
          background: 'linear-gradient(135deg, rgba(210,168,85,0.1) 0%, rgba(157,193,131,0.1) 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold mb-4">
            Meet Our Community
          </h1>
          <p className="text-lg text-gray-600">
            Connect with members from across the Mudyin programs
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="section-spacing container-wide">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <select
                value={program}
                onChange={e => setProgram(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
              >
                <option value="">All Programs</option>
                <option value="YSMP">Young Spirit Mentoring (YSMP)</option>
                <option value="Thrive Tribe">Thrive Tribe</option>
                <option value="Healing Centre">Healing Centre</option>
              </select>
            </div>

            {/* Result Count */}
            <p className="text-sm text-gray-600">
              {total > 0 ? `Showing ${Math.min(page * 20, total)} of ${total} members` : 'No members found'}
            </p>
          </div>
        </div>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading members...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No members found matching your search</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {members.map(member => {
                const initials = member.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()

                return (
                  <Link
                    key={member.id}
                    href={`/community/members/${member.id}`}
                    className="group"
                  >
                    <div
                      className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow p-6"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid rgba(210, 168, 85, 0.2)',
                      }}
                    >
                      {/* Avatar */}
                      <div className="mb-4">
                        {member.profile.avatar ? (
                          <Image
                            src={member.profile.avatar}
                            alt={member.name}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-full object-cover mx-auto group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div
                            className="h-20 w-20 rounded-full flex items-center justify-center font-bold text-lg text-white mx-auto group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: 'var(--color-ochre-400)' }}
                          >
                            {initials}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center">
                        <h3 className="font-bold text-lg mb-1 group-hover:text-ochre-400 transition-colors" style={{ color: 'inherit' }}>
                          {member.name}
                        </h3>

                        {member.profile.program && (
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">
                            {member.profile.program}
                          </p>
                        )}

                        {member.profile.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {member.profile.bio}
                          </p>
                        )}

                        {/* Badges */}
                        {member.profile.badges.length > 0 && (
                          <div className="flex justify-center mb-3">
                            <BadgeDisplay
                              badges={member.profile.badges}
                              size="sm"
                              maxDisplay={3}
                            />
                          </div>
                        )}

                        {/* Follower Count */}
                        <p className="text-xs text-gray-600">
                          {member._count.followers} followers
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Load More */}
            {(page * 20) < total && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-ochre-400)' }}
                >
                  Load More Members
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
