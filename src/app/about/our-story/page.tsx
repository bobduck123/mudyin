import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { AcknowledgementOfCountry } from '@/components/cultural/AcknowledgementOfCountry'
import { CTABand } from '@/components/sections/CTABand'
import { timeline, teamMembers } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Twenty-five years of Aboriginal-led healing, mentoring, and community building. From Uncle Dave Bell\'s Father & Sons Program in 2001 to the Mudyin Aboriginal Healing Centre today — a story of community, culture, and strength.',
}

const founder = teamMembers.find((m) => m.id === 'uncle-dave')!

export default function OurStoryPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Story"
        subtitle="25 Years of Purpose"
        description="Built on community, grounded in culture, and driven by the belief that every Aboriginal young person deserves to thrive."
        breadcrumbs={[
          { label: 'About', href: '/about/our-story' },
          { label: 'Our Story' },
        ]}
      />

      {/* Origin story */}
      <section className="section-padding py-20 lg:py-28" aria-label="Our origin">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label">Where It Began</span>
              <h2
                className="font-display font-semibold text-3xl lg:text-4xl mt-3 mb-8"
                style={{ color: 'var(--color-foreground)' }}
              >
                A Father Who Saw What Was Needed
              </h2>
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                In 2001, Uncle Dave Bell looked at his community and saw young Aboriginal men
                drifting — without direction, without mentorship, without a sense of purpose. He
                had no funding, no formal structure, and no blueprint. What he had was community,
                culture, and a deep understanding that belonging is the foundation of everything.
              </p>
              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                He started the Father &amp; Sons Program — gathering young men at dawn for fitness,
                breakfast, and conversation. The model was simple: show up, move your body, sit
                together, talk. From that seed, something extraordinary grew.
              </p>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Over 25 years, that program became the Young Spirit Mentoring Program, then Thrive
                Tribe, then the Mudyin Aboriginal Healing Centre — a full-spectrum organisation
                serving communities across NSW and Queensland.
              </p>
              <Link href="/about/team" className="btn-outline">
                Meet Our Leadership
              </Link>
            </div>

            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden aspect-square relative"
                style={{ border: '1px solid rgba(210,168,85,0.2)' }}
              >
                <Image
                  src={founder.image}
                  alt={founder.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(20,20,20,0.75) 0%, transparent 60%)',
                  }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="font-display font-semibold text-xl mb-1"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {founder.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {founder.role} — Mudyin Aboriginal Healing Centre
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section
        className="section-padding py-16"
        style={{
          background:
            'linear-gradient(135deg, rgba(210,168,85,0.07) 0%, rgba(20,20,20,0) 100%)',
          borderTop: '1px solid rgba(210,168,85,0.15)',
          borderBottom: '1px solid rgba(210,168,85,0.15)',
        }}
        aria-label="Founder quote"
      >
        <div className="container-mid text-center">
          <p
            className="font-display text-2xl lg:text-3xl font-semibold italic leading-relaxed mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            &ldquo;{founder.quote}&rdquo;
          </p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-ochre-400)' }}>
            {founder.name} &mdash; {founder.role}, Mudyin Aboriginal Healing Centre
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding py-20 lg:py-28" aria-label="Our history">
        <div className="container-mid">
          <div className="text-center mb-16">
            <span className="section-label">25 Years of Purpose</span>
            <h2
              className="font-display font-semibold text-3xl lg:text-4xl mt-3"
              style={{ color: 'var(--color-foreground)' }}
            >
              A Journey Built Together
            </h2>
          </div>

          <ol
            className="relative"
            aria-label="Mudyin history timeline"
            style={{ borderLeft: '2px solid rgba(210,168,85,0.25)' }}
          >
            {timeline.map((item, _index) => (
              <li
                key={item.year}
                className="relative pl-10 pb-12 last:pb-0"
              >
                {/* Dot */}
                <div
                  className="absolute left-0 top-0 w-4 h-4 rounded-full -translate-x-[9px]"
                  style={{ backgroundColor: 'var(--color-ochre-500)' }}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-6">
                  <span
                    className="font-display font-bold text-3xl flex-shrink-0 w-16"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {item.year}
                  </span>
                  <div>
                    <h3
                      className="font-display font-semibold text-xl mb-2"
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-base leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.68)' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values section */}
      <section
        className="section-padding py-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(210,168,85,0.04) 100%)',
          borderTop: '1px solid rgba(65,70,72,0.3)',
        }}
        aria-label="Our values"
      >
        <div className="container-wide">
          <div className="text-center mb-16">
            <span className="section-label">What Drives Us</span>
            <h2
              className="font-display font-semibold text-3xl lg:text-4xl mt-3"
              style={{ color: 'var(--color-foreground)' }}
            >
              Grounded in Culture. Led by Community.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Self-Determination',
                description:
                  'Mudyin is Aboriginal-led, Aboriginal-owned, and accountable to Aboriginal community. Our people set the direction.',
              },
              {
                title: 'Cultural Grounding',
                description:
                  'Culture is not an add-on to our programs — it is the foundation. Language, land, and ceremony are part of healing.',
              },
              {
                title: 'Strength-Based',
                description:
                  'We see the strength in every young person and every family. Our work builds on what is already there.',
              },
              {
                title: 'Genuine Partnership',
                description:
                  'We walk alongside — not in front of — our communities. Real partnership means listening first.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl p-7"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(65,70,72,0.4)',
                }}
              >
                <h3
                  className="font-display font-semibold text-lg mb-3"
                  style={{ color: 'var(--color-ochre-400)' }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acknowledgement of Country — full variant */}
      <section className="section-padding py-8" aria-label="Acknowledgement of Country">
        <div className="container-mid">
          <AcknowledgementOfCountry variant="full" />
        </div>
      </section>

      <CTABand
        heading="Be Part of the Next 25 Years"
        subheading="Mudyin's story is still being written — by every young person who rises at dawn, every Elder who shares their wisdom, and every supporter who believes in our community."
        primaryCTA={{ label: 'Support Our Work', href: '/donate' }}
        secondaryCTA={{ label: 'Our Programs', href: '/programs' }}
      />
    </div>
  )
}
