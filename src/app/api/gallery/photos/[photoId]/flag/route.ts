import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { reportContentSchema } from '@/lib/validators'

// POST - Flag photo for review
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const { photoId } = await context.params
    const body = await request.json()

    // Validate input
    const validation = reportContentSchema.safeParse({
      ...body,
      contentType: 'photo',
      contentId: photoId,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { reason, description } = validation.data

    // Check photo exists
    const photo = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Check if already flagged by this user
    const existingFlag = await prisma.flaggedContent.findFirst({
      where: {
        contentType: 'photo',
        contentId: photoId,
        flaggedBy: userId || 'anonymous',
      },
    })

    if (existingFlag) {
      return NextResponse.json(
        { error: 'You have already reported this photo' },
        { status: 400 }
      )
    }

    // Create flag record
    const flag = await prisma.flaggedContent.create({
      data: {
        contentType: 'photo',
        contentId: photoId,
        reason,
        description: description || null,
        flaggedBy: userId || 'anonymous',
        status: 'pending',
      },
    })

    // Mark photo as flagged (for moderators)
    if (reason === 'harmful' || reason === 'inappropriate') {
      await prisma.galleryPhoto.update({
        where: { id: photoId },
        data: { flaggedForReview: true },
      })
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action: 'flag_photo',
        details: {
          photoId,
          reason,
          flagId: flag.id,
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Thank you for reporting. Our moderation team will review this shortly.',
        flagId: flag.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Flag photo error:', error)
    return NextResponse.json(
      { error: 'Failed to flag photo' },
      { status: 500 }
    )
  }
}
