/**
 * SEO Constants
 * Central configuration for all SEO-related metadata across the application
 */

/**
 * Get the base URL from environment variable or fallback to localhost
 */
export function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

/**
 * Site information
 */
export const SITE_NAME = 'Meal Planner Agent';
export const SITE_TAGLINE = 'AI-Powered Meal Planning with Claude AI';
export const SITE_DESCRIPTION =
  'Get personalized, nutritious meal plans powered by Claude AI. Customize meals per week, servings, dietary restrictions, and nutrition targets. Automatic weekly planning with grocery lists.';

/**
 * Author information
 */
export const SITE_AUTHOR = {
  name: 'Brian Griffey',
  url: 'https://briangriffey.com',
};

/**
 * Primary keywords for SEO
 */
export const PRIMARY_KEYWORDS = [
  'ai meal planner',
  'meal planning app',
  'ai meal planning',
  'automatic meal planner',
  'personalized meal plans',
  'weekly meal planner',
];

/**
 * Secondary keywords for SEO
 */
export const SECONDARY_KEYWORDS = [
  'nutrition meal planner',
  'meal prep planner',
  'healthy meal planning',
  'ai powered meal planning',
  'meal planner with grocery list',
  'claude ai meal planning',
];

/**
 * Default Open Graph image path
 */
export const DEFAULT_OG_IMAGE = '/og-image.jpg';

/**
 * Default Twitter card image path
 */
export const DEFAULT_TWITTER_IMAGE = '/twitter-card.jpg';

/**
 * Twitter card type
 */
export const TWITTER_CARD_TYPE = 'summary_large_image';

/**
 * Locale for the site
 */
export const SITE_LOCALE = 'en_US';

/**
 * Robots meta tag configurations
 */
export const ROBOTS_DEFAULT = 'index,follow';
export const ROBOTS_NOINDEX = 'noindex,follow';

/**
 * Structured data constants
 */
export const SCHEMA_ORG_CONTEXT = 'https://schema.org';
export const APPLICATION_CATEGORY = 'HealthApplication';
export const OPERATING_SYSTEM = 'Web Browser';
