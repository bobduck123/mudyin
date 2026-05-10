import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Not Configured',
  description: 'This host is not bound to a known ANU white-label site.',
  robots: { index: false, follow: false },
}

export default function SiteUnavailablePage() {
  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <section className="container-narrow py-24 text-center">
        <span className="section-label">Site unavailable</span>
        <h1
          className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6"
          style={{ color: 'var(--color-foreground)' }}
        >
          This domain is not configured for a public site.
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
          The request was received safely, but this host is not assigned to a known white-label
          site. Check the Vercel domain binding and ANU site registry before routing traffic here.
        </p>
      </section>
    </div>
  )
}
