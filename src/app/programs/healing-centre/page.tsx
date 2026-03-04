import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { programs } from '@/lib/data'

const program = programs[2]

export const metadata: Metadata = {
  title: program.name,
  description: program.shortDescription,
}

export default function HealingCentrePage() {
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
        ctaLabel="Book an Appointment"
        ctaHref="/contact?type=program"
      />

      {/* Safe space notice */}
      <div
        className="section-padding py-8"
        style={{
          backgroundColor: 'rgba(139,37,0,0.08)',
          borderBottom: '1px solid rgba(139,37,0,0.2)',
        }}
      >
        <div className="container-mid text-center">
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            <span
              className="font-semibold"
              style={{ color: 'var(--color-ochre-400)' }}
            >
              Confidential &amp; Culturally Safe.
            </span>{' '}
            Everything shared with our Healing Centre practitioners is confidential.
            If you are in crisis, please call Lifeline on{' '}
            <a
              href="tel:131114"
              className="underline"
              style={{ color: 'var(--color-ochre-400)' }}
            >
              13 11 14
            </a>{' '}
            or Beyond Blue on{' '}
            <a
              href="tel:1300224636"
              className="underline"
              style={{ color: 'var(--color-ochre-400)' }}
            >
              1300 22 4636
            </a>.
          </p>
        </div>
      </div>

      {/* Main content */}
      <section className="section-padding py-20 lg:py-28" aria-label="Healing centre description">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Main description */}
            <div className="lg:col-span-2">
              <span className="section-label">About the Healing Centre</span>
              <h2
                className="font-display font-semibold text-3xl lg:text-4xl mt-3 mb-8"
                style={{ color: 'var(--color-foreground)' }}
              >
                A Safe Space to Heal
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
                Healing looks different for everyone. Some need a space to talk. Some need connection
                to Country. Some need the wisdom of an Elder. Some need structured therapeutic support.
                Our Healing Centre offers all of these — and meets people exactly where they are on
                their journey.
              </p>

              <p
                className="text-lg leading-relaxed mb-10"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                Our practitioners are grounded in both contemporary clinical practice and traditional
                healing wisdom — because true healing honours the whole person, and the whole community.
              </p>

              {/* Services */}
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
                  Services Available
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4" aria-label="Healing centre services">
                  {program.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      <span
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: '#8B2500' }}
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
                  background: 'linear-gradient(135deg, rgba(139,37,0,0.08), rgba(139,37,0,0.02))',
                  border: '1px solid rgba(139,37,0,0.25)',
                }}
              >
                <h3
                  className="font-display font-semibold text-xl mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  What Healing Looks Like
                </h3>
                <ul className="space-y-3" aria-label="Healing outcomes">
                  {program.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-ochre-400)' }}
                        aria-hidden="true"
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Approach statement */}
              <div
                className="mt-10 rounded-2xl p-7"
                style={{
                  background: 'linear-gradient(135deg, rgba(210,168,85,0.06), rgba(210,168,85,0.02))',
                  border: '1px solid rgba(210,168,85,0.15)',
                  borderLeft: '4px solid var(--color-ochre-500)',
                }}
              >
                <h3
                  className="font-display font-semibold text-lg mb-3"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Our Approach
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Healing at Mudyin is self-determined and community-led. We do not impose healing
                  frameworks that were not built for us. Our practitioners honour the knowledge of
                  Elders and the lived experience of community members in every session. You are the
                  expert on your own journey — we walk alongside you.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside aria-label="Healing centre contact and hours">
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
                  Service Details
                </h3>

                <dl className="space-y-5">
                  <div>
                    <dt
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-ochre-500)' }}
                    >
                      Hours
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
                      Location
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
                      Who We Serve
                    </dt>
                    <dd
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {program.targetAudience}
                    </dd>
                  </div>

                  <div
                    style={{ borderTop: '1px solid rgba(65,70,72,0.4)', paddingTop: '1.25rem' }}
                  >
                    <dt
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-ochre-500)' }}
                    >
                      Confidentiality
                    </dt>
                    <dd
                      className="text-sm"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      All sessions are fully confidential and culturally safe.
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/contact?type=program"
                  className="btn-primary w-full text-center mt-8 block"
                >
                  Book an Appointment
                </Link>

                <a
                  href="tel:0478796298"
                  className="btn-outline w-full text-center mt-3 block"
                >
                  Call 0478 796 298
                </a>
              </div>

              {/* Crisis support */}
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'rgba(139,37,0,0.08)',
                  border: '1px solid rgba(139,37,0,0.25)',
                }}
              >
                <p
                  className="text-xs font-semibold mb-3"
                  style={{ color: 'var(--color-ochre-400)' }}
                >
                  In Crisis? Immediate Support
                </p>
                <p
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  If you or someone you know needs immediate help, please reach out:
                </p>
                <div className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <p>Lifeline: <a href="tel:131114" className="font-semibold" style={{ color: 'var(--color-ochre-400)' }}>13 11 14</a></p>
                  <p>Beyond Blue: <a href="tel:1300224636" className="font-semibold" style={{ color: 'var(--color-ochre-400)' }}>1300 22 4636</a></p>
                  <p>13YARN (Aboriginal &amp; TSI): <a href="tel:139276" className="font-semibold" style={{ color: 'var(--color-ochre-400)' }}>13 92 76</a></p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTABand
        heading="You Are Welcome Here — No Matter Where You Are"
        subheading="Our Healing Centre is a safe, confidential, and culturally grounded space. Taking the first step is the hardest — we are here when you are ready."
        primaryCTA={{ label: 'Book an Appointment', href: '/contact?type=program' }}
        secondaryCTA={{ label: 'Learn About Our Story', href: '/about/our-story' }}
      />
    </div>
  )
}
