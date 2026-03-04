import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface Props {
  title:        string
  subtitle?:    string
  description?: string
  image?:       string
  imageAlt?:    string
  breadcrumbs?: Breadcrumb[]
  ctaLabel?:    string
  ctaHref?:     string
  compact?:     boolean
}

export function PageHero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  breadcrumbs,
  ctaLabel,
  ctaHref,
  compact = false,
}: Props) {
  return (
    <section
      className={`relative flex items-end overflow-hidden blak-motif-organic country-lines ${compact ? 'min-h-[320px] lg:min-h-[400px]' : 'min-h-[480px] lg:min-h-[600px]'}`}
      aria-label={`${title} page header`}
    >
      {/* Background image */}
      {image && (
        <Image
          src={image}
          alt={imageAlt ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ animation: 'kenBurns 26s ease-in-out infinite alternate' }}
          data-decorative="true"
        />
      )}

      {/* Fallback gradient background if no image */}
      {!image && (
        <div
          data-decorative="true"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #141414 0%, rgba(210,168,85,0.08) 50%, #141414 100%)',
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 overlay-dark" aria-hidden="true" data-decorative="true" />
      <div
        data-decorative="true"
        className="absolute inset-y-0 left-0 w-1/3"
        style={{ background: 'linear-gradient(100deg, rgba(219,22,47,0.2), transparent 65%)' }}
      />
      <div
        data-decorative="true"
        className="absolute inset-y-0 right-0 w-1/3"
        style={{ background: 'linear-gradient(250deg, rgba(243,222,44,0.16), transparent 65%)' }}
      />
      <div
        data-decorative="true"
        className="absolute inset-x-0 bottom-0 h-28"
        style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.92), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 container-wide section-padding w-full pb-12 lg:pb-16 pt-32 lg:pt-36">

        {/* Breadcrumbs */}
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

        {/* Label */}
        {subtitle && (
          <span className="section-label">{subtitle}</span>
        )}

        {/* Title */}
        <h1
          className="font-display font-semibold text-display-lg lg:text-display-xl mt-2 mb-4 max-w-3xl"
          style={{ color: 'var(--color-foreground)' }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            className="text-lg max-w-2xl leading-relaxed mb-6"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {description}
          </p>
        )}

        {/* CTA */}
        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="btn-primary">
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
