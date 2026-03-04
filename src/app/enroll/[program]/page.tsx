import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Clock, MapPin, Users, ArrowLeft } from 'lucide-react'
import { programs } from '@/lib/data'
import { EnrollmentForm } from '@/components/forms/EnrollmentForm'

type Props = {
  params: Promise<{ program: string }>
}

export async function generateStaticParams() {
  return programs.map(p => ({ program: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { program: programId } = await params
  const program = programs.find(p => p.id === programId)
  if (!program) return { title: 'Not Found' }

  return {
    title: `Enroll in ${program.name} — Mudyin`,
    description: `Register for the ${program.name} — ${program.shortDescription}`,
    openGraph: {
      title: `Enroll: ${program.name}`,
      description: program.shortDescription,
      images: [{ url: program.image, alt: program.imageAlt }],
    },
  }
}

export default async function EnrollProgramPage({ params }: Props) {
  const { program: programId } = await params
  const program = programs.find(p => p.id === programId)

  if (!program) notFound()

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-16 section-padding overflow-hidden"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <Image
            src={program.image}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
            priority
          />
        </div>
        <div className="container-wide relative z-10">
          <Link
            href="/enroll"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:underline"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Programs
          </Link>

          <span className="section-label">Enrollment</span>
          <h1
            className="font-display font-semibold mt-2 mb-3"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--color-foreground)' }}
          >
            {program.name}
          </h1>
          <p
            className="text-lg italic mb-5"
            style={{ color: 'var(--color-ochre-400)' }}
          >
            {program.tagline}
          </p>

          <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <span className="flex items-center gap-1.5">
              <Users size={13} aria-hidden="true" />
              {program.targetAudience}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} aria-hidden="true" />
              {program.schedule}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} aria-hidden="true" />
              {program.location}
            </span>
          </div>
        </div>
      </section>

      <section className="pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Enrollment form */}
            <div className="lg:col-span-2">
              {!program.enrollmentOpen && (
                <div
                  className="mb-6 p-4 rounded-xl text-sm"
                  style={{
                    backgroundColor: 'rgba(251,191,36,0.08)',
                    border: '1px solid rgba(251,191,36,0.25)',
                    color: '#fbbf24',
                  }}
                >
                  Enrollment for this program is currently closed. Complete the form below to register your interest and we&apos;ll notify you when the next intake opens.
                </div>
              )}
              <h2
                className="font-display font-semibold text-2xl mb-6"
                style={{ color: 'var(--color-foreground)' }}
              >
                {program.enrollmentOpen ? 'Enrollment Form' : 'Register Interest'}
              </h2>
              <EnrollmentForm program={program.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Program summary */}
              <div className="card-dark p-6">
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-5">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                </div>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  {program.shortDescription}
                </p>
                <Link
                  href={`/programs/${program.slug}`}
                  className="btn-ghost text-xs"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Full program details →
                </Link>
              </div>

              {/* What to expect */}
              <div className="card-dark p-6">
                <h3
                  className="font-display font-semibold text-base mb-4"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  What You&apos;ll Gain
                </h3>
                <ul className="space-y-3">
                  {program.outcomes.slice(0, 5).map(outcome => (
                    <li key={outcome} className="flex items-start gap-2">
                      <CheckCircle
                        size={13}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--color-ochre-500)' }}
                        aria-hidden="true"
                      />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions */}
              <div
                className="p-5 rounded-xl text-sm"
                style={{
                  background: 'rgba(210,168,85,0.05)',
                  border: '1px solid rgba(210,168,85,0.2)',
                }}
              >
                <p className="font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Got questions?
                </p>
                <p className="mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Call Uncle Dave Bell on{' '}
                  <a href="tel:0478796298" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                    0478 796 298
                  </a>{' '}
                  or{' '}
                  <Link href="/contact" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                    send us a message
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
