import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { generateDefaultMetadata } from '@/lib/seo/metadata'
import { generateHomePageSchema } from '@/lib/seo/structured-data'
import { GoogleAnalytics } from '@/lib/analytics/google-analytics'

/**
 * Root layout metadata with comprehensive SEO
 * Includes Open Graph, Twitter cards, and structured data
 */
export const metadata: Metadata = {
  ...generateDefaultMetadata(),
  icons: {
    icon: '/favicon.svg',
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
