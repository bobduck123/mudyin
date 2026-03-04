import type { Metadata, Viewport } from 'next'
import { SkipNav }                  from '@/components/a11y/SkipNav'
import { AccessibilityPanel }       from '@/components/a11y/AccessibilityPanel'
import { AcknowledgementOfCountry } from '@/components/cultural/AcknowledgementOfCountry'
import { Navigation }               from '@/components/layout/Navigation'
import { Footer }                   from '@/components/layout/Footer'
import { SessionProviderWrapper }   from '@/components/providers/SessionProvider'
import './globals.css'

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#141414',
}

export const metadata: Metadata = {
  title: {
    default:  'Mudyin Aboriginal Healing Centre',
    template: '%s | Mudyin',
  },
  description:
    'Healing, empowering, and connecting Aboriginal communities through the Young Spirit Mentoring Program and culturally grounded healing services. Campbelltown, NSW.',
  keywords: [
    'Aboriginal youth programs NSW',
    'Indigenous mentoring Sydney',
    'YSMP Campbelltown',
    'Aboriginal healing centre',
    'Young Spirit Mentoring Program',
    'Indigenous wellness Queensland',
    'Thrive Tribe',
    'Uncle Dave Bell',
  ],
  authors:   [{ name: 'Mudyin Aboriginal Healing Centre' }],
  creator:   'Mudyin Aboriginal Healing Centre',
  publisher: 'Mudyin Aboriginal Healing Centre',
  metadataBase: new URL('https://mudyin.org.au'),
  openGraph: {
    siteName: 'Mudyin Aboriginal Healing Centre',
    type:     'website',
    locale:   'en_AU',
    url:      'https://mudyin.org.au',
    images: [{
      url:    '/og-default.jpg',
      width:  1200,
      height: 630,
      alt:    'Mudyin Aboriginal Healing Centre — Two Worlds Strong',
    }],
  },
  twitter: {
    card:    'summary_large_image',
    creator: '@mudyin',
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
