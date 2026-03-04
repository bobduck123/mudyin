// Trending algorithm for photos
import { prisma } from '@/lib/db'

interface PhotoWithEngagement {
  id: string
  createdAt: Date
  _count: {
    likes: number
    comments: number
  }
}

interface PhotoWithScore extends PhotoWithEngagement {
  trendingScore: number
}

/**
 * Calculate trending score based on engagement and recency
 * Formula: (likes * 1.0 + comments * 2.0) * recency_multiplier
 *
 * Recency multiplier:
 * - Photos from last 7 days: 1.0
 * - Photos from 8-14 days: 0.75
 * - Photos from 15-30 days: 0.5
 * - Photos older than 30 days: 0.25
 */
export function calculateTrendingScore(photo: PhotoWithEngagement): number {
  const now = new Date()
  const daysOld = Math.floor(
    (now.getTime() - photo.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  let recencyMultiplier = 0.25 // Default for old photos
  if (daysOld <= 7) recencyMultiplier = 1.0
  else if (daysOld <= 14) recencyMultiplier = 0.75
  else if (daysOld <= 30) recencyMultiplier = 0.5

  const engagementScore =
    photo._count.likes * 1.0 + photo._count.comments * 2.0
  const finalScore = engagementScore * recencyMultiplier

  return finalScore
}

/**
 * Get trending photos for a given time period
 */
export async function getTrendingPhotos(
  timeWindow: 'week' | 'month' = 'week',
  limit: number = 10
) {
  const now = new Date()
  const daysBack = timeWindow === 'week' ? 7 : 30
  const startDate = new Date(
    now.getTime() - daysBack * 24 * 60 * 60 * 1000
  )

  const photos = await prisma.galleryPhoto.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    include: {
      uploader: {
        select: {
          name: true,
          profile: { select: { avatar: true } },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })

  // Calculate scores and sort
  const photosWithScores: PhotoWithScore[] = (photos as PhotoWithEngagement[]).map(photo => ({
    ...photo,
    trendingScore: calculateTrendingScore(photo),
  }))

  return photosWithScores
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}

/**
 * Get trending photos by program
 */
export async function getTrendingPhotosByProgram(
  program: string,
  timeWindow: 'week' | 'month' = 'week',
  limit: number = 5
) {
  const now = new Date()
  const daysBack = timeWindow === 'week' ? 7 : 30
  const startDate = new Date(
    now.getTime() - daysBack * 24 * 60 * 60 * 1000
  )

  const photos = await prisma.galleryPhoto.findMany({
    where: {
      program,
      createdAt: {
        gte: startDate,
      },
    },
    include: {
      uploader: {
        select: {
          name: true,
          profile: { select: { avatar: true } },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })

  const photosWithScores: PhotoWithScore[] = (photos as PhotoWithEngagement[]).map(photo => ({
    ...photo,
    trendingScore: calculateTrendingScore(photo),
  }))

  return photosWithScores
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, limit)
}
