import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPostSchema } from '@/lib/validators'
import { requireSessionUser } from '@/lib/api-auth'

// GET - Fetch single post with full details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true, program: true, badges: true } },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        post: {
          ...post,
          likeCount: post._count.likes,
          commentCount: post._count.comments,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Post fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT - Update own post
export async function PUT(
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
    const validation = createPostSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    // Check if user owns the post
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== userId) {
      return NextResponse.json(
        { error: 'You can only edit your own posts' },
        { status: 403 }
      )
    }

    const { content, tags, program, visibility } = validation.data

    // Update post
    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        content,
        tags: tags || [],
        program: program || null,
        visibility: visibility || 'public',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: { select: { avatar: true, program: true } },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'edit_post',
        details: {
          postId,
          previousContent: post.content.substring(0, 100),
          newContent: content.substring(0, 100),
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Post updated successfully',
        post: {
          ...updatedPost,
          likeCount: updatedPost._count.likes,
          commentCount: updatedPost._count.comments,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Post update error:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete own post
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const { postId } = await context.params

    // Check if user owns the post
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.authorId !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      )
    }

    // Delete post (cascades to comments and likes)
    await prisma.communityPost.delete({
      where: { id: postId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'delete_post',
        details: {
          postId,
          contentPreview: post.content.substring(0, 100),
        },
      },
    })

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Post deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
