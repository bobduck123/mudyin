import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const enquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return NextResponse.json({
    success: true,
    enquiries,
  })
}
