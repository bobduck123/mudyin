import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Mudyin Aboriginal Healing Centre builds genuine partnerships with organisations that share our commitment to Aboriginal community wellbeing, self-determination, and culturally safe services.',
}

export default function PartnersPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Partners"
        subtitle="Walking Together"
        description="Genuine partnerships built on shared values, mutual respect, and a commitment to Aboriginal community wellbeing."
        breadcrumbs={[
          { label: 'About', href: '/about/our-story' },
          { label: 'Partners' },
        ]}
      />

      {/* Partnership philosophy */}
      <section className="section-padding py-20 lg:py-28" aria-label="Partnership philosophy">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="section-label">Our Approach</span>
              <h2
                className="font-display font-semibold text-3xl lg:text-4xl mt-3 mb-8"
                style={{ color: 'var(--color-foreground)' }}
              >
                Partnerships Rooted in Community
              </h2>
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Mudyin does not enter into partnerships lightly. Every partner relationship we build
                is founded on three things: shared values, genuine respect for Aboriginal
                self-determination, and a commitment to putting community first.
              </p>
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                We partner with government agencies, health services, education providers,
                businesses, and community organisations — but in every case, the partnership
                must be community-led and culturally safe.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Our partnerships are growing. As Mudyin expands its reach into Queensland and
                broadens its service offering, we are actively seeking new partners who share
                our vision for Aboriginal community wellbeing.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Community Health Services',
                  description:
                    'Health service partnerships that extend Mudyin\'s reach to Aboriginal people who need clinical and community support.',
                },
                {
                  title: 'Education & Schools',
                  description:
                    'Working with local schools to support YSMP participants\' attendance, engagement, and educational aspirations.',
                },
                {
                  title: 'Government Funding Bodies',
                  description:
                    'Strategic partnerships with government that maintain Aboriginal community control and self-determination.',
                },
                {
                  title: 'Local Businesses',
                  description:
                    'Corporate partners who support our work through donations, employment pathways, and community sponsorship.',
                },
              ].map((type) => (
                <div
                  key={type.title}
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(65,70,72,0.4)',
                  }}
                >
                  <h3
                    className="font-display font-semibold text-base mb-2"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {type.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon notice */}
      <section
        className="section-padding py-16"
        style={{
          background:
            'linear-gradient(135deg, rgba(210,168,85,0.06) 0%, rgba(20,20,20,0) 100%)',
          borderTop: '1px solid rgba(210,168,85,0.15)',
          borderBottom: '1px solid rgba(210,168,85,0.15)',
        }}
        aria-label="Partner listing coming soon"
      >
        <div className="container-mid text-center">
          <span className="section-label">Growing Network</span>
          <h2
            className="font-display font-semibold text-3xl mt-3 mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            Our Partner Network Is Expanding
          </h2>
          <p
            className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.68)' }}
          >
            We are in the process of formalising our partner relationships as we grow. A full
            directory of Mudyin partners and supporters will be published here soon. If your
            organisation is interested in partnering with us, we would love to talk.
          </p>
          <Link href="/contact?type=partnership" className="btn-primary">
            Enquire About Partnership
          </Link>
        </div>
      </section>

      {/* Partnership principles */}
      <section className="section-padding py-20" aria-label="Partnership principles">
        <div className="container-wide">
          <div className="text-center mb-14">
            <span className="section-label">What We Stand For</span>
            <h2
              className="font-display font-semibold text-3xl mt-3"
              style={{ color: 'var(--color-foreground)' }}
            >
              Our Partnership Principles
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Community Consent',
                description:
                  'All partnerships are endorsed by Mudyin leadership and are consistent with community expectations and cultural protocols.',
              },
              {
                number: '02',
                title: 'Cultural Safety',
                description:
                  'Partner organisations are expected to engage with cultural safety training and respect Aboriginal ways of knowing, being, and doing.',
              },
              {
                number: '03',
                title: 'Mutual Benefit',
                description:
                  'Partnerships must generate genuine benefit for Aboriginal community — not just positive publicity for the partner.',
              },
              {
                number: '04',
                title: 'Long-Term Commitment',
                description:
                  'We prioritise partners who are committed to a long-term relationship over transactional, short-term arrangements.',
              },
              {
                number: '05',
                title: 'Transparency',
                description:
                  'Financial and programmatic partnership arrangements are transparent and consistent with Mudyin\'s governance obligations.',
              },
              {
                number: '06',
                title: 'Aboriginal Leadership',
                description:
                  'Aboriginal community voices lead the direction of all partnerships. Our partners support — they do not set — our agenda.',
              },
            ].map((principle) => (
              <div
                key={principle.number}
                className="rounded-2xl p-7"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(65,70,72,0.4)',
                }}
              >
                <p
                  className="font-display font-bold text-3xl mb-4"
                  style={{ color: 'var(--color-ochre-400)', opacity: 0.5 }}
                >
                  {principle.number}
                </p>
                <h3
                  className="font-display font-semibold text-lg mb-3"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {principle.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Walk With Us"
        subheading="If your organisation shares our commitment to Aboriginal community wellbeing and self-determination, we welcome a conversation about partnership."
        primaryCTA={{ label: 'Get in Touch', href: '/contact?type=partnership' }}
        secondaryCTA={{ label: 'Our Story', href: '/about/our-story' }}
      />
    </div>
  )
}
