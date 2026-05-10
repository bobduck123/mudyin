import type { Metadata } from 'next'
import { getDefaultSite } from '@/lib/white-label/site-registry'

const site = getDefaultSite()

export const metadata: Metadata = {
  title: 'Transparency',
  description: `Operational transparency and public status information for ${site.canonicalName}.`,
}

export default function TransparencyPage() {
  return (
    <section className="section-spacing container-narrow">
      <span className="section-label">Transparency</span>
      <h1 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-6">
        Public Status and Governance
      </h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
        <p>
          This page records the minimum public transparency commitments for {site.shortName}: safety
          reporting, privacy contact, community moderation, donations, and operational readiness.
        </p>
        <p>
          Health checks are available at <code>/api/health</code>. Full readiness checks are
          available at <code>/api/readiness</code> for deployment operators and release gates.
        </p>
        <p>
          Donation, legal registration, and policy statements must be reviewed by the operator before
          public launch approval. Until final documents are supplied, the site uses conservative
          public text and avoids publishing unverified registration numbers.
        </p>
      </div>
    </section>
  )
}

