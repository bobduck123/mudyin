import type { Metadata } from 'next'
import Link from 'next/link'
import { Heart, ShieldCheck, FileText, Star, Users } from 'lucide-react'
import { DonationForm }  from '@/components/forms/DonationForm'
import { CTABand }       from '@/components/sections/CTABand'
import { siteConfig, donationAmounts, impactMessages } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Donate — Support Aboriginal Youth & Healing',
  description:
    'Your donation to Mudyin Aboriginal Healing Centre funds the Young Spirit Mentoring Program, Thrive Tribe, and healing services for Aboriginal communities. DGR registered, fully tax-deductible.',
  openGraph: {
    title:       'Donate to Mudyin — Healing Our Community Together',
    description: 'Support 25 years of Aboriginal-led youth mentoring and healing. Every dollar goes directly to community.',
  },
}

const trustSignals = [
  { Icon: ShieldCheck, label: 'DGR Registered',       desc: 'All donations ≥$2 are fully tax-deductible' },
  { Icon: FileText,    label: 'ACNC Registered',       desc: 'Registered charity with the Australian Charities and Not-for-profits Commission' },
  { Icon: ShieldCheck, label: 'Secure Payments',       desc: 'PCI-compliant payment processing via Stripe' },
  { Icon: Users,       label: 'Community-Led',         desc: '100% of program funds go directly to Aboriginal community programs' },
]

export default function DonatePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-mid text-center">
          <span className="section-label">Make a Difference</span>
          <h1
            className="font-display font-semibold mt-2 mb-5"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--color-foreground)',
            }}
          >
            Your Generosity{' '}
            <span className="gradient-text">Changes Lives</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            For 25 years, Mudyin has walked alongside Aboriginal communities — building strength, healing, and belonging. Your gift keeps this work alive.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section
        className="pb-20 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Donation form — left */}
            <div className="lg:col-span-3">
              <div className="card-dark p-8">
                <h2
                  className="font-display font-semibold text-2xl mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Choose Your Gift
                </h2>
                <DonationForm />
              </div>
            </div>

            {/* Trust signals — right */}
            <div className="lg:col-span-2 space-y-6">

              {/* Impact examples */}
              <div className="card-dark p-6">
                <h3
                  className="font-display font-semibold text-lg mb-4 flex items-center gap-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  <Heart size={16} fill="currentColor" style={{ color: 'var(--color-ochre-500)' }} aria-hidden="true" />
                  Your Impact
                </h3>
                <div className="space-y-3">
                  {donationAmounts.map(amount => (
                    <div
                      key={amount}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span
                        className="font-bold flex-shrink-0 w-12 text-right"
                        style={{ color: 'var(--color-ochre-400)' }}
                      >
                        ${amount}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {impactMessages[amount]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust signals */}
              <div className="card-dark p-6">
                <h3
                  className="font-display font-semibold text-lg mb-4"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  You Can Trust Us
                </h3>
                <div className="space-y-4">
                  {trustSignals.map(({ Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon
                        size={16}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--color-ochre-500)' }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                          {label}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-5 pt-5 text-xs"
                  style={{ borderTop: '1px solid rgba(65,70,72,0.4)', color: 'rgba(255,255,255,0.4)' }}
                >
                  ABN: {siteConfig.abn} — Registered charity under the Australian Charities Act 2013.
                </div>
              </div>

              {/* Testimonial */}
              <div
                className="p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(210,168,85,0.06), rgba(139,37,0,0.06))',
                  border: '1px solid rgba(210,168,85,0.15)',
                }}
              >
                <Star size={14} fill="currentColor" style={{ color: 'var(--color-ochre-500)', marginBottom: '12px' }} aria-hidden="true" />
                <p className="italic text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  &ldquo;Every year I donate to Mudyin. I can see directly what it does — young people showing up, getting strong, staying in school. That&apos;s what I call value.&rdquo;
                </p>
                <p className="text-xs" style={{ color: 'var(--color-ochre-400)' }}>
                  — Corporate donor, 4 years
                </p>
              </div>

              {/* Corporate giving */}
              <div className="text-center">
                <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Interested in corporate or major gifts?
                </p>
                <Link href="/contact?type=partnership" className="btn-ghost text-sm">
                  Discuss Partnership →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="Can't Give Right Now?"
        subheading="There are other ways to support Mudyin — volunteer, partner, or simply share our story with your community."
        primaryCTA={{ label: 'Get Involved', href: '/enroll' }}
        secondaryCTA={{ label: 'Contact Us', href: '/contact' }}
      />
    </>
  )
}
