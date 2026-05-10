export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center section-padding" aria-live="polite">
      <div className="container-narrow text-center py-24">
        <span className="section-label">Loading</span>
        <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.68)' }}>
          Preparing the Mudyin site.
        </p>
      </div>
    </div>
  )
}

