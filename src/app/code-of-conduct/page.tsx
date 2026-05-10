import type { Metadata } from 'next'
import { getDefaultSite } from '@/lib/white-label/site-registry'

const site = getDefaultSite()

export const metadata: Metadata = {
  title: 'Code of Conduct',
  description: `Community code of conduct for ${site.canonicalName}.`,
}

const commitments = [
  'Respect cultural authority, Country, Elders, families, and community knowledge.',
  'Do not post harassment, hate, abuse, sexual content involving minors, threats, or exploitation.',
  'Share only images, stories, and cultural material you have permission to share.',
  'Use community and gallery spaces for support, learning, celebration, and constructive discussion.',
  'Report safety concerns immediately so moderators can review them.',
]

export default function CodeOfConductPage() {
  return (
    <section className="section-spacing container-narrow">
      <span className="section-label">Community safety</span>
      <h1 className="font-display text-4xl md:text-5xl font-semibold mt-4 mb-6">
        Code of Conduct
      </h1>
      <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.68)' }}>
        {site.canonicalName} is a culturally safe public and member space. Participation requires
        respect, consent, care, and accountability.
      </p>
      <ul className="space-y-4">
        {commitments.map((commitment) => (
          <li
            key={commitment}
            className="rounded-lg border p-4"
            style={{ borderColor: 'rgba(210,168,85,0.28)', background: 'rgba(255,255,255,0.03)' }}
          >
            {commitment}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
        This public version is launch-ready as a minimum operating policy. Operators should replace
        it with approved legal/community governance text when final policy documents are signed off.
      </p>
    </section>
  )
}

