import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CTABand } from '@/components/sections/CTABand'
import { newsArticles } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = newsArticles.find((a) => a.slug === slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = newsArticles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const related = newsArticles.filter(
    (a) => a.slug !== slug && (a.category === article.category || a.id !== article.id)
  ).slice(0, 2)

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Article hero image */}
      <div className="relative min-h-[400px] lg:min-h-[520px] flex items-end overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,20,20,0.92) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0.2) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 container-wide section-padding w-full pb-12 pt-32">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <Link
                  href="/"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  className="hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" style={{ color: 'rgba(255,255,255,0.3)' }}>/</li>
              <li>
                <Link
                  href="/news"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  className="hover:underline"
                >
                  News
                </Link>
              </li>
              <li aria-hidden="true" style={{ color: 'rgba(255,255,255,0.3)' }}>/</li>
              <li>
                <span aria-current="page" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {article.title}
                </span>
              </li>
            </ol>
          </nav>

          {/* Category & date */}
          <div className="flex items-center gap-4 mb-5">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(210,168,85,0.15)',
                border: '1px solid rgba(210,168,85,0.35)',
                color: 'var(--color-ochre-400)',
              }}
            >
              {article.category}
            </span>
            <time
              dateTime={article.publishedAt}
              className="text-sm"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {formatDate(article.publishedAt)}
            </time>
          </div>

          <h1
            className="font-display font-semibold max-w-3xl leading-snug"
            style={{
              color: 'var(--color-foreground)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            }}
          >
            {article.title}
          </h1>

          <p
            className="mt-4 text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            By {article.author}
          </p>
        </div>
      </div>

      {/* Article content */}
      <section
        className="section-padding py-16 lg:py-24"
        aria-label="Article content"
      >
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Excerpt / lead */}
              <p
                className="text-xl leading-relaxed mb-10 font-medium"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  borderLeft: '4px solid var(--color-ochre-500)',
                  paddingLeft: '1.5rem',
                }}
              >
                {article.excerpt}
              </p>

              {/* Content paragraphs */}
              <div className="space-y-6">
                {article.content.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-lg leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.72)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share / back */}
              <div
                className="mt-12 pt-8 flex flex-wrap items-center gap-4"
                style={{ borderTop: '1px solid rgba(65,70,72,0.4)' }}
              >
                <Link
                  href="/news"
                  className="btn-outline text-sm"
                >
                  &larr; Back to News
                </Link>
                <p
                  className="text-xs"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Published: {formatDate(article.publishedAt)} &bull; {article.author}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside aria-label="Related articles and actions">
              {/* Related articles */}
              <div
                className="rounded-2xl p-7 mb-8"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(65,70,72,0.4)',
                }}
              >
                <h2
                  className="font-display font-semibold text-lg mb-6"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Related Stories
                </h2>

                <div className="space-y-6">
                  {related.map((rel) => (
                    <article key={rel.id} aria-label={rel.title}>
                      <Link href={`/news/${rel.slug}`} className="group block">
                        <div
                          className="relative h-36 rounded-xl overflow-hidden mb-3"
                        >
                          <Image
                            src={rel.image}
                            alt={rel.imageAlt}
                            fill
                            sizes="300px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <span
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: 'var(--color-ochre-400)' }}
                        >
                          {rel.category}
                        </span>
                        <h3
                          className="font-semibold text-sm leading-snug group-hover:underline"
                          style={{ color: 'var(--color-foreground)' }}
                        >
                          {rel.title}
                        </h3>
                        <time
                          dateTime={rel.publishedAt}
                          className="text-xs mt-1 block"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {formatDate(rel.publishedAt)}
                        </time>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              {/* CTA card */}
              <div
                className="rounded-2xl p-7"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(210,168,85,0.07), rgba(210,168,85,0.02))',
                  border: '1px solid rgba(210,168,85,0.2)',
                }}
              >
                <h3
                  className="font-display font-semibold text-lg mb-3"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  Support Our Work
                </h3>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Stories like this are made possible by community supporters like you. Your
                  donation funds programs, mentors, and healing services.
                </p>
                <Link href="/donate" className="btn-primary text-sm w-full block text-center">
                  Donate Now
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTABand
        heading="Be Part of the Story"
        subheading="Every program, every milestone, every life transformed is made possible by community. Join us."
        primaryCTA={{ label: 'Enroll in a Program', href: '/enroll' }}
        secondaryCTA={{ label: 'Support Our Work', href: '/donate' }}
      />
    </div>
  )
}
