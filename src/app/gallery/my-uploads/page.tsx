'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Edit, Trash2, Eye, Upload, Lock, Globe } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'

interface Photo {
  id: string
  title: string
  imageUrl: string
  imageAlt: string
  description?: string
  permissions: string
  program?: string
  event?: string
  tags: string[]
  createdAt: string
  _count: {
    likes: number
    comments: number
  }
}

export default function MyUploadsPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'liked'>('newest')
  const [filterPermissions, setFilterPermissions] = useState<'all' | 'public' | 'members_only'>('all')

  const fetchPhotos = async () => {
    if (!userId) return
    try {
      setIsLoading(true)
      const response = await fetch('/api/gallery/my-uploads', {
        headers: { 'x-user-id': userId },
      })
      if (!response.ok) throw new Error('Failed to fetch uploads')

      const data = await response.json()
      setPhotos(data.photos || [])
    } catch (error) {
      console.error('Fetch uploads error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]) // re-fetch when session loads

  const handleDelete = async () => {
    if (!selectedPhoto || !userId) return

    try {
      const response = await fetch(`/api/gallery/photos/${selectedPhoto.id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      })

      if (!response.ok) throw new Error('Failed to delete photo')

      setPhotos(prev => prev.filter(p => p.id !== selectedPhoto.id))
      setShowDeleteConfirm(false)
      setSelectedPhoto(null)
    } catch (error) {
      console.error('Delete photo error:', error)
    }
  }

  const sortedPhotos = [...photos]
    .filter(p =>
      filterPermissions === 'all' ? true : p.permissions === filterPermissions
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        return b._count.likes - a._count.likes
      }
    })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <PageHero
        title="My Uploads"
        subtitle="Manage your gallery contributions"
        description="View, edit, and delete the photos you've shared with the community."
      />

      <section className="section-spacing container-wide">
        <div className="max-w-6xl mx-auto">
          {/* Header with Upload Button */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
              </h2>
              <p className="text-gray-600 text-sm">
                Total engagement: {photos.reduce((sum, p) => sum + p._count.likes + p._count.comments, 0)} likes & comments
              </p>
            </div>
            <Link
              href="/gallery/upload"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-ochre-400)' }}
            >
              <Upload size={18} />
              Upload Photo
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8 flex-col sm:flex-row">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'liked')}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="liked">Most Liked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Visibility
              </label>
              <select
                value={filterPermissions}
                onChange={(e) => setFilterPermissions(e.target.value as 'all' | 'public' | 'members_only')}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
              >
                <option value="all">All Photos</option>
                <option value="public">Public Only</option>
                <option value="members_only">Members Only</option>
              </select>
            </div>
          </div>

          {/* Photos List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your uploads...</p>
            </div>
          ) : sortedPhotos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {photos.length === 0
                  ? "You haven't uploaded any photos yet."
                  : 'No photos match your filters.'}
              </p>
              {photos.length === 0 && (
                <Link
                  href="/gallery/upload"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: 'var(--color-ochre-400)' }}
                >
                  <Upload size={18} />
                  Upload Your First Photo
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPhotos.map(photo => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Photo Thumbnail */}
                  <div className="relative w-full aspect-square bg-gray-200 overflow-hidden group">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Link
                        href={`/gallery/${photo.id}`}
                        className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors"
                        aria-label="View photo"
                      >
                        <Eye size={20} />
                      </Link>

                      <Link
                        href={`/gallery/${photo.id}/edit`}
                        className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors"
                        aria-label="Edit photo"
                      >
                        <Edit size={20} />
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedPhoto(photo)
                          setShowDeleteConfirm(true)
                        }}
                        className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        aria-label="Delete photo"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    {/* Visibility Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: 'rgba(20,20,20,0.7)' }}>
                      {photo.permissions === 'public' ? (
                        <>
                          <Globe size={12} />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock size={12} />
                          Members
                        </>
                      )}
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-4">
                    <Link
                      href={`/gallery/${photo.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-ochre-400 transition-colors block mb-2"
                      style={{ color: 'var(--color-charcoal-900)' }}
                    >
                      {photo.title}
                    </Link>

                    {photo.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {photo.description}
                      </p>
                    )}

                    {/* Tags */}
                    {photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {photo.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: 'var(--color-sage-500)' }}
                          >
                            {tag}
                          </span>
                        ))}
                        {photo.tags.length > 2 && (
                          <span className="text-xs px-2 py-1 rounded-full text-gray-600">
                            +{photo.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
                      <span>❤️ {photo._count.likes} likes</span>
                      <span>💬 {photo._count.comments} comments</span>
                      <span>{formatDate(photo.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold mb-2">Delete Photo?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{selectedPhoto.title}&quot;? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSelectedPhoto(null)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
