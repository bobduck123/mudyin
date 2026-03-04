import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// DELETE - Delete comment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ photoId: string; commentId: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const { photoId, commentId } = await context.params

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check comment ownership
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

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'delete_comment_photo',
        details: { photoId, commentId },
      },
    })

    return NextResponse.json(
      { message: 'Comment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
