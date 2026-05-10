import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isDbUnavailableError } from '@/lib/demo-fallback'

type AuthOk = {
  ok: true
  userId: string
}

type AuthRejected = {
  ok: false
  response: NextResponse
}

export type ApiAuthResult = AuthOk | AuthRejected

export async function requireSessionUser(): Promise<ApiAuthResult> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      ),
    }
  }

  return { ok: true, userId }
}

export async function requireModerator(requiredPermission?: string): Promise<ApiAuthResult> {
  const auth = await requireSessionUser()
  if (!auth.ok) return auth

  try {
    const role = await prisma.moderatorRole.findUnique({
      where: { userId: auth.userId },
      select: {
        role: true,
        permissions: true,
        revokedAt: true,
      },
    })

    const hasRole = role && !role.revokedAt
    const hasPermission =
      !requiredPermission ||
      role?.role === 'admin' ||
      role?.role === 'senior_moderator' ||
      role?.permissions.includes(requiredPermission)

    if (!hasRole || !hasPermission) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Moderator permission required' },
          { status: 403 },
        ),
      }
    }

    return auth
  } catch (error) {
    if (isDbUnavailableError(error)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Moderator authorization is unavailable' },
          { status: 503 },
        ),
      }
    }

    throw error
  }
}

