import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { createAdminUser, createAdminUserSchema } from '@/lib/admin-service'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireAdminApi({ roles: ['super_admin'] })
  if (!auth.ok) return auth.response

  const users = await prisma.adminProfile.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      },
    },
  })

  return NextResponse.json({
    success: true,
    users: users.map((profile) => ({
      id: profile.id,
      userId: profile.userId,
      email: profile.user.email,
      name: profile.user.name,
      role: profile.role,
      status: profile.status,
      scope: profile.scope,
      mustChangePassword: profile.mustChangePassword,
      bootstrap: profile.bootstrap,
      createdAt: profile.createdAt,
      lastLoginAt: profile.lastLoginAt,
    })),
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi({ roles: ['super_admin'] })
  if (!auth.ok) return auth.response

  const parsed = createAdminUserSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Admin account details are invalid.',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  try {
    const result = await createAdminUser(auth.admin.userId, parsed.data)
    return NextResponse.json({
      success: true,
      user: result.user,
      adminProfile: {
        role: result.adminProfile.role,
        status: result.adminProfile.status,
        scope: result.adminProfile.scope,
        mustChangePassword: result.adminProfile.mustChangePassword,
      },
      temporaryPassword: result.temporaryPassword,
      message: 'Admin account created. Share the temporary password through a secure channel.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Admin account could not be created.',
      },
      { status: 400 },
    )
  }
}
