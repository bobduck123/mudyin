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
    assignments: [],
    message: 'No operator-assignment store is configured in this repo yet.',
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
        code: 'operator_assignment_store_missing',
        message: 'Operator assignment mutation requires the control-plane database implementation.',
      },
    },
    501,
  )
}

