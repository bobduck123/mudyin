'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error boundary:', {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <section className="container-narrow py-24 text-center">
        <span className="section-label">Something went wrong</span>
        <h1
          className="font-display text-3xl md:text-5xl font-semibold mt-4 mb-6"
          style={{ color: 'var(--color-foreground)' }}
        >
          We could not load this page cleanly.
        </h1>
        <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.68)' }}>
          The issue has been contained so the site does not go blank. Try again or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button type="button" onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            Return Home
          </Link>
        </div>
      </section>
    </div>
  )
}

