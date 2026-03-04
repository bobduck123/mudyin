import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadPhotoSchema } from '@/lib/validators'
import { demoId, isDbUnavailableError } from '@/lib/demo-fallback'

function getDemoPhotos() {
  return [
    {
      id: 'demo_photo_1',
      title: 'Sunrise Training Circle',
      description: 'Demo gallery item for beta mode.',
      imageUrl: 'https://picsum.photos/800/600?random=901',
      imageAlt: 'Participants training at sunrise',
      tags: ['YSMP'],
      uploader: { id: 'demo_uploader_1', name: 'Demo Photographer', profile: { avatar: null } },
      likeCount: 10,
      commentCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo_photo_2',
      title: 'Community Gathering',
      description: 'Demo gallery item for beta mode.',
      imageUrl: 'https://picsum.photos/800/600?random=902',
      imageAlt: 'Community gathering on Country',
      tags: ['community'],
      uploader: { id: 'demo_uploader_2', name: 'Demo Member', profile: { avatar: null } },
      likeCount: 7,
      commentCount: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ]
}

// GET - List photos with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const program = searchParams.get('program')
    const event = searchParams.get('event')
    const photographer = searchParams.get('photographer')
    const sort = searchParams.get('sort') || 'newest' // newest, trending, liked
    const page = searchParams.get('page') || '1'
    const limit = 20

    const where: Record<string, unknown> = {
      permissions: { not: 'verified_members_only' }, // Only public/members-only for now
    }

    // Search in title, description, tags
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ]
    }

    if (program) where.program = program
    if (event) where.event = event
    if (photographer) where.uploaderId = photographer

    const skip = (parseInt(page) - 1) * limit

    // Sort logic
    let orderBy: Record<string, unknown> = { createdAt: 'desc' } // newest
    if (sort === 'trending') {
      orderBy = { likes: { _count: 'desc' } }
    } else if (sort === 'liked') {
      orderBy = { likes: { _count: 'desc' } }
    }

    const [photos, total] = await Promise.all([
      prisma.galleryPhoto.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              profile: { select: { avatar: true } },
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
      prisma.galleryPhoto.count({ where }),
    ])

    return NextResponse.json(
      {
        photos: photos.map((p: typeof photos[0]) => ({
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
    console.error('Gallery list error:', error)
    if (isDbUnavailableError(error)) {
      const photos = getDemoPhotos()
      return NextResponse.json(
        {
          photos,
          total: photos.length,
          page: 1,
          limit: 20,
          hasMore: false,
          demoMode: true,
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

// POST - Upload new photo
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
    const validation = uploadPhotoSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const {
      title,
      description,
      imageAlt,
      tags,
      program,
      event,
      permissions,
      hasCopyright,
    } = validation.data

    // For now, use placeholder image URL
    // In production: upload to Cloudinary and get URL
    const imageUrl = `https://picsum.photos/800/600?random=${Date.now()}`

    let photo: any

    try {
      photo = await prisma.galleryPhoto.create({
        data: {
          uploaderId: userId,
          title,
          description: description || '',
          imageUrl,
          imageAlt,
          tags: tags || [],
          program: program || null,
          event: event || null,
          permissions: permissions || 'public',
          hasCopyright,
        },
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              profile: { select: { avatar: true } },
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
          action: 'upload_photo',
          details: {
            photoId: photo.id,
            title,
            program,
          },
        },
      })
    } catch (dbError) {
      if (!isDbUnavailableError(dbError)) throw dbError
      photo = {
        id: demoId('photo'),
        uploader: { id: userId, name: 'Demo Uploader', profile: { avatar: null } },
        _count: { likes: 0, comments: 0 },
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Photo uploaded by ${userId}: ${title}`)
    }

    return NextResponse.json(
      {
        message: 'Photo uploaded successfully',
        photo: {
          ...photo,
          imageUrl,
          title,
          description: description || '',
          imageAlt,
          tags: tags || [],
          likeCount: photo._count.likes,
          commentCount: photo._count.comments,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}
