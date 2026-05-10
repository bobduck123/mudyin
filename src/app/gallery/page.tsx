'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Upload, Sparkles } from 'lucide-react'
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
    gradient: 'radial-gradient(circle at 52% 54%, rgba(200,167,93,0.12) 0 18%, transparent 38%), linear-gradient(180deg, rgba(2,2,2,0.72) 0 52%, rgba(184,117,85,0.2) 100%)',
    titleColor: 'rgba(255,255,255,0.94)',
  },
  {
    id: 'e2',
    title: 'Healing Session Moments',
    note: 'Feature Story Placeholder',
    gradient: 'radial-gradient(circle at 50% 50%, rgba(200,167,93,0.16) 0 20%, transparent 40%), linear-gradient(180deg, rgba(2,2,2,0.76) 0 52%, rgba(184,117,85,0.16) 100%)',
    titleColor: 'rgba(255,255,255,0.94)',
  },
  {
    id: 'e3',
    title: 'Mob Market Day Highlights',
    note: 'Feature Story Placeholder',
    gradient: 'radial-gradient(circle at 52% 56%, rgba(200,167,93,0.12) 0 16%, rgba(184,117,85,0.14) 33%, transparent 48%), linear-gradient(180deg, rgba(223,206,214,0.86) 0 52%, rgba(2,2,2,0.54) 100%)',
    titleColor: 'var(--color-charcoal-950)',
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
      setPhotos((prev) => (pageNum === 1 ? data.photos : [...prev, ...data.photos]))
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

      <section className="section-spacing section-padding">
        <div className="container-wide space-y-8">
          <div className="healing-panel rounded-2xl p-6 lg:p-8 grounded-lines">
            <div className="flex flex-wrap justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                  Visual Story Montage
                </p>
                <h2 className="font-display text-3xl lg:text-4xl">Enter Through Story Trails</h2>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Sparkles size={14} />
                Image-led navigation
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {editorialPlaceholders.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl p-6 min-h-[170px] flex flex-col justify-end"
                  style={{ background: item.gradient }}
                >
                  <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: item.id === 'e3' ? 'rgba(2,2,2,0.65)' : 'rgba(255,255,255,0.65)' }}>
                    {item.note}
                  </p>
                  <h3 className="font-display text-2xl" style={{ color: item.titleColor }}>{item.title}</h3>
                </article>
              ))}
            </div>
          </div>

          <div data-decorative="true">
            <h2 className="text-2xl font-display mb-4" style={{ color: 'var(--color-foreground)' }}>
              Trending Now
            </h2>
            <TrendingCarousel />
          </div>

          <div className="rounded-2xl p-4 md:p-5 healing-panel">
            <div className="flex gap-4 flex-col lg:flex-row lg:items-end">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text"
                  placeholder="Search photos and stories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-dark pl-10"
                />
              </div>

              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="input-dark lg:max-w-[230px]"
              >
                <option value="">All Programs</option>
                <option value="YSMP">YSMP</option>
                <option value="Thrive Tribe">Thrive Tribe</option>
                <option value="Healing Centre">Healing Centre</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-dark lg:max-w-[180px]"
              >
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
                <option value="liked">Most Liked</option>
              </select>

              <Link href="/gallery/upload" className="btn-primary whitespace-nowrap">
                <Upload size={18} />
                Upload
              </Link>
            </div>

            <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.62)' }}>
              {total > 0 ? `Showing ${Math.min(page * 20, total)} of ${total} photos` : 'No photos found'}
            </p>
          </div>

          {isLoading && page === 1 ? (
            <div className="grid md:grid-cols-3 gap-4" data-decorative="true">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="h-36 bg-white/10" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>
                No photos found yet. Curated stories are coming soon.
              </p>
              <Link href="/gallery/upload" className="btn-primary">
                <Upload size={18} />
                Be the first to upload
              </Link>
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

              {page * 20 < total && (
                <div className="text-center py-8">
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={isLoading}
                    className="btn-outline disabled:opacity-50"
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
        <p style={{ color: 'rgba(255,255,255,0.65)' }}>Loading gallery...</p>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}
