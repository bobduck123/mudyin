import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Heart, Phone, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Child Safety Policy — Mudyin Aboriginal Healing Centre',
  description: 'Mudyin\'s commitment to the safety, wellbeing, and cultural security of Aboriginal and Torres Strait Islander children in all our programs.',
}

const commitments = [
  'The safety, wellbeing, and best interests of every child is the primary consideration in all Mudyin programs and activities.',
  'All children have the right to be safe, respected, valued, and heard.',
  'Aboriginal children have the additional right to cultural safety — to maintain connection to Country, community, and culture.',
  'Child abuse and neglect in any form is unacceptable and will not be tolerated.',
  'All staff, volunteers, and contractors must undergo Working With Children Checks (WWCC) before working with children.',
  'All mandatory reporters at Mudyin understand and fulfil their legal obligations under NSW child protection legislation.',
]

const practices = [
  {
    title: 'Recruitment & Screening',
    body: 'All staff and volunteers who work with children must hold a current NSW Working With Children Check (WWCC). Reference checks and police checks are conducted for all relevant roles.',
  },
  {
    title: 'Code of Conduct',
    body: 'All Mudyin staff, volunteers, and contractors sign a Child Safety Code of Conduct. This outlines appropriate behaviour with children and describes prohibited conduct.',
  },
  {
    title: 'Supervision',
    body: 'Children in Mudyin programs are supervised by qualified staff at all times. One-on-one contact between a single adult and a child is avoided wherever possible.',
  },
  {
    title: 'Cultural Safety',
    body: 'Programs are designed and delivered in a culturally safe environment. Children are supported to maintain their cultural identity. Elder involvement is an important part of cultural safety.',
  },
  {
    title: 'Reporting',
    body: 'All staff and volunteers understand their mandatory reporting obligations. Any concern about a child\'s safety or wellbeing is reported to the NSW Child Protection Helpline (132 111) without delay.',
  },
  {
    title: 'Photography & Privacy',
    body: 'No child is photographed or recorded without written guardian consent. Photographs of children are never published on social media or the website without explicit permission.',
  },
  {
    title: 'Online Safety',
    body: 'Mudyin staff do not communicate with participants via personal social media accounts. All digital communication follows a documented online safety protocol.',
  },
  {
    title: 'Training',
    body: 'All Mudyin staff and relevant volunteers complete child safeguarding training on commencement and receive annual refresher training.',
  },
]

export default function ChildSafetyPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-mid">
          <span className="section-label">Safeguarding</span>
          <h1
            className="font-display font-semibold mt-2 mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-foreground)' }}
          >
            Child Safety Policy
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Mudyin Aboriginal Healing Centre is deeply committed to the safety, wellbeing, and cultural security of Aboriginal and Torres Strait Islander children. Every child has the right to be safe, and every child in our programs has the right to cultural safety.
          </p>
          <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Last reviewed: February 2025 — reviewed annually by the Mudyin Board and Cultural Advisory Group.
          </p>
        </div>
      </section>

      <section className="pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-mid">

          {/* Emergency box */}
          <div
            className="p-5 rounded-xl mb-10 flex items-start gap-4"
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} aria-hidden="true" />
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#fca5a5' }}>
                If a child is in immediate danger
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Call <strong>000</strong> immediately.
                For child protection concerns in NSW, call the{' '}
                <a
                  href="tel:132111"
                  style={{ color: '#fca5a5' }}
                  className="font-semibold hover:underline"
                >
                  Child Protection Helpline on 132 111
                </a>{' '}
                (24 hours, 7 days).
              </p>
            </div>
          </div>

          {/* Our commitments */}
          <h2
            className="font-display font-semibold text-2xl mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            Our Commitments
          </h2>
          <div className="space-y-3 mb-12">
            {commitments.map(c => (
              <div key={c} className="flex items-start gap-3">
                <CheckCircle
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--color-ochre-500)' }}
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {c}
                </p>
              </div>
            ))}
          </div>

          {/* Practices */}
          <h2
            className="font-display font-semibold text-2xl mb-6"
            style={{ color: 'var(--color-foreground)' }}
          >
            Child Safe Practices
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {practices.map(({ title, body }) => (
              <div key={title} className="card-dark p-5">
                <div className="flex items-start gap-3 mb-2">
                  <Shield
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-ochre-500)' }}
                    aria-hidden="true"
                  />
                  <h3
                    className="font-semibold text-base"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    {title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed pl-[22px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Reporting concerns */}
          <div className="card-dark p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={18} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
              <h2
                className="font-display font-semibold text-xl"
                style={{ color: 'var(--color-foreground)' }}
              >
                Reporting a Concern to Mudyin
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
              If you have a concern about the safety or wellbeing of a child in a Mudyin program (and the situation is not an emergency), please contact us:
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone size={13} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
                <a href="tel:0478796298" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                  0478 796 298 — Uncle Dave Bell (Program Director)
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Heart size={13} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
                <a href="mailto:info@mudyin.org.au" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                  info@mudyin.org.au
                </a>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              All concerns will be handled with the utmost seriousness, confidentiality, and sensitivity.
            </p>
          </div>

          {/* Related policies */}
          <div
            className="p-5 rounded-xl"
            style={{ background: 'rgba(210,168,85,0.05)', border: '1px solid rgba(210,168,85,0.2)' }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Related Policies
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                Privacy Policy →
              </Link>
              <Link href="/icip" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                ICIP Policy →
              </Link>
              <Link href="/contact" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                Contact Us →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
