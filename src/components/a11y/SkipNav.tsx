'use client'

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-3 focus:rounded-lg focus:font-semibold focus:text-sm"
      style={{
        backgroundColor: 'var(--color-ochre-500)',
        color: 'var(--color-charcoal-950)',
      }}
    >
      Skip to main content
    </a>
  )
}
