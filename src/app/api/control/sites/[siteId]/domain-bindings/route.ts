import { NextRequest } from 'next/server'
import { authenticateControlRequest, controlJson } from '@/lib/control-plane'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await context.params
  const auth = authenticateControlRequest(request, siteId)
  if (!auth.ok) return auth.response

  return controlJson({
    siteId: auth.site.siteId,
    bindings: {
      canonical: auth.site.domains.canonical,
      aliases: auth.site.domains.aliases,
      deploymentAliases: auth.site.domains.deploymentAliases,
      redirectToCanonical: auth.site.domains.redirectToCanonical,
    },
  })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await context.params
  const auth = authenticateControlRequest(request, siteId)
  if (!auth.ok) return auth.response

  return controlJson(
    {
      siteId: auth.site.siteId,
      error: {
        code: 'domain_binding_store_missing',
        message: 'Domain binding mutation requires the control-plane database implementation.',
      },
    },
    501,
  )
}

