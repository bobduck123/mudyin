import { getDefaultSite } from '@/lib/white-label/site-registry'

const defaultSite = getDefaultSite()

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export const mudyinPublicConfig = {
  siteSlug: process.env.NEXT_PUBLIC_SITE_SLUG || defaultSite.slug,
  tenantKey: process.env.NEXT_PUBLIC_TENANT_KEY || defaultSite.siteId,
  apiBaseUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://anu-back-end.vercel.app',
  ),
  publicSiteUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_PUBLIC_SITE_URL
      || defaultSite.metadata.url,
  ),
  canonicalHost: defaultSite.domains.canonical,
  features: {
    enquiries: true,
    bookingRequests: true,
    liveBookings: false,
    donations: defaultSite.featureFlags.donations,
    events: defaultSite.featureFlags.events,
    practitioners: defaultSite.featureFlags.practitioners,
  },
} as const

export type MudyinPublicConfig = typeof mudyinPublicConfig
