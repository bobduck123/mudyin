import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { CTABand } from '@/components/sections/CTABand'
import { newsArticles } from '@/lib/data'

export const metadata: Metadata = {
  title: 'News & Stories',
  description:
    'Stories shared like yarn around the fire. Follow community updates, milestones, and reflections from across Mudyin.',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function NewsPage() {
  const [featured, ...rest] = newsArticles

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      <PageHero
        title="News & Stories"
        subtitle="Yarn Circle Updates"
        description="Like stories shared around the corroboree fire, these updates carry lessons, momentum, and collective memory."
        breadcrumbs={[{ label: 'News' }]}
      />

      <section className="section-padding py-14 lg:py-16">
        <div className="container-wide">
          <div className="engraved-panel country-lines rounded-2xl p-6 lg:p-8 mb-10">
            <p className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: 'rgba(255,255,255,0.58)' }}>
              Campfire Opening
            </p>
            <h2 className="font-display text-3xl lg:text-4xl mb-3">What We Carry Forward This Week</h2>
            <p className="max-w-3xl" style={{ color: 'rgba(255,255,255,0.74)' }}>
              Stories here are shared as collective memory, not headline churn. Read them as tracks of effort, care, and change across community.
            </p>
          </div>

          <article
            className="rounded-2xl overflow-hidden grid lg:grid-cols-2 group"
            style={{ border: '1px solid rgba(223,206,214,0.26)', backgroundColor: 'rgba(2,2,2,0.7)' }}
            aria-label={featured.title}
          >
            <div className="relative h-72 lg:h-auto overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.65), transparent 65%)' }}
                aria-hidden="true"
              />
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-center country-lines">
              <div className="flex items-center gap-3 mb-4">
                <span className="ritual-chip" style={{ borderColor: 'rgba(219,22,47,0.55)' }}>
                  {featured.category}
                </span>
                <time dateTime={featured.publishedAt} className="text-xs" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  {formatDate(featured.publishedAt)}
                </time>
              </div>
              <h3 className="font-display font-semibold text-2xl lg:text-3xl mb-4 leading-snug">{featured.title}</h3>
              <p className="text-base leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.46)' }}>
                  Shared by {featured.author}
                </p>
                <Link href={`/news/${featured.slug}`} className="btn-primary text-sm">
                  Join This Yarn
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section-padding py-10 pb-24">
        <div className="container-wide">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl lg:text-3xl">Story Trails</h2>
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Ritual Interaction: trace each yarn trail
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl overflow-hidden flex flex-col group country-lines"
                style={{ border: '1px solid rgba(223,206,214,0.22)', backgroundColor: 'rgba(2,2,2,0.66)' }}
                aria-label={article.title}
              >
                <div className="relative h-52 overflow-hidden flex-shrink-0">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.62), transparent 60%)' }} aria-hidden="true" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="story-trail mb-4">
                    <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.54)' }}>
                      {article.category}
                    </p>
                    <time dateTime={article.publishedAt} className="text-xs mt-1 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>

                  <h3 className="font-display font-semibold text-xl mb-3 leading-snug">{article.title}</h3>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'rgba(255,255,255,0.68)' }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.44)' }}>
                      {article.author}
                    </p>
                    <Link href={`/news/${article.slug}`} className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-flag-yellow)' }}>
                      Follow Trail
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Keep the Yarn Moving"
        subheading="Program updates, community wins, and impact stories continue each week."
        primaryCTA={{ label: 'Community', href: '/community' }}
        secondaryCTA={{ label: 'Contact Us', href: '/contact' }}
      />
    </div>
  )
}
