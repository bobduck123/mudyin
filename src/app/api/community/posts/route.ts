import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createPostSchema } from '@/lib/validators'
import { demoId, isDbUnavailableError } from '@/lib/demo-fallback'

function getDemoPosts() {
  return [
    {
      id: 'demo_post_1',
      content: 'Morning training done. Proud of everyone showing up strong today.',
      images: [],
      tags: ['YSMP', 'momentum'],
      author: {
        id: 'demo_user_1',
        name: 'Demo Mentor',
        profile: { avatar: null, program: 'YSMP' },
      },
      likeCount: 12,
      commentCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo_post_2',
      content: 'Community yarn tonight. Bring stories, bring care.',
      images: [],
      tags: ['community', 'healing'],
      author: {
        id: 'demo_user_2',
        name: 'Demo Community Lead',
        profile: { avatar: null, program: 'Healing Centre' },
      },
      likeCount: 9,
      commentCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ]
}

// GET - List posts with filters, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const program = searchParams.get('program')
    const sort = searchParams.get('sort') || 'newest' // newest, trending, most-commented
    const page = searchParams.get('page') || '1'
    const limit = 20

    const where: Record<string, unknown> = {
      visibility: 'public', // Only fetch public posts for now
    }

    // Search in content and tags
    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    if (program) where.program = program

    const skip = (parseInt(page) - 1) * limit

    // Sort logic
    let orderBy: Record<string, unknown> = { createdAt: 'desc' } // newest by default
    if (sort === 'trending') {
      // Posts with more engagement (likes + comments) are trending
      orderBy = { likes: { _count: 'desc' } }
    } else if (sort === 'most-commented') {
      orderBy = { comments: { _count: 'desc' } }
    }

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
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
        skip,
        take: limit,
        orderBy,
      }),
      prisma.communityPost.count({ where }),
    ])

    return NextResponse.json(
      {
        posts: posts.map((p: typeof posts[0]) => ({
          ...p,
          likeCount: p._count.likes,
          commentCount: p._count.comments,
        })),
        total,
        page: parseInt(page),
        limit,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Community feed fetch error:', error)
    if (isDbUnavailableError(error)) {
      const posts = getDemoPosts()
      return NextResponse.json(
        {
          posts,
          total: posts.length,
          page: 1,
          limit: 20,
          hasMore: false,
          demoMode: true,
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validation = createPostSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { content, images, tags, program, visibility } = validation.data

    let post: any

    try {
      post = await prisma.communityPost.create({
        data: {
          authorId: userId,
          content,
          images: images || [],
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

      await prisma.auditLog.create({
        data: {
          userId,
          action: 'create_post',
          details: {
            postId: post.id,
            program,
            contentPreview: content.substring(0, 100),
          },
        },
      })
    } catch (dbError) {
      if (!isDbUnavailableError(dbError)) throw dbError
      post = {
        id: demoId('post'),
        content,
        images: images || [],
        tags: tags || [],
        createdAt: new Date(),
        author: { id: userId, name: 'Demo User', profile: { avatar: null, program: program || null } },
        _count: { likes: 0, comments: 0 },
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Post created by ${userId}`)
    }

    return NextResponse.json(
      {
        message: 'Post created successfully',
        post: {
          ...post,
          likeCount: post._count.likes,
          commentCount: post._count.comments,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
