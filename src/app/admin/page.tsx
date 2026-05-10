import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdminPage } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Mudyin Admin',
}

export default async function AdminDashboardPage() {
  const admin = await requireAdminPage()
  const [newEnquiries, streamCount, adminCount] = await Promise.all([
    prisma.inquiry.count({ where: { status: 'new' } }),
    prisma.programStream.count({ where: { publicEnabled: true } }),
    prisma.adminProfile.count({ where: { status: 'active' } }),
  ])

  const cards = [
    {
      href: '/admin/enquiries',
      label: 'Enquiries',
      value: String(newEnquiries),
      description: 'Review first-live enquiries and booking requests.',
    },
    {
      href: '/admin/programs',
      label: 'Program streams',
      value: String(streamCount),
      description: 'Check active and future-phase stream status.',
    },
    {
      href: '/admin/documents',
      label: 'Document control',
      value: '13',
      description: 'Track governance and operations starter-kit controls.',
    },
    {
      href: '/admin/users',
      label: 'Admin users',
      value: String(adminCount),
      description: 'Create controlled admin accounts.',
      superAdminOnly: true,
    },
  ]

  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-wide">
        <div className="mb-10 max-w-3xl">
          <span className="section-label">MUDYIN PTY LTD</span>
          <h1 className="font-display mt-3 text-4xl font-semibold text-white">Operations admin</h1>
          <p className="mt-4 text-white/65">
            Signed in as {admin.adminProfile.user.email}. Role: {admin.adminProfile.role}.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards
            .filter((card) => !card.superAdminOnly || admin.adminProfile.role === 'super_admin')
            .map((card) => (
              <Link key={card.href} href={card.href} className="card-dark block rounded-2xl p-6 healing-border hover:bg-white/5">
                <div className="text-3xl font-semibold text-ochre-300">{card.value}</div>
                <h2 className="mt-4 text-lg font-semibold text-white">{card.label}</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">{card.description}</p>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
