'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { impactMetrics } from '@/lib/data'

export function ImpactCarousel() {
  const [active, setActive]     = useState(0)
  const [paused, setPaused]     = useState(false)
  const total                   = impactMetrics.length

  const next = useCallback(() => setActive(i => (i + 1) % total), [total])
  const prev = useCallback(() => setActive(i => (i - 1 + total) % total), [total])

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, paused])

  const current = impactMetrics[active]

  return (
    <section
      id="impact"
      className="relative h-[80vh] min-h-[520px] max-h-[800px] overflow-hidden"
      aria-label="Our impact"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {impactMetrics.map((metric, i) => (
        <div
          key={metric.label}
          aria-hidden={i !== active}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={metric.image}
            alt={metric.imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
            style={{
              animation: i === active ? 'kenBurns 22s ease-in-out infinite alternate' : 'none',
            }}
          />
          <div className="absolute inset-0 overlay-dark" aria-hidden="true" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container-wide section-padding h-full flex flex-col items-center justify-center text-center">
        <div
          key={active}
          style={{ animation: 'fadeUp 0.7s ease-out both' }}
        >
          <p
            className="font-script text-2xl mb-2"
            style={{ color: 'var(--color-ochre-400)' }}
            aria-hidden="true"
          >
            Our Impact
          </p>

          <div
            className="font-display font-bold mb-4"
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, var(--color-ochre-300), var(--color-ochre-500))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            aria-label={`${current.stat} — ${current.label}`}
          >
            {current.stat}
          </div>

          <h2
            className="font-display font-semibold text-3xl lg:text-4xl mb-4"
            style={{ color: 'var(--color-foreground)' }}
          >
            {current.label}
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {current.description}
          </p>

          <Link href="/impact" className="btn-outline">
            See All Impact Data
          </Link>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-y-0 left-4 z-20 flex items-center">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: 'rgba(20,20,20,0.5)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(210,168,85,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(20,20,20,0.5)' }}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 z-20 flex items-center">
        <button
          onClick={next}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: 'rgba(20,20,20,0.5)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(210,168,85,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(20,20,20,0.5)' }}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Dot indicators */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2"
        role="group"
        aria-label="Slide indicators"
      >
        {impactMetrics.map((metric, i) => (
          <button
            key={metric.label}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}: ${metric.label}`}
            aria-current={i === active ? 'true' : undefined}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === active ? '24px' : '8px',
              height: '8px',
              backgroundColor: i === active
                ? 'var(--color-ochre-500)'
                : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
