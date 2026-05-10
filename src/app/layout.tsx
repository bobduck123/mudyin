import type { Metadata, Viewport } from 'next'
import { SkipNav }                  from '@/components/a11y/SkipNav'
import { AccessibilityPanel }       from '@/components/a11y/AccessibilityPanel'
import { AcknowledgementOfCountry } from '@/components/cultural/AcknowledgementOfCountry'
import { Navigation }               from '@/components/layout/Navigation'
import { Footer }                   from '@/components/layout/Footer'
import { SessionProviderWrapper }   from '@/components/providers/SessionProvider'
import { getDefaultSite }           from '@/lib/white-label/site-registry'
import './globals.css'

const defaultSite = getDefaultSite()

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   defaultSite.brand.colors.background,
}

export const metadata: Metadata = {
  title: {
    default:  defaultSite.metadata.title,
    template: defaultSite.metadata.titleTemplate,
  },
  description: defaultSite.metadata.description,
  keywords: defaultSite.metadata.keywords,
  authors:   [{ name: defaultSite.canonicalName }],
  creator:   defaultSite.canonicalName,
  publisher: defaultSite.canonicalName,
  metadataBase: new URL(defaultSite.metadata.url),
  openGraph: {
    siteName: defaultSite.canonicalName,
    type:     'website',
    locale:   defaultSite.metadata.locale,
    url:      defaultSite.metadata.url,
    images: [{
      url:    defaultSite.brand.ogImagePath,
      width:  1200,
      height: 630,
      alt:    'Mudyin Aboriginal Healing Centre — Two Worlds Strong',
    }],
  },
  twitter: {
    card:    'summary_large_image',
    creator: defaultSite.metadata.socialHandle,
  },
  robots: {
    index:    true,
    follow:   true,
    googleBot: {
      index:                   true,
      follow:                  true,
      'max-image-preview':    'large',
      'max-snippet':           -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body>
        <SessionProviderWrapper>
          <SkipNav />
          <AcknowledgementOfCountry variant="banner" />
          <Navigation />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <AccessibilityPanel />
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
