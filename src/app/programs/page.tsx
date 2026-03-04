import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { programs } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Our Programs',
  description:
    'Explore Mudyin Aboriginal Healing Centre\'s programs — the Young Spirit Mentoring Program (YSMP), Thrive Tribe wellness program, and Healing Centre Services. Community-led, culturally grounded.',
}

export default function ProgramsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Our Programs"
        subtitle="What We Offer"
        description="Three powerful, culturally grounded programs — built with community, for community. Each one is a doorway to healing, strength, and belonging."
        breadcrumbs={[{ label: 'Programs' }]}
      />

      {/* Programs grid */}
      <section className="section-padding py-20 lg:py-28" aria-label="Programs">
        <div className="container-wide">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <article
                key={program.id}
                className="card-dark flex flex-col overflow-hidden rounded-2xl group"
                style={{ border: '1px solid rgba(65,70,72,0.4)' }}
                aria-label={program.name}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.2) 60%, transparent 100%)',
                    }}
                    aria-hidden="true"
                  />
                  {/* Enrollment badge */}
                  {program.enrollmentOpen && (
                    <span
                      className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(157,193,131,0.2)',
                        border: '1px solid rgba(157,193,131,0.5)',
                        color: '#9DC183',
                      }}
                    >
                      Enrolling Now
                    </span>
                  )}
                  {/* Tagline on image */}
                  <span
                    className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {program.tagline}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-7">
                  <h2
                    className="font-display font-semibold text-xl mb-3"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {program.name}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-6 flex-1"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {program.shortDescription}
                  </p>

                  {/* Key detail */}
                  <p
                    className="text-xs mb-6"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {program.targetAudience} &bull; {program.location}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      href={`/programs/${program.slug}`}
                      className="btn-outline text-sm flex-1 text-center"
                      aria-label={`Learn more about ${program.name}`}
                    >
                      Learn More
                    </Link>
                    <Link
                      href={`/enroll/${program.slug}`}
                      className="btn-primary text-sm flex-1 text-center"
                      aria-label={`Enroll in ${program.name}`}
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Not sure section */}
      <section
        className="section-padding py-16"
        style={{
          borderTop: '1px solid rgba(65,70,72,0.3)',
          borderBottom: '1px solid rgba(65,70,72,0.3)',
        }}
        aria-label="Not sure which program"
      >
        <div className="container-mid text-center">
          <span className="section-label">Need Guidance?</span>
          <h2
            className="font-display font-semibold text-2xl lg:text-3xl mt-3 mb-5"
            style={{ color: 'var(--color-foreground)' }}
          >
            Not sure which program is right for you?
          </h2>
          <p
            className="text-lg leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Our team is here to help. Reach out and we will walk you through
            your options and find the best fit for you or your family.
          </p>
          <Link href="/contact" className="btn-primary">
            Talk to Our Team
          </Link>
        </div>
      </section>

      <CTABand
        heading="Two Worlds Strong — Together"
        subheading="Every program at Mudyin is built on the belief that when our communities are strong, our young people thrive. Come as you are."
        primaryCTA={{ label: 'Enroll Today', href: '/enroll' }}
        secondaryCTA={{ label: 'Support Our Work', href: '/donate' }}
      />
    </div>
  )
}
