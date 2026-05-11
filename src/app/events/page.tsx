import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'

export const metadata: Metadata = {
  title: 'Events and Intakes',
  description:
    'Mudyin events and program intakes are handled by enquiry during first launch. Public event listings will be added when approved details are ready.',
}

export default function EventsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Events and Intakes"
        subtitle="First-live enquiry mode"
        description="Mudyin is not publishing live event dates or intake places during first launch. Send an enquiry and the team will confirm what is currently appropriate and available."
        breadcrumbs={[{ label: 'Events' }]}
      />

      <section className="section-padding py-20 lg:py-28" aria-label="Events first-live status">
        <div className="container-mid">
          <div className="card-dark rounded-2xl p-8 healing-border">
            <span className="section-label">No public listings yet</span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white">
              Event and intake details are confirmed directly
            </h2>
            <p className="mt-5 text-base leading-7 text-white/65">
              Public event listings, capacities, dates, and program places are paused until Mudyin
              has approved the relevant delivery details. For now, use the enquiry pathway for
              Thrive Tribe, Young Spirit Mentoring, Culture Country, or another Mudyin stream.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/programs" className="btn-outline flex-1 text-center text-sm">
                View Programs
              </Link>
              <Link href="/contact#booking-request" className="btn-primary flex-1 text-center text-sm">
                Request a Conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Ask before making plans"
        subheading="A request is reviewed by the Mudyin team before any date, place, session, or activity is treated as confirmed."
        primaryCTA={{ label: 'General Enquiry', href: '/contact#general-enquiry' }}
        secondaryCTA={{ label: 'Program Streams', href: '/programs' }}
      />
    </div>
  )
}
