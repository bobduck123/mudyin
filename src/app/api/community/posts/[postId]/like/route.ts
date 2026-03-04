import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST - Toggle like on post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { postId } = await context.params

    // Check if post exists
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Use findFirst with explicit null check (findUnique breaks with null composite key fields)
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
        photoId: null,
      },
    })

    if (existingLike) {
      // Unlike - delete by id
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      await prisma.auditLog.create({
        data: {
          userId,
          action: 'unlike_post',
          details: { postId },
        },
      })

      return NextResponse.json(
        { message: 'Post unliked', liked: false },
        { status: 200 }
      )
    } else {
      // Like the post
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      })

      // Create notification for post author (skip if liking own post)
      if (post.authorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'like',
            title: 'New like on your post',
            message: 'Someone liked your post',
            relatedUserId: userId,
            postId,
          },
        })
      }

      await prisma.auditLog.create({
        data: {
          userId,
          action: 'like_post',
          details: { postId },
        },
      })

      return NextResponse.json(
        { message: 'Post liked', liked: true, like },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Like toggle error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
