/**
 * E2E Test Authentication Helpers
 *
 * This file provides reusable authentication utilities for E2E tests.
 * These helpers abstract common authentication flows to keep test code DRY.
 *
 * Usage:
 * ```typescript
 * import { login, register, logout, getAuthenticatedPage } from './helpers/auth';
 *
 * test('authenticated user can view dashboard', async ({ page }) => {
 *   await login(page, VALID_USER.email, VALID_USER.password);
 *   await expect(page).toHaveURL(ROUTES.dashboard);
 * });
 * ```
 */

import { Page, Browser, BrowserContext, expect } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from './fixtures';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * User data for registration
 */
export interface UserRegistrationData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Authentication options
 */
export interface AuthOptions {
  timeout?: number;
  waitForNavigation?: boolean;
  expectedUrl?: string;
}

// ============================================================================
// Login Helper
// ============================================================================

/**
 * Log in a user with email and password
 *
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 * @param options - Optional authentication options
 *
 * @example
 * await login(page, 'test@example.com', 'Password123!');
 */
export async function login(
  page: Page,
  email: string,
  password: string,
  options: AuthOptions = {}
): Promise<void> {
  const {
    timeout = TIMEOUTS.authentication,
    waitForNavigation = true,
    expectedUrl = ROUTES.dashboard,
  } = options;

  // Navigate to login page if not already there
  const currentUrl = page.url();
  if (!currentUrl.includes(ROUTES.login)) {
    await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });
  }

  // Fill in credentials
  await page.fill(SELECTORS.emailInput, email, { timeout });
  await page.fill(SELECTORS.passwordInput, password, { timeout });

  // Submit login form
  await page.click(SELECTORS.loginButton, { timeout });

  // Wait for navigation to complete
  // Note: App may redirect to /dashboard/preferences or other dashboard routes
  if (waitForNavigation) {
    await page.waitForURL(/\/dashboard/, { timeout: TIMEOUTS.navigation });
  }

  // Verify we're authenticated by checking we're on a dashboard route
  if (waitForNavigation) {
    const url = page.url();
    if (!url.includes('/dashboard')) {
      throw new Error(`Expected to be on dashboard route after login, but got: ${url}`);
    }
  }
}

// ============================================================================
// Register Helper
// ============================================================================

/**
 * Register a new user account
 *
 * @param page - Playwright page object
 * @param userData - User registration data
 * @param options - Optional authentication options
 *
 * @example
 * await register(page, {
 *   name: 'New User',
 *   email: 'newuser@example.com',
 *   password: 'SecurePass123!',
 *   confirmPassword: 'SecurePass123!'
 * });
 */
export async function register(
  page: Page,
  userData: UserRegistrationData,
  options: AuthOptions = {}
): Promise<void> {
  const {
    timeout = TIMEOUTS.authentication,
    waitForNavigation = true,
    expectedUrl = ROUTES.dashboard,
  } = options;

  // Navigate to registration page if not already there
  const currentUrl = page.url();
  if (!currentUrl.includes(ROUTES.register)) {
    await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });
  }

  // Fill in registration form
  if (userData.name) {
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill(userData.name, { timeout });
  }

  await page.fill(SELECTORS.emailInput, userData.email, { timeout });
  await page.fill(SELECTORS.passwordInput, userData.password, { timeout });

  // Handle confirm password field if provided
  if (userData.confirmPassword) {
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    await confirmPasswordInput.fill(userData.confirmPassword, { timeout });
  }

  // Submit registration form
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click({ timeout });

  // Wait for navigation to complete
  if (waitForNavigation) {
    await page.waitForURL(expectedUrl, { timeout: TIMEOUTS.navigation });
  }

  // Verify successful registration
  if (waitForNavigation) {
    await expect(page).toHaveURL(expectedUrl);
  }
}

// ============================================================================
// Logout Helper
// ============================================================================

/**
 * Log out the current user
 *
 * @param page - Playwright page object
 * @param options - Optional authentication options
 *
 * @example
 * await logout(page);
 */
export async function logout(
  page: Page,
  options: AuthOptions = {}
): Promise<void> {
  const {
    timeout = TIMEOUTS.authentication,
    waitForNavigation = true,
    expectedUrl = ROUTES.home,
  } = options;

  // Find and click logout button
  // The logout button might be in a dropdown menu or header
  const logoutButton = page.locator(SELECTORS.logoutButton);

  // Wait for logout button to be visible
  await logoutButton.waitFor({ state: 'visible', timeout });

  // Click logout
  await logoutButton.click({ timeout });

  // Wait for navigation to complete
  if (waitForNavigation) {
    await page.waitForURL(expectedUrl, { timeout: TIMEOUTS.navigation });
  }

  // Verify we're logged out
  if (waitForNavigation) {
    await expect(page).toHaveURL(expectedUrl);
  }
}

// ============================================================================
// Get Authenticated Page
// ============================================================================

/**
 * Create a new page with an authenticated user session
 *
 * This is useful for tests that need a fresh page with authentication
 * already established, skipping the login flow in each test.
 *
 * @param browser - Playwright browser object
 * @param email - User email
 * @param password - User password
 * @returns Authenticated page object
 *
 * @example
 * test('view preferences', async ({ browser }) => {
 *   const page = await getAuthenticatedPage(
 *     browser,
 *     VALID_USER.email,
 *     VALID_USER.password
 *   );
 *   await page.goto(ROUTES.preferences);
 *   // ... rest of test
 * });
 */
export async function getAuthenticatedPage(
  browser: Browser,
  email: string,
  password: string,
  options: AuthOptions = {}
): Promise<Page> {
  // Create a new browser context (isolated session)
  const context: BrowserContext = await browser.newContext();

  // Create a new page in this context
  const page: Page = await context.newPage();

  // Log in the user
  await login(page, email, password, options);

  return page;
}

// ============================================================================
// Check Authentication Status
// ============================================================================

/**
 * Check if a user is currently authenticated
 *
 * @param page - Playwright page object
 * @returns True if user is authenticated, false otherwise
 *
 * @example
 * const isLoggedIn = await isAuthenticated(page);
 * if (!isLoggedIn) {
 *   await login(page, VALID_USER.email, VALID_USER.password);
 * }
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check if we can access an authenticated-only route
    const currentUrl = page.url();

    // If we're already on an authenticated route, we're likely authenticated
    const authenticatedRoutes = [
      ROUTES.dashboard,
      ROUTES.preferences,
      ROUTES.mealPlans,
    ];

    if (authenticatedRoutes.some((route) => currentUrl.includes(route))) {
      return true;
    }

    // Try to navigate to dashboard and see if we get redirected to login
    await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });

    // If we're redirected to login, we're not authenticated
    if (page.url().includes(ROUTES.login)) {
      return false;
    }

    // Otherwise, we're authenticated
    return true;
  } catch (error) {
    // If there's an error, assume not authenticated
    return false;
  }
}

// ============================================================================
// Wait for Authentication
// ============================================================================

/**
 * Wait for authentication to complete
 *
 * This is useful when authentication happens asynchronously
 * (e.g., OAuth callback, SSO redirect)
 *
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait (ms)
 *
 * @example
 * await page.click('button:has-text("Login with Google")');
 * await waitForAuthentication(page);
 */
export async function waitForAuthentication(
  page: Page,
  timeout: number = TIMEOUTS.authentication
): Promise<void> {
  // Wait for URL to change to an authenticated route
  await page.waitForURL(
    (url) => {
      const urlString = url.toString();
      return (
        urlString.includes(ROUTES.dashboard) ||
        urlString.includes(ROUTES.preferences) ||
        urlString.includes(ROUTES.mealPlans)
      );
    },
    { timeout }
  );
}

// ============================================================================
// Login with Session Storage
// ============================================================================

/**
 * Log in using session storage (faster for tests)
 *
 * This bypasses the UI login flow by directly setting session storage,
 * which can speed up tests significantly. Only use this when you don't
 * need to test the login flow itself.
 *
 * @param page - Playwright page object
 * @param sessionData - Session data to set
 *
 * @example
 * await loginWithSession(page, {
 *   user: { id: '123', email: 'test@example.com' },
 *   token: 'mock-jwt-token'
 * });
 */
export async function loginWithSession(
  page: Page,
  sessionData: Record<string, unknown>
): Promise<void> {
  // Navigate to home page first
  await page.goto(ROUTES.home, { timeout: TIMEOUTS.navigation });

  // Set session storage with error handling
  await page.evaluate((data) => {
    try {
      for (const [key, value] of Object.entries(data)) {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error('Failed to set session storage:', e);
    }
  }, sessionData);

  // Navigate to dashboard to activate session
  await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });
}

// ============================================================================
// Clear Session
// ============================================================================

/**
 * Clear all session and local storage
 *
 * Useful for ensuring a clean state between tests
 *
 * @param page - Playwright page object
 *
 * @example
 * test.afterEach(async ({ page }) => {
 *   await clearSession(page);
 * });
 */
export async function clearSession(page: Page): Promise<void> {
  try {
    // Navigate to a valid page first if we're on about:blank or an invalid origin
    const currentUrl = page.url();
    if (!currentUrl || currentUrl === 'about:blank' || currentUrl === '') {
      await page.goto(ROUTES.home, { timeout: TIMEOUTS.navigation }).catch(() => {
        // Ignore navigation errors
      });
    }

    // Try to clear storage, but don't fail if we can't access it
    await page.evaluate(() => {
      try {
        sessionStorage.clear();
      } catch (e) {
        // Ignore - sessionStorage might not be accessible
      }
      try {
        localStorage.clear();
      } catch (e) {
        // Ignore - localStorage might not be accessible
      }
    }).catch(() => {
      // Ignore evaluation errors
    });
  } catch (e) {
    // Ignore all errors during session clearing
  }

  // Clear cookies as well
  try {
    const context = page.context();
    await context.clearCookies();
  } catch (e) {
    // Ignore cookie clearing errors
  }
}

// ============================================================================
// Register Without Verification (for testing)
// ============================================================================

/**
 * Register a new user and wait for "check email" message (doesn't log in)
 *
 * This is the new expected flow after email verification was implemented.
 * Users no longer auto-login after registration.
 *
 * @param page - Playwright page object
 * @param userData - User registration data
 * @param options - Optional authentication options
 *
 * @example
 * await registerWithoutVerification(page, {
 *   email: 'test@example.com',
 *   password: 'SecurePass123!',
 *   name: 'Test User'
 * });
 * // User is registered but NOT logged in
 * // Page shows "Check your email" message
 */
export async function registerWithoutVerification(
  page: Page,
  userData: UserRegistrationData,
  options: AuthOptions = {}
): Promise<void> {
  const { timeout = TIMEOUTS.authentication } = options;

  // Navigate to registration page if not already there
  const currentUrl = page.url();
  if (!currentUrl.includes(ROUTES.register)) {
    await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });
  }

  // Fill in registration form
  if (userData.name) {
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill(userData.name, { timeout });
  }

  await page.fill(SELECTORS.emailInput, userData.email, { timeout });
  await page.fill(SELECTORS.passwordInput, userData.password, { timeout });

  // Handle confirm password field if provided
  if (userData.confirmPassword) {
    const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    await confirmPasswordInput.fill(userData.confirmPassword, { timeout });
  }

  // Submit registration form
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click({ timeout });

  // Wait for success message (NOT redirect to login)
  const successMessage = page.locator('text=/check your email/i');
  await successMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.formSubmission });
}

// ============================================================================
// Export all helpers
// ============================================================================

export default {
  login,
  register,
  registerWithoutVerification,
  logout,
  getAuthenticatedPage,
  isAuthenticated,
  waitForAuthentication,
  loginWithSession,
  clearSession,
};
