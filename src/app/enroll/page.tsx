import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Clock, MapPin, Users } from 'lucide-react'
import { programs } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Enroll — Join a Mudyin Program',
  description:
    'Request a place in the Young Spirit Mentoring Program, Thrive Tribe, or Healing Centre services. Aboriginal-led programs for youth and community in Campbelltown and beyond.',
  openGraph: {
    title: 'Request a place in a Mudyin program',
    description: 'Take the first step. Send a program request for Aboriginal-led mentoring, healing, and community programs.',
  },
}

const steps = [
  { step: '01', title: 'Choose a Program', desc: 'Select the program that fits your needs or your young person\'s stage of life.' },
  { step: '02', title: 'Complete the Form', desc: 'Fill out the online request form. It takes about 10 minutes.' },
  { step: '03', title: 'We\'ll Be in Touch', desc: 'Our team will contact you within 2 business days to discuss next steps.' },
  { step: '04', title: 'Confirm Together', desc: 'The team will confirm availability before a place or appointment is set.' },
]

export default function EnrollPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-mid text-center">
          <span className="section-label">Program Requests</span>
          <h1
            className="font-display font-semibold mt-2 mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-foreground)' }}
          >
            Take the First Step
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Our programs are open to Aboriginal and Torres Strait Islander young people and families. No referral needed — just reach out.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-16 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2
              className="font-display font-semibold text-3xl mb-3"
              style={{ color: 'var(--color-foreground)' }}
            >
              How Requests Work
            </h2>
            <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Simple, respectful, and community-led from day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" data-decorative="true">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 font-display font-bold text-xl"
                  style={{
                    backgroundColor: 'rgba(210,168,85,0.12)',
                    border: '2px solid rgba(210,168,85,0.3)',
                    color: 'var(--color-ochre-400)',
                  }}
                >
                  {step}
                </div>
                <h3
                  className="font-display font-semibold text-lg mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Program cards */}
          <h2
            className="font-display font-semibold text-3xl mb-8 text-center"
            style={{ color: 'var(--color-foreground)' }}
          >
            Choose Your Program
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {programs.map(program => (
              <div key={program.id} className="card-dark overflow-hidden flex flex-col">
                <div className="relative h-48 w-full flex-shrink-0">
                  <Image
                    src={program.image}
                    alt={program.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="overlay-dark absolute inset-0" />
                  {program.enrollmentOpen ? (
                    <span
                      className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}
                    >
                      Requests Open
                    </span>
                  ) : (
                    <span
                      className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      Enquire
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className="font-display font-semibold text-xl mb-1"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {program.name}
                  </h3>
                  <p
                    className="text-sm mb-4 italic"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {program.tagline}
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {program.shortDescription}
                  </p>

                  <div className="space-y-2 mb-5 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-2">
                      <Users size={12} aria-hidden="true" />
                      <span>{program.targetAudience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} aria-hidden="true" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} aria-hidden="true" />
                      <span>{program.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-2">
                    <Link
                      href="/contact#booking-request"
                      className="btn-primary w-full text-center text-sm"
                    >
                      {program.enrollmentOpen ? 'Request a Place' : 'Register Interest'}
                    </Link>
                    <Link
                      href={`/programs/${program.slug}`}
                      className="btn-ghost w-full text-center text-sm"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Eligibility note */}
          <div
            className="mt-12 p-6 rounded-xl"
            style={{
              background: 'rgba(210,168,85,0.05)',
              border: '1px solid rgba(210,168,85,0.2)',
            }}
          >
            <h3
              className="font-display font-semibold text-lg mb-3"
              style={{ color: 'var(--color-ochre-400)' }}
            >
              Eligibility & Support
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <div className="space-y-2">
                {[
                  'Programs are primarily for Aboriginal and Torres Strait Islander people',
                  'Some programs welcome all young people when space allows',
                  'No ATAR or school completion required',
                ].map(point => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-ochre-500)' }} aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  'Transport assistance available for YSMP participants',
                  'All programs are free - funded by grants and approved community support',
                  'Interpreter support available on request',
                ].map(point => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-ochre-500)' }} aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact fallback */}
          <p className="text-center text-sm mt-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Not sure which program is right for you?{' '}
            <Link href="/contact" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
              Contact us
            </Link>{' '}
            and we&apos;ll help you find the best fit.
          </p>
        </div>
      </section>
    </>
  )
}
