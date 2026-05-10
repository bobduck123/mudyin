import Link from 'next/link'

export function DonationForm() {
  return (
    <div
      className="rounded-2xl p-6"
      role="status"
      style={{
        backgroundColor: 'rgba(111,138,120,0.12)',
        border: '1px solid rgba(111,138,120,0.32)',
        color: 'rgba(255,255,255,0.72)',
      }}
    >
      <h3 className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--color-foreground)' }}>
        Donations are not enabled yet
      </h3>
      <p className="text-sm leading-relaxed mb-4">
        Public donation processing is paused until payment, charity, receipt, and operator approval
        settings are confirmed.
      </p>
      <Link href="/contact#general-enquiry" className="btn-outline text-sm">
        Contact Mudyin
      </Link>
    </div>
  )
}
