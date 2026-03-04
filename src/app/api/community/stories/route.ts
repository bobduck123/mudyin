import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const page = searchParams.get('page') || '1'
    const limit = 20

    const where: Record<string, unknown> = {
      isStory: true,
      visibility: 'public',
    }

    if (userId) {
      where.authorId = userId
    }

    const skip = (parseInt(page) - 1) * limit

    const [stories, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profile: { select: { avatar: true } },
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communityPost.count({ where }),
    ])

    return NextResponse.json(
      {
        stories: stories.map((s) => ({
          ...s,
          likeCount: s._count.likes,
          commentCount: s._count.comments,
        })),
        total,
        page: parseInt(page),
        limit,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Stories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      content,
      program,
      tags = [],
      visibility = 'public',
      storyFrames = [],
    } = body

    // Validation
    if (!userId || !content || !storyFrames || storyFrames.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, content, storyFrames' },
        { status: 400 }
      )
    }

    if (storyFrames.length > 50) {
      return NextResponse.json(
        { error: 'Story cannot have more than 50 frames' },
        { status: 400 }
      )
    }

    // Create story post
    const story = await prisma.communityPost.create({
      data: {
        authorId: userId,
        content,
        program,
        tags,
        visibility,
        isStory: true,
        storyFrames: {
          createMany: {
            data: storyFrames.map((frame: Record<string, unknown>, index: number) => ({
              imageUrl: frame.imageUrl,
              caption: frame.caption,
              duration: frame.duration || 5,
              frameOrder: index + 1,
            })),
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
            profile: { select: { avatar: true } },
          },
        },
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
          ...story,
          likeCount: story._count.likes,
          commentCount: story._count.comments,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Story creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
}
