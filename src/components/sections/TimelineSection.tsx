'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { timeline, teamMembers } from '@/lib/data'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

const tabs = ['History', 'Culture', 'Impact'] as const
type Tab = typeof tabs[number]

const tabContent: Record<Tab, { heading: string; body: string[] }> = {
  History: {
    heading: 'From Father & Sons to Mudyin',
    body: [
      'In 2001, Uncle Dave Bell watched young Aboriginal men in his community drifting — disconnected from family, culture, and purpose. His response was simple and powerful: get them up early, get them moving, and get them together.',
      "What began as a Father & Sons program grew — through community love, Elder guidance, and unwavering commitment — into the Young Spirit Mentoring Program, the Thrive Tribe, and ultimately, Mudyin Aboriginal Healing Centre.",
      '25 years later, what hasn\'t changed is the heart of it: community comes first, culture comes first, people come first.',
    ],
  },
  Culture: {
    heading: 'Culture at Our Core',
    body: [
      'At Mudyin, culture is not a program activity — it is the foundation of everything we do. Every session, every meal, every conversation is grounded in Aboriginal values of connection, reciprocity, and respect for Country.',
      'From traditional dance and language classes to on-country camps guided by Elders, cultural learning is woven into the fabric of daily life at Mudyin. We believe that strong culture builds strong people.',
      'We are guided by the principle that true healing for Aboriginal people must be culturally grounded — that addressing the mind, body, and spirit requires reconnection to identity, community, and Country.',
    ],
  },
  Impact: {
    heading: 'Making Real Change',
    body: [
      'More than 5,000 Aboriginal young people have passed through Mudyin\'s programs over 25 years. Their stories are the measure of our success — young people who found direction, families who found support, communities that found strength.',
      'The impact is not just individual. It is generational. The young men who joined Father & Sons in 2001 are now bringing their own children to YSMP. Culture, connection, and healing passing from one generation to the next.',
      "We measure success not in numbers alone, but in lives transformed, relationships healed, and communities strengthened. That's what Mudyin is for.",
    ],
  },
}

export function TimelineSection() {
  const [activeTab, setActiveTab] = useState<Tab>('History')
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>()
  const content = tabContent[activeTab]
  const founder = teamMembers[0]

  return (
    <section
      id="our-story"
      className="py-20 lg:py-32 section-padding"
      style={{
        background: 'linear-gradient(to bottom, rgba(20,20,20,1), rgba(10,10,10,1))',
      }}
      aria-label="Our story"
    >
      <div ref={ref} className="container-wide">

        {/* Header */}
        <div className={cn('mb-16 animate-on-scroll', isInView && 'in-view')}>
          <span className="section-label">25 Years of Purpose</span>
          <h2
            className="font-display font-semibold text-display-md lg:text-display-lg mt-2 max-w-3xl"
            style={{ color: 'var(--color-foreground)' }}
          >
            Our Story
          </h2>
        </div>

        {/* Timeline */}
        <div
          className={cn(
            'relative mb-20 animate-on-scroll animation-delay-200',
            isInView && 'in-view',
          )}
          aria-label="Mudyin history timeline"
        >
          {/* Connecting line */}
          <div
            className="absolute top-5 left-0 right-0 h-px hidden lg:block"
            style={{ background: 'linear-gradient(to right, transparent, rgba(210,168,85,0.3), transparent)' }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-0">
            {timeline.map((event, i) => (
              <div
                key={event.year}
                className={cn(
                  'flex flex-col animate-on-scroll',
                  isInView && 'in-view',
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Year dot */}
                <div className="flex items-center mb-3 lg:flex-col lg:items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mr-3 lg:mr-0 lg:mb-2 flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(210,168,85,0.15)',
                      border: '2px solid var(--color-ochre-500)',
                      color: 'var(--color-ochre-400)',
                    }}
                    aria-hidden="true"
                  >
                    {event.year.slice(2)}
                  </div>
                </div>

                <div className="lg:px-2 lg:text-center">
                  <p
                    className="text-xs font-bold tracking-widest mb-1"
                    style={{ color: 'var(--color-ochre-500)' }}
                  >
                    {event.year}
                  </p>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {event.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed hidden lg:block"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab + content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left: Founder portrait */}
          <div
            className={cn('relative animate-on-scroll-left', isInView && 'in-view')}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]" style={{ maxWidth: '420px' }}>
              <Image
                src={founder.image}
                alt={founder.imageAlt}
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 overlay-dark" aria-hidden="true" />

              {/* Quote on portrait */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <blockquote>
                  <p
                    className="font-display italic text-lg mb-3 leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    &ldquo;{founder.quote}&rdquo;
                  </p>
                  <footer>
                    <cite className="not-italic">
                      <span
                        className="font-semibold text-sm block"
                        style={{ color: 'var(--color-ochre-400)' }}
                      >
                        {founder.name}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {founder.role}, Mudyin
                      </span>
                    </cite>
                  </footer>
                </blockquote>
              </div>
            </div>

            {/* Founding year badge */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-ochre-500), var(--color-desert-gold))',
                boxShadow: '0 4px 24px rgba(210,168,85,0.3)',
              }}
              aria-label="Founded in 2001"
            >
              <span className="font-display font-bold text-lg leading-none text-charcoal-950">2001</span>
              <span className="text-xs font-semibold text-charcoal-950/80">Founded</span>
            </div>
          </div>

          {/* Right: Tabs + content */}
          <div className={cn('animate-on-scroll-right animation-delay-200', isInView && 'in-view')}>

            {/* Tabs */}
            <div
              className="flex gap-1 mb-8 p-1 rounded-xl"
              role="tablist"
              aria-label="Our story sections"
              style={{
                backgroundColor: 'rgba(30,30,30,0.6)',
                border: '1px solid rgba(65,70,72,0.4)',
                display: 'inline-flex',
              }}
            >
              {tabs.map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`story-panel-${tab}`}
                  id={`story-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={
                    activeTab === tab
                      ? {
                          backgroundColor: 'var(--color-ochre-500)',
                          color: 'var(--color-charcoal-950)',
                        }
                      : { color: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div
              id={`story-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`story-tab-${activeTab}`}
              key={activeTab}
              style={{ animation: 'fadeIn 0.4s ease-out' }}
            >
              <h3
                className="font-display font-semibold text-2xl lg:text-3xl mb-6"
                style={{ color: 'var(--color-foreground)' }}
              >
                {content.heading}
              </h3>

              <div className="space-y-4">
                {content.body.map((para, i) => (
                  <p key={i} className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Hours + CTA */}
            <div
              className="mt-8 pt-8 flex flex-col sm:flex-row items-start gap-6"
              style={{ borderTop: '1px solid rgba(65,70,72,0.4)' }}
            >
              <div>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  YSMP Hours
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Mon, Wed, Fri — 6:00 AM to 7:00 AM
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Healing Centre — Mon–Fri, 9 AM–5 PM
                </p>
              </div>

              <Link href="/about/our-story" className="btn-outline text-sm mt-auto sm:mt-0">
                Full Story →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
