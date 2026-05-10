import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getActiveAdminProfile, type AdminRole, adminRoles } from '@/lib/admin-service'

type RequireAdminOptions = {
  roles?: AdminRole[]
  allowPasswordChangeRequired?: boolean
}

export async function getCurrentAdmin() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id

  if (!userId) {
    return null
  }

  const adminProfile = await getActiveAdminProfile(userId)
  if (!adminProfile) {
    return null
  }

  return {
    session,
    userId,
    adminProfile,
  }
}

export async function requireAdminApi(options: RequireAdminOptions = {}) {
  const roles = options.roles ?? [...adminRoles]
  const admin = await getCurrentAdmin()

  if (!admin) {
    return {
      ok: false as const,
      response: NextResponse.json({ success: false, error: 'Admin authentication is required.' }, { status: 401 }),
    }
  }

  if (!roles.includes(admin.adminProfile.role as AdminRole)) {
    return {
      ok: false as const,
      response: NextResponse.json({ success: false, error: 'You do not have permission for this action.' }, { status: 403 }),
    }
  }

  if (admin.adminProfile.mustChangePassword && !options.allowPasswordChangeRequired) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          error: 'Password rotation is required before using the admin system.',
          code: 'password_change_required',
        },
        { status: 403 },
      ),
    }
  }

  return {
    ok: true as const,
    admin,
  }
}

export async function requireAdminPage(options: RequireAdminOptions = {}) {
  const roles = options.roles ?? [...adminRoles]
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  if (!roles.includes(admin.adminProfile.role as AdminRole)) {
    redirect('/admin')
  }

  if (admin.adminProfile.mustChangePassword && !options.allowPasswordChangeRequired) {
    redirect('/admin/first-login')
  }

  return admin
}
