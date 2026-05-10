import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireAdminApi({ allowPasswordChangeRequired: true })
  if (!auth.ok) return auth.response

  return NextResponse.json({
    success: true,
    admin: {
      id: auth.admin.userId,
      email: auth.admin.adminProfile.user.email,
      name: auth.admin.adminProfile.user.name,
      role: auth.admin.adminProfile.role,
      status: auth.admin.adminProfile.status,
      scope: auth.admin.adminProfile.scope,
      mustChangePassword: auth.admin.adminProfile.mustChangePassword,
      bootstrap: auth.admin.adminProfile.bootstrap,
    },
  })
}
