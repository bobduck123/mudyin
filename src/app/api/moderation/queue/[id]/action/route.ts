import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { banUser } from '@/lib/moderation'
import { requireModerator } from '@/lib/api-auth'

/**
 * Moderator takes action on flagged content
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireModerator('review_content')
    if (!auth.ok) return auth.response

    const { id } = await params
    const body = await request.json()
    const { action, banDurationDays, reviewNotes } = body
    const moderatorId = auth.userId

    // Validate action
    const validActions = ['dismiss', 'remove_content', 'ban_user', 'temp_ban', 'warn']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Get flagged content
    const flagged = await prisma.flaggedContent.findUnique({
      where: { id: id },
    })

    if (!flagged) {
      return NextResponse.json(
        { error: 'Flagged content not found' },
        { status: 404 }
      )
    }

    const status = 'reviewed'
    let userId: string | null = null

    // Get the content to find user ID
    if (flagged.contentType === 'post') {
      const post = await prisma.communityPost.findUnique({
        where: { id: flagged.contentId },
        select: { authorId: true },
      })
      userId = post?.authorId || null

      if (action === 'remove_content') {
        // Delete the post
        await prisma.communityPost.delete({
          where: { id: flagged.contentId },
        })
      }
    } else if (flagged.contentType === 'comment') {
      const comment = await prisma.comment.findUnique({
        where: { id: flagged.contentId },
        select: { authorId: true },
      })
      userId = comment?.authorId || null

      if (action === 'remove_content') {
        await prisma.comment.delete({
          where: { id: flagged.contentId },
        })
      }
    } else if (flagged.contentType === 'photo') {
      const photo = await prisma.galleryPhoto.findUnique({
        where: { id: flagged.contentId },
        select: { uploaderId: true },
      })
      userId = photo?.uploaderId || null

      if (action === 'remove_content') {
        await prisma.galleryPhoto.delete({
          where: { id: flagged.contentId },
        })
      }
    }

    // Take action
    if (action === 'ban_user' || action === 'temp_ban') {
      if (!userId) {
        return NextResponse.json(
          { error: 'Could not identify user to ban' },
          { status: 400 }
        )
      }

      const durationDays =
        action === 'temp_ban' ? banDurationDays || 7 : undefined

      await banUser(
        userId,
        flagged.reason,
        durationDays,
        moderatorId
      )
    }

    // Update flagged content
    const updated = await prisma.flaggedContent.update({
      where: { id: id },
      data: {
        status,
        actionTaken: action,
        reviewedBy: moderatorId,
        reviewedAt: new Date(),
        reviewNotes,
      },
    })

    // Log the moderation action
    await prisma.auditLog.create({
      data: {
        userId: moderatorId,
        action: 'moderate_content',
        details: {
          flaggedContentId: id,
          contentType: flagged.contentType,
          contentId: flagged.contentId,
          action,
          authorId: userId,
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: `Action taken: ${action}`,
        flagged: updated,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Moderation action error:', error)
    return NextResponse.json(
      { error: 'Failed to take action' },
      { status: 500 }
    )
  }
}
