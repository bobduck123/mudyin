import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/admin/', '/portal/', '/api/'],
      },
    ],
    sitemap:  'https://mudyin.org.au/sitemap.xml',
    host:     'https://mudyin.org.au',
  }
}
