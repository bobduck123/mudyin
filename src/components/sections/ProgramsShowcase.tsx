'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { mudyinProgramStreams, statusLabel } from '@/lib/mudyin-operational-model'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

export function ProgramsShowcase() {
  const [active, setActive] = useState(0)
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>()
  const current = mudyinProgramStreams[active]

  return (
    <section
      id="programs"
      className="py-20 lg:py-32 section-padding"
      style={{ backgroundColor: 'var(--color-background)' }}
      aria-label="Program streams"
    >
      <div ref={ref} className="container-wide">
        <div className={cn('text-center mb-14 animate-on-scroll', isInView && 'in-view')}>
          <span className="section-label">Program Streams</span>
          <h2 className="font-display font-semibold text-display-md lg:text-display-lg mt-2 mb-4 text-white">
            One operating entity, staged public rollout
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white/60">
            Mudyin presents its public work as controlled sub-program streams under MUDYIN PTY LTD. Active and future-phase status is kept visible.
          </p>
        </div>

        <div
          className={cn(
            'flex flex-col sm:flex-row justify-center gap-3 mb-12 animate-on-scroll animation-delay-200',
            isInView && 'in-view',
          )}
          role="tablist"
          aria-label="Program stream selection"
        >
          {mudyinProgramStreams.map((stream, i) => (
            <button
              key={stream.slug}
              role="tab"
              aria-selected={active === i}
              aria-controls={`program-panel-${stream.slug}`}
              id={`program-tab-${stream.slug}`}
              onClick={() => setActive(i)}
              className={cn('px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300', active === i ? 'shadow-cultural' : 'hover:bg-white/5')}
              style={
                active === i
                  ? { backgroundColor: 'var(--color-sage-500)', color: 'var(--color-foreground)' }
                  : { backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.65)' }
              }
            >
              {stream.name}
            </button>
          ))}
        </div>

        <div
          id={`program-panel-${current.slug}`}
          role="tabpanel"
          aria-labelledby={`program-tab-${current.slug}`}
          className={cn(
            'grid gap-0 rounded-2xl overflow-hidden animate-on-scroll animation-delay-300 healing-panel lg:grid-cols-[0.8fr_1.2fr]',
            isInView && 'in-view',
          )}
          key={current.slug}
        >
          <div className="p-8 lg:p-12" style={{ backgroundColor: 'rgba(71,57,47,0.72)' }}>
            <div className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/75">
              {statusLabel(current.status)}
            </div>
            <h3 className="font-display mt-6 text-3xl font-semibold text-white">{current.name}</h3>
            <p className="mt-3 text-sm text-ochre-200/80">{current.phase}</p>
            <ul className="mt-8 space-y-3 text-sm text-white/65">
              {[
                `Parent entity: ${current.parentEntity}`,
                current.enquiryEnabled ? 'Enquiry pathway enabled' : 'Enquiry pathway paused',
                current.status === 'future_phase' ? 'Not represented as a live service' : 'Open for first-live review requests',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-sage-300" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col p-8 lg:p-12" style={{ backgroundColor: 'rgba(58,44,35,0.82)' }}>
            <p className="text-base leading-relaxed text-white/68">{current.description}</p>
            <div className="mt-8 rounded-xl border border-sage-300/20 bg-sage-900/25 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-white/45">Cultural care</h4>
              <p className="mt-3 text-sm leading-6 text-white/65">{current.culturalNote}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/contact#booking-request" className="btn-primary">
                Submit Request
              </Link>
              <Link href={`/programs/${current.slug}`} className="btn-outline">
                Learn More
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className={cn('text-center mt-8 animate-on-scroll animation-delay-400', isInView && 'in-view')}>
          <Link href="/programs" className="btn-ghost text-sm">
            View all streams
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
