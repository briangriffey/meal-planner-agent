/**
 * Minimal E2E Tests for Debugging Authentication
 */

import { test, expect } from '@playwright/test';
import { login, clearSession } from './helpers/auth';
import { VALID_USER, ROUTES, SELECTORS, TIMEOUTS } from './helpers/fixtures';

test.describe('Authentication - Minimal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  test('should load login page', async ({ page }) => {
    await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });
    await expect(page).toHaveURL(ROUTES.login);
    await expect(page.locator('h1, h2')).toContainText(/welcome|sign in|login/i);
  });

  test('should show email and password inputs', async ({ page }) => {
    await page.goto(ROUTES.login);

    const emailInput = page.locator(SELECTORS.emailInput);
    const passwordInput = page.locator(SELECTORS.passwordInput);
    const loginButton = page.locator(SELECTORS.loginButton);

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto(ROUTES.login);

    // Fill credentials
    await page.fill(SELECTORS.emailInput, VALID_USER.email);
    await page.fill(SELECTORS.passwordInput, VALID_USER.password);

    // Click login button
    await page.click(SELECTORS.loginButton);

    // Wait for redirect to dashboard (may redirect to /dashboard/preferences)
    await page.waitForURL(/\/dashboard/, {
      timeout: TIMEOUTS.navigation,
      waitUntil: 'networkidle'
    });

    // Verify we're on a dashboard page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/dashboard/);
  });

  test('should reject login with wrong password', async ({ page }) => {
    await page.goto(ROUTES.login);

    await page.fill(SELECTORS.emailInput, VALID_USER.email);
    await page.fill(SELECTORS.passwordInput, 'WrongPassword123!');

    await page.click(SELECTORS.loginButton);

    // Should stay on login page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(ROUTES.login);
  });

  test('should use login helper successfully', async ({ page }) => {
    await login(page, VALID_USER.email, VALID_USER.password);

    // Verify we're authenticated and on dashboard
    await expect(page).toHaveURL(ROUTES.dashboard);
  });
});
