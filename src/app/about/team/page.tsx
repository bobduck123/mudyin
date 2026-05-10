import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { teamMembers } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the leadership team behind Mudyin Aboriginal Healing Centre. Community-led and community-accountable.',
}

export default function TeamPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Team"
        subtitle="Editorial profiles with accountability"
        description="Leadership grounded in governance, guided by culture, and accountable to community outcomes."
        breadcrumbs={[
          { label: 'About', href: '/about/our-story' },
          { label: 'Our Team' },
        ]}
      />

      <section className="section-spacing section-padding" aria-label="Leadership profiles">
        <div className="container-wide">
          <div className="mb-8">
            <span className="section-label">Leadership Profiles</span>
            <h2 className="font-display text-3xl lg:text-4xl mt-2">Editorial Team Cards</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-7">
            {teamMembers.map((member) => (
              <article
                key={member.id}
                className="rounded-2xl overflow-hidden healing-panel healing-border"
                aria-label={`${member.name}, ${member.role}`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(circle at 52% 56%, rgba(200,167,93,0.16) 0 16%, rgba(184,117,85,0.14) 34%, transparent 48%), linear-gradient(to top, rgba(2,2,2,0.82) 0%, rgba(184,117,85,0.16) 32%, rgba(2,2,2,0.25) 62%, transparent 100%)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Editorial Profile
                    </p>
                    <h3 className="font-display text-3xl">{member.name}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="p-6 lg:p-7">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 sm:col-span-4">
                      <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Authority
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {member.culturalAuthority ?? 'Organisation-wide'}
                      </p>
                    </div>
                    <div className="col-span-12 sm:col-span-8">
                      <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Profile
                      </p>
                      <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.74)' }}>
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding py-12" aria-label="Team governance statement">
        <div className="container-mid">
          <article className="rounded-2xl p-7 healing-panel healing-border">
            <h2 className="font-display text-3xl mb-3">Governance and Community Accountability</h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.74)' }}>
              Mudyin is governed and led by Aboriginal people for Aboriginal community. Leadership decisions
              are measured against cultural safety, service quality, and practical community outcomes.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Alongside formal governance responsibilities, the team remains grounded in relational practice:
              listening first, showing up consistently, and keeping people safe in shared spaces.
            </p>
          </article>
        </div>
      </section>

      <section className="section-padding py-10" aria-label="Work with us">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 healing-panel healing-border">
              <h3 className="font-display text-2xl mb-4">Join Our Team</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                We recruit for mentors, counsellors, coordinators, and operational roles as programs expand.
              </p>
              <Link href="/contact?type=volunteer" className="btn-outline text-sm">
                Express Interest
              </Link>
            </div>

            <div className="rounded-2xl p-8 healing-panel healing-border">
              <h3 className="font-display text-2xl mb-4">Volunteer with Mudyin</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Volunteers support delivery across mentoring sessions, events, and community gatherings.
              </p>
              <Link href="/contact?type=volunteer" className="btn-primary text-sm">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Strength in Every Direction"
        subheading="Our team combines community knowledge, professional discipline, and commitment to self-determination."
        primaryCTA={{ label: 'Our Programs', href: '/programs' }}
        secondaryCTA={{ label: 'Contact Us', href: '/contact#general-enquiry' }}
      />
    </div>
  )
}
