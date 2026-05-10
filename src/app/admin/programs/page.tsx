import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Admin Program Streams',
}

export default async function AdminProgramStreamsPage() {
  await requireAdminPage()
  const streams = await prisma.programStream.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-wide">
        <Link href="/admin" className="text-sm text-ochre-300 hover:underline">
          Back to admin
        </Link>
        <div className="mt-5 mb-8">
          <span className="section-label">Program Control</span>
          <h1 className="font-display mt-3 text-4xl font-semibold text-white">Program streams</h1>
          <p className="mt-3 max-w-3xl text-white/65">
            Streams belong under MUDYIN PTY LTD. Future-phase streams should stay labelled as future until governance and delivery controls are approved.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {streams.map((stream) => (
            <article key={stream.id} className="card-dark rounded-2xl p-6 healing-border">
              <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 inline-flex">
                {stream.status.replace('_', ' ')}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">{stream.name}</h2>
              <p className="mt-2 text-sm text-white/50">{stream.phase}</p>
              <p className="mt-4 text-sm leading-6 text-white/65">{stream.summary}</p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Public</dt>
                  <dd className="text-white/70">{stream.publicEnabled ? 'Enabled' : 'Disabled'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Enquiries</dt>
                  <dd className="text-white/70">{stream.enquiryEnabled ? 'Enabled' : 'Disabled'}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
