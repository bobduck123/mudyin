import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isDbUnavailableError } from '@/lib/demo-fallback'

/**
 * Get moderation queue for moderators
 * Returns flagged content sorted by priority and severity
 */
export async function GET(request: NextRequest) {
  try {
    // In production, check moderator role
    // const userId = extractUserIdFromToken()
    // if (!await isModerator(userId)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const status = searchParams.get('status') || 'pending'
    const priority = searchParams.get('priority')
    const sort = searchParams.get('sort') || 'severity_desc' // severity_desc, priority, oldest, newest

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = { status }

    if (priority) {
      where.priority = priority
    }

    // Get total count
    const total = await prisma.flaggedContent.count({ where })

    // Determine sort order
    let orderBy: Record<string, unknown> = { severity: 'desc' }
    if (sort === 'priority') {
      orderBy = { priority: 'desc' }
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' }
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' }
    }

    // Fetch flagged content
    const queue = await prisma.flaggedContent.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        contentType: true,
        contentId: true,
        reason: true,
        description: true,
        flaggedBy: true,
        status: true,
        priority: true,
        severity: true,
        reviewedBy: true,
        reviewedAt: true,
        reviewNotes: true,
        actionTaken: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        queue,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
        stats: {
          pending: await prisma.flaggedContent.count({ where: { status: 'pending' } }),
          critical: await prisma.flaggedContent.count({
            where: { status: 'pending', priority: 'critical' },
          }),
          high: await prisma.flaggedContent.count({
            where: { status: 'pending', priority: 'high' },
          }),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Moderation queue fetch error:', error)
    if (isDbUnavailableError(error)) {
      return NextResponse.json(
        {
          queue: [],
          total: 0,
          page: 1,
          limit: 20,
          hasMore: false,
          stats: {
            pending: 0,
            critical: 0,
            high: 0,
          },
          demoMode: true,
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch moderation queue' },
      { status: 500 }
    )
  }
}
