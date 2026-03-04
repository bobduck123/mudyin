import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Get tag suggestions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const limit = 10

    if (!search || search.length < 2) {
      return NextResponse.json({ tags: [] }, { status: 200 })
    }

    // Get photos matching the search term in tags
    const photos = await prisma.galleryPhoto.findMany({
      where: {
        tags: {
          hasSome: [search],
        },
      },
      select: { tags: true },
      take: 100,
    })

    // Collect all tags and count frequency
    const tagFrequency: Record<string, number> = {}
    photos.forEach((photo: { tags: string[] }) => {
      photo.tags.forEach((tag: string) => {
        if (tag.toLowerCase().includes(search.toLowerCase())) {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
        }
      })
    })

    // Sort by frequency and return top results
    const suggestions = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag)

    return NextResponse.json({ tags: suggestions }, { status: 200 })
  } catch (error) {
    console.error('Tags fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}
