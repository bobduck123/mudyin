import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createCommentSchema } from '@/lib/validators'

// POST - Add comment to photo
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const { photoId } = await context.params

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = createCommentSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { content } = validation.data

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

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        photoId,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true } },
          },
        },
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'add_comment_photo',
        details: { photoId, commentId: comment.id },
      },
    })

    return NextResponse.json(
      {
        message: 'Comment added successfully',
        comment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}
