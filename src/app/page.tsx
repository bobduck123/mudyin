import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroSection }       from '@/components/sections/HeroSection'
import { ProgramsShowcase }  from '@/components/sections/ProgramsShowcase'
import { CTABand }           from '@/components/sections/CTABand'
import { getDefaultSite }    from '@/lib/white-label/site-registry'
import { mudyinGovernanceControls, mudyinOperatingEntity } from '@/lib/mudyin-operational-model'

const defaultSite = getDefaultSite()

export const metadata: Metadata = {
  title: 'Mudyin Aboriginal Healing Centre - Two Worlds Strong',
  description:
    'Mudyin is a culturally grounded healing-centre site operating under MUDYIN PTY LTD, accepting first-live enquiries and booking requests while future-phase streams are prepared carefully.',
  openGraph: {
    title:       'Mudyin Aboriginal Healing Centre - Two Worlds Strong',
    description: 'First-live Mudyin enquiries, booking requests, and staged program streams under MUDYIN PTY LTD.',
  },
}

// Schema.org structured data
function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    ['Organization'],
    name:             'Mudyin Aboriginal Healing Centre',
    alternateName:    'Mudyin',
    url:              defaultSite.metadata.url,
    legalName:         mudyinOperatingEntity.legalName,
    description:      'Culturally grounded Mudyin program-stream site accepting enquiries and booking requests in a staged first-live mode.',
    contactPoint: [{
      '@type':       'ContactPoint',
      telephone:     '+61478796298',
      contactType:   'customer service',
      availableLanguage: 'English',
    }],
    address: {
      '@type':          'PostalAddress',
      addressLocality:  'Campbelltown',
      addressRegion:    'NSW',
      postalCode:       '2560',
      addressCountry:   'AU',
    },
    sameAs: [
      'https://facebook.com/mudyin',
      'https://instagram.com/mudyin',
      'https://youtube.com/@mudyin',
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <HeroSection />
      <ProgramsShowcase />
      <section className="section-padding py-20 healing-border-y" aria-label="Governance controls">
        <div className="container-wide">
          <div className="mb-10 max-w-3xl">
            <span className="section-label">Operational Readiness</span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white">Controlled growth, not overstatement</h2>
            <p className="mt-4 leading-7 text-white/65">
              Mudyin&apos;s first-live site is designed to take enquiries safely while governance, consent, program approval, risk, and document-control pathways are kept visible.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {mudyinGovernanceControls.map((control) => (
              <article key={control.title} className="card-dark rounded-2xl p-6 healing-border">
                <h3 className="text-lg font-semibold text-white">{control.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{control.summary}</p>
              </article>
            ))}
          </div>
          <Link href="/governance" className="btn-outline mt-8">
            View governance summary
          </Link>
        </div>
      </section>
      <CTABand
        heading="Ready to talk with Mudyin?"
        subheading="Send a booking request or enquiry and the team will come back to you with the right next step."
        primaryCTA={{ label: 'Request a Program Place', href: '/contact#booking-request' }}
        secondaryCTA={{ label: 'General Enquiry', href: '/contact#general-enquiry' }}
      />
    </>
  )
}
