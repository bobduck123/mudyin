import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireModerator } from '@/lib/api-auth'

// GET - List collections
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get('page') || '1'
    const limit = 20
    const skip = (parseInt(page) - 1) * limit

    const [collections, total] = await Promise.all([
      prisma.galleryCollection.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          createdBy: { select: { name: true } },
          _count: { select: { photos: true } },
          photos: {
            select: { imageUrl: true },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.galleryCollection.count(),
    ])

    return NextResponse.json(
      {
        collections,
        total,
        page: parseInt(page),
        limit,
        hasMore: skip + limit < total,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Collections list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

// POST - Create collection (staff only)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireModerator('manage_gallery')
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const body = await request.json()
    const { name, description } = body

    if (!name || name.length < 3) {
      return NextResponse.json(
        { error: 'Collection name must be at least 3 characters' },
        { status: 400 }
      )
    }

    const collection = await prisma.galleryCollection.create({
      data: {
        name,
        description: description || '',
        createdById: userId,
      },
      include: {
        createdBy: { select: { name: true } },
        _count: { select: { photos: true } },
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'create_collection',
        details: { collectionId: collection.id, name },
      },
    })

    return NextResponse.json(
      {
        message: 'Collection created successfully',
        collection,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create collection error:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
