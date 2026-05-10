import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSessionUser } from '@/lib/api-auth'

// GET - Get user's uploaded photos
export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const skip = (page - 1) * limit

    const [photos, total] = await Promise.all([
      prisma.galleryPhoto.findMany({
        where: { uploaderId: userId },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          imageAlt: true,
          tags: true,
          program: true,
          event: true,
          permissions: true,
          createdAt: true,
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.galleryPhoto.count({ where: { uploaderId: userId } }),
    ])

    return NextResponse.json(
      {
        photos,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch my uploads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch uploads' },
      { status: 500 }
    )
  }
}
