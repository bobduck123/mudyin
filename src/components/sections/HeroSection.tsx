'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, Play } from 'lucide-react'
import { heroStats } from '@/lib/data'
import { useCountUp } from '@/hooks/useCountUp'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

function StatItem({ label, value, suffix, index }: { label: string; value: number; suffix: string; index: number }) {
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 })
  const count = useCountUp({ end: value, duration: 2200, enabled: isInView })

  return (
    <div
      ref={ref}
      className="text-center animate-on-scroll"
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div
        className="text-3xl lg:text-4xl font-display font-bold mb-1"
        style={{ color: 'var(--color-ochre-400)' }}
        aria-label={`${count.toLocaleString()}${suffix} ${label}`}
      >
        {isInView ? count.toLocaleString() : '0'}
        <span style={{ color: 'var(--color-ochre-500)' }}>{suffix}</span>
      </div>
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.52)' }}>
        {label}
      </div>
    </div>
  )
}

const storyTrail = [
  { id: 'community', label: 'Community', href: '/community' },
  { id: 'impact', label: 'Impact', href: '/impact' },
  { id: 'marketplace', label: 'Marketplace', href: '/marketplace' },
  { id: 'resources', label: 'Resources', href: '/resources' },
]

export function HeroSection() {
  const [visible, setVisible] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 180)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden blak-motif-organic country-lines"
      aria-label="Hero - Mudyin Aboriginal Healing Centre"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true" data-decorative="true">
        {!videoEnded ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/images/hero-video.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoEnded(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/hero-banner.jpg"
            alt="Mudyin Aboriginal Healing Centre"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(20,20,20,0.5) 0%, rgba(20,20,20,0.74) 55%, rgba(20,20,20,0.96) 100%)',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-1/3"
          style={{ background: 'linear-gradient(110deg, rgba(219,22,47,0.22), transparent 70%)' }}
          data-decorative="true"
        />
        <div
          className="absolute inset-y-0 right-0 w-1/3"
          style={{ background: 'linear-gradient(250deg, rgba(243,222,44,0.18), transparent 70%)' }}
          data-decorative="true"
        />
      </div>

      <div className="relative z-10 container-wide section-padding w-full flex flex-col items-center text-center pt-32 pb-20">
        <span
          className="font-script text-3xl mb-4 block"
          style={{
            color: 'var(--color-ochre-400)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
          }}
          aria-hidden="true"
        >
          Welcome Home
        </span>

        <div
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-widest"
          style={{
            backgroundColor: 'rgba(2,2,2,0.58)',
            border: '1px solid rgba(243,222,44,0.4)',
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          <span style={{ color: 'var(--color-flag-red)' }}>●</span>
          Community-Led
          <span style={{ color: 'var(--color-flag-yellow)' }}>●</span>
          On Country
        </div>

        <h1
          className="font-display font-semibold max-w-5xl mb-6"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.7rem)',
            lineHeight: '1.04',
            color: 'var(--color-foreground)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s',
          }}
        >
          Pride in Our Momentum.
          <br />
          Safe in Our Warmth.
        </h1>

        <p
          className="text-lg md:text-xl max-w-3xl mb-9 leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.75)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s',
          }}
        >
          Story first. Impact always. Walk the trails below to see how culture, care, and collective action shape every part of Mudyin.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {storyTrail.map((item, idx) => (
            <Link
              key={item.id}
              href={item.href}
              className="ritual-chip"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.7s ease-out ${0.35 + idx * 0.08}s, transform 0.7s ease-out ${0.35 + idx * 0.08}s`,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.75s ease-out 0.45s, transform 0.75s ease-out 0.45s',
          }}
        >
          <Link href="/programs" className="btn-primary text-base px-8 py-4">
            Explore Programs
          </Link>
          <Link href="/about/our-story" className="btn-outline text-base px-8 py-4">
            <Play size={16} aria-hidden="true" />
            Our Story
          </Link>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-14 pt-10 w-full max-w-3xl"
          style={{
            borderTop: '1px solid rgba(210,168,85,0.24)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.95s ease-out 0.58s',
          }}
          aria-label="Key impact statistics"
        >
          {heroStats.map((stat, i) => (
            <StatItem key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{
          opacity: visible ? 0.55 : 0,
          transition: 'opacity 1s ease-out 1.1s',
        }}
        aria-hidden="true"
        data-decorative="true"
      >
        <div style={{ animation: 'fadeUp 1.25s ease-out infinite alternate' }}>
          <ArrowDown size={20} style={{ color: 'var(--color-ochre-400)' }} />
        </div>
      </div>
    </section>
  )
}
