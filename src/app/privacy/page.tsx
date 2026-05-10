import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Privacy Policy — Mudyin Aboriginal Healing Centre',
  description: 'How Mudyin Aboriginal Healing Centre collects, uses, and protects your personal information in accordance with Australian privacy law.',
}

const sections = [
  {
    id: 'collection',
    heading: '1. Information We Collect',
    content: [
      {
        sub: 'Contact and Program Request Information',
        body: 'When you contact us or request a program place, we may collect your name, email address, phone number, date of birth, and information relevant to program participation (including emergency contacts and medical information where required for participant safety).',
      },
      {
        sub: 'Website Usage Data',
        body: 'We use privacy-respecting analytics (Plausible Analytics — no cookies, no cross-site tracking) to understand how our website is used. This data is anonymous and aggregated.',
      },
      {
        sub: 'Sensitive Information',
        body: 'Where we collect sensitive information (including health information, cultural background, or information about children), we do so only with your explicit informed consent and only where it is necessary for program delivery or legal compliance.',
      },
    ],
  },
  {
    id: 'use',
    heading: '2. How We Use Your Information',
    content: [
      {
        sub: 'Program Delivery',
        body: 'Personal information is used to administer your participation in Mudyin programs, communicate updates, and ensure participant safety.',
      },
      {
        sub: 'Communications',
        body: 'With your consent, we may send newsletters, program updates, or impact reports. You can unsubscribe at any time.',
      },
      {
        sub: 'Donations',
        body: 'Public donations are disabled for first launch. Donor information should only be collected after payment, charity, receipt, and consent processes are confirmed by the operator.',
      },
      {
        sub: 'Legal Obligations',
        body: 'We may use or disclose your information where required by Australian law, including mandatory reporting obligations under child protection legislation.',
      },
    ],
  },
  {
    id: 'sharing',
    heading: '3. Sharing Your Information',
    content: [
      {
        sub: 'We Do Not Sell Your Data',
        body: 'Mudyin Aboriginal Healing Centre does not sell, rent, or trade personal information to third parties for marketing purposes.',
      },
      {
        sub: 'Service Providers',
        body: 'We share information with trusted service providers who assist us in operating our website and programs (such as payment processors and email platforms), under strict confidentiality agreements.',
      },
      {
        sub: 'Funding Bodies',
        body: 'De-identified, aggregated program data may be shared with government funding bodies as required under grant reporting obligations.',
      },
    ],
  },
  {
    id: 'security',
    heading: '4. Security',
    content: [
      {
        sub: 'Data Protection',
        body: 'We take reasonable steps to protect your personal information from misuse, interference, loss, unauthorised access, modification, or disclosure. This includes encrypted data transmission, secure hosting, and staff training.',
      },
      {
        sub: 'Breach Notification',
        body: 'In the event of an eligible data breach, we will notify affected individuals and the Office of the Australian Information Commissioner (OAIC) in accordance with the Notifiable Data Breaches scheme.',
      },
    ],
  },
  {
    id: 'access',
    heading: '5. Accessing and Correcting Your Information',
    content: [
      {
        sub: 'Your Rights',
        body: 'You have the right to access personal information we hold about you and to request corrections if the information is inaccurate, out of date, incomplete, or misleading.',
      },
      {
        sub: 'How to Request Access',
        body: `Contact us at ${siteConfig.email} or by phone on ${siteConfig.phone}. We will respond to access requests within 30 days.`,
      },
    ],
  },
  {
    id: 'children',
    heading: '6. Children\'s Privacy',
    content: [
      {
        sub: 'Parental Consent',
        body: 'Where programs involve participants under 18 years of age, we collect personal information from parents or guardians. Photographs or recordings of minors are only published with written guardian consent.',
      },
      {
        sub: 'Child Safety',
        body: 'Our approach to child safety, including how we protect children\'s information and identity, is outlined in our Child Safety Policy.',
      },
    ],
  },
  {
    id: 'changes',
    heading: '7. Changes to This Policy',
    content: [
      {
        sub: 'Updates',
        body: 'We may update this Privacy Policy from time to time. The current version is always available on this page. Significant changes will be communicated via email where we hold your contact information.',
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section
        className="pt-32 pb-12 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-mid">
          <span className="section-label">Legal</span>
          <h1
            className="font-display font-semibold mt-2 mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-foreground)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-base mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Last updated: February 2025
          </p>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {siteConfig.name} is committed to protecting your privacy in accordance with the{' '}
            <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).
          </p>
        </div>
      </section>

      <section className="pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-mid">
          {/* Table of contents */}
          <nav
            className="card-dark p-5 mb-10 rounded-xl"
            aria-label="Privacy policy contents"
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Contents
            </p>
            <ol className="space-y-1">
              {sections.map(s => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm hover:underline"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map(s => (
              <div key={s.id} id={s.id}>
                <h2
                  className="font-display font-semibold text-xl mb-5"
                  style={{
                    color: 'var(--color-foreground)',
                    borderBottom: '1px solid rgba(65,70,72,0.4)',
                    paddingBottom: '12px',
                  }}
                >
                  {s.heading}
                </h2>
                <div className="space-y-5">
                  {s.content.map(item => (
                    <div key={item.sub}>
                      <h3
                        className="font-semibold text-base mb-1"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {item.sub}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div
            className="mt-12 p-6 rounded-xl"
            style={{ background: 'rgba(210,168,85,0.05)', border: '1px solid rgba(210,168,85,0.2)' }}
          >
            <h2
              className="font-display font-semibold text-lg mb-2"
              style={{ color: 'var(--color-ochre-400)' }}
            >
              Privacy Enquiries &amp; Complaints
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              For privacy enquiries or complaints, contact our Privacy Officer at{' '}
              <a href={`mailto:${siteConfig.email}`} style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                {siteConfig.email}
              </a>
              {' '}or by phone on{' '}
              <a href="tel:0478796298" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                {siteConfig.phone}
              </a>.
              If you are not satisfied with our response, you may contact the{' '}
              <a
                href="https://www.oaic.gov.au/privacy/privacy-complaints"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-ochre-400)' }}
                className="hover:underline"
              >
                Office of the Australian Information Commissioner
              </a>.
            </p>
            <Link href="/contact" className="btn-ghost text-sm">
              Contact Us →
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
