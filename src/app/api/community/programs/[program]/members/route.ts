import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ program: string }> }
) {
  try {
    const { program: rawProgram } = await params
    const program = decodeURIComponent(rawProgram)
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const _sort = searchParams.get('sort') || 'newest' // newest, most-posts
    const page = searchParams.get('page') || '1'
    const limit = 20

    // Validate program
    const validPrograms = ['YSMP', 'Thrive Tribe', 'Healing Centre']
    if (!validPrograms.includes(program)) {
      return NextResponse.json(
        { error: 'Invalid program' },
        { status: 400 }
      )
    }

    const skip = (parseInt(page) - 1) * limit

    // Build where clause to find users in program
    const where: Record<string, unknown> = {}

    if (search) {
      where.user = {
        name: { contains: search, mode: 'insensitive' },
      }
    }

    where.program = program

    // Sort logic
    const orderBy: Record<string, unknown> = { enrolledAt: 'desc' } // newest joined by default

    const [enrollments, total] = await Promise.all([
      prisma.userProgramEnrollment.findMany({
        where,
        include: {
          user: {
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
              _count: {
                select: { posts: true, followers: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.userProgramEnrollment.count({ where }),
    ])

    const members = enrollments.map((e) => ({
      userId: e.user.id,
      name: e.user.name,
      avatar: e.user.profile?.avatar,
      bio: e.user.profile?.bio,
      badges: e.user.profile?.badges || [],
      enrolledAt: e.enrolledAt,
      postCount: e.user._count.posts,
      followerCount: e.user._count.followers,
    }))

    return NextResponse.json(
      {
        members,
        total,
        page: parseInt(page),
        limit,
        hasMore: skip + limit < total,
        program,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Program members fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch program members' },
      { status: 500 }
    )
  }
}
