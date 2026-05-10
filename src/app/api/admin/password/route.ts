import { NextRequest, NextResponse } from 'next/server'
import { compare, hash } from 'bcryptjs'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(14).max(160),
})

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi({ allowPasswordChangeRequired: true })
  if (!auth.ok) return auth.response

  const parsed = passwordSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Enter the current password and a new password of at least 14 characters.' },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.admin.userId },
    select: { id: true, password: true },
  })

  if (!user?.password) {
    return NextResponse.json({ success: false, error: 'Admin account is missing a password credential.' }, { status: 400 })
  }

  const valid = await compare(parsed.data.currentPassword, user.password)
  if (!valid) {
    return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: await hash(parsed.data.newPassword, 12) },
    }),
    prisma.adminProfile.update({
      where: { userId: user.id },
      data: { mustChangePassword: false },
    }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'mudyin_admin_password_rotated',
        details: { firstLoginPasswordResetSatisfied: true },
      },
    }),
  ])

  return NextResponse.json({ success: true, message: 'Password updated. Admin access is now active.' })
}
