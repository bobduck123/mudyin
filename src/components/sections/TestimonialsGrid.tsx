'use client'

import { testimonials, newsArticles } from '@/lib/data'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Star, Quote } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function TestimonialsGrid() {
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>()

  return (
    <section
      id="stories"
      className="py-20 lg:py-32 section-padding"
      style={{
        background: 'linear-gradient(to bottom, rgba(10,10,10,1), rgba(20,20,20,1))',
      }}
      aria-label="Community voices"
    >
      <div ref={ref} className="container-wide">

        {/* Header */}
        <div className={cn('text-center mb-14 animate-on-scroll', isInView && 'in-view')}>
          <span className="section-label">Community Voices</span>
          <h2
            className="font-display font-semibold text-display-md lg:text-display-lg mt-2"
            style={{ color: 'var(--color-foreground)' }}
          >
            What Our Mob Says
          </h2>
        </div>

        {/* Testimonials */}
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-on-scroll animation-delay-200',
            isInView && 'in-view',
          )}
        >
          {testimonials.map((t, i) => (
            <blockquote
              key={t.id}
              className={cn(
                'card-dark p-7 relative animate-on-scroll',
                isInView && 'in-view',
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Quote icon */}
              <Quote
                size={32}
                className="absolute top-5 right-5 opacity-10"
                style={{ color: 'var(--color-ochre-500)' }}
                aria-hidden="true"
              />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={13}
                    fill="currentColor"
                    style={{ color: 'var(--color-ochre-500)' }}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p
                className="text-base leading-relaxed mb-5 italic"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <footer className="flex items-center justify-between">
                <div>
                  <cite className="not-italic">
                    <span
                      className="text-sm font-semibold block"
                      style={{ color: 'var(--color-ochre-400)' }}
                    >
                      {t.name}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {t.role}
                    </span>
                  </cite>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(210,168,85,0.1)',
                    color: 'var(--color-ochre-400)',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.24)',
                  }}
                >
                  {t.program}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>

        {/* News previews */}
        <div className={cn('animate-on-scroll animation-delay-300', isInView && 'in-view')}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-label">Latest News</span>
              <h3
                className="font-display font-semibold text-2xl"
                style={{ color: 'var(--color-foreground)' }}
              >
                Community Stories
              </h3>
            </div>
            <Link
              href="/news"
              className="btn-ghost text-sm hidden sm:flex"
              aria-label="View all news articles"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newsArticles.map((article, i) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className={cn(
                  'group card-dark overflow-hidden block animate-on-scroll',
                  isInView && 'in-view',
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Article image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 overlay-dark opacity-50" aria-hidden="true" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(210,168,85,0.85)',
                        color: 'var(--color-charcoal-950)',
                      }}
                    >
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <time
                    dateTime={article.publishedAt}
                    className="text-xs mb-2 block"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {formatDate(article.publishedAt)}
                  </time>
                  <h4
                    className="font-display font-semibold text-base leading-snug mb-2 group-hover:underline decoration-ochre-500/50 underline-offset-2 transition-all"
                    style={{ color: 'var(--color-foreground)' }}
                  >
                    {article.title}
                  </h4>
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile: view all */}
          <div className="text-center mt-6 sm:hidden">
            <Link href="/news" className="btn-ghost text-sm">
              View all news →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
