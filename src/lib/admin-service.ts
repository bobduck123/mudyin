import { randomBytes } from 'crypto'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'

export const adminRoles = ['super_admin', 'admin', 'editor'] as const
export type AdminRole = (typeof adminRoles)[number]

export const createAdminUserSchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(2).max(120),
  role: z.enum(adminRoles).refine((role) => role !== 'super_admin', {
    message: 'Additional super_admin accounts require a deliberate separate governance decision.',
  }),
  scope: z.array(z.string().trim().min(1).max(80)).default(['mudyin']),
})

export const reviewInquirySchema = z.object({
  status: z.enum(['new', 'reviewed', 'closed']),
  adminNotes: z.string().trim().max(2000).optional().or(z.literal('')),
})

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>

export function makeTemporaryPassword() {
  return [
    randomBytes(9).toString('base64url'),
    randomBytes(9).toString('base64url'),
    randomBytes(9).toString('base64url'),
  ].join('-')
}

export function canCreateAdminUsers(role?: string | null) {
  return role === 'super_admin'
}

export async function getActiveAdminProfile(userId: string) {
  return prisma.adminProfile.findFirst({
    where: {
      userId,
      status: 'active',
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  })
}

export async function createAdminUser(actorUserId: string, input: CreateAdminUserInput) {
  const actorProfile = await getActiveAdminProfile(actorUserId)

  if (!actorProfile || !canCreateAdminUsers(actorProfile.role)) {
    throw new Error('Only an active super_admin can create admin accounts.')
  }

  if (actorProfile.mustChangePassword) {
    throw new Error('The bootstrap super_admin must rotate their temporary password before creating admin accounts.')
  }

  const parsed = createAdminUserSchema.parse(input)
  const temporaryPassword = makeTemporaryPassword()
  const passwordHash = await hash(temporaryPassword, 12)

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email },
    include: { adminProfile: true },
  })

  if (existingUser?.adminProfile) {
    throw new Error('That email already has an admin account.')
  }

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: parsed.name,
          password: passwordHash,
        },
      })
    : await prisma.user.create({
        data: {
          email: parsed.email,
          name: parsed.name,
          password: passwordHash,
          dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
          ageGroup: '26+',
        },
      })

  const adminProfile = await prisma.adminProfile.create({
    data: {
      userId: user.id,
      role: parsed.role,
      status: 'active',
      scope: parsed.scope.length ? parsed.scope : ['mudyin'],
      mustChangePassword: true,
      bootstrap: false,
      createdById: actorUserId,
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: actorUserId,
      action: 'mudyin_admin_user_created',
      details: {
        targetUserId: user.id,
        targetEmail: user.email,
        role: adminProfile.role,
        scope: adminProfile.scope,
      },
    },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    adminProfile,
    temporaryPassword,
  }
}

export async function recordAdminLogin(userId: string) {
  const adminProfile = await getActiveAdminProfile(userId)
  if (!adminProfile) return null

  await prisma.adminProfile.update({
    where: { id: adminProfile.id },
    data: { lastLoginAt: new Date() },
  })

  return adminProfile
}
