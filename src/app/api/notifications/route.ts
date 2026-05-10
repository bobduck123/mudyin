import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSessionUser } from '@/lib/api-auth'
import { authenticateControlRequest } from '@/lib/control-plane'
import { getDefaultSite } from '@/lib/white-label/site-registry'

// GET - Fetch user's notifications
export async function GET(request: NextRequest) {
  try {
    const auth = await requireSessionUser()

    if (!auth.ok) {
      return NextResponse.json(
        {
          notifications: [],
          total: 0,
          unreadCount: 0,
          limit: parseInt(request.nextUrl.searchParams.get('limit') || '20'),
          offset: parseInt(request.nextUrl.searchParams.get('offset') || '0'),
        },
        { status: 200 }
      )
    }
    const userId = auth.userId

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unread') === 'true'

    // Build query filter
    const whereClause: Record<string, unknown> = { userId }
    if (unreadOnly) {
      whereClause.isRead = false
    }

    // Fetch notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        include: {
          user: { select: { name: true, profile: { select: { avatar: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where: whereClause }),
    ])

    // Count unread notifications
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    return NextResponse.json(
      {
        notifications,
        total,
        unreadCount,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fetch notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// POST - Create notification (internal use)
export async function POST(request: NextRequest) {
  try {
    const controlAuth = authenticateControlRequest(request, getDefaultSite().siteId)
    if (!controlAuth.ok) return controlAuth.response

    const body = await request.json()
    const {
      userId,
      type, // "like", "comment", "follow", "mention"
      title,
      message,
      relatedUserId,
      photoId,
      postId,
      commentId,
    } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedUserId,
        photoId,
        postId,
        commentId,
      },
      include: {
        user: { select: { name: true } },
      },
    })

    return NextResponse.json(
      {
        message: 'Notification created',
        notification,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
