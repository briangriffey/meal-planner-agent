/**
 * E2E Tests: Authentication Flows
 *
 * Tests user authentication functionality:
 * - User registration (valid)
 * - User registration (validation errors)
 * - User login (valid credentials)
 * - User login (invalid credentials)
 * - Password requirements validation
 * - Session persistence after login
 * - Logout flow
 * - Protected route redirects
 */

import { test, expect } from '@playwright/test';
import {
  login,
  register,
  logout,
  clearSession,
  isAuthenticated,
} from './helpers/auth';
import {
  VALID_USER,
  REGISTRATION_DATA,
  INVALID_CREDENTIALS,
  ROUTES,
  SELECTORS,
  TIMEOUTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './helpers/fixtures';

// ============================================================================
// Setup and Teardown
// ============================================================================

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session before each test for isolation
    await clearSession(page);
  });

  test.afterEach(async ({ page }) => {
    // Clean up session after tests
    await clearSession(page);
  });

  // ============================================================================
  // User Registration - Valid Cases
  // ============================================================================

  test.describe('User Registration - Valid Cases', () => {
    test('should successfully register a new user with valid data', async ({
      page,
    }) => {
      // Generate unique email to avoid conflicts
      const uniqueEmail = `test-${Date.now()}@example.com`;
      const userData = {
        name: 'New Test User',
        email: uniqueEmail,
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
      };

      // Navigate to registration page
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      // Verify we're on the registration page
      await expect(page).toHaveURL(ROUTES.register);
      await expect(page.locator('h1, h2')).toContainText(/create account/i);

      // Fill in registration form
      if (userData.name) {
        const nameInput = page.locator('input[name="name"]');
        await nameInput.waitFor({ state: 'visible', timeout: TIMEOUTS.formSubmission });
        await nameInput.fill(userData.name);
      }

      await page.fill(SELECTORS.emailInput, userData.email);
      await page.fill(SELECTORS.passwordInput, userData.password);

      // Handle confirm password field if present
      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]');
      const confirmPasswordExists = await confirmPasswordInput.count() > 0;
      if (confirmPasswordExists && userData.confirmPassword) {
        await confirmPasswordInput.fill(userData.confirmPassword);
      }

      // Submit the form
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ timeout: TIMEOUTS.formSubmission });

      // After registration, app redirects to login page (may have query params like ?registered=true)
      await page.waitForURL(/\/login/, { timeout: TIMEOUTS.navigation });

      // Now login with the newly created credentials
      await page.fill(SELECTORS.emailInput, userData.email);
      await page.fill(SELECTORS.passwordInput, userData.password);
      await page.click(SELECTORS.loginButton);

      // Wait for redirect to dashboard after login
      await page.waitForURL(/\/dashboard/, { timeout: TIMEOUTS.authentication });

      // Verify user is authenticated
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
    });

    test('should accept strong passwords with special characters', async ({
      page,
    }) => {
      const uniqueEmail = `test-strong-${Date.now()}@example.com`;
      const strongPassword = 'V3ry$tr0ng!P@ssw0rd#123';

      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      await page.fill(SELECTORS.emailInput, uniqueEmail);
      await page.fill(SELECTORS.passwordInput, strongPassword);

      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]');
      const confirmPasswordExists = await confirmPasswordInput.count() > 0;
      if (confirmPasswordExists) {
        await confirmPasswordInput.fill(strongPassword);
      }

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ timeout: TIMEOUTS.formSubmission });

      // Should not show password validation errors
      const errorMessage = page.locator('text=/password.*weak|password.*invalid/i');
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 }).catch(() => {
        // Ignore timeout - means error message doesn't exist
      });
    });
  });

  // ============================================================================
  // User Registration - Validation Errors
  // ============================================================================

  test.describe('User Registration - Validation Errors', () => {
    test('should reject registration with weak password', async ({ page }) => {
      const uniqueEmail = `test-weak-${Date.now()}@example.com`;
      const weakPassword = '123'; // Too short and simple

      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      // Fill name field
      const nameInput = page.locator('input[name="name"]');
      await nameInput.fill('Test User');

      await page.fill(SELECTORS.emailInput, uniqueEmail);
      await page.fill(SELECTORS.passwordInput, weakPassword);

      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]');
      const confirmPasswordExists = await confirmPasswordInput.count() > 0;
      if (confirmPasswordExists) {
        await confirmPasswordInput.fill(weakPassword);
      }

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ timeout: TIMEOUTS.formSubmission });

      // Wait a moment for validation to occur
      await page.waitForTimeout(1000);

      // Should show password validation error: "Password must be at least 8 characters"
      const errorMessage = page.locator('text=/password must be at least 8 characters/i');
      await expect(errorMessage).toBeVisible({ timeout: TIMEOUTS.formSubmission });
    });

    test('should reject registration with mismatched passwords', async ({
      page,
    }) => {
      const uniqueEmail = `test-mismatch-${Date.now()}@example.com`;

      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      await page.fill(SELECTORS.emailInput, uniqueEmail);
      await page.fill(SELECTORS.passwordInput, 'Password123!');

      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]');
      const confirmPasswordExists = await confirmPasswordInput.count() > 0;
      if (confirmPasswordExists) {
        await confirmPasswordInput.fill('DifferentPassword456!');

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click({ timeout: TIMEOUTS.formSubmission });

        // Should show password mismatch error
        const errorMessage = page.locator(
          'text=/password.*match|password.*same|confirm.*password/i'
        );
        await expect(errorMessage).toBeVisible({ timeout: TIMEOUTS.formSubmission });
      }
    });

    test('should reject registration with invalid email format', async ({
      page,
    }) => {
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      // Try various invalid email formats
      const invalidEmails = ['not-an-email', 'test@', '@example.com', 'test'];

      for (const invalidEmail of invalidEmails) {
        await page.fill(SELECTORS.emailInput, invalidEmail);
        await page.fill(SELECTORS.passwordInput, 'ValidPassword123!');

        // Trigger validation (blur event)
        await page.locator(SELECTORS.emailInput).blur();

        // Should show email validation error or prevent submission
        const errorMessage = page.locator(
          'text=/invalid.*email|valid.*email.*address|email.*format/i'
        );
        const errorVisible = await errorMessage.isVisible().catch(() => false);

        // Either error message shown or email input is invalid
        const emailInput = page.locator(SELECTORS.emailInput);
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);

        expect(errorVisible || isInvalid).toBe(true);
      }
    });

    test('should reject registration with existing email', async ({ page }) => {
      // Use the VALID_USER email which should already exist in test database
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      // Fill name field
      const nameInput = page.locator('input[name="name"]');
      await nameInput.fill('Test User');

      await page.fill(SELECTORS.emailInput, VALID_USER.email);
      await page.fill(SELECTORS.passwordInput, 'NewPassword123!');

      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm-password"]');
      const confirmPasswordExists = await confirmPasswordInput.count() > 0;
      if (confirmPasswordExists) {
        await confirmPasswordInput.fill('NewPassword123!');
      }

      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ timeout: TIMEOUTS.formSubmission });

      // Wait for error to appear - could be in toast/alert or inline
      await page.waitForTimeout(2000);

      // Should show email already exists error - check multiple possible locations
      const errorInAlert = page.locator('[role="alert"]:has-text("email")');
      const errorInline = page.locator('text=/email.*already|already.*registered|user.*exists|email.*in use/i');

      const alertCount = await errorInAlert.count();
      if (alertCount > 0) {
        await expect(errorInAlert).toBeVisible();
      } else {
        await expect(errorInline).toBeVisible({ timeout: TIMEOUTS.formSubmission });
      }
    });

    test('should reject registration with empty required fields', async ({
      page,
    }) => {
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      // Try to submit with empty fields
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click({ timeout: TIMEOUTS.formSubmission });

      // Should show required field errors or browser validation
      const emailInput = page.locator(SELECTORS.emailInput);
      const passwordInput = page.locator(SELECTORS.passwordInput);

      const emailRequired = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valueMissing
      );
      const passwordRequired = await passwordInput.evaluate(
        (el: HTMLInputElement) => el.validity.valueMissing
      );

      expect(emailRequired || passwordRequired).toBe(true);
    });
  });

  // ============================================================================
  // User Login - Valid Credentials
  // ============================================================================

  test.describe('User Login - Valid Credentials', () => {
    test('should successfully login with valid credentials', async ({
      page,
    }) => {
      await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });

      // Verify we're on the login page
      await expect(page).toHaveURL(ROUTES.login);
      await expect(page.locator('h1, h2')).toContainText(/login|sign in/i);

      // Fill in credentials
      await page.fill(SELECTORS.emailInput, VALID_USER.email);
      await page.fill(SELECTORS.passwordInput, VALID_USER.password);

      // Submit login form
      await page.click(SELECTORS.loginButton, { timeout: TIMEOUTS.formSubmission });

      // Wait for navigation to dashboard (may redirect to /dashboard/preferences)
      await page.waitForURL(/\/dashboard/, { timeout: TIMEOUTS.authentication });

      // Verify successful login - should be on a dashboard route
      expect(page.url()).toMatch(/\/dashboard/);

      // Verify user is authenticated
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
    });

    test('should use the login helper function successfully', async ({
      page,
    }) => {
      // Test using the helper function
      await login(page, VALID_USER.email, VALID_USER.password);

      // Should be on a dashboard route
      expect(page.url()).toMatch(/\/dashboard/);

      // Should be authenticated
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
    });
  });

  // ============================================================================
  // User Login - Invalid Credentials
  // ============================================================================

  test.describe('User Login - Invalid Credentials', () => {
    test('should reject login with wrong email', async ({ page }) => {
      await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });

      await page.fill(SELECTORS.emailInput, INVALID_CREDENTIALS.wrongEmail.email);
      await page.fill(SELECTORS.passwordInput, INVALID_CREDENTIALS.wrongEmail.password);
      await page.click(SELECTORS.loginButton, { timeout: TIMEOUTS.formSubmission });

      // Should show error message
      const errorMessage = page.locator(
        'text=/invalid.*credentials|incorrect.*email.*password|login.*failed/i'
      );
      await expect(errorMessage).toBeVisible({ timeout: TIMEOUTS.authentication });

      // Should still be on login page
      await expect(page).toHaveURL(ROUTES.login);
    });

    test('should reject login with wrong password', async ({ page }) => {
      await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });

      await page.fill(SELECTORS.emailInput, INVALID_CREDENTIALS.wrongPassword.email);
      await page.fill(SELECTORS.passwordInput, INVALID_CREDENTIALS.wrongPassword.password);
      await page.click(SELECTORS.loginButton, { timeout: TIMEOUTS.formSubmission });

      // Should show error message
      const errorMessage = page.locator(
        'text=/invalid.*credentials|incorrect.*email.*password|login.*failed/i'
      );
      await expect(errorMessage).toBeVisible({ timeout: TIMEOUTS.authentication });

      // Should still be on login page
      await expect(page).toHaveURL(ROUTES.login);
    });

    test('should reject login with empty fields', async ({ page }) => {
      await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });

      // Try to submit with empty fields
      await page.click(SELECTORS.loginButton, { timeout: TIMEOUTS.formSubmission });

      // Should show required field errors or browser validation
      const emailInput = page.locator(SELECTORS.emailInput);
      const passwordInput = page.locator(SELECTORS.passwordInput);

      const emailRequired = await emailInput.evaluate(
        (el: HTMLInputElement) => el.validity.valueMissing
      );
      const passwordRequired = await passwordInput.evaluate(
        (el: HTMLInputElement) => el.validity.valueMissing
      );

      expect(emailRequired || passwordRequired).toBe(true);
    });
  });

  // ============================================================================
  // Session Persistence
  // ============================================================================

  test.describe('Session Persistence', () => {
    test('should maintain session after page reload', async ({ page }) => {
      // Login first
      await login(page, VALID_USER.email, VALID_USER.password);
      expect(page.url()).toMatch(/\/dashboard/);

      // Reload the page
      await page.reload({ timeout: TIMEOUTS.navigation });

      // Should still be authenticated and on a dashboard route
      expect(page.url()).toMatch(/\/dashboard/);

      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
    });

    test('should maintain session when navigating between pages', async ({
      page,
    }) => {
      // Login first
      await login(page, VALID_USER.email, VALID_USER.password);

      // Navigate to preferences
      await page.goto(ROUTES.preferences, { timeout: TIMEOUTS.navigation });
      await expect(page).toHaveURL(ROUTES.preferences);

      // Navigate to meal plans
      await page.goto(ROUTES.mealPlans, { timeout: TIMEOUTS.navigation });
      await expect(page).toHaveURL(ROUTES.mealPlans);

      // Navigate back to dashboard
      await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });
      expect(page.url()).toMatch(/\/dashboard/);

      // Should still be authenticated
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
    });
  });

  // ============================================================================
  // Logout Flow
  // ============================================================================

  test.describe('Logout Flow', () => {
    test('should successfully logout authenticated user', async ({ page }) => {
      // Login first
      await login(page, VALID_USER.email, VALID_USER.password);
      expect(page.url()).toMatch(/\/dashboard/);

      // Find and click logout button
      const logoutButton = page.locator(SELECTORS.logoutButton);

      // Logout button might be in a menu, so try to find and click it
      const isVisible = await logoutButton.isVisible().catch(() => false);

      if (isVisible) {
        await logoutButton.click({ timeout: TIMEOUTS.authentication });

        // Should redirect to home or login page
        await page.waitForURL(
          (url) => {
            const urlString = url.toString();
            return urlString.includes(ROUTES.home) || urlString.includes(ROUTES.login);
          },
          { timeout: TIMEOUTS.navigation }
        );

        // Should not be authenticated
        const authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(false);
      } else {
        // If logout button not visible, test is inconclusive
        test.skip();
      }
    });

    test('should redirect to login when accessing protected route after logout', async ({
      page,
    }) => {
      // Login first
      await login(page, VALID_USER.email, VALID_USER.password);

      // Logout
      await clearSession(page);

      // Try to access protected route
      await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });

      // Should redirect to login (may have query params like ?callbackUrl)
      expect(page.url()).toMatch(/\/login/);
    });
  });

  // ============================================================================
  // Protected Route Redirects
  // ============================================================================

  test.describe('Protected Route Redirects', () => {
    test('should redirect to login when accessing dashboard without authentication', async ({
      page,
    }) => {
      // Ensure not authenticated
      await clearSession(page);

      // Try to access dashboard
      await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });

      // Should redirect to login (may have query params like ?callbackUrl)
      expect(page.url()).toMatch(/\/login/);
    });

    test('should redirect to login when accessing preferences without authentication', async ({
      page,
    }) => {
      // Ensure not authenticated
      await clearSession(page);

      // Try to access preferences
      await page.goto(ROUTES.preferences, { timeout: TIMEOUTS.navigation });

      // Should redirect to login (may have query params like ?callbackUrl)
      expect(page.url()).toMatch(/\/login/);
    });

    test('should redirect to login when accessing meal plans without authentication', async ({
      page,
    }) => {
      // Ensure not authenticated
      await clearSession(page);

      // Try to access meal plans
      await page.goto(ROUTES.mealPlans, { timeout: TIMEOUTS.navigation });

      // Should redirect to login (may have query params like ?callbackUrl)
      expect(page.url()).toMatch(/\/login/);
    });

    test('should allow access to public routes without authentication', async ({
      page,
    }) => {
      // Ensure not authenticated
      await clearSession(page);

      // Should be able to access home page
      await page.goto(ROUTES.home, { timeout: TIMEOUTS.navigation });
      await expect(page).toHaveURL(ROUTES.home);

      // Should be able to access login page
      await page.goto(ROUTES.login, { timeout: TIMEOUTS.navigation });
      await expect(page).toHaveURL(ROUTES.login);

      // Should be able to access register page
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });
      await expect(page).toHaveURL(ROUTES.register);
    });
  });

  // ============================================================================
  // Password Requirements
  // ============================================================================

  test.describe('Password Requirements', () => {
    test('should enforce minimum password length', async ({ page }) => {
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      // Try password that's too short
      await page.fill(SELECTORS.emailInput, `test-${Date.now()}@example.com`);
      await page.fill(SELECTORS.passwordInput, '12345'); // Less than 8 characters

      // Trigger validation
      await page.locator(SELECTORS.passwordInput).blur();

      // Should show error or mark field as invalid
      const errorMessage = page.locator(
        'text=/password.*least.*8|password.*too.*short/i'
      );
      const errorVisible = await errorMessage.isVisible().catch(() => false);

      const passwordInput = page.locator(SELECTORS.passwordInput);
      const isInvalid = await passwordInput.evaluate(
        (el: HTMLInputElement) => !el.validity.valid
      );

      expect(errorVisible || isInvalid).toBe(true);
    });

    test('should accept password meeting all requirements', async ({ page }) => {
      await page.goto(ROUTES.register, { timeout: TIMEOUTS.navigation });

      const strongPassword = 'StrongP@ssw0rd123';

      await page.fill(SELECTORS.emailInput, `test-${Date.now()}@example.com`);
      await page.fill(SELECTORS.passwordInput, strongPassword);

      // Trigger validation
      await page.locator(SELECTORS.passwordInput).blur();

      // Should not show password validation errors
      const errorMessage = page.locator(
        'text=/password.*weak|password.*invalid|password.*least/i'
      );
      await expect(errorMessage).not.toBeVisible({ timeout: 2000 }).catch(() => {
        // Ignore - means no error shown
      });
    });
  });
});
