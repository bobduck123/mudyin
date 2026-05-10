import type { Metadata } from 'next'
import { requireAdminPage } from '@/lib/admin-auth'
import { PasswordResetForm } from './PasswordResetForm'

export const metadata: Metadata = {
  title: 'Set Admin Password',
}

export default async function FirstLoginPage() {
  await requireAdminPage({ allowPasswordChangeRequired: true })

  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-mid max-w-xl">
        <div className="card-dark rounded-2xl p-8 healing-border">
          <span className="section-label">First Login</span>
          <h1 className="font-display mt-3 text-3xl font-semibold text-white">Rotate temporary password</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">
            The bootstrap account cannot create or manage other admins until the temporary password has been replaced.
          </p>
          <div className="mt-8">
            <PasswordResetForm />
          </div>
        </div>
      </div>
    </section>
  )
}
