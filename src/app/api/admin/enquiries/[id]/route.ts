import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { reviewInquirySchema } from '@/lib/admin-service'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const { id } = await params
  const parsed = reviewInquirySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Enquiry review details are invalid.', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const enquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes || null,
      reviewedById: auth.admin.userId,
      reviewedAt: new Date(),
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: auth.admin.userId,
      action: 'mudyin_inquiry_reviewed',
      details: {
        inquiryId: enquiry.id,
        reference: enquiry.reference,
        status: enquiry.status,
      },
    },
  })

  return NextResponse.json({ success: true, enquiry })
}
