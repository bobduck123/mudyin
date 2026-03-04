import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { LikeButton } from '@/components/gallery/LikeButton'
import { CommentSection } from '@/components/gallery/CommentSection'
import { Download, Share2, Flag } from 'lucide-react'

interface PhotoPageProps {
  params: Promise<{
    photoId: string
  }>
}

export async function generateMetadata({ params }: PhotoPageProps) {
  const { photoId } = await params
  const photo = await prisma.galleryPhoto.findUnique({
    where: { id: photoId },
  })

  if (!photo) {
    return {
      title: 'Photo Not Found | Gallery | Mudyin',
    }
  }

  return {
    title: `${photo.title} | Gallery | Mudyin`,
    description: photo.description || photo.title,
    openGraph: {
      images: [photo.imageUrl],
    },
  }
}

export default async function PhotoDetailPage({ params }: PhotoPageProps) {
  const { photoId } = await params
  const photo = await prisma.galleryPhoto.findUnique({
    where: { id: photoId },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          profile: { select: { avatar: true } },
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profile: { select: { avatar: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { likes: true },
      },
    },
  })

  if (!photo) {
    notFound()
  }

  const uploadDate = new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(photo.createdAt)

  const photographerInitials = photo.uploader.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <>
      {/* Photo Viewer */}
      <section className="py-12 container-wide">
        <div className="max-w-5xl mx-auto">
          {/* Image */}
          <div className="mb-8 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              alt={photo.imageAlt}
              className="w-full h-auto"
            />
          </div>

          {/* Photo Info & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Metadata */}
              <div>
                <h1 className="font-display text-4xl font-bold mb-3">
                  {photo.title}
                </h1>

                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(photo.tags as string[]).map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/gallery?search=${tag}`}
                        className="text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:opacity-80"
                        style={{
                          backgroundColor: 'rgba(210, 168, 85, 0.2)',
                          color: 'var(--color-ochre-400)',
                        }}
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Photo Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {photo.program && (
                    <span
                      className="font-semibold px-3 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(157, 193, 131, 0.2)',
                        color: 'var(--color-sage-500)',
                      }}
                    >
                      {photo.program}
                    </span>
                  )}
                  <span>{uploadDate}</span>
                </div>
              </div>

              {/* Description */}
              {photo.description && (
                <div>
                  <h2 className="text-lg font-bold mb-3">About</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {photo.description}
                  </p>
                </div>
              )}

              {/* Accessibility Info */}
              <div
                className="p-4 rounded-lg border-l-4"
                style={{
                  backgroundColor: 'rgba(210, 168, 85, 0.05)',
                  borderColor: 'var(--color-ochre-400)',
                }}
              >
                <p className="text-sm text-gray-600">
                  <strong>Alt text:</strong> {photo.imageAlt}
                </p>
              </div>

              {/* Engagement */}
              <div className="flex flex-wrap gap-3">
                <LikeButton
                  photoId={photo.id}
                  initialLikes={photo._count.likes}
                />

                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: 'rgba(210, 168, 85, 0.1)',
                    color: 'var(--color-ochre-400)',
                    border: '1px solid var(--color-ochre-400)',
                  }}
                >
                  <Download size={18} />
                  Download
                </button>

                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: 'rgba(210, 168, 85, 0.1)',
                    color: 'var(--color-ochre-400)',
                    border: '1px solid var(--color-ochre-400)',
                  }}
                >
                  <Share2 size={18} />
                  Share
                </button>

                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                  }}
                >
                  <Flag size={18} />
                  Report
                </button>
              </div>

              {/* Comments */}
              <CommentSection
                photoId={photo.id}
                initialComments={photo.comments}
              />
            </div>

            {/* Sidebar - Photographer Info */}
            <div
              className="p-6 rounded-xl h-fit"
              style={{
                backgroundColor: 'rgba(210, 168, 85, 0.05)',
                border: '1px solid rgba(210, 168, 85, 0.2)',
              }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
                Photographer
              </h3>

              <div className="flex items-start gap-3 mb-4">
                {photo.uploader.profile?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.uploader.profile.avatar}
                    alt={photo.uploader.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: 'var(--color-ochre-400)' }}
                  >
                    {photographerInitials}
                  </div>
                )}

                <div>
                  <Link
                    href={`/community/members/${photo.uploader.id}`}
                    className="font-bold hover:underline"
                  >
                    {photo.uploader.name}
                  </Link>
                  <p className="text-xs text-gray-600">Photographer</p>
                </div>
              </div>

              <Link
                href={`/community/members/${photo.uploader.id}`}
                className="w-full py-2 rounded-lg font-semibold text-center text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-ochre-400)' }}
              >
                View Profile
              </Link>

              {/* Stats */}
              <div
                className="mt-6 pt-6 border-t"
                style={{ borderColor: 'rgba(210, 168, 85, 0.2)' }}
              >
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Likes</span>
                    <span className="font-bold">{photo._count.likes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comments</span>
                    <span className="font-bold">{photo.comments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Privacy</span>
                    <span className="font-bold">
                      {photo.permissions === 'public'
                        ? 'Public'
                        : photo.permissions === 'members_only'
                          ? 'Members'
                          : 'Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
