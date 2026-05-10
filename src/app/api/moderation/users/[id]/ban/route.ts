import { NextRequest, NextResponse } from 'next/server'
import { banUser } from '@/lib/moderation'
import { prisma } from '@/lib/db'
import { requireModerator } from '@/lib/api-auth'

/**
 * Ban or unban a user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireModerator('ban_users')
    if (!auth.ok) return auth.response

    const { id } = await params
    const body = await request.json()
    const { action, reason, durationDays } = body
    const moderatorId = auth.userId

    if (action === 'ban') {
      const ban = await banUser(
        id,
        reason,
        durationDays,
        moderatorId
      )

      if (!ban) {
        return NextResponse.json(
          { error: 'Failed to ban user' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: true,
          message: `User banned${durationDays ? ` for ${durationDays} days` : ' permanently'}`,
          ban,
        },
        { status: 200 }
      )
    } else if (action === 'unban') {
      // Unban user
      await prisma.bannedUser.delete({
        where: { userId: id },
      })

      await prisma.auditLog.create({
        data: {
          userId: moderatorId,
          action: 'unban_user',
          details: {
            targetUserId: id,
          },
        },
      })

      return NextResponse.json(
        {
          success: true,
          message: 'User unbanned',
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Ban action error:', error)
    return NextResponse.json(
      { error: 'Failed to process ban action' },
      { status: 500 }
    )
  }
}

/**
 * Get ban details for a user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireModerator('ban_users')
    if (!auth.ok) return auth.response

    const { id } = await params
    const ban = await prisma.bannedUser.findUnique({
      where: { userId: id },
      select: {
        reason: true,
        severity: true,
        bannedAt: true,
        unbanAt: true,
        appealedAt: true,
        appealStatus: true,
        appealNotes: true,
      },
    })

    if (!ban) {
      return NextResponse.json(
        { banned: false },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        banned: true,
        ...ban,
        isPermanent: !ban.unbanAt,
        isExpired: ban.unbanAt ? ban.unbanAt < new Date() : false,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ban lookup error:', error)
    return NextResponse.json(
      { error: 'Failed to get ban details' },
      { status: 500 }
    )
  }
}
