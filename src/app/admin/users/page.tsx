import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'
import { AdminUserCreateForm } from './AdminUserCreateForm'

export const metadata: Metadata = {
  title: 'Admin Users',
}

export default async function AdminUsersPage() {
  await requireAdminPage({ roles: ['super_admin'] })
  const users = await prisma.adminProfile.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          createdAt: true,
        },
      },
    },
  })

  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-wide">
        <Link href="/admin" className="text-sm text-ochre-300 hover:underline">
          Back to admin
        </Link>
        <div className="mt-5 mb-8">
          <span className="section-label">Role Control</span>
          <h1 className="font-display mt-3 text-4xl font-semibold text-white">Admin users</h1>
          <p className="mt-3 max-w-3xl text-white/65">
            Only an active super_admin whose temporary password has been rotated can create additional admin users.
          </p>
        </div>

        <AdminUserCreateForm />

        <div className="mt-8 overflow-hidden rounded-2xl healing-border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/8 text-white/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">First login</th>
                <th className="px-4 py-3">Bootstrap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-charcoal-900/70">
              {users.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-4 py-3 text-white">{profile.user.name}</td>
                  <td className="px-4 py-3 text-white/70">{profile.user.email}</td>
                  <td className="px-4 py-3 text-white/70">{profile.role}</td>
                  <td className="px-4 py-3 text-white/70">{profile.status}</td>
                  <td className="px-4 py-3 text-white/70">{profile.mustChangePassword ? 'Required' : 'Complete'}</td>
                  <td className="px-4 py-3 text-white/70">{profile.bootstrap ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
