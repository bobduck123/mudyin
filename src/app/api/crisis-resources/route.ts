import { NextRequest, NextResponse } from 'next/server'
import { CRISIS_HOTLINES } from '@/lib/moderation'

/**
 * Get crisis resources / hotline numbers
 * Can filter by support type or region
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supportType = searchParams.get('type')
    const region = searchParams.get('region') || 'Australia'

    let resources = CRISIS_HOTLINES.filter((r) => r.region === region)

    if (supportType) {
      resources = resources.filter(
        (r) => r.supportTypes && r.supportTypes.includes(supportType)
      )
    }

    return NextResponse.json(
      {
        resources,
        count: resources.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    )
  } catch (error) {
    console.error('Crisis resources fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crisis resources' },
      { status: 500 }
    )
  }
}
