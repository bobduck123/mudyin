import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found. Return to the Mudyin Aboriginal Healing Centre homepage.',
}

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center section-padding"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="container-narrow text-center py-24">
        {/* 404 display */}
        <p
          className="font-display font-bold mb-6 gradient-text"
          style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', lineHeight: 1 }}
          aria-hidden="true"
        >
          404
        </p>

        <span className="section-label">Page Not Found</span>

        <h1
          className="font-display font-semibold text-3xl lg:text-4xl mt-4 mb-6"
          style={{ color: 'var(--color-foreground)' }}
        >
          This path leads somewhere else
        </h1>

        <p
          className="text-lg leading-relaxed mb-10 max-w-lg mx-auto"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          The page you are looking for may have moved, or the link you followed
          may be out of date. Let us help you find your way back.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
          <Link href="/programs" className="btn-outline">
            Explore Program Streams
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-16">
          <p
            className="text-sm font-medium mb-6"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Looking for something specific?
          </p>
          <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { label: 'Our Story',   href: '/about/our-story' },
              { label: "Women's Business", href: '/programs/womens-business' },
              { label: "Aaliyah's Dreaming", href: '/programs/aaliyahs-dreaming' },
              { label: 'Governance', href: '/governance' },
              { label: 'Contact',     href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-200 hover:underline"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
