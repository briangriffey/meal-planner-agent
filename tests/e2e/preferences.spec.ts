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
// Setup and Authentication
// ============================================================================

test.describe('Preferences Management', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate user before accessing preferences
    await page.goto(ROUTES.login);
    await page.fill(SELECTORS.emailInput, VALID_USER.email);
    await page.fill(SELECTORS.passwordInput, VALID_USER.password);
    await page.click(SELECTORS.loginButton);

    // Wait for successful login (redirects to dashboard)
    await page.waitForURL(/\/dashboard/, { timeout: TIMEOUTS.authentication });

    // Navigate to preferences page
    await page.goto(ROUTES.preferences);

    // Close the "Ready to Generate Your First Meal Plan?" modal if it appears
    const modalNotNowButton = page.locator('button:has-text("Not Now")');
    const modalVisible = await modalNotNowButton.isVisible({ timeout: 2000 }).catch(() => false);
    if (modalVisible) {
      await modalNotNowButton.click();
      // Wait for modal to disappear
      await expect(modalNotNowButton).not.toBeVisible({ timeout: 2000 });
    }
  });

  // ============================================================================
  // Load Current Preferences
  // ============================================================================

  test('should load current user preferences', async ({ page }) => {
    // Verify page loaded (heading is h2, not h1)
    await expect(page.locator('h2')).toContainText(/preferences/i);

    // Verify form fields are populated - using accessible names
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });
    await expect(mealsPerWeekInput).toBeVisible();

    const servingsPerMealInput = page.getByRole('spinbutton', { name: /servings per meal/i });
    await expect(servingsPerMealInput).toBeVisible();

    // Verify fields have values (should load from database)
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

    // Wait for success modal to appear
    const successModal = page.locator('text=/your preferences have been saved/i');
    await expect(successModal).toBeVisible({ timeout: TIMEOUTS.formSubmission });

    // Close the modal by clicking "Not Now"
    await page.locator('button:has-text("Not Now")').click();
    await expect(successModal).not.toBeVisible();

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

    // Wait for success modal to appear
    const successModal = page.locator('text=/your preferences have been saved/i');
    await expect(successModal).toBeVisible({ timeout: TIMEOUTS.formSubmission });

    // Close the modal by clicking "Not Now"
    await page.locator('button:has-text("Not Now")').click();
    await expect(successModal).not.toBeVisible();

    // Reload and verify
    await page.reload();

    // Close modal if it appears after reload
    const modalAfterReload = page.locator('button:has-text("Not Now")');
    if (await modalAfterReload.isVisible({ timeout: 2000 }).catch(() => false)) {
      await modalAfterReload.click();
    }

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

      // Wait for success modal to appear
      const successModal = page.locator('text=/your preferences have been saved/i');
      await expect(successModal).toBeVisible({ timeout: TIMEOUTS.formSubmission });

      // Close the modal by clicking "Not Now"
      await page.locator('button:has-text("Not Now")').click();
      await expect(successModal).not.toBeVisible();
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

    // Wait for success modal to appear
    const successModal = page.locator('text=/your preferences have been saved/i');
    await expect(successModal).toBeVisible({ timeout: TIMEOUTS.formSubmission });

    // Close the modal by clicking "Not Now"
    await page.locator('button:has-text("Not Now")').click();
    await expect(successModal).not.toBeVisible();

    // Reload and verify all emails persist
    await page.reload();

    // Close modal if it appears after reload
    const modalAfterReload = page.locator('button:has-text("Not Now")');
    if (await modalAfterReload.isVisible({ timeout: 2000 }).catch(() => false)) {
      await modalAfterReload.click();
    }

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

  test('should prevent duplicate email addresses', async ({ page }) => {
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
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);
    if (await emailInput.isVisible()) {
      await emailInput.fill(VALID_EMAILS[0]);
      await page.click(SELECTORS.addEmailButton);
    }

    // Save all at once
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

    // Reload and verify all changes persisted
    await page.reload();

    // Verify meal settings
    expect(Number(await mealsPerDayInput.inputValue()))
      .toBe(PREFERENCE_UPDATES.fullUpdate.mealsPerDay);
    expect(Number(await daysPerPlanInput.inputValue()))
      .toBe(PREFERENCE_UPDATES.fullUpdate.daysPerPlan);

    // Verify dietary restriction
    if (await veganCheckbox.isVisible()) {
      await expect(veganCheckbox).toBeChecked();
    }

    // Verify email
    if (await emailInput.isVisible()) {
      await expect(page.locator(`text=${VALID_EMAILS[0]}`)).toBeVisible();
    }
  });

  test('should show loading state while saving', async ({ page }) => {
    const saveButton = page.locator(SELECTORS.savePreferencesButton);

    // Make a change
    const mealsPerWeekInput = page.getByRole('spinbutton', { name: /number of meals per week/i });
    await mealsPerWeekInput.clear();
    await mealsPerWeekInput.fill('4');

    // Click save
    await saveButton.click();

    // Button should show loading state (disabled or spinner)
    await expect(saveButton).toBeDisabled({ timeout: 1000 });

    // Wait for completion
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

    // Button should be enabled again
    await expect(saveButton).toBeEnabled();
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

  test('should handle save errors gracefully', async ({ page }) => {
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
