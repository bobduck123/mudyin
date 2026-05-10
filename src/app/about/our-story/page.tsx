import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero } from '@/components/layout/PageHero'
import { AcknowledgementOfCountry } from '@/components/cultural/AcknowledgementOfCountry'
import { CTABand } from '@/components/sections/CTABand'
import { teamMembers } from '@/lib/data'
import { CountryMilestoneTrail } from '@/components/about/CountryMilestoneTrail'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Twenty-five years of Aboriginal-led healing, mentoring, and community building from 2001 to 2026.',
}

const founder = teamMembers.find((m) => m.id === 'uncle-dave')!

const keyMilestones = [
  {
    year: '2001',
    title: 'Father and Sons Program Began',
    detail: 'Uncle Dave Bell established a consistent dawn routine for young people: fitness, breakfast, and mentoring in community.',
  },
  {
    year: '2005',
    title: 'Community Expansion',
    detail: 'Participation and trust deepened, with growing collaboration between families, mentors, and local services.',
  },
  {
    year: '2010',
    title: 'YSMP Formalised',
    detail: 'The Young Spirit Mentoring Program became a defined pathway with stronger structure and ongoing continuity.',
  },
  {
    year: '2020',
    title: 'Healing Centre Opened',
    detail: 'Mudyin unified mentoring, wellbeing, and support services under one culturally grounded home.',
  },
  {
    year: '2026',
    title: 'Digital and Regional Reach',
    detail: 'The platform and new regional pathways extended program access while retaining community leadership.',
  },
]

export default function OurStoryPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Story"
        subtitle="Country trail and milestones"
        description="A split narrative of origin and systems growth, grounded in community leadership and cultural continuity."
        breadcrumbs={[
          { label: 'About', href: '/about/our-story' },
          { label: 'Our Story' },
        ]}
      />

      <section className="section-spacing section-padding" aria-label="Our origin and leadership">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <article className="lg:col-span-7 rounded-2xl p-7 healing-panel grounded-lines healing-border">
              <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Origin Narrative
              </p>
              <h2 className="font-display text-3xl lg:text-4xl mb-4">A community response, built with discipline</h2>
              <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                In 2001, Uncle Dave Bell identified a practical gap: many young people needed consistent structure,
                culturally safe mentorship, and a place of belonging. The response was direct and repeatable.
              </p>
              <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Morning sessions created routine. Shared breakfast built trust. Ongoing mentoring strengthened identity
                and accountability. Over time, this model expanded into a broader service system while staying
                Aboriginal-led and community-accountable.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                The result is not a single program story. It is a long-term operating model for collective wellbeing.
              </p>
            </article>

            <aside className="lg:col-span-5 rounded-2xl overflow-hidden healing-panel healing-border">
              <div className="relative aspect-[4/5]">
                <Image
                  src={founder.image}
                  alt={founder.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 52% 56%, rgba(200,167,93,0.16) 0 17%, rgba(184,117,85,0.16) 35%, transparent 49%), linear-gradient(to top, rgba(2,2,2,0.8) 0%, rgba(184,117,85,0.16) 30%, rgba(2,2,2,0.26) 62%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(255,255,255,0.56)' }}>
                  Foundational Leadership
                </p>
                <h3 className="font-display text-2xl mb-1">{founder.name}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  {founder.role} - Mudyin Aboriginal Healing Centre
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding py-10 lg:py-14" aria-label="Milestone trail">
        <div className="container-wide">
          <div className="mb-10">
            <span className="section-label">Five Key Milestones</span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">Country Map Trail and Timeline</h2>
          </div>
          <CountryMilestoneTrail milestones={keyMilestones} />
        </div>
      </section>

      <section className="section-padding py-14" aria-label="Values and governance">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Aboriginal Governance',
                description:
                  'Decisions are made with Aboriginal leadership and direct accountability to community outcomes.',
              },
              {
                title: 'Service Integration',
                description:
                  'Programs are designed to connect mentoring, wellbeing, referrals, and long-term support pathways.',
              },
              {
                title: 'Belonging and Safety',
                description:
                  'Professional standards are paired with cultural safety so people feel welcome, respected, and supported.',
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl p-6 healing-panel healing-border">
                <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding py-8" aria-label="Acknowledgement of Country">
        <div className="container-mid">
          <AcknowledgementOfCountry variant="full" />
        </div>
      </section>

      <CTABand
        heading="Be Part of the Next 25 Years"
        subheading="Mudyin's story continues through every participant, family, Elder, and partner who walks with us."
        primaryCTA={{ label: 'Talk With Us', href: '/contact#general-enquiry' }}
        secondaryCTA={{ label: 'Our Programs', href: '/programs' }}
      />
    </div>
  )
}
