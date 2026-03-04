import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { resources } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Guided pathways by life stage, with direct access to archive resources and urgent support.',
}

const lifeStages = [
  { id: 'young-people', title: 'Young People', note: 'Mentoring, identity, and confidence pathways.' },
  { id: 'parents-carers', title: 'Parents & Carers', note: 'Family support, referrals, and practical guidance.' },
  { id: 'community-workers', title: 'Community Workers', note: 'Partnership packs, protocol guidance, and program pathways.' },
]

export default function ResourcesPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Resources"
        subtitle="Guided pathways for every life stage"
        description="Find the right guidance quickly, then move into our archive when you need deeper material."
        breadcrumbs={[{ label: 'Resources' }]}
      />

      <section className="section-padding py-12">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-9 engraved-panel rounded-2xl p-6 country-lines">
              <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Ritual Interaction: choose your path first
              </p>
              <h2 className="font-display text-3xl mb-4">Guided Pathways by Life Stage</h2>
              <div className="grid md:grid-cols-3 gap-3">
                {lifeStages.map((stage) => (
                  <a
                    key={stage.id}
                    href={`#${stage.id}`}
                    className="rounded-xl p-4 transition-transform hover:-translate-y-1"
                    style={{ border: '1px solid rgba(223,206,214,0.24)', backgroundColor: 'rgba(255,255,255,0.02)' }}
                  >
                    <p className="font-semibold mb-2" style={{ color: 'var(--color-flag-yellow)' }}>{stage.title}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>{stage.note}</p>
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 rounded-2xl p-5 flex flex-col justify-between" style={{ border: '1px solid rgba(219,22,47,0.4)', backgroundColor: 'rgba(219,22,47,0.08)' }}>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.66)' }}>
                  Urgent
                </p>
                <h3 className="font-display text-xl mb-2">Need Help Now?</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  Immediate crisis and support pathways are available.
                </p>
              </div>
              <Link href="/contact?type=support" className="btn-primary text-sm mt-4">
                Urgent Help Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding py-8 lg:py-12">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-5 gap-3">
            <h2 className="font-display text-2xl lg:text-3xl">Knowledge Archive</h2>
            <span className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Clear access, low friction
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <article
                key={resource.id}
                className="rounded-2xl p-6 country-lines"
                style={{ border: '1px solid rgba(223,206,214,0.24)', backgroundColor: 'rgba(2,2,2,0.72)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="ritual-chip">{resource.category}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{resource.fileType}</span>
                </div>
                <h3 className="font-display text-xl mb-2">{resource.title}</h3>
                <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.68)' }}>{resource.description}</p>
                <Link href={`/contact?type=general&resource=${resource.slug}`} className="btn-outline text-xs w-full text-center">
                  Request Resource
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {lifeStages.map((stage) => (
        <section key={stage.id} id={stage.id} className="section-padding py-8">
          <div className="container-mid">
            <article className="rounded-2xl p-6 story-trail" style={{ border: '1px solid rgba(223,206,214,0.22)', backgroundColor: 'rgba(2,2,2,0.66)' }}>
              <h3 className="font-display text-2xl mb-2">{stage.title} Pathway</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Start with essential guides, then move to archive resources for deeper support. Contact us for tailored packs if your context needs specific cultural or service guidance.
              </p>
            </article>
          </div>
        </section>
      ))}

      <CTABand
        heading="Knowledge Shared, Community Strengthened"
        subheading="Move through guided pathways, then deepen with archive resources."
        primaryCTA={{ label: 'Our Programs', href: '/programs' }}
        secondaryCTA={{ label: 'Contact Us', href: '/contact' }}
      />
    </div>
  )
}
