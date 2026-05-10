import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateControlRequest, controlJson } from '@/lib/control-plane'
import { getSiteById } from '@/lib/white-label/site-registry'

const bootstrapSchema = z.object({
  siteId: z.string().min(1),
})

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = bootstrapSchema.safeParse(body)
  if (!parsed.success) {
    return controlJson(
      {
        error: {
          code: 'invalid_bootstrap_payload',
          message: 'Expected JSON body with siteId.',
        },
      },
      400,
    )
  }

  const auth = authenticateControlRequest(request, parsed.data.siteId)
  if (!auth.ok) return auth.response

  const site = getSiteById(parsed.data.siteId)
  if (!site) {
    return controlJson({ error: { code: 'unknown_site', message: 'Unknown site ID.' } }, 404)
  }

  return controlJson({
    siteId: site.siteId,
    tenantScope: site.tenantScope,
    canonicalDomain: site.domains.canonical,
    message: 'Site bootstrap is idempotent. Apply database/domain steps from the launch checklist.',
  })
}

