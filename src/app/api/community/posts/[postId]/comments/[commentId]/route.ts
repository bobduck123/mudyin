import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// DELETE - Delete own comment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string; commentId: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const { postId, commentId } = await context.params

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

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    if (comment.authorId !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: commentId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'delete_comment',
        details: {
          postId,
          commentId,
          contentPreview: comment.content.substring(0, 50),
        },
      },
    })

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Comment deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
