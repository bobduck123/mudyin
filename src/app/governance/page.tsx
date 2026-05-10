import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import {
  mudyinGovernanceControls,
  mudyinOperatingEntity,
  mudyinOperationsDocuments,
} from '@/lib/mudyin-operational-model'

export const metadata: Metadata = {
  title: 'Governance and Transparency',
  description:
    'How Mudyin uses governance, document control, consent, incident, complaints, risk, and program approval controls for staged rollout.',
}

export default function GovernancePage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="Governance and Transparency"
        subtitle={mudyinOperatingEntity.legalName}
        description="Mudyin is preparing public delivery through controlled program approval, document control, consent, risk, complaints, incident, partnership, and spending pathways."
        breadcrumbs={[{ label: 'Governance' }]}
      />

      <section className="section-padding py-20 lg:py-28">
        <div className="container-wide">
          <div className="mb-10 max-w-3xl">
            <span className="section-label">Operating Model</span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white">One parent entity, staged program streams</h2>
            <p className="mt-4 leading-7 text-white/65">
              The current public site treats {mudyinOperatingEntity.legalName} as the operating entity. Program streams are not represented as separate live organisations, and future-phase work is labelled carefully until operational readiness is confirmed.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {mudyinGovernanceControls.map((control) => (
              <article key={control.title} className="card-dark rounded-2xl p-6 healing-border">
                <h3 className="text-xl font-semibold text-white">{control.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{control.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pb-20">
        <div className="container-wide">
          <div className="overflow-hidden rounded-2xl healing-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/8 text-white/60">
                <tr>
                  <th className="px-4 py-3">Control document</th>
                  <th className="px-4 py-3">Public status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-charcoal-900/70">
                {mudyinOperationsDocuments.map((document) => (
                  <tr key={document}>
                    <td className="px-4 py-3 text-white">{document}</td>
                    <td className="px-4 py-3 text-white/70">Tracked for controlled internal use and review</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/55">
            This page is a public summary, not legal advice and not a replacement for approved internal records.
          </p>
          <Link href="/contact#general-enquiry" className="btn-outline mt-8">
            Governance enquiry
          </Link>
        </div>
      </section>
    </div>
  )
}
