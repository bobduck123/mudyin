import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin-auth'
import { mudyinGovernanceControls, mudyinOperationsDocuments } from '@/lib/mudyin-operational-model'

export const metadata: Metadata = {
  title: 'Admin Document Control',
}

export default async function AdminDocumentsPage() {
  await requireAdminPage()

  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-wide">
        <Link href="/admin" className="text-sm text-ochre-300 hover:underline">
          Back to admin
        </Link>
        <div className="mt-5 mb-8 max-w-3xl">
          <span className="section-label">Document Control</span>
          <h1 className="font-display mt-3 text-4xl font-semibold text-white">Operations starter kit</h1>
          <p className="mt-3 text-white/65">
            This register mirrors the starter-kit controls that should govern rollout. The source documents were not present in the workspace, so this is a control index, not a substitute for approved documents.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {mudyinGovernanceControls.map((control) => (
            <article key={control.title} className="card-dark rounded-2xl p-6 healing-border">
              <h2 className="text-xl font-semibold text-white">{control.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">{control.summary}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl healing-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-white/8 text-white/60">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Current control state</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-charcoal-900/70">
              {mudyinOperationsDocuments.map((document) => (
                <tr key={document}>
                  <td className="px-4 py-3 text-white">{document}</td>
                  <td className="px-4 py-3 text-white/70">Listed for controlled import/review</td>
                  <td className="px-4 py-3 text-white/70">Mudyin admin</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
