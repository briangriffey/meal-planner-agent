import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { generateDefaultMetadata } from '@/lib/seo/metadata'
import { generateHomePageSchema } from '@/lib/seo/structured-data'
import { GoogleAnalytics } from '@/lib/analytics/google-analytics'

/**
 * Root layout metadata with comprehensive SEO
 * Includes Open Graph, Twitter cards, and structured data
 *
 * Search Engine Verification:
 * To verify your site with search engines, add the following environment variables:
 * - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: Google Search Console verification code
 * - NEXT_PUBLIC_BING_VERIFICATION: Bing Webmaster Tools verification code
 * - NEXT_PUBLIC_YANDEX_VERIFICATION: Yandex Webmaster verification code
 *
 * How to get verification codes:
 * 1. Google Search Console: https://search.google.com/search-console
 *    - Add property > HTML tag method > copy the content value
 * 2. Bing Webmaster Tools: https://www.bing.com/webmasters
 *    - Add site > HTML meta tag method > copy the content value
 * 3. Yandex Webmaster: https://webmaster.yandex.com
 *    - Add site > Meta tag method > copy the content value
 */
export const metadata: Metadata = {
  ...generateDefaultMetadata(),
  icons: {
    icon: '/favicon.svg',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION,
      'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Generate structured data for the site
  const structuredData = generateHomePageSchema()

  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Google Analytics */}
        <GoogleAnalytics />
      </head>
      <body>{children}</body>
    </html>
  )
}
