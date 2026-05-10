import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'
import { ReviewEnquiryForm } from './ReviewEnquiryForm'

export const metadata: Metadata = {
  title: 'Admin Enquiries',
}

export default async function AdminEnquiriesPage() {
  await requireAdminPage()
  const enquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-wide">
        <Link href="/admin" className="text-sm text-ochre-300 hover:underline">
          Back to admin
        </Link>
        <div className="mt-5 mb-8">
          <span className="section-label">Operational Intake</span>
          <h1 className="font-display mt-3 text-4xl font-semibold text-white">Enquiries and booking requests</h1>
          <p className="mt-3 max-w-3xl text-white/65">
            Public submissions are requests for review. Booking requests are not confirmed bookings until the Mudyin team contacts the person.
          </p>
        </div>

        <div className="space-y-5">
          {enquiries.map((enquiry) => (
            <article key={enquiry.id} className="card-dark rounded-2xl p-6 healing-border">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ochre-300">{enquiry.reference}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{enquiry.name}</h2>
                  <p className="mt-1 text-sm text-white/60">
                    {enquiry.email}
                    {enquiry.phone ? ` | ${enquiry.phone}` : ''}
                  </p>
                </div>
                <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/75">
                  {enquiry.kind.replace('_', ' ')} / {enquiry.status}
                </div>
              </div>
              <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <dt className="text-white/40">Type</dt>
                  <dd className="mt-1 text-white/75">{enquiry.enquiryType}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Preferred service</dt>
                  <dd className="mt-1 text-white/75">{enquiry.preferredService || 'Not supplied'}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Preferred date/time</dt>
                  <dd className="mt-1 text-white/75">{enquiry.preferredDateTime || 'Not supplied'}</dd>
                </div>
              </dl>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-white/70">{enquiry.message}</p>
              <ReviewEnquiryForm enquiryId={enquiry.id} currentStatus={enquiry.status} />
            </article>
          ))}

          {!enquiries.length && (
            <div className="card-dark rounded-2xl p-8 text-white/65 healing-border">
              No enquiries have been captured yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
