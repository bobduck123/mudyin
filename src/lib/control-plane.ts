import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSiteById, type WhiteLabelSiteConfig } from '@/lib/white-label/site-registry'
import { validateRuntimeEnvironment, summarizeEnvChecks } from '@/lib/white-label/env'

const DEFAULT_CONTROL_HEADER = 'x-anu-control-secret'

type ControlAuthOk = {
  ok: true
  site: WhiteLabelSiteConfig
  actor: 'control-plane'
}

type ControlAuthRejected = {
  ok: false
  response: NextResponse
}

export type ControlAuthResult = ControlAuthOk | ControlAuthRejected

function safeCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

function getControlHeaderName(): string {
  return (process.env.CONTROL_PLANE_SECRET_HEADER || process.env.CONTROL_SMOKE_AUTH_HEADER || DEFAULT_CONTROL_HEADER)
    .trim()
    .toLowerCase()
}

export function getControlSmokeHeaderName(): string {
  return getControlHeaderName()
}

export function authenticateControlRequest(
  request: NextRequest,
  siteId: string,
): ControlAuthResult {
  const site = getSiteById(siteId)
  if (!site) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: 'unknown_site', message: 'Unknown site ID' } },
        { status: 404 },
      ),
    }
  }

  const envSummary = summarizeEnvChecks(validateRuntimeEnvironment(process.env, 'control'))
  if (envSummary.errors.some((check) => check.name === 'CONTROL_PLANE_SECRET')) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: {
            code: 'control_plane_not_configured',
            message: 'Control-plane authentication is not configured.',
          },
        },
        { status: 503 },
      ),
    }
  }

  const headerName = getControlHeaderName()
  const suppliedSecret = request.headers.get(headerName)
  if (!suppliedSecret) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: {
            code: 'missing_control_header',
            message: `Missing required control-plane header: ${headerName}`,
          },
        },
        { status: 401 },
      ),
    }
  }

  const expectedSecret = process.env.CONTROL_PLANE_SECRET || ''
  if (!safeCompare(suppliedSecret, expectedSecret)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: {
            code: 'invalid_control_secret',
            message: 'Invalid control-plane credentials.',
          },
        },
        { status: 403 },
      ),
    }
  }

  console.info(
    JSON.stringify({
      event: 'control_plane_access',
      siteId,
      path: request.nextUrl.pathname,
      method: request.method,
      at: new Date().toISOString(),
    }),
  )

  return { ok: true, site, actor: 'control-plane' }
}

export function controlJson(data: Record<string, unknown>, status = 200) {
  return NextResponse.json({ ok: status < 400, ...data }, { status })
}

