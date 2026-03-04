import type { MetadataRoute } from 'next'
import { newsArticles, programs } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mudyin.org.au'
  const now     = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`,                         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/programs`,                lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/programs/ysmp`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/programs/thrive-tribe`,   lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/programs/healing-centre`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about/our-story`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about/team`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/partners`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/impact`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/news`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/events`,                  lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/resources`,               lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,                 lastModified: now, changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${baseUrl}/donate`,                  lastModified: now, changeFrequency: 'yearly',  priority: 0.9 },
    { url: `${baseUrl}/enroll`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/icip`,                    lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${baseUrl}/privacy`,                 lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms`,                   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/accessibility`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${baseUrl}/about/child-safety`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ]

  const newsRoutes: MetadataRoute.Sitemap = newsArticles.map(article => ({
    url:              `${baseUrl}/news/${article.slug}`,
    lastModified:     new Date(article.publishedAt),
    changeFrequency:  'never' as const,
    priority:         0.6,
  }))

  const programEnrollRoutes: MetadataRoute.Sitemap = programs.map(p => ({
    url:             `${baseUrl}/enroll/${p.id}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }))

  return [...staticRoutes, ...newsRoutes, ...programEnrollRoutes]
}
