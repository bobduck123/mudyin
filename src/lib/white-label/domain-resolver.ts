import {
  getAllSites,
  getDefaultSite,
  type WhiteLabelSiteConfig,
} from './site-registry'

export type DomainResolutionStatus =
  | 'matched'
  | 'local'
  | 'vercel-preview'
  | 'missing-host'
  | 'unknown'

export type DomainResolution = {
  status: DomainResolutionStatus
  host: string | null
  normalizedHost: string | null
  site: WhiteLabelSiteConfig | null
  shouldRedirectToCanonical: boolean
  canonicalUrl?: string
  diagnostics: string[]
}

export type DomainResolverEnv = {
  nodeEnv?: string
  vercelUrl?: string
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

export function normalizeHost(rawHost: string | null | undefined): string | null {
  if (!rawHost) return null

  const trimmed = rawHost.trim().toLowerCase()
  if (!trimmed) return null

  if (trimmed.startsWith('[')) {
    const closeBracket = trimmed.indexOf(']')
    return closeBracket >= 0 ? trimmed.slice(1, closeBracket) : trimmed
  }

  return trimmed.split(':')[0] || null
}

export function isLocalHost(host: string | null): boolean {
  return Boolean(host && (LOCAL_HOSTS.has(host) || host.endsWith('.localhost')))
}

function isConfiguredVercelPreview(host: string, env: DomainResolverEnv): boolean {
  return Boolean(env.vercelUrl && normalizeHost(env.vercelUrl) === host && host.endsWith('.vercel.app'))
}

function findSiteByHost(host: string): WhiteLabelSiteConfig | null {
  for (const site of getAllSites()) {
    const domains = [
      site.domains.canonical,
      ...site.domains.aliases,
      ...site.domains.deploymentAliases,
    ].map((domain) => normalizeHost(domain))

    if (domains.includes(host)) {
      return site
    }
  }

  return null
}

export function resolveSiteForHost(
  rawHost: string | null | undefined,
  env: DomainResolverEnv = {},
): DomainResolution {
  const normalizedHost = normalizeHost(rawHost)
  const diagnostics: string[] = []

  if (!normalizedHost) {
    diagnostics.push('No Host header was available.')
    return {
      status: 'missing-host',
      host: rawHost ?? null,
      normalizedHost: null,
      site: env.nodeEnv === 'production' ? null : getDefaultSite(),
      shouldRedirectToCanonical: false,
      diagnostics,
    }
  }

  if (isLocalHost(normalizedHost)) {
    diagnostics.push('Local development host resolved to the default site.')
    return {
      status: 'local',
      host: rawHost ?? null,
      normalizedHost,
      site: getDefaultSite(),
      shouldRedirectToCanonical: false,
      diagnostics,
    }
  }

  const matchedSite = findSiteByHost(normalizedHost)
  if (matchedSite) {
    const shouldRedirectToCanonical = matchedSite.domains.redirectToCanonical.includes(normalizedHost)
    return {
      status: 'matched',
      host: rawHost ?? null,
      normalizedHost,
      site: matchedSite,
      shouldRedirectToCanonical,
      canonicalUrl: shouldRedirectToCanonical ? matchedSite.metadata.url : undefined,
      diagnostics,
    }
  }

  if (isConfiguredVercelPreview(normalizedHost, env)) {
    diagnostics.push('Configured Vercel preview host resolved through VERCEL_URL.')
    return {
      status: 'vercel-preview',
      host: rawHost ?? null,
      normalizedHost,
      site: getDefaultSite(),
      shouldRedirectToCanonical: false,
      diagnostics,
    }
  }

  diagnostics.push(`Host ${normalizedHost} is not assigned to a known white-label site.`)
  return {
    status: 'unknown',
    host: rawHost ?? null,
    normalizedHost,
    site: null,
    shouldRedirectToCanonical: false,
    diagnostics,
  }
}

