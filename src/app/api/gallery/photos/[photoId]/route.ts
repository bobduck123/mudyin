import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch single photo with comments
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const { photoId } = await context.params

    const photo = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true } },
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profile: { select: { avatar: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { likes: true },
        },
      },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        photo: {
          ...photo,
          likeCount: photo._count.likes,
          commentCount: photo.comments.length,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Photo fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    )
  }
}

// PUT - Update photo metadata
export async function PUT(
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

    // Check ownership
    const photo = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    if (photo.uploaderId !== userId) {
      return NextResponse.json(
        { error: 'You can only edit your own photos' },
        { status: 403 }
      )
    }

    // Update photo
    const updated = await prisma.galleryPhoto.update({
      where: { id: photoId },
      data: {
        title: body.title || photo.title,
        description: body.description !== undefined ? body.description : photo.description,
        tags: body.tags || photo.tags,
        program: body.program || photo.program,
        permissions: body.permissions || photo.permissions,
      },
      include: {
        uploader: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'update_photo',
        details: { photoId },
      },
    })

    return NextResponse.json(
      {
        message: 'Photo updated successfully',
        photo: updated,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Photo update error:', error)
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    )
  }
}

// DELETE - Delete photo
export async function DELETE(
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

    // Check ownership
    const photo = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    if (photo.uploaderId !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own photos' },
        { status: 403 }
      )
    }

    // Delete photo (cascade deletes comments and likes)
    await prisma.galleryPhoto.delete({
      where: { id: photoId },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'delete_photo',
        details: { photoId, title: photo.title },
      },
    })

    return NextResponse.json(
      { message: 'Photo deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Photo delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    )
  }
}
