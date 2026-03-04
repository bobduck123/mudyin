import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { teamMembers } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the leadership team behind Mudyin Aboriginal Healing Centre — Uncle Dave Bell, founder, and Kaiyu Bayles, CEO. Community-led, community-accountable.',
}

export default function TeamPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Team"
        subtitle="The People Behind Mudyin"
        description="Leadership grounded in community, guided by culture, and accountable to the people we serve."
        breadcrumbs={[
          { label: 'About', href: '/about/our-story' },
          { label: 'Our Team' },
        ]}
      />

      {/* Team members */}
      <section className="section-padding py-20 lg:py-28" aria-label="Team members">
        <div className="container-wide">
          <div className="grid gap-16">
            {teamMembers.map((member, index) => (
              <article
                key={member.id}
                className="grid lg:grid-cols-2 gap-12 items-center"
                aria-label={`${member.name}, ${member.role}`}
              >
                {/* Image — alternate left/right */}
                <div
                  className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <div
                    className="rounded-2xl overflow-hidden aspect-[4/3] relative"
                    style={{ border: '1px solid rgba(210,168,85,0.2)' }}
                  >
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
                          'linear-gradient(to top, rgba(20,20,20,0.5) 0%, transparent 70%)',
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="section-label">{member.role}</span>
                  <h2
                    className="font-display font-bold text-3xl lg:text-4xl mt-2 mb-2"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {member.name}
                  </h2>

                  {member.culturalAuthority && (
                    <p
                      className="text-sm mb-6"
                      style={{ color: 'var(--color-ochre-400)' }}
                    >
                      {member.culturalAuthority}
                    </p>
                  )}

                  <p
                    className="text-lg leading-relaxed mb-8"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {member.bio}
                  </p>

                  {/* Quote */}
                  <blockquote
                    className="rounded-2xl p-6"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(210,168,85,0.06), rgba(210,168,85,0.02))',
                      border: '1px solid rgba(210,168,85,0.2)',
                      borderLeft: '4px solid var(--color-ochre-500)',
                    }}
                  >
                    <p
                      className="text-base italic leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.85)' }}
                    >
                      &ldquo;{member.quote}&rdquo;
                    </p>
                    <footer className="mt-3">
                      <cite
                        className="text-sm font-semibold not-italic"
                        style={{ color: 'var(--color-ochre-400)' }}
                      >
                        — {member.name}
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community accountability */}
      <section
        className="section-padding py-16"
        style={{
          borderTop: '1px solid rgba(65,70,72,0.3)',
          borderBottom: '1px solid rgba(65,70,72,0.3)',
        }}
        aria-label="Community accountability"
      >
        <div className="container-mid text-center">
          <span className="section-label">Community-Led</span>
          <h2
            className="font-display font-semibold text-3xl mt-3 mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            Accountable to Community
          </h2>
          <p
            className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.68)' }}
          >
            Mudyin is governed, led, and operated by Aboriginal people, for Aboriginal community.
            Every decision is made with community accountability at its centre. Our Elders guide
            our direction. Our participants and families shape our programs. Our community holds
            us to account.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about/our-story" className="btn-outline">
              Our Story
            </Link>
            <Link href="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Join team / Volunteer */}
      <section className="section-padding py-16" aria-label="Work with us">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 gap-8">
            <div
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(65,70,72,0.4)',
              }}
            >
              <h3
                className="font-display font-semibold text-xl mb-4"
                style={{ color: 'var(--color-foreground)' }}
              >
                Join Our Team
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Mudyin is growing. We periodically recruit for mentors, counsellors, program
                coordinators, and administrative roles. If you are passionate about Aboriginal
                community wellbeing, we would love to hear from you.
              </p>
              <Link href="/contact?type=volunteer" className="btn-outline text-sm">
                Express Interest
              </Link>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(210,168,85,0.07), rgba(210,168,85,0.02))',
                border: '1px solid rgba(210,168,85,0.2)',
              }}
            >
              <h3
                className="font-display font-semibold text-xl mb-4"
                style={{ color: 'var(--color-foreground)' }}
              >
                Volunteer with Mudyin
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Volunteers play a vital role in our programs — from helping at YSMP morning sessions
                to supporting our events and community days. Cultural safety awareness is essential.
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
        subheading="Our team brings together community wisdom, professional expertise, and an unwavering commitment to Aboriginal self-determination."
        primaryCTA={{ label: 'Our Programs', href: '/programs' }}
        secondaryCTA={{ label: 'Support Our Work', href: '/donate' }}
      />
    </div>
  )
}
