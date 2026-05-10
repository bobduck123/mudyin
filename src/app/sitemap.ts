import type { MetadataRoute } from 'next'
import { newsArticles } from '@/lib/data'
import { getDefaultSite } from '@/lib/white-label/site-registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getDefaultSite().metadata.url
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

  return [...staticRoutes, ...newsRoutes]
}
