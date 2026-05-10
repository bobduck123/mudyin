import { NextRequest, NextResponse } from 'next/server'
import { resolveSiteForHost } from '@/lib/white-label/domain-resolver'

function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/audio/') ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/favicon.ico'
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isStaticPath(pathname)) {
    return NextResponse.next()
  }

  const host = request.headers.get('host')
  const resolution = resolveSiteForHost(host, {
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
  })

  if (!resolution.site) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: 'unknown_host',
            message: 'This host is not bound to a known white-label site.',
          },
        },
        { status: 421 },
      )
    }

    const url = request.nextUrl.clone()
    url.pathname = '/site-unavailable'
    url.search = ''
    const response = NextResponse.rewrite(url)
    response.headers.set('x-anu-domain-resolution', resolution.status)
    return response
  }

  if (
    resolution.shouldRedirectToCanonical &&
    request.method === 'GET' &&
    resolution.canonicalUrl
  ) {
    const redirectUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, resolution.canonicalUrl)
    return NextResponse.redirect(redirectUrl, 308)
  }

  const response = NextResponse.next()
  response.headers.set('x-anu-site-id', resolution.site.siteId)
  response.headers.set('x-anu-tenant-scope', resolution.site.tenantScope)
  response.headers.set('x-anu-domain-resolution', resolution.status)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

