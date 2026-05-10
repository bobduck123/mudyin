import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Terms of Use — Mudyin Aboriginal Healing Centre',
  description: 'Terms and conditions for using the Mudyin Aboriginal Healing Centre website.',
}

const sections = [
  {
    id: 'acceptance',
    heading: '1. Acceptance of Terms',
    body: `By accessing or using the ${siteConfig.name} website (${siteConfig.url}), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.`,
  },
  {
    id: 'use',
    heading: '2. Acceptable Use',
    body: 'You may use this website for lawful purposes only. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way that is unlawful, illegal, fraudulent, or harmful. You must not use our website to transmit or post any material that is offensive, abusive, or discriminatory.',
  },
  {
    id: 'intellectual',
    heading: '3. Intellectual Property',
    body: 'The content on this website — including text, images, logos, and program materials — is owned by or licensed to Mudyin Aboriginal Healing Centre Inc. All Aboriginal cultural content and imagery remains the cultural property of the respective communities and knowledge holders (see our ICIP Policy). You must not reproduce, distribute, or create derivative works from our content without written permission.',
  },
  {
    id: 'cultural',
    heading: '4. Cultural Content',
    body: 'This website contains Aboriginal and Torres Strait Islander cultural content. Users must engage with this content respectfully. Downloading, sharing, or using cultural imagery, stories, or content for commercial purposes without explicit permission from the relevant community is prohibited and may be a breach of Indigenous Cultural and Intellectual Property (ICIP) rights.',
  },
  {
    id: 'links',
    heading: '5. External Links',
    body: 'Our website may contain links to external websites. These links are provided for your convenience. Mudyin is not responsible for the content or privacy practices of external websites. The inclusion of a link does not constitute an endorsement.',
  },
  {
    id: 'accuracy',
    heading: '6. Accuracy of Information',
    body: 'While we make every effort to ensure the information on this website is current and accurate, we do not warrant its completeness or accuracy. Program schedules, fees, and enrollment details are subject to change. Please contact us directly to confirm current program information.',
  },
  {
    id: 'donations',
    heading: '7. Donations',
    body: 'Public donations are disabled for first launch until payment, charity, and tax status are confirmed by the operator. Do not treat any donation copy on this site as active fundraising instructions unless it is explicitly confirmed by Mudyin.',
  },
  {
    id: 'liability',
    heading: '8. Limitation of Liability',
    body: 'To the maximum extent permitted by law, Mudyin Aboriginal Healing Centre Inc. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or its content. Our total liability to you for any cause shall not exceed the amount paid by you to us (if any) in the preceding 12 months.',
  },
  {
    id: 'privacy',
    heading: '9. Privacy',
    body: 'Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms of Use by reference.',
  },
  {
    id: 'changes',
    heading: '10. Changes to Terms',
    body: 'We reserve the right to update these Terms of Use at any time. Changes take effect when posted to this page. Your continued use of the website after changes are posted constitutes acceptance of the updated terms.',
  },
  {
    id: 'governing',
    heading: '11. Governing Law',
    body: 'These Terms of Use are governed by the laws of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales.',
  },
]

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <p className="text-base mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Last updated: February 2025
          </p>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Please read these terms carefully before using the Mudyin website or any of our online services.
          </p>
        </div>
      </section>

      <section className="pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-mid">

          {/* Contents */}
          <nav className="card-dark p-5 mb-10 rounded-xl" aria-label="Terms of use contents">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Contents
            </p>
            <ol className="space-y-1">
              {sections.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm hover:underline" style={{ color: 'var(--color-ochre-400)' }}>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map(s => (
              <div key={s.id} id={s.id}>
                <h2
                  className="font-display font-semibold text-xl mb-3"
                  style={{
                    color: 'var(--color-foreground)',
                    borderBottom: '1px solid rgba(65,70,72,0.4)',
                    paddingBottom: '10px',
                  }}
                >
                  {s.heading}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {s.body}
                </p>
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
              Questions?
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              If you have questions about these terms, contact us at{' '}
              <a href={`mailto:${siteConfig.email}`} style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                {siteConfig.email}
              </a>.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                Privacy Policy →
              </Link>
              <Link href="/icip" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                ICIP Policy →
              </Link>
              <Link href="/accessibility" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                Accessibility →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
