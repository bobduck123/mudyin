import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { type ProgramStreamDefinition, statusLabel } from '@/lib/mudyin-operational-model'

export function ProgramStreamPublicPage({ stream }: { stream: ProgramStreamDefinition }) {
  const futurePhase = stream.status === 'future_phase'

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title={stream.name}
        subtitle={statusLabel(stream.status)}
        description={stream.summary}
        breadcrumbs={[
          { label: 'Programs', href: '/programs' },
          { label: stream.name },
        ]}
      />

      <section className="section-padding py-20 lg:py-28">
        <div className="container-mid">
          <div className="card-dark rounded-2xl p-7 md:p-10 healing-border">
            <div className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/75">
              {stream.phase}
            </div>
            <h1 className="font-display mt-5 text-3xl font-semibold text-white">Stream overview</h1>
            <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-white/70">{stream.description}</p>
            <div className="mt-8 rounded-xl border border-sage-300/25 bg-sage-900/25 p-5">
              <h2 className="text-base font-semibold text-white">Cultural care</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{stream.culturalNote}</p>
            </div>
            {futurePhase && (
              <div className="mt-6 rounded-xl border border-ochre-300/25 bg-ochre-900/20 p-5">
                <h2 className="text-base font-semibold text-white">Current public status</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  This stream is not being represented as a confirmed live service. Mudyin can receive expressions of interest while approvals, risk controls, consent pathways, and delivery scope are prepared.
                </p>
              </div>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact#booking-request" className="btn-primary text-center">
                Submit booking request
              </Link>
              <Link href="/contact#general-enquiry" className="btn-outline text-center">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Requests are reviewed before confirmation"
        subheading="Mudyin will contact you to discuss suitability, availability, consent, and next steps."
        primaryCTA={{ label: 'Contact Mudyin', href: '/contact' }}
        secondaryCTA={{ label: 'All Streams', href: '/programs' }}
      />
    </div>
  )
}
