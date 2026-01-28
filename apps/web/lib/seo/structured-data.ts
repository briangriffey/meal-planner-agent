/**
 * Structured Data (JSON-LD) Utilities
 * Generates schema.org structured data for search engines
 */

import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  SCHEMA_ORG_CONTEXT,
  APPLICATION_CATEGORY,
  OPERATING_SYSTEM,
  getBaseUrl,
} from './constants';

/**
 * Base structured data interface
 */
interface BaseStructuredData {
  '@context': string;
  '@type': string;
}

/**
 * WebApplication structured data
 */
interface WebApplicationData extends BaseStructuredData {
  '@type': 'WebApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency?: string;
  };
  author?: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

/**
 * Organization structured data
 */
interface OrganizationData extends BaseStructuredData {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
  };
}

/**
 * WebSite structured data
 */
interface WebSiteData extends BaseStructuredData {
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
  author?: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
}

/**
 * BreadcrumbList item
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * BreadcrumbList structured data
 */
interface BreadcrumbListData extends BaseStructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate WebApplication structured data
 *
 * @param options - Optional overrides for default values
 * @returns WebApplication JSON-LD object
 */
export function generateWebApplicationSchema(options?: {
  name?: string;
  description?: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
  rating?: { value: string; count: string };
}): WebApplicationData {
  const baseUrl = getBaseUrl();

  const schema: WebApplicationData = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'WebApplication',
    name: options?.name || SITE_NAME,
    description: options?.description || SITE_DESCRIPTION,
    url: options?.url || baseUrl,
    applicationCategory: APPLICATION_CATEGORY,
    operatingSystem: OPERATING_SYSTEM,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
  };

  // Add pricing information if provided
  if (options?.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      price: options.price,
      priceCurrency: options?.priceCurrency,
    };
  }

  // Add rating if provided
  if (options?.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: options.rating.value,
      reviewCount: options.rating.count,
    };
  }

  return schema;
}

/**
 * Generate Organization structured data
 *
 * @param options - Optional overrides for default values
 * @returns Organization JSON-LD object
 */
export function generateOrganizationSchema(options?: {
  name?: string;
  url?: string;
  logo?: string;
  socialLinks?: string[];
  contactEmail?: string;
}): OrganizationData {
  const baseUrl = getBaseUrl();

  const schema: OrganizationData = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'Organization',
    name: options?.name || SITE_AUTHOR.name,
    url: options?.url || SITE_AUTHOR.url,
  };

  // Add logo if provided
  if (options?.logo) {
    const logoUrl = options.logo.startsWith('http')
      ? options.logo
      : `${baseUrl}${options.logo}`;
    schema.logo = logoUrl;
  }

  // Add social media links if provided
  if (options?.socialLinks && options.socialLinks.length > 0) {
    schema.sameAs = options.socialLinks;
  }

  // Add contact information if provided
  if (options?.contactEmail) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: options.contactEmail,
    };
  }

  return schema;
}

/**
 * Generate WebSite structured data
 *
 * @param options - Optional overrides for default values
 * @returns WebSite JSON-LD object
 */
export function generateWebSiteSchema(options?: {
  name?: string;
  description?: string;
  url?: string;
  searchUrl?: string;
}): WebSiteData {
  const baseUrl = getBaseUrl();

  const schema: WebSiteData = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'WebSite',
    name: options?.name || SITE_NAME,
    description: options?.description || SITE_TAGLINE,
    url: options?.url || baseUrl,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
    },
  };

  // Add search action if search URL provided
  if (options?.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: `${options.searchUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList structured data
 *
 * @param items - Array of breadcrumb items (name and URL)
 * @returns BreadcrumbList JSON-LD object
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): BreadcrumbListData {
  const baseUrl = getBaseUrl();

  const schema: BreadcrumbListData = {
    '@context': SCHEMA_ORG_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const itemUrl = item.url.startsWith('http')
        ? item.url
        : `${baseUrl}${item.url}`;

      const listItem: {
        '@type': 'ListItem';
        position: number;
        name: string;
        item?: string;
      } = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };

      // Don't include item URL for the last item (current page)
      if (index < items.length - 1) {
        listItem.item = itemUrl;
      }

      return listItem;
    }),
  };

  return schema;
}

/**
 * Convert structured data object to JSON-LD script tag string
 *
 * @param data - Structured data object
 * @returns HTML script tag string
 */
export function toJsonLdScript(data: BaseStructuredData): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/**
 * Convert multiple structured data objects to a single JSON-LD script tag
 *
 * @param dataArray - Array of structured data objects
 * @returns HTML script tag string
 */
export function toJsonLdScriptArray(
  dataArray: BaseStructuredData[]
): string {
  return `<script type="application/ld+json">${JSON.stringify(dataArray)}</script>`;
}

/**
 * Generate structured data for the homepage
 * Combines WebApplication, Organization, and WebSite schemas
 *
 * @returns Array of structured data objects
 */
export function generateHomePageSchema(): BaseStructuredData[] {
  return [
    generateWebApplicationSchema({ price: '0' }), // Free app
    generateOrganizationSchema(),
    generateWebSiteSchema(),
  ];
}

/**
 * Export types for use in other files
 */
export type {
  BaseStructuredData,
  WebApplicationData,
  OrganizationData,
  WebSiteData,
  BreadcrumbListData,
  BreadcrumbItem,
};
