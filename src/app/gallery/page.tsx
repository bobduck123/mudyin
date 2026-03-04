'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Upload } from 'lucide-react'
import { PhotoCard } from '@/components/gallery/PhotoCard'
import { TrendingCarousel } from '@/components/gallery/TrendingCarousel'
import { PageHero } from '@/components/layout/PageHero'

interface Photo {
  id: string
  imageUrl: string
  title: string
  uploader: {
    name: string
    profile?: {
      avatar?: string
    }
  }
  likeCount: number
  commentCount: number
}

interface PhotosResponse {
  photos: Photo[]
  total: number
  hasMore: boolean
}

const editorialPlaceholders = [
  {
    id: 'e1',
    title: 'Sunrise Training Circle',
    note: 'Feature Story Placeholder',
    gradient: 'linear-gradient(135deg, rgba(219,22,47,0.35), rgba(20,20,20,0.9))',
    titleColor: 'var(--color-flag-red)',
  },
  {
    id: 'e2',
    title: 'Healing Session Moments',
    note: 'Feature Story Placeholder',
    gradient: 'linear-gradient(135deg, rgba(243,222,44,0.25), rgba(20,20,20,0.9))',
    titleColor: 'var(--color-flag-yellow)',
  },
  {
    id: 'e3',
    title: 'Mob Market Day Highlights',
    note: 'Feature Story Placeholder',
    gradient: 'linear-gradient(135deg, rgba(223,206,214,0.95), rgba(210,210,210,0.82))',
    titleColor: 'var(--color-flag-black)',
  },
]

function GalleryContent() {
  const searchParams = useSearchParams()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [program, setProgram] = useState(searchParams.get('program') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchPhotos = async (pageNum: number) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (program) params.append('program', program)
      params.append('sort', sort)
      params.append('page', pageNum.toString())

      const response = await fetch(`/api/gallery/photos?${params}`)
      if (!response.ok) throw new Error('Failed to fetch photos')

      const data: PhotosResponse = await response.json()
      setPhotos(pageNum === 1 ? data.photos : [...photos, ...data.photos])
      setTotal(data.total)
    } catch (error) {
      console.error('Fetch photos error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchPhotos(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, program, sort])

  useEffect(() => {
    if (page > 1) {
      fetchPhotos(page)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <>
      <PageHero
        title="Community Gallery"
        subtitle="Celebrating moments, preserving memories"
        description="Browse photos from Mudyin programs and events. Share your own story with our community."
      />

      <section className="section-spacing container-wide">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Trending Carousel */}
          <div data-decorative="true">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
              Trending Now
            </h2>
            <TrendingCarousel />
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row md:items-end">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                />
              </div>

              {/* Program Filter */}
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2"
              >
                <option value="">All Programs</option>
                <option value="YSMP">YSMP</option>
                <option value="Thrive Tribe">Thrive Tribe</option>
                <option value="Healing Centre">Healing Centre</option>
              </select>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2"
              >
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
                <option value="liked">Most Liked</option>
              </select>

              {/* Upload Button */}
              <Link
                href="/gallery/upload"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: 'var(--color-ochre-400)' }}
              >
                <Upload size={18} />
                Upload
              </Link>
            </div>

            {/* Result Count */}
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.62)' }}>
              {total > 0 ? `Showing ${Math.min(page * 20, total)} of ${total} photos` : 'No photos found'}
            </p>
          </div>

          {/* Photos Grid */}
          {isLoading && page === 1 ? (
            <div className="text-center py-12">
              <p style={{ color: 'rgba(255,255,255,0.62)' }}>Loading photos...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="py-4 space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                {editorialPlaceholders.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl p-6 min-h-[180px] flex flex-col justify-end"
                    style={{ background: item.gradient, border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: item.id === 'e3' ? 'rgba(2,2,2,0.65)' : 'rgba(255,255,255,0.65)' }}>
                      {item.note}
                    </p>
                    <h3 className="font-display text-2xl" style={{ color: item.titleColor }}>{item.title}</h3>
                  </article>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4" data-decorative="true">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden animate-pulse"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <div className="h-36 bg-white/10" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-2/3 bg-white/10 rounded" />
                      <div className="h-3 w-1/2 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center py-6">
                <p className="mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>No photos found yet. Curated stories are coming soon.</p>
                <Link
                  href="/gallery/upload"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: 'var(--color-ochre-400)' }}
                >
                  <Upload size={18} />
                  Be the first to upload!
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`break-inside-avoid mb-6 ${
                      index % 4 === 0 ? 'md:mt-0 lg:mt-0 xl:mt-0' :
                      index % 4 === 1 ? 'md:mt-1 lg:mt-2 xl:mt-3' :
                      index % 4 === 2 ? 'md:mt-2 lg:mt-3 xl:mt-4' :
                      'md:mt-0 lg:mt-1 xl:mt-2'
                    }`}
                  >
                    <PhotoCard
                      id={photo.id}
                      imageUrl={photo.imageUrl}
                      title={photo.title}
                      photographerName={photo.uploader.name}
                      photographerAvatar={photo.uploader.profile?.avatar}
                      likeCount={photo.likeCount}
                      commentCount={photo.commentCount}
                    />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {page * 20 < total && (
                <div className="text-center py-8">
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={isLoading}
                    className="px-8 py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-ochre-400)' }}
                  >
                    Load More Photos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <p className="text-gray-600">Loading gallery...</p>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}
