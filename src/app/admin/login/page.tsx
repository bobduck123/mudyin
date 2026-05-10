import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Mudyin Admin Login',
  description: 'Secure admin access for Mudyin operations.',
}

export default function AdminLoginPage() {
  return (
    <section className="section-padding min-h-screen pt-36 pb-20">
      <div className="container-mid max-w-xl">
        <div className="card-dark rounded-2xl p-8 healing-border">
          <span className="section-label">Controlled Access</span>
          <h1 className="font-display mt-3 text-3xl font-semibold text-white">Mudyin admin</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Admin accounts are created by an authorised super admin only. Public self-signup does not grant admin access.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  )
}
