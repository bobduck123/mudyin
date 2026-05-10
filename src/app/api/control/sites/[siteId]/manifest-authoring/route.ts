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

  const { site } = auth
  return controlJson({
    siteId: site.siteId,
    tenantScope: site.tenantScope,
    manifest: {
      canonicalName: site.canonicalName,
      shortName: site.shortName,
      domains: site.domains,
      enabledModules: site.enabledModules,
      featureFlags: site.featureFlags,
      publicRoutes: site.publicRoutes,
      legal: site.legal,
      contact: {
        email: site.contact.email,
        phone: site.contact.phone,
      },
    },
  })
}

