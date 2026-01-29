import { Metadata } from 'next';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  PRIMARY_KEYWORDS,
  SECONDARY_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  TWITTER_CARD_TYPE,
  SITE_LOCALE,
  ROBOTS_DEFAULT,
  ROBOTS_NOINDEX,
  getBaseUrl,
} from './constants';

/**
 * Page metadata options
 */
export interface PageMetadataOptions {
  /** Page title (will be suffixed with site name if not a template) */
  title: string;
  /** Page description for meta tags */
  description?: string;
  /** Page-specific keywords (will be combined with default keywords) */
  keywords?: string[];
  /** Canonical URL (defaults to current page URL) */
  canonicalUrl?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Twitter card image URL */
  twitterImage?: string;
  /** Whether to index this page (default: true) */
  noIndex?: boolean;
  /** Open Graph type (default: 'website') */
  ogType?: 'website' | 'article';
  /** Additional metadata to merge */
  additionalMetadata?: Partial<Metadata>;
}

/**
 * Generate comprehensive page metadata for Next.js
 *
 * @param options - Page metadata options
 * @returns Next.js Metadata object
 */
export function generatePageMetadata(
  options: PageMetadataOptions
): Metadata {
  const baseUrl = getBaseUrl();
  const {
    title,
    description = SITE_DESCRIPTION,
    keywords = [],
    canonicalUrl,
    ogImage = DEFAULT_OG_IMAGE,
    twitterImage = DEFAULT_TWITTER_IMAGE,
    noIndex = false,
    ogType = 'website',
    additionalMetadata = {},
  } = options;

  // Combine keywords
  const allKeywords = [
    ...PRIMARY_KEYWORDS,
    ...SECONDARY_KEYWORDS,
    ...keywords,
  ];

  // Build full title
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  // Build canonical URL
  const canonical = canonicalUrl || baseUrl;

  // Build Open Graph image URL
  const ogImageUrl = ogImage.startsWith('http')
    ? ogImage
    : `${baseUrl}${ogImage}`;

  // Build Twitter image URL
  const twitterImageUrl = twitterImage.startsWith('http')
    ? twitterImage
    : `${baseUrl}${twitterImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.url }],
    creator: SITE_AUTHOR.name,
    publisher: SITE_AUTHOR.name,
    robots: noIndex ? ROBOTS_NOINDEX : ROBOTS_DEFAULT,
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      locale: SITE_LOCALE,
      url: canonical,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: TWITTER_CARD_TYPE,
      title: fullTitle,
      description,
      images: [twitterImageUrl],
    },
    ...additionalMetadata,
  };

  return metadata;
}

/**
 * Create Open Graph image metadata
 *
 * @param imageUrl - URL to the Open Graph image
 * @param alt - Alt text for the image
 * @param width - Image width (default: 1200)
 * @param height - Image height (default: 630)
 * @returns Open Graph image object
 */
export function createOpenGraphImage(
  imageUrl: string,
  alt: string,
  width: number = 1200,
  height: number = 630
) {
  const baseUrl = getBaseUrl();
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${baseUrl}${imageUrl}`;

  return {
    url: fullImageUrl,
    width,
    height,
    alt,
  };
}

/**
 * Create Twitter card metadata
 *
 * @param title - Card title
 * @param description - Card description
 * @param imageUrl - Card image URL
 * @returns Twitter card metadata object
 */
export function createTwitterCard(
  title: string,
  description: string,
  imageUrl: string
) {
  const baseUrl = getBaseUrl();
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${baseUrl}${imageUrl}`;

  return {
    card: TWITTER_CARD_TYPE,
    title,
    description,
    images: [fullImageUrl],
  };
}

/**
 * Generate default metadata for the site (used in root layout)
 *
 * @returns Default Next.js Metadata object
 */
export function generateDefaultMetadata(): Metadata {
  return generatePageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  });
}

/**
 * Generate metadata for authentication pages (login, register, etc.)
 * These pages should not be indexed by search engines
 *
 * @param title - Page title
 * @param description - Page description
 * @returns Next.js Metadata object with noindex
 */
export function generateAuthPageMetadata(
  title: string,
  description: string
): Metadata {
  return generatePageMetadata({
    title,
    description,
    noIndex: true,
  });
}
