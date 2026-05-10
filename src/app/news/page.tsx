import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

const ritualTags = ['Yarn Circle', 'Story Trails', 'Collective Memory']

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

      <section className="section-spacing section-padding">
        <div className="container-wide">
          <div className="healing-panel grounded-lines rounded-2xl p-6 lg:p-8 mb-10 healing-border">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                  Campfire Opening
                </p>
                <h2 className="font-display text-3xl lg:text-4xl">What We Carry Forward This Week</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {ritualTags.map((tag) => (
                  <span key={tag} className="healing-chip">{tag}</span>
                ))}
              </div>
            </div>
            <p className="max-w-3xl" style={{ color: 'rgba(255,255,255,0.74)' }}>
              Stories here are shared as collective memory, not headline churn. Read them as tracks of effort,
              care, and change across community.
            </p>
          </div>

          <article
            className="rounded-2xl overflow-hidden grid lg:grid-cols-2 group healing-panel healing-border"
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
                style={{ background: 'linear-gradient(to top, rgba(2,2,2,0.68), transparent 65%)' }}
                aria-hidden="true"
              />
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-center grounded-lines">
              <div className="flex items-center gap-3 mb-4">
                <span className="healing-chip">
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

      <section className="section-padding py-8 pb-24">
        <div className="container-wide">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl lg:text-3xl">Story Trails</h2>
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Ritual Interaction: trace each yarn trail
            </p>
          </div>

          <div className="grounded-divider mb-8" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl overflow-hidden flex flex-col group grounded-lines healing-border"
                style={{ backgroundColor: 'rgba(2,2,2,0.66)' }}
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
                  <div className="care-trail mb-4">
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
                    <Link href={`/news/${article.slug}`} className="text-sm font-semibold inline-flex items-center gap-1" style={{ color: 'var(--color-ochre-400)' }}>
                      Follow Trail <ArrowRight size={14} />
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
