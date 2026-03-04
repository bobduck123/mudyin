import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accessibility Statement — Mudyin Aboriginal Healing Centre',
  description: 'Mudyin\'s commitment to digital accessibility under WCAG 2.1 AA. Known issues, contact information, and our ongoing improvement plan.',
}

const features = [
  'Keyboard navigation throughout the entire website',
  'Skip to main content link on all pages',
  'Screen reader compatible — tested with NVDA and VoiceOver',
  'All images include descriptive alt text',
  'Sufficient colour contrast ratios (minimum 4.5:1 for text)',
  'Focus indicators visible on all interactive elements',
  'Form fields include labels and error descriptions',
  'PDF documents include title and language attributes',
  'Video content will include captions when published',
  'Respects user preference for reduced motion (prefers-reduced-motion)',
  'Responsive design — fully functional at 320px viewport width',
  'Text remains readable when zoomed to 200%',
]

const knownIssues = [
  {
    issue: 'Some third-party embedded content (e.g., maps) may not be fully accessible.',
    status: 'Investigating alternatives',
  },
  {
    issue: 'PDF documents linked from the Resources page have not yet been fully audited.',
    status: 'In progress — target completion Q2 2025',
  },
]

export default function AccessibilityPage() {
  return (
    <>
      <section
        className="pt-32 pb-12 section-padding"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <div className="container-mid">
          <span className="section-label">Inclusion</span>
          <h1
            className="font-display font-semibold mt-2 mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-foreground)' }}
          >
            Accessibility Statement
          </h1>
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Mudyin Aboriginal Healing Centre is committed to ensuring our website is accessible to all people — including those using assistive technologies, people with disability, and those on lower-bandwidth connections.
          </p>
          <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Last updated: February 2025 — reviewed annually.
          </p>
        </div>
      </section>

      <section className="pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-mid">

          {/* Conformance status */}
          <div className="card-dark p-6 mb-10">
            <h2
              className="font-display font-semibold text-xl mb-3"
              style={{ color: 'var(--color-foreground)' }}
            >
              Conformance Status
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
              This website aims to conform to{' '}
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>WCAG 2.1 Level AA</strong>{' '}
              (Web Content Accessibility Guidelines). We use automated testing (axe-core), manual keyboard testing, and screen reader verification during development.
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              We acknowledge that some content may not yet meet all WCAG 2.1 AA criteria. We are actively working to address known issues and welcome feedback.
            </p>
          </div>

          {/* Features */}
          <h2
            className="font-display font-semibold text-xl mb-5"
            style={{ color: 'var(--color-foreground)' }}
          >
            Accessibility Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-12">
            {features.map(feature => (
              <div key={feature} className="flex items-start gap-2">
                <CheckCircle
                  size={14}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--color-ochre-500)' }}
                  aria-hidden="true"
                />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Known issues */}
          <h2
            className="font-display font-semibold text-xl mb-5"
            style={{ color: 'var(--color-foreground)' }}
          >
            Known Issues
          </h2>
          <div className="space-y-3 mb-12">
            {knownIssues.map(({ issue, status }) => (
              <div
                key={issue}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: 'rgba(251,191,36,0.05)',
                  border: '1px solid rgba(251,191,36,0.15)',
                }}
              >
                <AlertCircle
                  size={16}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#fbbf24' }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{issue}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Status: {status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Technical specifications */}
          <div className="card-dark p-6 mb-10">
            <h2
              className="font-display font-semibold text-xl mb-4"
              style={{ color: 'var(--color-foreground)' }}
            >
              Technical Approach
            </h2>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <p>This website is built with <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Next.js</strong> (React) using semantic HTML5 elements throughout. We rely on WAI-ARIA attributes only where native HTML semantics are insufficient.</p>
              <p>Compatibility tested with: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Chrome + NVDA</strong>, <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Safari + VoiceOver (macOS and iOS)</strong>, Firefox keyboard-only navigation.</p>
              <p>Colour palette maintained at minimum 4.5:1 contrast ratio for all body text and 3:1 for large text (18px+ or bold 14px+).</p>
            </div>
          </div>

          {/* Feedback */}
          <div
            className="p-6 rounded-xl"
            style={{ background: 'rgba(210,168,85,0.05)', border: '1px solid rgba(210,168,85,0.2)' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <Mail size={18} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
              <h2
                className="font-display font-semibold text-lg"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                Report an Accessibility Issue
              </h2>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
              If you experience an accessibility barrier on our website, we want to hear from you. Contact us at{' '}
              <a href="mailto:info@mudyin.org.au" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                info@mudyin.org.au
              </a>{' '}
              with:
            </p>
            <ul className="space-y-1 text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <li>• The page URL where you encountered the issue</li>
              <li>• A description of the problem</li>
              <li>• The assistive technology and browser you were using</li>
            </ul>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              We aim to respond within 5 business days. If you are unsatisfied with our response, you may contact the{' '}
              <a
                href="https://humanrights.gov.au/our-work/disability-rights/complaint-information"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-ochre-400)' }}
                className="hover:underline"
              >
                Australian Human Rights Commission
              </a>.
            </p>
            <Link href="/contact" className="btn-primary text-sm">
              Contact Us
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
