/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@meal-planner/database'],
  productionBrowserSourceMaps: true,

  // SEO Optimizations
  trailingSlash: false, // Avoid duplicate content issues with/without trailing slashes
  compress: true, // Enable gzip compression for better performance

  // Image optimizations for better performance and SEO
  images: {
    formats: ['image/avif', 'image/webp'], // Modern image formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller image sizes for icons/thumbnails
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
  },

  // Generate unique build ID for cache busting
  generateBuildId: async () => {
    // Use git commit hash if available, otherwise use timestamp
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    return `build-${Date.now()}`;
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: [
      '@meal-planner/core',
      '@meal-planner/queue',
      'puppeteer',
      'puppeteer-extra',
      'puppeteer-extra-plugin-stealth',
      '@anthropic-ai/sdk',
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude puppeteer and related packages from bundling
      config.externals = [
        ...config.externals,
        'puppeteer',
        'puppeteer-extra',
        'puppeteer-extra-plugin-stealth',
      ];
    }
    return config;
  },
};

export default nextConfig;
