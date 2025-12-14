/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@meal-planner/database'],
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
