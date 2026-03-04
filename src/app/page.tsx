import type { Metadata } from 'next'
import { HeroSection }       from '@/components/sections/HeroSection'
import { ProgramsShowcase }  from '@/components/sections/ProgramsShowcase'
import { ImpactCarousel }    from '@/components/sections/ImpactCarousel'
import { TimelineSection }   from '@/components/sections/TimelineSection'
import { TestimonialsGrid }  from '@/components/sections/TestimonialsGrid'
import { CTABand }           from '@/components/sections/CTABand'

export const metadata: Metadata = {
  title: 'Mudyin Aboriginal Healing Centre — Two Worlds Strong',
  description:
    'Mudyin Aboriginal Healing Centre delivers the Young Spirit Mentoring Program, Thrive Tribe, and culturally grounded healing services for Aboriginal communities in NSW and Queensland. 25+ years of community-led healing.',
  openGraph: {
    title:       'Mudyin Aboriginal Healing Centre — Two Worlds Strong',
    description: '25 years of Aboriginal-led youth mentoring, fitness, and healing. Campbelltown NSW.',
  },
}

// Schema.org structured data
function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    ['Organization', 'NGO'],
    name:             'Mudyin Aboriginal Healing Centre',
    alternateName:    'Mudyin',
    url:              'https://mudyin.org.au',
    foundingDate:     '2001',
    foundingLocation: 'Campbelltown, NSW, Australia',
    description:      'Aboriginal-led healing centre delivering the Young Spirit Mentoring Program (YSMP), Thrive Tribe, and culturally grounded healing services.',
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
    nonprofitStatus: 'RegisteredNonprofit',
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
      <ImpactCarousel />
      <TimelineSection />
      <TestimonialsGrid />
      <CTABand
        heading="Ready to Join Our Community?"
        subheading="The Young Spirit Mentoring Program and Thrive Tribe are open. Come as you are — we walk together from here."
        primaryCTA={{ label: 'Enroll in a Program', href: '/enroll' }}
        secondaryCTA={{ label: 'Our Story', href: '/about/our-story' }}
      />
    </>
  )
}
