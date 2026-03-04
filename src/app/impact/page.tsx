import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'

export const metadata: Metadata = {
  title: 'Our Impact',
  description:
    'Collective outcomes and systems-level change shaped through Aboriginal-led community practice.',
}

const collectiveMetrics = [
  { stat: '25+', label: 'Years of Community-Led Work', description: 'Consistent delivery grounded in culture, care, and accountability.' },
  { stat: '5,000+', label: 'People Reached', description: 'Young people, families, and kin networks supported through programs.' },
  { stat: '200+', label: 'Gatherings & Events', description: 'Shared spaces for connection, ceremony, learning, and healing.' },
  { stat: '1,000+', label: 'Healing Sessions', description: 'Trauma-informed and culturally grounded support delivered.' },
  { stat: '15+', label: 'Active Program Streams', description: 'Cross-linked services supporting growth from youth to adulthood.' },
  { stat: '50+', label: 'Weekly Participants', description: 'A steady cycle of engagement with visible momentum.' },
]

const systemChanges = [
  {
    title: 'Education Retention',
    detail:
      'More young people remain engaged in school and training when culturally safe mentorship and peer pathways are stable.',
  },
  {
    title: 'Service Integration',
    detail:
      'Families navigate support faster when referrals, wellbeing sessions, and program pathways are connected in one community network.',
  },
  {
    title: 'Intergenerational Continuity',
    detail:
      'Youth participants become mentors and carers, carrying culture and leadership forward rather than restarting from crisis.',
  },
]

export default function ImpactPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Impact"
        subtitle="Collective outcomes, systems change"
        description="Every figure is collective effort. Every shift reflects long-term community strength built on Country."
        breadcrumbs={[{ label: 'Impact' }]}
      />

      <section className="section-padding py-14">
        <div className="container-wide">
          <div className="engraved-panel rounded-2xl p-6 lg:p-8 country-lines">
            <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.58)' }}>
              Ritual Interaction: Change Lens
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="#collective" className="ritual-chip">Collective Outcomes</a>
              <a href="#systems" className="ritual-chip">Systems Level Change</a>
              <a href="#transparency" className="ritual-chip">Transparency</a>
            </div>
          </div>
        </div>
      </section>

      <section id="collective" className="section-padding py-10 lg:py-14">
        <div className="container-wide">
          <div className="mb-10">
            <span className="section-label">Collective Outcomes</span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">What We Build Together</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {collectiveMetrics.map((metric, idx) => (
              <article
                key={metric.label}
                className="rounded-2xl p-6 lg:p-7 country-lines"
                style={{
                  backgroundColor: idx === 2 ? 'rgba(223,206,214,0.9)' : 'rgba(2,2,2,0.7)',
                  border: idx === 2 ? '1px solid rgba(223,206,214,0.95)' : '1px solid rgba(223,206,214,0.25)',
                }}
              >
                <p className="font-display font-bold mb-2" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)', color: idx === 2 ? 'var(--color-flag-black)' : 'var(--color-flag-yellow)', lineHeight: 1 }}>
                  {metric.stat}
                </p>
                <p className="font-semibold text-sm mb-2" style={{ color: idx === 2 ? 'var(--color-flag-black)' : 'var(--color-foreground)' }}>
                  {metric.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: idx === 2 ? 'rgba(2,2,2,0.74)' : 'rgba(255,255,255,0.66)' }}>
                  {metric.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="systems" className="section-padding py-14">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span className="section-label">Systems Level Change</span>
              <h2 className="font-display text-3xl lg:text-4xl mt-2 mb-4">Beyond Individual Outcomes</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)' }}>
                We measure impact through stronger social systems: safer service pathways, sustained education engagement, and intergenerational leadership continuity.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-4">
              {systemChanges.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl p-6 story-trail"
                  style={{ backgroundColor: 'rgba(2,2,2,0.72)', border: '1px solid rgba(223,206,214,0.24)' }}
                >
                  <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.72)' }}>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="transparency" className="section-padding py-14">
        <div className="container-wide">
          <div className="rounded-2xl p-7 lg:p-10 country-lines" style={{ border: '1px solid rgba(223,206,214,0.24)', backgroundColor: 'rgba(2,2,2,0.7)' }}>
            <span className="section-label">Transparency</span>
            <h2 className="font-display text-3xl mt-2 mb-4">Annual Reports</h2>
            <p className="max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Our annual reports are available on request for community members, partners, and stakeholders.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
              {['2025', '2024', '2023'].map((year) => (
                <div key={year} className="rounded-xl p-5" style={{ border: '1px solid rgba(223,206,214,0.25)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <p className="font-display text-3xl mb-2" style={{ color: 'var(--color-flag-yellow)' }}>{year}</p>
                  <Link href="/contact?type=general" className="btn-outline text-xs w-full text-center">
                    Request Report
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Collective Action Sustains Change"
        subheading="Support programs that strengthen families, services, and future leadership."
        primaryCTA={{ label: 'Donate (Demo)', href: '/donate' }}
        secondaryCTA={{ label: 'Our Programs', href: '/programs' }}
      />
    </div>
  )
}
