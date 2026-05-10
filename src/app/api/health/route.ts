import { NextResponse } from 'next/server'
import { getDefaultSite } from '@/lib/white-label/site-registry'

export const dynamic = 'force-dynamic'

export async function GET() {
  const site = getDefaultSite()

  return NextResponse.json(
    {
      ok: true,
      service: 'mudyin-web',
      siteId: site.siteId,
      status: 'alive',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}

