import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface Props {
  title: string
  subtitle?: string
  description?: string
  video?: string
  image?: string
  imageAlt?: string
  motifOverlay?: boolean
  breadcrumbs?: Breadcrumb[]
  ctaLabel?: string
  ctaHref?: string
  compact?: boolean
}

export function PageHero({
  title,
  subtitle,
  description,
  video,
  image,
  imageAlt,
  motifOverlay = false,
  breadcrumbs,
  ctaLabel,
  ctaHref,
  compact = false,
}: Props) {
  const heroImage = image ?? '/images/hero-banner.jpg'

  return (
    <section
      className={`relative flex items-end overflow-hidden ${compact ? 'min-h-[320px] lg:min-h-[400px]' : 'min-h-[480px] lg:min-h-[600px]'}`}
      aria-label={`${title} page header`}
    >
      {video && (
        <video
          src={video}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          loop
          data-decorative="true"
        />
      )}

      {!video && (
        <Image
          src={heroImage}
          alt={imageAlt ?? `${title} hero image`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ animation: 'none' }}
          data-decorative="true"
        />
      )}

      <div className="absolute inset-0 overlay-dark" aria-hidden="true" data-decorative="true" />
      {motifOverlay && (
        <div
          data-decorative="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 52%, rgba(200,167,93,0.055) 0 11%, rgba(184,117,85,0.07) 25%, transparent 45%)',
            opacity: 0.4,
          }}
        />
      )}
      <div
        data-decorative="true"
        className="absolute inset-x-0 bottom-0 h-28"
        style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.92), transparent)' }}
      />

      <div className="relative z-10 container-wide section-padding w-full pb-12 lg:pb-16 pt-32 lg:pt-36">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1 text-sm flex-wrap">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {subtitle && (
          <span className="section-label">{subtitle}</span>
        )}

        <h1
          className="font-display font-semibold text-display-lg lg:text-display-xl mt-2 mb-4 max-w-3xl"
          style={{ color: 'var(--color-foreground)' }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="text-lg max-w-2xl leading-relaxed mb-6"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {description}
          </p>
        )}

        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="btn-primary">
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
