import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSessionUser } from '@/lib/api-auth'

// POST - Follow or unfollow a user
export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const body = await request.json()
    const { targetUserId, action } = body

    if (!targetUserId || !action) {
      return NextResponse.json(
        { error: 'targetUserId and action are required' },
        { status: 400 }
      )
    }

    if (action !== 'follow' && action !== 'unfollow') {
      return NextResponse.json(
        { error: 'action must be "follow" or "unfollow"' },
        { status: 400 }
      )
    }

    // Prevent self-following
    if (userId === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      )
    }

    if (action === 'follow') {
      // Add to following list
      await prisma.user.update({
        where: { id: userId },
        data: {
          following: {
            connect: { id: targetUserId },
          },
        },
      })

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'follow_user',
          details: { target_user_id: targetUserId },
        },
      })

      return NextResponse.json(
        {
          message: 'User followed successfully',
          action: 'follow',
        },
        { status: 200 }
      )
    } else {
      // Remove from following list
      await prisma.user.update({
        where: { id: userId },
        data: {
          following: {
            disconnect: { id: targetUserId },
          },
        },
      })

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'unfollow_user',
          details: { target_user_id: targetUserId },
        },
      })

      return NextResponse.json(
        {
          message: 'User unfollowed successfully',
          action: 'unfollow',
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Connection action error:', error)
    return NextResponse.json(
      { error: 'Failed to update connection' },
      { status: 500 }
    )
  }
}

// GET - Fetch followers or following list
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'followers' or 'following'
    const page = searchParams.get('page') || '1'
    const limit = 20

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      )
    }

    if (type !== 'followers' && type !== 'following') {
      return NextResponse.json(
        { error: 'type must be "followers" or "following"' },
        { status: 400 }
      )
    }

    const skip = (parseInt(page) - 1) * limit

    if (type === 'followers') {
      const [followers, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            following: {
              some: { id: userId },
            },
          },
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
                program: true,
                bio: true,
              },
            },
            _count: {
              select: {
                followers: true,
              },
            },
          },
          skip,
          take: limit,
        }),
        prisma.user.count({
          where: {
            following: {
              some: { id: userId },
            },
          },
        }),
      ])

      return NextResponse.json(
        {
          list: followers,
          total,
          page: parseInt(page),
          limit,
          hasMore: skip + limit < total,
        },
        { status: 200 }
      )
    } else {
      const [following, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            id: userId,
          },
          select: {
            following: {
              select: {
                id: true,
                name: true,
                profile: {
                  select: {
                    avatar: true,
                    program: true,
                    bio: true,
                  },
                },
                _count: {
                  select: {
                    followers: true,
                  },
                },
              },
              skip,
              take: limit,
            },
          },
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            _count: {
              select: { following: true },
            },
          },
        }),
      ])

      return NextResponse.json(
        {
          list: following[0]?.following || [],
          total: total?._count?.following || 0,
          page: parseInt(page),
          limit,
          hasMore: skip + limit < (total?._count?.following || 0),
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Get connections error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    )
  }
}
