import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createCommentSchema } from '@/lib/validators'
import { requireSessionUser } from '@/lib/api-auth'

// GET - List comments for a post
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const limit = 20

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

    const skip = (parseInt(page) - 1) * limit

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          postId,
          parentCommentId: null, // Only get top-level comments
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
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.comment.count({
        where: {
          postId,
          parentCommentId: null,
        },
      }),
    ])

    return NextResponse.json(
      {
        comments,
        total,
        page: parseInt(page),
        limit,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Add comment to post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const { postId } = await context.params
    const body = await request.json()

    // Validate input
    const validation = createCommentSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

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

    const { content } = validation.data

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        postId,
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

    // Create notification for post author (skip if commenting on own post)
    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'comment',
          title: 'New comment on your post',
          message: `${comment.author.name} commented on your post`,
          relatedUserId: userId,
          postId,
          commentId: comment.id,
        },
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'create_comment',
        details: {
          postId,
          commentId: comment.id,
          contentPreview: content.substring(0, 50),
        },
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
    console.error('Comment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}
