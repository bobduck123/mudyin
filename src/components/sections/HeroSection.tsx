'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowDown, CalendarCheck2, MessageCircle } from 'lucide-react'
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
        <span style={{ color: 'var(--color-sage-300)' }}>{suffix}</span>
      </div>
      <div className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.56)', letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  )
}

const careTrail = [
  { id: 'programs', label: 'Program Streams', href: '/programs' },
  { id: 'womens-business', label: "Women's Business", href: '/programs/womens-business' },
  { id: 'governance', label: 'Governance', href: '/governance' },
  { id: 'contact', label: 'Contact', href: '/contact' },
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero - Mudyin Aboriginal Healing Centre"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true" data-decorative="true">
        {!videoEnded ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/videos/mudyin-hero.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoEnded(true)}
          />
        ) : (
          <Image
            src="/images/hero-banner.jpg"
            alt="Mudyin Aboriginal Healing Centre"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(47,36,29,0.42) 0%, rgba(47,36,29,0.72) 55%, rgba(47,36,29,0.96) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 20% 24%, rgba(111,138,120,0.24), transparent 38%), radial-gradient(ellipse at 78% 74%, rgba(184,117,85,0.16), transparent 42%)',
            opacity: 0.72,
          }}
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
        >
          Aboriginal-led care, culture, and connection
        </span>

        <div
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase"
          style={{
            letterSpacing: '0.08em',
            backgroundColor: 'rgba(255,248,239,0.1)',
            border: '1px solid rgba(255,248,239,0.18)',
            color: 'rgba(255,255,255,0.82)',
            boxShadow: '0 10px 22px rgba(0,0,0,0.28)',
          }}
        >
          <span className="w-2 h-2 rounded-full healing-disc" aria-hidden="true" />
          First-live enquiries under MUDYIN PTY LTD
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
          A calm place to begin.
          <br />
          A strong path to keep walking.
        </h1>

        <p
          className="text-lg md:text-xl max-w-3xl mb-9 leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.76)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s',
          }}
        >
          Mudyin is preparing culturally grounded program streams with careful intake,
          clear future-phase labels, and respectful pathways for enquiries and booking requests.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {careTrail.map((item, idx) => (
            <Link
              key={item.id}
              href={item.href}
              className="healing-chip"
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
            transition: 'opacity 0.75s ease-out 0.48s, transform 0.75s ease-out 0.48s',
          }}
        >
          <Link href="/contact#booking-request" className="btn-primary text-base px-8 py-4">
            <CalendarCheck2 size={16} aria-hidden="true" />
            Request a Booking
          </Link>
          <Link href="/contact#general-enquiry" className="btn-outline text-base px-8 py-4">
            <MessageCircle size={16} aria-hidden="true" />
            General Enquiry
          </Link>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-14 pt-10 w-full max-w-3xl"
          style={{
            borderTop: '1px solid rgba(255,248,239,0.22)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.95s ease-out 0.58s',
          }}
          aria-label="First-live readiness summary"
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
