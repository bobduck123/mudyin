import { NextRequest } from 'next/server'
import { authenticateControlRequest, controlJson } from '@/lib/control-plane'
import { summarizeEnvChecks, validateRuntimeEnvironment } from '@/lib/white-label/env'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await context.params
  const auth = authenticateControlRequest(request, siteId)
  if (!auth.ok) return auth.response

  const checks = validateRuntimeEnvironment(process.env, 'readiness')
  const summary = summarizeEnvChecks(checks)

  return controlJson(
    {
      siteId: auth.site.siteId,
      ready: summary.ok,
      errors: summary.errors,
      warnings: summary.warnings,
      requiredPublicRoutes: auth.site.publicRoutes,
    },
    summary.ok ? 200 : 503,
  )
}

