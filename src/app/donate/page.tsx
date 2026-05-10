import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Donations Paused - Mudyin',
  description:
    'Public donations are paused for Mudyin first launch until payment, charity, and receipt settings are confirmed.',
}

export default function DonatePage() {
  return (
    <section className="pt-32 pb-20 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-narrow">
        <span className="section-label">Donations</span>
        <div className="card-dark p-8 lg:p-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: 'rgba(111,138,120,0.16)', border: '1px solid rgba(111,138,120,0.35)' }}
          >
            <ShieldCheck size={22} style={{ color: 'var(--color-sage-300)' }} aria-hidden="true" />
          </div>
          <h1 className="font-display font-semibold text-3xl mb-4" style={{ color: 'var(--color-foreground)' }}>
            Donations are paused for first launch
          </h1>
          <p className="leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.68)' }}>
            Mudyin is not taking public donations through this website yet. Payment processing,
            charity status, tax receipt wording, and operator approval must be confirmed before
            fundraising is enabled.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact#general-enquiry" className="btn-primary">
              Contact Mudyin
            </Link>
            <Link href="/programs" className="btn-outline">
              View Programs
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
