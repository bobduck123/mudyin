'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock, MapPin, Users } from 'lucide-react'
import { programs } from '@/lib/data'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

export function ProgramsShowcase() {
  const [active, setActive] = useState(0)
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>()
  const current = programs[active]

  return (
    <section
      id="programs"
      className="py-20 lg:py-32 section-padding"
      style={{ backgroundColor: 'var(--color-background)' }}
      aria-label="Our programs"
    >
      <div ref={ref} className="container-wide">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-14 animate-on-scroll',
            isInView && 'in-view',
          )}
        >
          <span className="section-label">What We Offer</span>
          <h2
            className="font-display font-semibold text-display-md lg:text-display-lg mt-2 mb-4"
            style={{ color: 'var(--color-foreground)' }}
          >
            Programs Built on{' '}
            <span className="gradient-text">Culture & Community</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Three distinct programs — one shared purpose: healing, empowerment, and belonging for Aboriginal communities.
          </p>
        </div>

        {/* Tab selectors */}
        <div
          className={cn(
            'flex flex-col sm:flex-row justify-center gap-3 mb-12 animate-on-scroll animation-delay-200',
            isInView && 'in-view',
          )}
          role="tablist"
          aria-label="Program selection"
        >
          {programs.map((prog, i) => (
            <button
              key={prog.id}
              role="tab"
              aria-selected={active === i}
              aria-controls={`program-panel-${prog.id}`}
              id={`program-tab-${prog.id}`}
              onClick={() => setActive(i)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                active === i
                  ? 'shadow-cultural'
                  : 'hover:bg-white/5',
              )}
              style={
                active === i
                  ? { backgroundColor: 'var(--color-ochre-500)', color: 'var(--color-charcoal-950)' }
                  : { border: '1px solid rgba(65,70,72,0.5)', color: 'rgba(255,255,255,0.65)' }
              }
            >
              {prog.tagline}
            </button>
          ))}
        </div>

        {/* Program panel */}
        <div
          id={`program-panel-${current.id}`}
          role="tabpanel"
          aria-labelledby={`program-tab-${current.id}`}
          className={cn(
            'grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden animate-on-scroll animation-delay-300',
            isInView && 'in-view',
          )}
          style={{ border: '1px solid rgba(65,70,72,0.4)' }}
          key={current.id}
        >
          {/* Image */}
          <div className="relative h-64 sm:h-80 lg:h-auto lg:min-h-[500px]">
            <Image
              src={current.image}
              alt={current.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-500"
              priority={active === 0}
            />
            <div className="absolute inset-0 overlay-gradient" aria-hidden="true" />

            {/* Program badge */}
            <div className="absolute top-4 left-4">
              <span
                className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'rgba(20,20,20,0.7)',
                  border: '1px solid rgba(210,168,85,0.35)',
                  color: 'var(--color-ochre-400)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {current.tagline}
              </span>
            </div>

            {/* Enrollment status */}
            {current.enrollmentOpen && (
              <div className="absolute bottom-4 left-4">
                <span
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(157,193,131,0.15)',
                    border: '1px solid rgba(157,193,131,0.4)',
                    color: 'var(--color-sage-400)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
                  Enrollments Open
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="p-8 lg:p-12 flex flex-col"
            style={{ backgroundColor: 'rgba(30,30,30,0.8)' }}
          >
            <h3
              className="font-display font-semibold text-3xl mb-3"
              style={{ color: 'var(--color-foreground)' }}
            >
              {current.name}
            </h3>

            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {current.shortDescription}
            </p>

            {/* Meta info */}
            <div className="grid grid-cols-1 gap-2.5 mb-8">
              <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <MapPin size={14} style={{ color: 'var(--color-ochre-500)' }} aria-hidden="true" />
                {current.location}
              </div>
              {current.schedule[0] && (
                <div className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <Clock size={14} style={{ color: 'var(--color-ochre-500)', marginTop: '2px' }} aria-hidden="true" />
                  <span>{current.schedule.join(' • ')}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Users size={14} style={{ color: 'var(--color-ochre-500)' }} aria-hidden="true" />
                {current.targetAudience}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h4
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                What&apos;s included
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--color-ochre-500)', flexShrink: 0 }} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Link href={`/enroll?program=${current.id}`} className="btn-primary">
                Enroll Now
              </Link>
              <Link href={`/programs/${current.slug}`} className="btn-outline">
                Learn More
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* View all programs link */}
        <div
          className={cn(
            'text-center mt-8 animate-on-scroll animation-delay-400',
            isInView && 'in-view',
          )}
        >
          <Link href="/programs" className="btn-ghost text-sm">
            View all programs
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
