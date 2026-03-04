'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

interface Props {
  heading:      string
  subheading:   string
  primaryCTA:   { label: string; href: string }
  secondaryCTA: { label: string; href: string }
}

export function CTABand({ heading, subheading, primaryCTA, secondaryCTA }: Props) {
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>()

  return (
    <section
      className="py-20 lg:py-24 section-padding relative overflow-hidden"
      aria-label="Call to action"
      style={{
        background: 'linear-gradient(135deg, rgba(139,37,0,0.12) 0%, rgba(20,20,20,1) 40%, rgba(20,20,20,1) 60%, rgba(210,168,85,0.08) 100%)',
        borderTop:    '1px solid rgba(210,168,85,0.15)',
        borderBottom: '1px solid rgba(210,168,85,0.15)',
      }}
    >
      {/* Decorative */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(210,168,85,0.05) 0%, transparent 70%)',
        }}
      />

      <div ref={ref} className="container-mid relative text-center">
        <div className={cn('animate-on-scroll', isInView && 'in-view')}>
          <span className="section-label">Join Our Community</span>

          <h2
            className="font-display font-semibold mt-2 mb-5 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(1.875rem, 4vw, 3rem)',
              color: 'var(--color-foreground)',
            }}
          >
            {heading}
          </h2>

          <p
            className="text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            {subheading}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryCTA.href} className="btn-primary text-base px-8 py-4">
              {primaryCTA.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href={secondaryCTA.href} className="btn-outline text-base px-8 py-4">
              {secondaryCTA.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
