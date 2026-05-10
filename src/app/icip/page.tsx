import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Eye, Heart, AlertTriangle, BookOpen, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ICIP — Indigenous Cultural & Intellectual Property Policy',
  description:
    'Mudyin\'s policy on Indigenous Cultural and Intellectual Property (ICIP) — protecting Aboriginal knowledge, stories, art, and cultural expressions.',
  robots: { index: true, follow: true },
}

const principles = [
  {
    Icon: Shield,
    title: 'Protection',
    desc: 'All cultural knowledge, stories, songs, art, and ceremonies shared within Mudyin programs remain the intellectual property of the Aboriginal communities from which they originate.',
  },
  {
    Icon: Eye,
    title: 'Consent',
    desc: 'Photographs, videos, and recordings of cultural activities, Elders, and participants are only taken and used with explicit, informed, free prior and informed consent (FPIC).',
  },
  {
    Icon: Heart,
    title: 'Respect',
    desc: 'Cultural materials are used respectfully and never taken out of context, trivialised, commercialised without community agreement, or appropriated.',
  },
  {
    Icon: Users,
    title: 'Community Ownership',
    desc: 'Cultural IP created within Mudyin programs belongs to the community, not to Mudyin as an organisation. Communities retain the right to withdraw consent at any time.',
  },
]

export default function ICIPPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-16 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-mid">
          <span className="section-label">Cultural Policy</span>
          <h1
            className="font-display font-semibold mt-2 mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-foreground)' }}
          >
            Indigenous Cultural &amp;{' '}
            <span className="gradient-text">Intellectual Property</span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Mudyin is committed to protecting Aboriginal and Torres Strait Islander cultural and intellectual property. This policy outlines how we handle, use, and protect cultural knowledge within our platforms and programs.
          </p>
          <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Last updated: February 2025 — pending review by Uncle Dave Bell and Kaiyu Bayles.
          </p>
        </div>
      </section>

      <section className="pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-mid">

          {/* Cultural warning */}
          <div
            className="p-5 rounded-xl mb-10 flex items-start gap-4"
            style={{
              backgroundColor: 'rgba(184,117,85,0.12)',
              border: '1px solid rgba(184,117,85,0.3)',
            }}
          >
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} aria-hidden="true" />
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#fca5a5' }}>
                Cultural Sensitivity Notice
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                This website may contain names, images, and voices of Aboriginal and Torres Strait Islander people. Some content may include references to cultural practices and ceremonies. We acknowledge that cultural protocols vary between communities and Country.
              </p>
            </div>
          </div>

          {/* Core principles */}
          <h2
            className="font-display font-semibold text-2xl mb-8"
            style={{ color: 'var(--color-foreground)' }}
          >
            Our Core Principles
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {principles.map(({ Icon, title, desc }) => (
              <div key={title} className="card-dark p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(210,168,85,0.12)', border: '1px solid rgba(210,168,85,0.25)' }}
                >
                  <Icon size={18} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
                </div>
                <h3
                  className="font-display font-semibold text-lg mb-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Policy sections */}
          {[
            {
              Icon: BookOpen,
              heading: 'Digital Content & Photography',
              body: [
                'All participant photographs on this website have been taken with written consent.',
                'Where a participant or their guardian has withdrawn consent, images are removed within 48 hours of notification.',
                'No images of Elders, ceremonies, or sacred practices are published without explicit community authority.',
                'Children under 18 years are only photographed and published with guardian consent and with faces partially or fully obscured where required.',
              ],
            },
            {
              Icon: Heart,
              heading: 'Traditional Knowledge & Stories',
              body: [
                'Traditional stories, songs, and knowledge shared by Elders and community members during programs are treated with the highest respect.',
                'Stories told in program settings are not recorded, transcribed, or published without explicit permission from the knowledge holder.',
                'Mudyin does not claim ownership over any Aboriginal cultural or traditional knowledge.',
                'Community members may request that any cultural content be removed from our platforms at any time.',
              ],
            },
            {
              Icon: Shield,
              heading: 'Reporting & Concerns',
              body: [
                'If you believe that cultural IP has been misused or that this policy has been breached, please contact us immediately.',
                'All ICIP concerns are escalated to Uncle Dave Bell (Cultural Director) for resolution.',
                'We commit to responding to ICIP concerns within 5 business days.',
                'This policy is reviewed annually in consultation with community Elders and the Mudyin Cultural Advisory Group.',
              ],
            },
          ].map(({ Icon, heading, body }) => (
            <div key={heading} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Icon size={18} style={{ color: 'var(--color-ochre-500)' }} aria-hidden="true" />
                <h2
                  className="font-display font-semibold text-xl"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {heading}
                </h2>
              </div>
              <ul className="space-y-3">
                {body.map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    <span
                      className="flex-shrink-0 w-1 h-1 rounded-full mt-2"
                      style={{ backgroundColor: 'var(--color-ochre-500)' }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div
            className="p-6 rounded-xl mt-8"
            style={{
              background: 'rgba(210,168,85,0.05)',
              border: '1px solid rgba(210,168,85,0.2)',
            }}
          >
            <h3
              className="font-display font-semibold text-lg mb-2"
              style={{ color: 'var(--color-ochre-400)' }}
            >
              Questions or Concerns?
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              If you have questions about our ICIP policy or wish to report a concern, please reach out to us directly. We take all cultural IP matters seriously and respond with care.
            </p>
            <Link href="/contact?type=general" className="btn-primary text-sm">
              Contact Us
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
