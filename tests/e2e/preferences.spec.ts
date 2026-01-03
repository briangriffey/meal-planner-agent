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
    // Navigate to application
    await page.goto(ROUTES.home);

    // Authenticate (assumes auth is required)
    // TODO: Replace with actual authentication flow once implemented
    // For now, we'll assume the user is already authenticated
    // await page.goto(ROUTES.login);
    // await page.fill(SELECTORS.emailInput, VALID_USER.email);
    // await page.fill(SELECTORS.passwordInput, VALID_USER.password);
    // await page.click(SELECTORS.loginButton);
    // await page.waitForURL(ROUTES.dashboard, { timeout: TIMEOUTS.authentication });

    // Navigate to preferences page
    await page.goto(ROUTES.preferences);
  });

  // ============================================================================
  // Load Current Preferences
  // ============================================================================

  test('should load current user preferences', async ({ page }) => {
    // Verify page loaded
    await expect(page.locator('h1')).toContainText(/preferences/i);

    // Verify form fields are populated
    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);
    await expect(mealsPerDayInput).toBeVisible();

    const daysPerPlanInput = page.locator(SELECTORS.daysPerPlanInput);
    await expect(daysPerPlanInput).toBeVisible();

    // Verify fields have values (should load from database)
    const mealsPerDay = await mealsPerDayInput.inputValue();
    expect(Number(mealsPerDay)).toBeGreaterThan(0);

    const daysPerPlan = await daysPerPlanInput.inputValue();
    expect(Number(daysPerPlan)).toBeGreaterThan(0);
  });

  test('should display default preferences for new users', async ({ page }) => {
    // If this is a new user with no preferences set, should show defaults
    // This test assumes we can detect or create a new user scenario

    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);
    const daysPerPlanInput = page.locator(SELECTORS.daysPerPlanInput);

    // Verify inputs exist with reasonable defaults
    await expect(mealsPerDayInput).toBeVisible();
    await expect(daysPerPlanInput).toBeVisible();

    // Values should be within expected ranges
    const mealsPerDay = Number(await mealsPerDayInput.inputValue());
    expect(mealsPerDay).toBeGreaterThanOrEqual(1);
    expect(mealsPerDay).toBeLessThanOrEqual(6);

    const daysPerPlan = Number(await daysPerPlanInput.inputValue());
    expect(daysPerPlan).toBeGreaterThanOrEqual(1);
    expect(daysPerPlan).toBeLessThanOrEqual(14);
  });

  // ============================================================================
  // Update Meal Settings
  // ============================================================================

  test('should update meals per day', async ({ page }) => {
    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);

    // Clear and enter new value
    await mealsPerDayInput.clear();
    await mealsPerDayInput.fill(String(PREFERENCE_UPDATES.basic.mealsPerDay));

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success message
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

    // Reload page and verify persistence
    await page.reload();

    // Verify value persisted
    const savedValue = await mealsPerDayInput.inputValue();
    expect(Number(savedValue)).toBe(PREFERENCE_UPDATES.basic.mealsPerDay);
  });

  test('should update days per plan', async ({ page }) => {
    const daysPerPlanInput = page.locator(SELECTORS.daysPerPlanInput);

    // Clear and enter new value
    await daysPerPlanInput.clear();
    await daysPerPlanInput.fill(String(PREFERENCE_UPDATES.basic.daysPerPlan));

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success message
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

    // Reload page and verify persistence
    await page.reload();

    // Verify value persisted
    const savedValue = await daysPerPlanInput.inputValue();
    expect(Number(savedValue)).toBe(PREFERENCE_UPDATES.basic.daysPerPlan);
  });

  test('should validate meal settings ranges', async ({ page }) => {
    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);

    // Try invalid value (too low)
    await mealsPerDayInput.clear();
    await mealsPerDayInput.fill('0');
    await page.click(SELECTORS.savePreferencesButton);

    // Should show validation error
    await expect(page.locator('[role="alert"]'))
      .toBeVisible({ timeout: TIMEOUTS.formSubmission });

    // Try invalid value (too high)
    await mealsPerDayInput.clear();
    await mealsPerDayInput.fill('100');
    await page.click(SELECTORS.savePreferencesButton);

    // Should show validation error
    await expect(page.locator('[role="alert"]'))
      .toBeVisible({ timeout: TIMEOUTS.formSubmission });
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

    // Wait for success
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

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
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);

    // Enter valid email
    await emailInput.fill(VALID_EMAILS[0]);

    // Click add button
    await page.click(SELECTORS.addEmailButton);

    // Verify email appears in list
    await expect(page.locator(`text=${VALID_EMAILS[0]}`)).toBeVisible();

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

    // Reload and verify
    await page.reload();

    // Email should still be in list
    await expect(page.locator(`text=${VALID_EMAILS[0]}`)).toBeVisible();
  });

  test('should remove email recipient', async ({ page }) => {
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);

    // First, add an email
    await emailInput.fill(VALID_EMAILS[0]);
    await page.click(SELECTORS.addEmailButton);

    // Find and click remove button for this email
    const emailItem = page.locator(`text=${VALID_EMAILS[0]}`).locator('..');
    const removeButton = emailItem.locator('button:has-text("Remove")');

    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Email should be removed from list
      await expect(page.locator(`text=${VALID_EMAILS[0]}`)).not.toBeVisible();

      // Save preferences
      await page.click(SELECTORS.savePreferencesButton);

      // Wait for success
      await expect(page.locator('[role="alert"]'))
        .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });
    }
  });

  test('should handle multiple email recipients', async ({ page }) => {
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);

    // Add multiple emails
    for (const email of VALID_EMAILS) {
      await emailInput.fill(email);
      await page.click(SELECTORS.addEmailButton);

      // Verify email appears
      await expect(page.locator(`text=${email}`)).toBeVisible();
    }

    // Save preferences
    await page.click(SELECTORS.savePreferencesButton);

    // Wait for success
    await expect(page.locator('[role="alert"]'))
      .toContainText(/saved|success/i, { timeout: TIMEOUTS.formSubmission });

    // Reload and verify all emails persist
    await page.reload();

    for (const email of VALID_EMAILS) {
      await expect(page.locator(`text=${email}`)).toBeVisible();
    }
  });

  // ============================================================================
  // Email Validation
  // ============================================================================

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);

    // Try adding invalid emails
    for (const invalidEmail of INVALID_EMAILS) {
      await emailInput.clear();
      await emailInput.fill(invalidEmail);
      await page.click(SELECTORS.addEmailButton);

      // Should show validation error
      await expect(page.locator('[role="alert"]'))
        .toBeVisible({ timeout: TIMEOUTS.formSubmission });

      // Email should not be added to list
      // (assuming error prevents addition)
    }
  });

  test('should accept valid email formats', async ({ page }) => {
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);

    // Try adding valid emails
    for (const validEmail of VALID_EMAILS) {
      await emailInput.clear();
      await emailInput.fill(validEmail);
      await page.click(SELECTORS.addEmailButton);

      // Should be added successfully
      await expect(page.locator(`text=${validEmail}`)).toBeVisible();
    }
  });

  test('should prevent duplicate email addresses', async ({ page }) => {
    const emailInput = page.locator(SELECTORS.emailRecipientsInput);
    const testEmail = VALID_EMAILS[0];

    // Add email once
    await emailInput.fill(testEmail);
    await page.click(SELECTORS.addEmailButton);

    // Try to add same email again
    await emailInput.fill(testEmail);
    await page.click(SELECTORS.addEmailButton);

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
    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);
    const daysPerPlanInput = page.locator(SELECTORS.daysPerPlanInput);

    // Update multiple settings
    await mealsPerDayInput.clear();
    await mealsPerDayInput.fill(String(PREFERENCE_UPDATES.fullUpdate.mealsPerDay));

    await daysPerPlanInput.clear();
    await daysPerPlanInput.fill(String(PREFERENCE_UPDATES.fullUpdate.daysPerPlan));

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
    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);
    await mealsPerDayInput.clear();
    await mealsPerDayInput.fill('4');

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
    const mealsPerDayInput = page.locator(SELECTORS.mealsPerDayInput);
    await mealsPerDayInput.clear();
    await mealsPerDayInput.fill('4');

    // Try to save
    await page.click(SELECTORS.savePreferencesButton);

    // Should show error message
    await expect(page.locator('[role="alert"]'))
      .toContainText(/error|fail/i, { timeout: TIMEOUTS.formSubmission });

    // Form should still be editable (can retry)
    await expect(mealsPerDayInput).toBeEnabled();
  });
});
