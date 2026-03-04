import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params
    const story = await prisma.communityPost.findUnique({
      where: { id: storyId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
                bio: true,
                badges: true,
              },
            },
          },
        },
        storyFrames: {
          orderBy: { frameOrder: 'asc' },
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            duration: true,
            frameOrder: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (!story.isStory) {
      return NextResponse.json(
        { error: 'Post is not a story' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        story: {
          ...story,
          likeCount: story._count.likes,
          commentCount: story._count.comments,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Story fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params
    const body = await request.json()
    const { userId, visibility, storyFrames: _storyFrames } = body

    // Verify ownership
    const story = await prisma.communityPost.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (story.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update story
    const updatedStory = await prisma.communityPost.update({
      where: { id: storyId },
      data: {
        visibility: visibility || undefined,
      },
      include: {
        storyFrames: {
          orderBy: { frameOrder: 'asc' },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    return NextResponse.json(
      {
        story: {
          ...updatedStory,
          likeCount: updatedStory._count.likes,
          commentCount: updatedStory._count.comments,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Story update error:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> }
) {
  try {
    const { storyId } = await params
    const body = await request.json()
    const { userId } = body

    // Verify ownership
    const story = await prisma.communityPost.findUnique({
      where: { id: storyId },
    })

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (story.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete story (cascade deletes frames)
    await prisma.communityPost.delete({
      where: { id: storyId },
    })

    return NextResponse.json(
      { success: true, message: 'Story deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Story delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    )
  }
}
