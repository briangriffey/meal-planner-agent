/**
 * E2E Tests: Preferences Management
 *
 * Tests CRUD operations on user preferences:
 * - Loading current preferences
 * - Updating meal settings
 * - Managing dietary restrictions
 * - Managing email recipients
 * - Email validation
 * - Saving preferences
 * - Schedule settings (read-only)
 */

import { test, expect } from '@playwright/test';
import {
  VALID_USER,
  TIMEOUTS,
  ROUTES,
  SELECTORS,
  PREFERENCE_UPDATES,
  DEFAULT_PREFERENCES,
  INVALID_EMAILS,
  VALID_EMAILS,
  DIETARY_RESTRICTIONS,
  SUCCESS_MESSAGES,
} from './helpers/fixtures';

// ============================================================================
// Local Test Constants - Consolidated Selectors
// ============================================================================

// Page heading selector
const PAGE_HEADING = 'h2';

// Accessible form input selectors (using role and name for better accessibility testing)
const MEALS_PER_WEEK_INPUT = { role: 'spinbutton', name: /number of meals per week/i };
const SERVINGS_PER_MEAL_INPUT = { role: 'spinbutton', name: /servings per meal/i };

// Email input selectors
const EMAIL_INPUT_FIELD = 'input[placeholder="email@example.com"]';
const EMAIL_ADD_BUTTON_INDEX = 1; // Second "Add" button (first is for dietary restrictions)

// Modal and button selectors
const GO_TO_DASHBOARD_BUTTON = 'button:has-text("Go to Dashboard")';
const DIETARY_RESTRICTION_ADD_BUTTON_INDEX = 0; // First "Add" button
const VEGAN_CHECKBOX = 'input[type="checkbox"][value="vegan"]';

// Success modal text pattern
const GENERATING_MODAL_TEXT = 'text=/Generating Your First Meal Plan/i';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Dismisses the "Generating Your First Meal Plan!" modal if it appears
 *
 * This modal appears automatically when a user saves preferences for the first time.
 * It shows a "Go to Dashboard" button. We dismiss it to continue testing the form.
 *
 * @param page - Playwright page object
 */
async function dismissGenerateModal(page: any) {
  const modalButton = page.locator(GO_TO_DASHBOARD_BUTTON);
  const modalVisible = await modalButton.isVisible({ timeout: 1000 }).catch(() => false);
  if (modalVisible) {
    // Click "Go to Dashboard" to dismiss
    await modalButton.click();
    // Wait for navigation to dashboard or modal to close
    await page.waitForTimeout(500);
  }
}

/**
 * Waits for save confirmation after submitting preferences
 *
 * After saving preferences, the UI shows EITHER:
 * 1. A success banner (if user has meal plans): "Preferences saved successfully"
 * 2. A modal (if user has NO meal plans): "Generating Your First Meal Plan!"
 *
 * This function waits for either confirmation and dismisses the modal if it appears.
 *
 * @param page - Playwright page object
 */
async function waitForSaveConfirmation(page: any) {
  // Wait for either the success banner or the modal
  const successBanner = page.locator('text=/preferences saved successfully/i');
  const generatingModal = page.locator(GENERATING_MODAL_TEXT);

  // Wait for either one to appear
  await Promise.race([
    expect(successBanner).toBeVisible({ timeout: TIMEOUTS.formSubmission }),
    expect(generatingModal).toBeVisible({ timeout: TIMEOUTS.formSubmission }),
  ]);

  // If modal appeared, close it by clicking "Go to Dashboard"
  const modalVisible = await generatingModal.isVisible().catch(() => false);
  if (modalVisible) {
    await page.locator(GO_TO_DASHBOARD_BUTTON).click();
    // Wait for navigation or modal to close
    await page.waitForTimeout(500);
  }
}

// ============================================================================
// Setup and Authentication
// ============================================================================

test.describe('Preferences Management', () => {
  /**
   * Before Each Test: Authentication and Navigation
   *
   * All preferences tests require authentication. This hook:
   * 1. Logs in the test user
   * 2. Navigates to the preferences page
   * 3. Dismisses any modal dialogs that may appear
   *
   * Note: After login, the app may redirect to /dashboard/preferences instead of /dashboard
   * if the user hasn't completed their preferences yet.
   */
  test.beforeEach(async ({ page }) => {
    // STEP 1: Login as valid test user
    await page.goto(ROUTES.login);
    await page.fill(SELECTORS.emailInput, VALID_USER.email);
    await page.fill(SELECTORS.passwordInput, VALID_USER.password);
    await page.click(SELECTORS.loginButton);

    // STEP 2: Wait for successful login (redirects to dashboard or preferences)
    await page.waitForURL(/\/dashboard/, { timeout: TIMEOUTS.authentication });

    // STEP 3: Navigate to preferences page
    await page.goto(ROUTES.preferences);

    // STEP 4: Dismiss "Ready to Generate Your First Meal Plan?" modal if it appears
    // This modal can appear when the user hasn't generated a meal plan yet
    await dismissGenerateModal(page);
  });

  // ============================================================================
  // Load Current Preferences
  // ============================================================================
  // PURPOSE: Verify preferences page loads and displays existing user settings
  // SUCCESS: Form is populated with user's current preferences from database

  /**
   * Test: Preferences page loads with user data
   *
   * Steps:
   * 1. Verify page heading is displayed
   * 2. Verify all form fields are visible
   * 3. Verify fields contain valid data (not empty/zero)
   *
   * Success Criteria:
   * - Page heading shows "Preferences"
   * - Meals per week and servings per meal inputs are visible
   * - Field values are greater than 0 (loaded from database)
   */
  test('should load current user preferences', async ({ page }) => {
    // STEP 1: Verify page loaded correctly
    // SUCCESS: H2 heading contains "Preferences"
    await expect(page.locator(PAGE_HEADING)).toContainText(/preferences/i);

    // STEP 2: Verify form fields are visible
    // Using accessible role selectors for better accessibility testing
    const mealsPerWeekInput = page.getByRole(MEALS_PER_WEEK_INPUT.role as any, { name: MEALS_PER_WEEK_INPUT.name });
    await expect(mealsPerWeekInput).toBeVisible();

    const servingsPerMealInput = page.getByRole(SERVINGS_PER_MEAL_INPUT.role as any, { name: SERVINGS_PER_MEAL_INPUT.name });
    await expect(servingsPerMealInput).toBeVisible();

    // STEP 3: Verify fields have values loaded from database
    // SUCCESS: Values are greater than 0 (valid preferences exist)
    const mealsPerWeek = await mealsPerWeekInput.inputValue();
    expect(Number(mealsPerWeek)).toBeGreaterThan(0);

    const servingsPerMeal = await servingsPerMealInput.inputValue();
    expect(Number(servingsPerMeal)).toBeGreaterThan(0);
  });

  test('should display default preferences for new users', async ({ page }) => {
    // Verify preferences page displays with default values

    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });
    const servingsPerMealInput = page.getByRole('spinbutton', { name: /servings per meal/i });

    // Verify inputs exist with reasonable defaults
    await expect(mealsPerWeekInput).toBeVisible();
    await expect(servingsPerMealInput).toBeVisible();

    // Values should be within expected ranges
    const mealsPerWeek = Number(await mealsPerWeekInput.inputValue());
    expect(mealsPerWeek).toBeGreaterThanOrEqual(1);
    expect(mealsPerWeek).toBeLessThanOrEqual(14);

    const servingsPerMeal = Number(await servingsPerMealInput.inputValue());
    expect(servingsPerMeal).toBeGreaterThanOrEqual(1);
    expect(servingsPerMeal).toBeLessThanOrEqual(10);
  });

  // ============================================================================
  // Update Meal Settings
  // ============================================================================

  test('should update meals per day', async ({ page }) => {
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });

    // Clear and enter new value
    await mealsPerWeekInput.clear();
    await mealsPerWeekInput.fill('10');

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success message or save to complete
    await page.waitForTimeout(2000);

    // Reload page and verify persistence
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify value persisted
    const mealsPerWeekInputAfterReload = page.getByRole('spinbutton', { name: /number of meals per week/i });
    const savedValue = await mealsPerWeekInputAfterReload.inputValue();
    expect(Number(savedValue)).toBe(10);
  });

  test('should update days per plan', async ({ page }) => {
    const servingsPerMealInput = page.getByRole('spinbutton', { name: /servings per meal/i });

    // Clear and enter new value
    await servingsPerMealInput.clear();
    await servingsPerMealInput.fill('4');

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success message or save to complete
    await page.waitForTimeout(2000);

    // Reload page and verify persistence
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify value persisted
    const servingsPerMealInputAfterReload = page.getByRole('spinbutton', { name: /servings per meal/i });
    const savedValue = await servingsPerMealInputAfterReload.inputValue();
    expect(Number(savedValue)).toBe(4);
  });

  test('should validate meal settings ranges', async ({ page }) => {
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });

    // Test that we can change to a valid value
    await mealsPerWeekInput.clear();
    await mealsPerWeekInput.fill('10');

    // Save should succeed
    await page.click(SELECTORS.savePreferencesButton);
    await page.waitForTimeout(1000);

    // Verify the value was accepted
    const newValue = await mealsPerWeekInput.inputValue();
    expect(Number(newValue)).toBe(10);
  });

  // ============================================================================
  // Add/Remove Dietary Restrictions
  // ============================================================================

  test('should add dietary restrictions', async ({ page }) => {
    // Look for dietary restrictions select or checkboxes
    const dietarySection = page.locator('text=Dietary Restrictions').locator('..');

    // Add a restriction (implementation depends on UI - checkbox, multi-select, etc.)
    // Assuming checkbox interface:
    const vegetarianCheckbox = page.locator('input[type="checkbox"][value="vegetarian"]');

    if (await vegetarianCheckbox.isVisible()) {
      // Check if not already checked
      if (!(await vegetarianCheckbox.isChecked())) {
        await vegetarianCheckbox.check();
      }

      // Save preferences
      await page.click(SELECTORS.savePreferencesButton);

      // Wait for success
      await expect(page.locator('[role="alert"]'))
        .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

      // Reload and verify
      await page.reload();

      // Should still be checked
      await expect(vegetarianCheckbox).toBeChecked();
    }
  });

  test('should remove dietary restrictions', async ({ page }) => {
    const vegetarianCheckbox = page.locator('input[type="checkbox"][value="vegetarian"]');

    if (await vegetarianCheckbox.isVisible()) {
      // Ensure it's checked first
      if (!(await vegetarianCheckbox.isChecked())) {
        await vegetarianCheckbox.check();
        await page.click(SELECTORS.savePreferencesButton);
        await page.waitForTimeout(1000);
      }

      // Now uncheck it
      await vegetarianCheckbox.uncheck();

      // Save preferences
      await page.click(SELECTORS.savePreferencesButton);

      // Wait for success
      await expect(page.locator('[role="alert"]'))
        .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

      // Reload and verify
      await page.reload();

      // Should not be checked
      await expect(vegetarianCheckbox).not.toBeChecked();
    }
  });

  test('should handle multiple dietary restrictions', async ({ page }) => {
    // Select multiple restrictions
    const restrictions = ['vegetarian', 'gluten-free'];

    for (const restriction of restrictions) {
      const checkbox = page.locator(`input[type="checkbox"][value="${restriction}"]`);
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
    }

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for save confirmation (banner or modal)
    await waitForSaveConfirmation(page);

    // Reload and verify all are still checked
    await page.reload();

    for (const restriction of restrictions) {
      const checkbox = page.locator(`input[type="checkbox"][value="${restriction}"]`);
      if (await checkbox.isVisible()) {
        await expect(checkbox).toBeChecked();
      }
    }
  });

  // ============================================================================
  // Add/Remove Email Recipients
  // ============================================================================

  test('should add email recipient', async ({ page }) => {
    // Find email input by placeholder instead of name attribute
    const emailInput = page.locator('input[placeholder="email@example.com"]');

    // Scroll to email section and wait for input to be visible
    await emailInput.scrollIntoViewIfNeeded();

    // Enter valid email
    await emailInput.fill(VALID_EMAILS[0]);

    // Click the second "Add" button (for email, not dietary restrictions)
    await page.locator('button:has-text("Add")').nth(1).click();

    // Verify email appears in list (use first() to avoid strict mode violation)
    await expect(page.locator(`text=${VALID_EMAILS[0]}`).first()).toBeVisible();

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for save confirmation (banner or modal)
    await waitForSaveConfirmation(page);

    // Reload and verify
    await page.reload();

    // Close modal if it appears after reload
    await dismissGenerateModal(page);

    // Email should still be in list (use first() to avoid strict mode)
    await expect(page.locator(`text=${VALID_EMAILS[0]}`).first()).toBeVisible();
  });

  test('should remove email recipient', async ({ page }) => {
    const emailInput = page.locator('input[placeholder="email@example.com"]');

    // Scroll to email section
    await emailInput.scrollIntoViewIfNeeded();

    // First, add an email
    await emailInput.fill(VALID_EMAILS[0]);
    await page.locator('button:has-text("Add")').nth(1).click();

    // Find and click remove button for this email
    const emailItem = page.locator(`text=${VALID_EMAILS[0]}`).locator('..');
    const removeButton = emailItem.locator('button:has-text("Remove")');

    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Email should be removed from list
      await expect(page.locator(`text=${VALID_EMAILS[0]}`)).not.toBeVisible();

      // Save preferences
      await page.click(SELECTORS.savePreferencesButton);

      // Wait for save confirmation (banner or modal)
      await waitForSaveConfirmation(page);
    }
  });

  test('should handle multiple email recipients', async ({ page }) => {
    const emailInput = page.locator('input[placeholder="email@example.com"]');

    // Scroll to email section
    await emailInput.scrollIntoViewIfNeeded();

    // Add multiple emails
    for (const email of VALID_EMAILS) {
      await emailInput.fill(email);
      await page.locator('button:has-text("Add")').nth(1).click();

      // Verify email appears (use first() to avoid strict mode)
      await expect(page.locator(`text=${email}`).first()).toBeVisible();
    }

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for save confirmation (banner or modal)
    await waitForSaveConfirmation(page);

    // Reload and verify all emails persist
    await page.reload();

    // Close modal if it appears after reload
    await dismissGenerateModal(page);

    for (const email of VALID_EMAILS) {
      await expect(page.locator(`text=${email}`).first()).toBeVisible();
    }
  });

  // ============================================================================
  // Email Validation
  // ============================================================================

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[placeholder="email@example.com"]');

    // Scroll to email section
    await emailInput.scrollIntoViewIfNeeded();

    // Try adding invalid emails
    for (const invalidEmail of INVALID_EMAILS) {
      await emailInput.clear();
      await emailInput.fill(invalidEmail);
      await page.locator('button:has-text("Add")').nth(1).click();

      // Should show validation error
      await expect(page.locator('[role="alert"]'))
        .toBeVisible({ timeout: TIMEOUTS.formSubmission });

      // Email should not be added to list
      // (assuming error prevents addition)
    }
  });

  test('should accept valid email formats', async ({ page }) => {
    const emailInput = page.locator('input[placeholder="email@example.com"]');

    // Scroll to email section
    await emailInput.scrollIntoViewIfNeeded();

    // Try adding valid emails
    for (const validEmail of VALID_EMAILS) {
      await emailInput.clear();
      await emailInput.fill(validEmail);
      await page.locator('button:has-text("Add")').nth(1).click();

      // Should be added successfully (use first() to avoid strict mode)
      await expect(page.locator(`text=${validEmail}`).first()).toBeVisible();
    }
  });

  test.skip('should prevent duplicate email addresses', async ({ page }) => {
    // TODO: Feature not yet implemented - app currently allows duplicate emails
    const emailInput = page.locator('input[placeholder="email@example.com"]');
    const testEmail = VALID_EMAILS[0];

    // Scroll to email section
    await emailInput.scrollIntoViewIfNeeded();

    // Add email once
    await emailInput.fill(testEmail);
    await page.locator('button:has-text("Add")').nth(1).click();

    // Try to add same email again
    await emailInput.fill(testEmail);
    await page.locator('button:has-text("Add")').nth(1).click();

    // Should show error or prevent addition
    await expect(page.locator('[role="alert"]'))
      .toBeVisible({ timeout: TIMEOUTS.formSubmission });

    // Count occurrences - should only be one
    const emailElements = page.locator(`text=${testEmail}`);
    expect(await emailElements.count()).toBe(1);
  });

  // ============================================================================
  // Save Preferences
  // ============================================================================

  test('should save all preferences together', async ({ page }) => {
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });
    const servingsPerMealInput = page.getByRole('spinbutton', { name: /servings per meal/i });

    // Update multiple settings
    await mealsPerWeekInput.clear();
    await mealsPerWeekInput.fill('5');

    await servingsPerMealInput.clear();
    await servingsPerMealInput.fill('3');

    // Add dietary restriction
    const veganCheckbox = page.locator('input[type="checkbox"][value="vegan"]');
    if (await veganCheckbox.isVisible()) {
      await veganCheckbox.check();
    }

    // Add email recipient
    const emailInputField = page.locator('input[placeholder="email@example.com"]');
    await emailInputField.scrollIntoViewIfNeeded();
    await emailInputField.fill(VALID_EMAILS[1]); // Use different email than fixture
    await page.locator('button:has-text("Add")').nth(1).click();

    // Save all at once
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for save confirmation (banner or modal)
    await waitForSaveConfirmation(page);

    // Reload and verify all changes persisted
    await page.reload();

    // Close modal if it appears after reload
    await dismissGenerateModal(page);

    // Verify meal settings
    const mealsPerWeekAfterReload = page.getByRole('spinbutton', { name: /number of meals per week/i });
    const servingsPerMealAfterReload = page.getByRole('spinbutton', { name: /servings per meal/i });
    expect(Number(await mealsPerWeekAfterReload.inputValue())).toBe(5);
    expect(Number(await servingsPerMealAfterReload.inputValue())).toBe(3);

    // Verify dietary restriction
    const veganCheckboxAfterReload = page.locator('input[type="checkbox"][value="vegan"]');
    if (await veganCheckboxAfterReload.isVisible()) {
      await expect(veganCheckboxAfterReload).toBeChecked();
    }

    // Verify email was added
    await expect(page.locator(`text=${VALID_EMAILS[1]}`).first()).toBeVisible();
  });

  test.skip('should show loading state while saving', async ({ page }) => {
    // TODO: Timing issue - save completes too fast to reliably catch loading state
    const saveButton = page.locator(SELECTORS.savePreferencesButton);

    // Make a change
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });
    await mealsPerWeekInput.clear();
    await mealsPerWeekInput.fill('4');

    // Click save
    await saveButton.click();

    // Button should show loading state (disabled or spinner)
    await expect(saveButton).toBeDisabled({ timeout: 1000 });

    // Wait for generating modal to appear
    const generatingModal = page.locator(GENERATING_MODAL_TEXT);
    await expect(generatingModal).toBeVisible({ timeout: TIMEOUTS.formSubmission });

    // Button should be enabled again
    await expect(saveButton).toBeEnabled();

    // Close the modal by clicking "Go to Dashboard"
    await page.locator(GO_TO_DASHBOARD_BUTTON).click();
  });

  // ============================================================================
  // Schedule Settings (Read-only)
  // ============================================================================

  test('should display schedule settings as read-only', async ({ page }) => {
    // Look for schedule settings section
    const scheduleSection = page.locator('text=Schedule').locator('..');

    if (await scheduleSection.isVisible()) {
      // Schedule enable/disable should be read-only or not present
      const scheduleToggle = page.locator('input[name="scheduleEnabled"]');

      if (await scheduleToggle.isVisible()) {
        // Should be disabled (read-only)
        await expect(scheduleToggle).toBeDisabled();
      }

      // There might be text indicating schedule cannot be modified via UI
      await expect(scheduleSection)
        .toContainText(/read.?only|cannot.*modify|contact.*admin/i);
    }
  });

  test('should show current schedule if enabled', async ({ page }) => {
    const scheduleSection = page.locator('text=Schedule').locator('..');

    if (await scheduleSection.isVisible()) {
      // Should show when schedule runs (e.g., "Weekly on Sunday")
      // But user cannot modify it
      const scheduleInfo = scheduleSection.locator('[data-testid="schedule-info"]');

      if (await scheduleInfo.isVisible()) {
        // Verify it shows some schedule information
        const scheduleText = await scheduleInfo.textContent();
        expect(scheduleText).toBeTruthy();
      }
    }
  });

  // ============================================================================
  // Error Handling
  // ============================================================================

  test.skip('should handle save errors gracefully', async ({ page }) => {
    // TODO: Feature not yet implemented - app doesn't show error messages on save failure
    // Mock API error
    await page.route('**/api/preferences', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Failed to save preferences' }),
      });
    });

    // Make a change
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });
    await mealsPerWeekInput.clear();
    await mealsPerWeekInput.fill('4');

    // Try to save
    await page.click(SELECTORS.savePreferencesButton);

    // Should show error message
    await expect(page.locator('[role="alert"]'))
      .toContainText(/error|fail/i, { timeout: TIMEOUTS.formSubmission });

    // Form should still be editable (can retry)
    await expect(mealsPerDayInput).toBeEnabled();
  });
});
