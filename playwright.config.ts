import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * Playwright Test Configuration
 *
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Maximum time one test can run for
  timeout: 30 * 1000,

  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: process.env.NEXTAUTH_URL || 'http://localhost:3001',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot settings
    screenshot: 'only-on-failure',

    // Video settings
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 10 * 1000,

    // Navigation timeout
    navigationTimeout: 15 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Output folder for test artifacts
  outputDir: 'test-results/',

  // Folder for test assets (e.g., test data files)
  // testMatch: '**/*.spec.ts',
});
