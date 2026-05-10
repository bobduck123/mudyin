import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { programs } from '@/lib/data'

const program = programs[1]

export const metadata: Metadata = {
  title: program.name,
  description: program.shortDescription,
}

export default function ThriveTribePage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title={program.name}
        subtitle={program.tagline}
        description={program.shortDescription}
        image={program.image}
        imageAlt={program.imageAlt}
        breadcrumbs={[
          { label: 'Programs', href: '/programs' },
          { label: program.name },
        ]}
        ctaLabel="Request a Thrive Tribe Place"
        ctaHref="/contact#booking-request"
      />

      {/* Main content */}
      <section className="section-padding py-20 lg:py-28" aria-label="Program description">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Main description */}
            <div className="lg:col-span-2">
              <span className="section-label">About the Program</span>
              <h2
                className="font-display font-semibold text-3xl lg:text-4xl mt-3 mb-8"
                style={{ color: 'var(--color-foreground)' }}
              >
                Wholeness in 9 Days
              </h2>

              {program.description.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed mb-6"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {para}
                </p>
              ))}

              <p
                className="text-lg leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Thrive Tribe understands that health is not just physical. It is the quality of your
                relationships, your connection to Country, your emotional wellbeing, and the stories
                you tell yourself about who you are. The program is designed to nurture all of these
                dimensions in a safe, culturally grounded environment.
              </p>

              <p
                className="text-lg leading-relaxed mb-10"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Whether you are taking your first steps toward better health, recovering from a difficult
                period, or simply seeking community and renewal — Thrive Tribe meets you exactly where
                you are.
              </p>

              {/* Features */}
              <div
                className="rounded-2xl p-8 mb-10"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(65,70,72,0.4)',
                }}
              >
                <h3
                  className="font-display font-semibold text-xl mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  What Thrive Tribe Includes
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4" aria-label="Program features">
                  {program.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      <span
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#9DC183' }}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(157,193,131,0.07), rgba(157,193,131,0.02))',
                  border: '1px solid rgba(157,193,131,0.2)',
                }}
              >
                <h3
                  className="font-display font-semibold text-xl mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Program Outcomes
                </h3>
                <ul className="space-y-3" aria-label="Program outcomes">
                  {program.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#9DC183' }}
                        aria-hidden="true"
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Queensland expansion callout */}
              <div
                className="mt-10 rounded-2xl p-7"
                style={{
                  background: 'linear-gradient(135deg, rgba(184,117,85,0.1), rgba(210,168,85,0.05))',
                  border: '1px solid rgba(210,168,85,0.2)',
                }}
              >
                <h3
                  className="font-display font-semibold text-lg mb-3"
                  style={{ color: 'var(--color-ochre-400)' }}
                >
                  Now Expanding to Queensland
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Thrive Tribe is growing — bringing its community wellness model to North Stradbroke
                  Island (Minjerribah), Queensland. If you are on Country or connected to the QLD
                  community, express your interest today.
                </p>
                <Link
                  href="/contact?type=program"
                  className="btn-outline text-sm"
                >
                  Express Interest — QLD Intake
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside aria-label="Program details">
              <div
                className="rounded-2xl p-7 mb-8 sticky top-28"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(65,70,72,0.4)',
                }}
              >
                <h3
                  className="font-display font-semibold text-lg mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Program Details
                </h3>

                <dl className="space-y-5">
                  <div>
                    <dt
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-ochre-500)' }}
                    >
                      Format
                    </dt>
                    <dd>
                      {program.schedule.map((s) => (
                        <p
                          key={s}
                          className="text-sm mb-1"
                          style={{ color: 'rgba(255,255,255,0.75)' }}
                        >
                          {s}
                        </p>
                      ))}
                    </dd>
                  </div>

                  <div
                    style={{ borderTop: '1px solid rgba(65,70,72,0.4)', paddingTop: '1.25rem' }}
                  >
                    <dt
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-ochre-500)' }}
                    >
                      Locations
                    </dt>
                    <dd
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {program.location}
                    </dd>
                  </div>

                  <div
                    style={{ borderTop: '1px solid rgba(65,70,72,0.4)', paddingTop: '1.25rem' }}
                  >
                    <dt
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-ochre-500)' }}
                    >
                      Who Can Join
                    </dt>
                    <dd
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {program.targetAudience}
                    </dd>
                  </div>

                  {program.enrollmentOpen && (
                    <div
                      className="rounded-xl p-3 text-center text-sm font-semibold"
                      style={{
                        backgroundColor: 'rgba(157,193,131,0.1)',
                        border: '1px solid rgba(157,193,131,0.3)',
                        color: '#9DC183',
                      }}
                    >
                      Requests Open
                    </div>
                  )}
                </dl>

                <Link
                  href="/contact#booking-request"
                  className="btn-primary w-full text-center mt-8 block"
                >
                  Request a Thrive Tribe Place
                </Link>

                <Link
                  href="/contact"
                  className="btn-outline w-full text-center mt-3 block"
                >
                  Ask a Question
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section
        className="section-padding py-16"
        style={{
          background:
            'linear-gradient(135deg, rgba(157,193,131,0.05) 0%, rgba(20,20,20,0.0) 100%)',
          borderTop: '1px solid rgba(157,193,131,0.15)',
        }}
        aria-label="CEO quote"
      >
        <div className="container-mid text-center">
          <p
            className="font-display text-2xl lg:text-3xl font-semibold italic leading-relaxed mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            &ldquo;Health doesn&apos;t look the same for everyone, and it shouldn&apos;t.
            Thrive Tribe meets people where they are — and that approach works
            even better on Country.&rdquo;
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--color-ochre-400)' }}
          >
            Kaiyu Bayles &mdash; CEO, Mudyin Aboriginal Healing Centre
          </p>
        </div>
      </section>

      <CTABand
        heading="Ready to Thrive?"
        subheading="The next Thrive Tribe intake is open for requests. Take the first step — your community is waiting."
        primaryCTA={{ label: 'Request a Thrive Tribe Place', href: '/enroll/thrive-tribe' }}
        secondaryCTA={{ label: 'Contact Us', href: '/contact' }}
      />
    </div>
  )
}
