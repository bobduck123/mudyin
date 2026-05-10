import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const auth = await requireAdminApi()
  if (!auth.ok) return auth.response

  const streams = await prisma.programStream.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({ success: true, streams })
}
