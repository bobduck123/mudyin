export type SiteModule =
  | 'about'
  | 'community'
  | 'contact'
  | 'donations'
  | 'events'
  | 'gallery'
  | 'impact'
  | 'legal'
  | 'marketplace'
  | 'news'
  | 'programs'
  | 'resources'

export type SiteFeatureFlag =
  | 'communityFeed'
  | 'donations'
  | 'enquiries'
  | 'bookingRequests'
  | 'liveBookings'
  | 'events'
  | 'galleryUploads'
  | 'marketplace'
  | 'memberDirectory'
  | 'practitioners'
  | 'programEnrollment'

export type PublicNavItem = {
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}

export type WhiteLabelSiteConfig = {
  siteId: string
  tenantScope: string
  slug: string
  canonicalName: string
  shortName: string
  tagline: string
  domains: {
    canonical: string
    aliases: string[]
    deploymentAliases: string[]
    redirectToCanonical: string[]
  }
  brand: {
    colors: {
      background: string
      foreground: string
      primary: string
      accent: string
      muted: string
    }
    typography: {
      display: string
      body: string
    }
    logoText: string
    logoSubtext: string
    faviconPath: string
    ogImagePath: string
  }
  metadata: {
    title: string
    titleTemplate: string
    description: string
    keywords: string[]
    url: string
    locale: string
    socialHandle?: string
  }
  publicNav: PublicNavItem[]
  footerLinks: Array<{ label: string; href: string }>
  enabledModules: SiteModule[]
  featureFlags: Record<SiteFeatureFlag, boolean>
  legal: {
    privacyPath: string
    termsPath: string
    codeOfConductPath: string
    accessibilityPath: string
    transparencyPath: string
    childSafetyPath?: string
    icipPath?: string
  }
  contact: {
    email: string
    phone: string
    routing: Record<string, string>
    address: {
      locality: string
      region: string
      postcode: string
      country: string
    }
  }
  donation: {
    enabled: boolean
    path: string
    taxStatement: string
  }
  analytics: {
    plausibleDomain?: string
    gaMeasurementIdEnv?: string
  }
  environment: {
    requiredRuntime: string[]
    requiredProduction: string[]
    optional: string[]
  }
  publicRoutes: string[]
}

export const MUDYIN_SITE_ID = 'mudyin'

export const mudyinSiteConfig: WhiteLabelSiteConfig = {
  siteId: MUDYIN_SITE_ID,
  tenantScope: 'tenant_mudyin',
  slug: 'mudyin',
  canonicalName: 'Mudyin Aboriginal Healing Centre',
  shortName: 'Mudyin',
  tagline: 'Two Worlds Strong',
  domains: {
    canonical: 'www.mudyin.com',
    aliases: ['mudyin.com', 'mudyin.org.au', 'www.mudyin.org.au'],
    deploymentAliases: ['mudyin-live.vercel.app', 'maanara.vercel.app'],
    redirectToCanonical: ['mudyin.com', 'mudyin.org.au', 'www.mudyin.org.au'],
  },
  brand: {
    colors: {
      background: '#2f241d',
      foreground: '#fff8ef',
      primary: '#6f8a78',
      accent: '#b87555',
      muted: '#8a8178',
    },
    typography: {
      display: 'var(--font-display)',
      body: 'var(--font-body)',
    },
    logoText: 'Mudyin',
    logoSubtext: 'Aboriginal Healing Centre',
    faviconPath: '/favicon.ico',
    ogImagePath: '/og-default.jpg',
  },
  metadata: {
    title: 'Mudyin Aboriginal Healing Centre',
    titleTemplate: '%s | Mudyin',
    description:
      'Mudyin is a culturally grounded healing-centre and program-stream site operating under MUDYIN PTY LTD, accepting first-live enquiries and booking requests.',
    keywords: [
      'Mudyin',
      'MUDYIN PTY LTD',
      'Aboriginal healing centre',
      'Indigenous-led wellbeing',
      'Thrive Tribe',
      'Young Spirit Mentoring',
      'Culture Country',
      'Mudyin Womens Business',
      'Aaliyahs Dreaming',
      'Mirabellas Dreaming',
    ],
    url: 'https://www.mudyin.com',
    locale: 'en_AU',
    socialHandle: '@mudyin',
  },
  publicNav: [
    {
      label: 'About',
      href: '/about/our-story',
      children: [
        { label: 'Our Story', href: '/about/our-story' },
        { label: 'Our Team', href: '/about/team' },
        { label: 'Governance', href: '/governance' },
      ],
    },
    {
      label: 'Programs',
      href: '/programs',
      children: [
        { label: 'Thrive Tribe', href: '/programs/thrive-tribe' },
        { label: 'Young Spirit Mentoring', href: '/programs/young-spirit-mentoring' },
        { label: 'Culture Country', href: '/programs/culture-country' },
        { label: "Mudyin Women's Business", href: '/programs/womens-business' },
        { label: "Aaliyah's Dreaming", href: '/programs/aaliyahs-dreaming' },
        { label: "Mirabella's Dreaming", href: '/programs/mirabellas-dreaming' },
      ],
    },
    { label: 'Governance', href: '/governance' },
    { label: 'Contact', href: '/contact' },
  ],
  footerLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Code of Conduct', href: '/code-of-conduct' },
    { label: 'Governance', href: '/governance' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'ICIP Protocols', href: '/icip' },
    { label: 'Child Safety Policy', href: '/about/child-safety' },
  ],
  enabledModules: [
    'about',
    'contact',
    'impact',
    'legal',
    'programs',
    'resources',
  ],
  featureFlags: {
    communityFeed: false,
    donations: false,
    enquiries: true,
    bookingRequests: true,
    liveBookings: false,
    events: false,
    galleryUploads: false,
    marketplace: false,
    memberDirectory: false,
    practitioners: false,
    programEnrollment: false,
  },
  legal: {
    privacyPath: '/privacy',
    termsPath: '/terms',
    codeOfConductPath: '/code-of-conduct',
    accessibilityPath: '/accessibility',
    transparencyPath: '/transparency',
    childSafetyPath: '/about/child-safety',
    icipPath: '/icip',
  },
  contact: {
    email: 'yaama@mudyin.com',
    phone: '0478 796 298',
    routing: {
      general: 'yaama@mudyin.com',
      media: 'yaama@mudyin.com',
      partnership: 'yaama@mudyin.com',
      program: 'yaama@mudyin.com',
      volunteer: 'yaama@mudyin.com',
    },
    address: {
      locality: 'Campbelltown',
      region: 'NSW',
      postcode: '2560',
      country: 'AU',
    },
  },
  donation: {
    enabled: false,
    path: '/donate',
    taxStatement:
      'Public donations are disabled for first launch until payment, charity, and tax status are confirmed by the operator.',
  },
  analytics: {
    plausibleDomain: 'www.mudyin.com',
    gaMeasurementIdEnv: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  },
  environment: {
    requiredRuntime: ['NEXTAUTH_SECRET'],
    requiredProduction: ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'],
    optional: [
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'RESEND_API_KEY',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
      'NEXT_PUBLIC_SITE_SLUG',
      'NEXT_PUBLIC_TENANT_KEY',
      'NEXT_PUBLIC_API_BASE_URL',
      'NEXT_PUBLIC_PUBLIC_SITE_URL',
      'MUDYIN_INTAKE_EMAIL',
      'ANU_PUBLIC_ENQUIRIES_ENDPOINT',
      'ANU_PUBLIC_BOOKING_REQUEST_ENDPOINT',
    ],
  },
  publicRoutes: [
    '/',
    '/about/our-story',
    '/about/team',
    '/about/partners',
    '/about/child-safety',
    '/accessibility',
    '/code-of-conduct',
    '/contact',
    '/governance',
    '/icip',
    '/impact',
    '/privacy',
    '/programs',
    '/programs/aaliyahs-dreaming',
    '/programs/culture-country',
    '/programs/mirabellas-dreaming',
    '/programs/thrive-tribe',
    '/programs/womens-business',
    '/programs/young-spirit-mentoring',
    '/programs/ysmp',
    '/resources',
    '/terms',
    '/transparency',
  ],
}

export const whiteLabelSites = {
  [MUDYIN_SITE_ID]: mudyinSiteConfig,
} as const satisfies Record<string, WhiteLabelSiteConfig>

export type KnownSiteId = keyof typeof whiteLabelSites

export function getDefaultSite(): WhiteLabelSiteConfig {
  return whiteLabelSites[MUDYIN_SITE_ID]
}

export function getSiteById(siteId: string): WhiteLabelSiteConfig | null {
  return Object.prototype.hasOwnProperty.call(whiteLabelSites, siteId)
    ? whiteLabelSites[siteId as KnownSiteId]
    : null
}

export function getAllSites(): WhiteLabelSiteConfig[] {
  return Object.values(whiteLabelSites)
}

export type SiteRegistryIssue = {
  siteId: string
  field: string
  message: string
}

export function validateWhiteLabelSite(site: WhiteLabelSiteConfig): SiteRegistryIssue[] {
  const issues: SiteRegistryIssue[] = []
  const requiredStrings: Array<keyof WhiteLabelSiteConfig> = [
    'siteId',
    'tenantScope',
    'slug',
    'canonicalName',
    'shortName',
    'tagline',
  ]

  for (const field of requiredStrings) {
    if (!site[field]) {
      issues.push({ siteId: site.siteId || 'unknown', field, message: 'Required value is missing' })
    }
  }

  if (!site.domains.canonical) {
    issues.push({ siteId: site.siteId, field: 'domains.canonical', message: 'Canonical domain is required' })
  }

  if (!site.metadata.url.startsWith('https://')) {
    issues.push({ siteId: site.siteId, field: 'metadata.url', message: 'Canonical metadata URL must be HTTPS' })
  }

  if (!site.publicNav.length) {
    issues.push({ siteId: site.siteId, field: 'publicNav', message: 'At least one public navigation item is required' })
  }

  const requiredLegalPaths = [
    site.legal.privacyPath,
    site.legal.termsPath,
    site.legal.codeOfConductPath,
    site.legal.accessibilityPath,
    site.legal.transparencyPath,
  ]
  if (requiredLegalPaths.some((path) => !path.startsWith('/'))) {
    issues.push({ siteId: site.siteId, field: 'legal', message: 'Legal paths must be absolute app paths' })
  }

  return issues
}

export function validateWhiteLabelRegistry(): SiteRegistryIssue[] {
  const issues = getAllSites().flatMap(validateWhiteLabelSite)
  const seenDomains = new Map<string, string>()

  for (const site of getAllSites()) {
    const domains = [
      site.domains.canonical,
      ...site.domains.aliases,
      ...site.domains.deploymentAliases,
    ]
    for (const domain of domains) {
      const key = domain.toLowerCase()
      const existing = seenDomains.get(key)
      if (existing && existing !== site.siteId) {
        issues.push({
          siteId: site.siteId,
          field: 'domains',
          message: `Domain ${domain} is already assigned to ${existing}`,
        })
      }
      seenDomains.set(key, site.siteId)
    }
  }

  return issues
}
