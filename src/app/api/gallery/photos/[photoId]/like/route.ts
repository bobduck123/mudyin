import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST - Like or unlike a photo
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
    const { action } = body // 'like' or 'unlike'

    if (!action || !['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be "like" or "unlike"' },
        { status: 400 }
      )
    }

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

    if (action === 'like') {
      // Check if already liked
      const existingLike = await prisma.like.findFirst({
        where: {
          userId,
          photoId,
          postId: null,
        },
      })

      if (existingLike) {
        return NextResponse.json(
          { error: 'You already liked this photo' },
          { status: 400 }
        )
      }

      // Create like
      await prisma.like.create({
        data: {
          userId,
          photoId,
        },
      })

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'like_photo',
          details: { photoId },
        },
      })

      return NextResponse.json(
        { message: 'Photo liked', action: 'like' },
        { status: 200 }
      )
    } else {
      // Unlike
      const like = await prisma.like.findFirst({
        where: {
          userId,
          photoId,
          postId: null,
        },
      })

      if (!like) {
        return NextResponse.json(
          { error: 'You have not liked this photo' },
          { status: 400 }
        )
      }

      await prisma.like.delete({
        where: { id: like.id },
      })

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'unlike_photo',
          details: { photoId },
        },
      })

      return NextResponse.json(
        { message: 'Photo unliked', action: 'unlike' },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Like action error:', error)
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    )
  }
}
