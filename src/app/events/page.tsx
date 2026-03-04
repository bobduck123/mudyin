import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { events } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Upcoming Events',
  description:
    'Find upcoming Mudyin Aboriginal Healing Centre events — YSMP open days, Thrive Tribe intakes, cultural camps, and community gatherings. Register your interest today.',
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  YSMP: {
    bg: 'rgba(210,168,85,0.12)',
    border: 'rgba(210,168,85,0.35)',
    text: 'var(--color-ochre-400)',
  },
  'Thrive Tribe': {
    bg: 'rgba(157,193,131,0.12)',
    border: 'rgba(157,193,131,0.35)',
    text: '#9DC183',
  },
  Cultural: {
    bg: 'rgba(139,37,0,0.15)',
    border: 'rgba(139,37,0,0.35)',
    text: '#e8916a',
  },
}

export default function EventsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Upcoming Events"
        subtitle="Join Our Community"
        description="Open days, program intakes, cultural camps, and community gatherings — see what is happening and register your interest."
        breadcrumbs={[{ label: 'Events' }]}
      />

      {/* Events list */}
      <section className="section-padding py-20 lg:py-28" aria-label="Event listings">
        <div className="container-wide">
          {events.length > 0 ? (
            <div className="space-y-8">
              {events.map((event) => {
                const colours = categoryColors[event.category] ?? categoryColors['YSMP']
                const spotsPercent = Math.round(
                  ((event.capacity - event.spotsLeft) / event.capacity) * 100
                )

                return (
                  <article
                    key={event.id}
                    className="rounded-2xl p-8"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(65,70,72,0.4)',
                    }}
                    aria-label={event.title}
                  >
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                      {/* Date column */}
                      <div
                        className="lg:col-span-1 rounded-xl p-6 text-center"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(210,168,85,0.07), rgba(210,168,85,0.02))',
                          border: '1px solid rgba(210,168,85,0.15)',
                        }}
                      >
                        <time
                          dateTime={event.date}
                          className="font-display font-bold text-4xl block mb-1"
                          style={{ color: 'var(--color-ochre-400)' }}
                        >
                          {new Date(event.date).getDate()}
                        </time>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: 'var(--color-foreground)' }}
                        >
                          {new Date(event.date).toLocaleDateString('en-AU', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p
                          className="text-xs mt-2"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                          {new Date(event.date).toLocaleDateString('en-AU', {
                            weekday: 'long',
                          })}
                        </p>
                      </div>

                      {/* Event details */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-wrap items-start gap-3 mb-4">
                          <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: colours.bg,
                              border: `1px solid ${colours.border}`,
                              color: colours.text,
                            }}
                          >
                            {event.category}
                          </span>
                          {event.spotsLeft < 15 && (
                            <span
                              className="text-xs font-semibold px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: '#fca5a5',
                              }}
                            >
                              {event.spotsLeft} spots remaining
                            </span>
                          )}
                        </div>

                        <h2
                          className="font-display font-semibold text-2xl mb-3"
                          style={{ color: 'var(--color-foreground)' }}
                        >
                          {event.title}
                        </h2>

                        <p
                          className="text-base leading-relaxed mb-5"
                          style={{ color: 'rgba(255,255,255,0.68)' }}
                        >
                          {event.description}
                        </p>

                        <dl className="grid sm:grid-cols-3 gap-4 mb-6">
                          <div>
                            <dt
                              className="text-xs font-semibold uppercase tracking-wider mb-1"
                              style={{ color: 'var(--color-ochre-500)' }}
                            >
                              Time
                            </dt>
                            <dd
                              className="text-sm"
                              style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {event.time}
                            </dd>
                          </div>
                          <div>
                            <dt
                              className="text-xs font-semibold uppercase tracking-wider mb-1"
                              style={{ color: 'var(--color-ochre-500)' }}
                            >
                              Location
                            </dt>
                            <dd
                              className="text-sm"
                              style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {event.location}
                            </dd>
                          </div>
                          <div>
                            <dt
                              className="text-xs font-semibold uppercase tracking-wider mb-1"
                              style={{ color: 'var(--color-ochre-500)' }}
                            >
                              Capacity
                            </dt>
                            <dd
                              className="text-sm"
                              style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {event.capacity - event.spotsLeft}/{event.capacity} registered
                            </dd>
                          </div>
                        </dl>

                        {/* Capacity bar */}
                        <div className="mb-6">
                          <div
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'rgba(65,70,72,0.4)' }}
                            role="progressbar"
                            aria-valuenow={spotsPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${spotsPercent}% capacity filled`}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${spotsPercent}%`,
                                backgroundColor:
                                  spotsPercent > 80
                                    ? '#f87171'
                                    : 'var(--color-ochre-500)',
                              }}
                            />
                          </div>
                        </div>

                        <Link
                          href="/contact?type=program"
                          className="btn-primary text-sm"
                          aria-label={`Register interest for ${event.title}`}
                        >
                          Register Interest
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p
                className="text-lg"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                No upcoming events at this time. Check back soon or contact us.
              </p>
              <Link href="/contact" className="btn-outline mt-6">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Notice */}
      <section
        className="section-padding py-12"
        style={{
          borderTop: '1px solid rgba(65,70,72,0.3)',
          borderBottom: '1px solid rgba(65,70,72,0.3)',
        }}
        aria-label="Event registration note"
      >
        <div className="container-mid text-center">
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            All events are subject to availability. For YSMP open days, no prior registration is
            required — just show up. For Thrive Tribe intakes and cultural camps, please register
            your interest via our contact form and our team will be in touch.
          </p>
        </div>
      </section>

      <CTABand
        heading="Ready to Join the Community?"
        subheading="Whether it is an open day, a program intake, or a cultural gathering — there is a place for you here."
        primaryCTA={{ label: 'Register Interest', href: '/contact?type=program' }}
        secondaryCTA={{ label: 'Our Programs', href: '/programs' }}
      />
    </div>
  )
}
