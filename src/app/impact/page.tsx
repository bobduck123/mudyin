import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

const impactPath = [
  'Cultural safety in daily delivery',
  'Sustained participation and trust',
  'Systems-level improvement and continuity',
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

      <section className="section-spacing section-padding">
        <div className="container-wide">
          <div className="healing-panel rounded-2xl p-6 lg:p-8 grounded-lines">
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.58)' }}>
                  Ritual Interaction: Change Lens
                </p>
                <h2 className="font-display text-3xl lg:text-4xl mb-3">From Individual Story to System Shift</h2>
                <p style={{ color: 'rgba(255,255,255,0.73)' }}>
                  Impact is measured as community continuity. The pathway below shows how culturally grounded work
                  becomes long-term social infrastructure.
                </p>
              </div>
              <div className="lg:col-span-5 rounded-xl p-4 soft-border" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <ol className="space-y-3 text-sm">
                  {impactPath.map((step, idx) => (
                    <li key={step} className="care-trail">
                      <span style={{ color: 'rgba(255,255,255,0.82)' }}>
                        {idx + 1}. {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href="#collective" className="healing-chip">Collective Outcomes</a>
                  <a href="#systems" className="healing-chip">Systems Level Change</a>
                  <a href="#transparency" className="healing-chip">Transparency</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collective" className="section-padding py-8 lg:py-12">
        <div className="container-wide">
          <div className="mb-10">
            <span className="section-label">Collective Outcomes</span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">What We Build Together</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {collectiveMetrics.map((metric, idx) => (
              <article
                key={metric.label}
                className="rounded-2xl p-6 lg:p-7 grounded-lines"
                style={{
                  backgroundColor: idx === 2 ? 'rgba(223,206,214,0.9)' : 'rgba(2,2,2,0.72)',
                  boxShadow: idx === 2 ? '0 14px 28px rgba(0,0,0,0.26)' : '0 14px 28px rgba(0,0,0,0.3)',
                }}
              >
                <p className="font-display font-bold mb-2" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)', color: idx === 2 ? 'var(--color-charcoal-950)' : 'var(--color-ochre-400)', lineHeight: 1 }}>
                  {metric.stat}
                </p>
                <p className="font-semibold text-sm mb-2" style={{ color: idx === 2 ? 'var(--color-charcoal-950)' : 'var(--color-foreground)' }}>
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

      <section id="systems" className="section-padding py-12">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span className="section-label">Systems Level Change</span>
              <h2 className="font-display text-3xl lg:text-4xl mt-2 mb-4">Beyond Individual Outcomes</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)' }}>
                We measure impact through stronger social systems: safer service pathways, sustained education engagement,
                and intergenerational leadership continuity.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-4">
              {systemChanges.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl p-6 care-trail"
                  style={{ backgroundColor: 'rgba(2,2,2,0.72)', boxShadow: '0 12px 24px rgba(0,0,0,0.3)' }}
                >
                  <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.72)' }}>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="transparency" className="section-padding py-12">
        <div className="container-wide">
          <div className="rounded-2xl p-7 lg:p-10 grounded-lines healing-panel">
            <span className="section-label">Transparency</span>
            <h2 className="font-display text-3xl mt-2 mb-4">Annual Reports</h2>
            <p className="max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Our annual reports are available on request for community members, partners, and stakeholders.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
              {['2025', '2024', '2023'].map((year) => (
                <div key={year} className="rounded-xl p-5 soft-border" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <p className="font-display text-3xl mb-2" style={{ color: 'var(--color-ochre-400)' }}>{year}</p>
                  <Link href="/contact?type=general" className="btn-outline text-xs w-full text-center">
                    Request Report
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/contact?type=general" className="inline-flex items-center gap-2 text-sm mt-6" style={{ color: 'var(--color-ochre-400)' }}>
              Ask a transparency question <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        heading="Collective Action Sustains Change"
        subheading="Support programs that strengthen families, services, and future leadership."
        primaryCTA={{ label: 'Start an Enquiry', href: '/contact#general-enquiry' }}
        secondaryCTA={{ label: 'Our Programs', href: '/programs' }}
      />
    </div>
  )
}
