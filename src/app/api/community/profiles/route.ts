import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateProfileSchema } from '@/lib/validators'
import { requireSessionUser } from '@/lib/api-auth'

// GET current user's profile or search members
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const search = searchParams.get('search')
    const program = searchParams.get('program')
    const page = searchParams.get('page') || '1'
    const limit = 20

    // If searching for specific user
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          profile: {
            select: {
              bio: true,
              avatar: true,
              program: true,
              badges: true,
              privacyLevel: true,
            },
          },
          followers: {
            select: { id: true },
          },
          following: {
            select: { id: true },
          },
          _count: {
            select: {
              posts: true,
              photos: true,
              comments: true,
              followers: true,
              following: true,
            },
          },
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(user, { status: 200 })
    }

    // Search/filter members
    const where: Record<string, unknown> = {}
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }
    if (program) {
      where.profile = { program }
    }

    const skip = (parseInt(page) - 1) * limit

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          createdAt: true,
          profile: {
            select: {
              bio: true,
              avatar: true,
              program: true,
              badges: true,
            },
          },
          _count: {
            select: {
              followers: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json(
      {
        members,
        total,
        page: parseInt(page),
        limit,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile search error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}

// PUT - Update own profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    // Validate input
    const validation = updateProfileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { bio, program, privacyLevel } = validation.data

    // Update or create profile
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        bio,
        program,
        privacyLevel,
      },
      create: {
        userId,
        bio,
        program,
        privacyLevel,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'update_profile',
        details: { updated_fields: Object.keys(body) },
      },
    })

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        profile,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
