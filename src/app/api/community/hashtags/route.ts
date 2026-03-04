import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Search/fetch trending hashtags
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const type = searchParams.get('type') || 'trending' // trending, search

    const hashtags: Record<string, number> = {}

    if (type === 'search' && search) {
      // Search for hashtags containing the search term
      const posts = await prisma.communityPost.findMany({
        where: {
          tags: {
            hasSome: [search],
          },
        },
        select: { tags: true },
        take: 100,
      })

      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(search.toLowerCase())) {
            hashtags[tag] = (hashtags[tag] || 0) + 1
          }
        })
      })
    } else if (type === 'trending') {
      // Get all hashtags and count occurrences from recent posts
      const posts = await prisma.communityPost.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        select: { tags: true },
      })

      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          hashtags[tag] = (hashtags[tag] || 0) + 1
        })
      })
    }

    // Convert to array and sort by count
    const result = Object.entries(hashtags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20) // Return top 20
      .map(([tag, count]) => ({
        tag,
        count,
      }))

    return NextResponse.json(
      {
        hashtags: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Hashtag fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hashtags' },
      { status: 500 }
    )
  }
}
