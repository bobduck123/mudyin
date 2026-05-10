import type { MetadataRoute } from 'next'
import { getDefaultSite } from '@/lib/white-label/site-registry'

export default function robots(): MetadataRoute.Robots {
  const site = getDefaultSite()

  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/admin/', '/portal/', '/api/'],
      },
    ],
    sitemap:  `${site.metadata.url}/sitemap.xml`,
    host:     site.metadata.url,
  }
}
