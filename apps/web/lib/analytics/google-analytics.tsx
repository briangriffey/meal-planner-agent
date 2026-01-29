import Script from 'next/script'

/**
 * Google Analytics 4 (gtag.js) Integration
 *
 * This component loads Google Analytics only in production environments.
 * Requires NEXT_PUBLIC_GA_ID environment variable to be set.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  // Only load Google Analytics in production and when GA ID is configured
  if (process.env.NODE_ENV !== 'production' || !gaId) {
    return null
  }

  return (
    <>
      {/* Google Analytics gtag.js script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />

      {/* Google Analytics configuration */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

/**
 * Track a custom event in Google Analytics
 * Only sends events in production when GA is configured
 *
 * @param action - The action being tracked (e.g., 'generate_meal_plan')
 * @param category - Category of the event (e.g., 'engagement')
 * @param label - Optional label for additional context
 * @param value - Optional numeric value
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_GA_ID) {
    return
  }

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

/**
 * Track a page view in Google Analytics
 * Useful for client-side navigation in Next.js
 *
 * @param url - The page URL to track
 */
export function trackPageView(url: string) {
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_GA_ID) {
    return
  }

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}
