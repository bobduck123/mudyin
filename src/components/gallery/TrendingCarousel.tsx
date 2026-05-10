'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react'

interface TrendingPhoto {
  id: string
  title: string
  imageUrl: string
  imageAlt: string
  uploader: {
    name: string
    profile?: {
      avatar?: string
    }
  }
  _count: {
    likes: number
    comments: number
  }
  trendingScore: number
}

export function TrendingCarousel() {
  const [photos, setPhotos] = useState<TrendingPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingPhotos = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/gallery/trending?limit=5')
        if (!response.ok) throw new Error('Failed to fetch trending photos')

        const data = await response.json()
        setPhotos(data.photos || [])
      } catch (err) {
        console.error('Trending photos error:', err)
        setError('Failed to load trending photos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingPhotos()
  }, [])

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % photos.length)
  }

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length)
  }

  if (isLoading) {
    return (
      <div
        className="w-full h-64 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'rgba(2,2,2,0.72)', boxShadow: '0 12px 24px rgba(0,0,0,0.3)' }}
      >
        <span style={{ color: 'rgba(255,255,255,0.62)' }}>Loading trending photos...</span>
      </div>
    )
  }

  if (error || photos.length === 0) {
    return null
  }

  const currentPhoto = photos[currentIndex]

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden grounded-lines"
      style={{ aspectRatio: '16/9', boxShadow: '0 14px 28px rgba(0,0,0,0.32)' }}
    >
      <div className="relative w-full h-full">
        <Image
          src={currentPhoto.imageUrl}
          alt={currentPhoto.imageAlt}
          fill
          className="object-cover"
          priority
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"
          aria-hidden
        />

        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.14em] font-semibold text-white"
          style={{ backgroundColor: 'rgba(210,168,85,0.9)' }}
        >
          Trending
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Link href={`/gallery/${currentPhoto.id}`}>
            <h3 className="text-2xl font-display font-semibold mb-2 hover:underline">
              {currentPhoto.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentPhoto.uploader.profile?.avatar && (
                <Image
                  src={currentPhoto.uploader.profile.avatar}
                  alt={currentPhoto.uploader.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium">
                  {currentPhoto.uploader.name}
                </p>
                <p className="text-xs opacity-75">Photographer</p>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Heart size={16} className="fill-current" />
                <span>{currentPhoto._count.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{currentPhoto._count.comments}</span>
              </div>
            </div>
          </div>
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-colors backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(2,2,2,0.42)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
              aria-label="Previous trending photo"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-colors backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(2,2,2,0.42)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
              aria-label="Next trending photo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {photos.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to trending photo ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
