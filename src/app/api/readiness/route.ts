import { NextResponse } from 'next/server'
import { getDefaultSite } from '@/lib/white-label/site-registry'
import { summarizeEnvChecks, validateRuntimeEnvironment } from '@/lib/white-label/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const site = getDefaultSite()
  const checks = validateRuntimeEnvironment(process.env, 'readiness')
  const summary = summarizeEnvChecks(checks)

  return NextResponse.json(
    {
      ok: summary.ok,
      service: 'mudyin-web',
      siteId: site.siteId,
      status: summary.ok ? 'ready' : 'not_ready',
      errors: summary.errors,
      warnings: summary.warnings,
      timestamp: new Date().toISOString(),
    },
    {
      status: summary.ok ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}

