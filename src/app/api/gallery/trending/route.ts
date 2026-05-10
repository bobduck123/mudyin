import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateTrendingScore } from '@/lib/trending'
import { cache, cacheKeys, cacheDuration } from '@/lib/cache'
import { isDbUnavailableError } from '@/lib/demo-fallback'

// GET - Get trending photos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const timeWindow = searchParams.get('timeWindow') || 'week'
    const program = searchParams.get('program')

    // Check cache
    const cacheKey = program
      ? cacheKeys.trendingPhotosByProgram(program, timeWindow)
      : cacheKeys.trendingPhotos(timeWindow)

    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(
        { photos: cached, cached: true },
        { status: 200 }
      )
    }

    // Calculate time window
    const now = new Date()
    const daysBack = timeWindow === 'week' ? 7 : 30
    const startDate = new Date(
      now.getTime() - daysBack * 24 * 60 * 60 * 1000
    )

    // Fetch photos with engagement data
    const photos = await prisma.galleryPhoto.findMany({
      where: {
        createdAt: { gte: startDate },
        ...(program && { program }),
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

    // Calculate trending scores and sort
    type PhotoWithScore = (typeof photos)[0] & { trendingScore: number }
    const photosWithScores: PhotoWithScore[] = photos
      .map((photo: (typeof photos)[0]) => ({
        ...photo,
        trendingScore: calculateTrendingScore(photo),
      }))
      .sort((a: PhotoWithScore, b: PhotoWithScore) => b.trendingScore - a.trendingScore)
      .slice(0, limit)

    // Cache for 5 minutes
    cache.set(cacheKey, photosWithScores, cacheDuration.MEDIUM)

    return NextResponse.json(
      { photos: photosWithScores, cached: false },
      { status: 200 }
    )
  } catch (error) {
    if (isDbUnavailableError(error)) {
      return NextResponse.json(
        {
          photos: [
            {
              id: 'demo_trending_1',
              title: 'Demo Trending Story',
              imageUrl: 'https://picsum.photos/800/600?random=903',
              uploader: { name: 'Demo Uploader', profile: { avatar: null } },
              _count: { likes: 6, comments: 1 },
              trendingScore: 50,
            },
          ],
          cached: false,
          demoMode: true,
        },
        { status: 200 }
      )
    }
    console.error('Trending photos fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending photos' },
      { status: 500 }
    )
  }
}
