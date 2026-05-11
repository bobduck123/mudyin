import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { mudyinOperatingEntity, mudyinProgramStreams, statusLabel } from '@/lib/mudyin-operational-model'

export const metadata: Metadata = {
  title: 'Programs and Streams',
  description:
    'Mudyin program streams under MUDYIN PTY LTD, with clear first-live and future-phase status.',
}

export default function ProgramsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Programs and Streams"
        subtitle={mudyinOperatingEntity.legalName}
        description="Mudyin is using a staged sub-program model. The site accepts enquiries now, while future-phase streams stay clearly labelled until operational approvals are complete."
        breadcrumbs={[{ label: 'Programs' }]}
      />

      <section className="section-padding py-20 lg:py-28" aria-label="Program streams">
        <div className="container-wide">
          <div className="mb-10 max-w-3xl">
            <span className="section-label">First-live model</span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white">Sub-programs under one operating entity</h2>
            <p className="mt-4 leading-7 text-white/65">
              Thrive Tribe, Young Spirit Mentoring, Culture Country, Mudyin Women&apos;s Business,
              Aaliyah&apos;s Dreaming, and Mirabella&apos;s Dreaming are presented as streams under{' '}
              {mudyinOperatingEntity.legalName}, not as separate live organisations. Public
              requests are reviewed by the Mudyin team before any activity is confirmed.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {mudyinProgramStreams.map((stream) => (
              <article key={stream.slug} className="card-dark flex flex-col rounded-2xl p-7 healing-border">
                <div className="inline-flex w-fit rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/75">
                  {statusLabel(stream.status)}
                </div>
                <h3 className="font-display mt-5 text-2xl font-semibold text-white">{stream.name}</h3>
                <p className="mt-2 text-sm text-ochre-200/85">{stream.phase}</p>
                <p className="mt-5 flex-1 text-sm leading-6 text-white/65">{stream.summary}</p>
                <p className="mt-5 text-xs leading-5 text-white/45">{stream.culturalNote}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/programs/${stream.slug}`} className="btn-outline flex-1 text-center text-sm">
                    View stream
                  </Link>
                  <Link href="/contact#booking-request" className="btn-primary flex-1 text-center text-sm">
                    Make request
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding py-16 healing-border-y" aria-label="Rollout discipline">
        <div className="container-mid text-center">
          <span className="section-label">Rollout Discipline</span>
          <h2 className="font-display mt-3 text-3xl font-semibold text-white">Future-phase means future-phase</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Mudyin will not publicly overstate delivery, accreditation, transport, child programs, clinical capacity, or confirmed sessions. Enquiries help the team understand demand while governance, consent, risk, and program approval controls are completed.
          </p>
          <Link href="/governance" className="btn-outline mt-8">
            Governance summary
          </Link>
        </div>
      </section>

      <CTABand
        heading="Start with an enquiry"
        subheading="Tell the Mudyin team what you are seeking. A request is reviewed before anything is treated as confirmed."
        primaryCTA={{ label: 'Booking Request', href: '/contact#booking-request' }}
        secondaryCTA={{ label: 'General Enquiry', href: '/contact#general-enquiry' }}
      />
    </div>
  )
}
