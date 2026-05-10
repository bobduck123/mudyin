import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Mudyin builds genuine partnerships with organisations that support Aboriginal community wellbeing and self-determination.',
}

const partnerLogos = [
  'Community Health NSW',
  'Regional Youth Services',
  'Education Pathways AU',
  'Mob Enterprise Network',
  'Local Government Support',
  'Wellbeing Alliance',
]

const partnershipStories = [
  {
    title: 'Referral Pathway Integration',
    detail:
      'Partner service mapping reduced referral delays and improved continuity for young people and families.',
  },
  {
    title: 'On-Country Program Support',
    detail:
      'Joint planning with community services expanded local delivery capacity while retaining Aboriginal leadership.',
  },
  {
    title: 'Employment and Training Channels',
    detail:
      'Collaborative pathways created practical progression opportunities for participants moving into work and study.',
  },
]

const principles = [
  'Community consent and protocol alignment',
  'Cultural safety as operating standard',
  'Mutual benefit with transparent outcomes',
  'Long-term commitment over one-off campaigns',
  'Aboriginal leadership in decision-making',
  'Governance and reporting integrity',
]

export default function PartnersPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Partners"
        subtitle="Walking together with accountability"
        description="Partnerships are structured around shared outcomes, cultural safety, and community-led governance."
        image="/images/community-gathering.jpg"
        imageAlt="Partner organisations supporting community-led outcomes"
        breadcrumbs={[
          { label: 'About', href: '/about/our-story' },
          { label: 'Partners' },
        ]}
      />

      <section className="section-spacing section-padding" aria-label="Partner logos">
        <div className="container-wide">
          <div className="healing-panel rounded-2xl p-6 lg:p-8 healing-border">
            <div className="flex items-start justify-between gap-6 flex-wrap mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                  Network Overview
                </p>
                <h2 className="font-display text-3xl lg:text-4xl">Partner Logos First</h2>
              </div>
              <p className="max-w-md text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>
                Current logos represent the working network. Full directory details remain available on request.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerLogos.map((logo) => (
                <div
                  key={logo}
                  className="rounded-xl p-5 healing-panel healing-border"
                  style={{ minHeight: '92px' }}
                >
                  <p className="text-xs uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(255,255,255,0.52)' }}>
                    Partner Logo
                  </p>
                  <h3 className="font-display text-xl">{logo}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding py-10 lg:py-14" aria-label="Hybrid partner narrative">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-7">
            <article className="lg:col-span-8 rounded-2xl p-6 lg:p-8 healing-panel healing-border">
              <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Institutional Framework
              </p>
              <h2 className="font-display text-3xl mb-4">Partnerships Rooted in Governance and Community Outcomes</h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.74)' }}>
                Mudyin partners with government, education, health, and enterprise organisations using a formal accountability model.
                Each partnership is reviewed against cultural safety, community consent, and measurable outcomes.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.74)' }}>
                Alongside formal governance, relationships are sustained through trust, continuity, and responsiveness to local context.
              </p>
            </article>

            <aside className="lg:col-span-4 rounded-2xl p-6 healing-panel healing-border">
              <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Story Outcomes
              </p>
              <div className="space-y-3">
                {partnershipStories.map((story) => (
                  <article key={story.title} className="rounded-xl p-4 healing-panel">
                    <h3 className="font-display text-xl mb-1">{story.title}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>{story.detail}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding py-12" aria-label="Partnership principles">
        <div className="container-wide">
          <div className="mb-8">
            <span className="section-label">Operating Principles</span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">How We Assess Partnership Fit</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {principles.map((principle, idx) => (
              <article key={principle} className="rounded-2xl p-5 healing-panel healing-border">
                <p className="text-xs uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  Principle {idx + 1}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.78)' }}>{principle}</p>
              </article>
            ))}
          </div>

          <Link
            href="/contact?type=partnership"
            className="inline-flex items-center gap-2 text-sm mt-8"
            style={{ color: 'var(--color-ochre-400)' }}
          >
            Enquire about partnership <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <CTABand
        heading="Walk With Us"
        subheading="If your organisation shares our commitment to Aboriginal community wellbeing and self-determination, we welcome a conversation."
        primaryCTA={{ label: 'Get in Touch', href: '/contact?type=partnership' }}
        secondaryCTA={{ label: 'Our Story', href: '/about/our-story' }}
      />
    </div>
  )
}
