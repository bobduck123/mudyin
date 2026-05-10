import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminApi } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

const streamUpdateSchema = z.object({
  status: z.enum(['active_enquiry', 'future_phase', 'paused']).optional(),
  phase: z.string().trim().min(2).max(180).optional(),
  summary: z.string().trim().min(20).max(600).optional(),
  description: z.string().trim().min(20).max(2500).optional(),
  culturalNote: z.string().trim().max(800).optional().or(z.literal('')),
  enquiryEnabled: z.boolean().optional(),
  publicEnabled: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi({ roles: ['super_admin', 'admin'] })
  if (!auth.ok) return auth.response

  const { id } = await params
  const parsed = streamUpdateSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Program stream update is invalid.', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const stream = await prisma.programStream.update({
    where: { id },
    data: {
      ...parsed.data,
      culturalNote: parsed.data.culturalNote || undefined,
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: auth.admin.userId,
      action: 'mudyin_program_stream_updated',
      details: {
        streamId: stream.id,
        slug: stream.slug,
        status: stream.status,
      },
    },
  })

  return NextResponse.json({ success: true, stream })
}
