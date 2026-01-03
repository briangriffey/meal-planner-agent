/**
 * E2E Tests: Meal Plan Generation
 *
 * Tests the complete meal plan generation workflow:
 * - User initiates generation
 * - Progress tracking and status updates
 * - Job completion and redirect
 * - Viewing generated meal plans
 * - Error handling
 */

import { test, expect } from '@playwright/test';
import {
  VALID_USER,
  TIMEOUTS,
  ROUTES,
  SELECTORS,
  SUCCESS_MESSAGES,
} from './helpers/fixtures';

// ============================================================================
// Setup and Authentication
// ============================================================================

test.describe('Meal Plan Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application
    await page.goto(ROUTES.home);

    // Authenticate (assumes auth is required)
    // TODO: Replace with actual authentication flow once implemented
    // For now, we'll assume the user is already authenticated or skip this
    // await page.goto(ROUTES.login);
    // await page.fill(SELECTORS.emailInput, VALID_USER.email);
    // await page.fill(SELECTORS.passwordInput, VALID_USER.password);
    // await page.click(SELECTORS.loginButton);
    // await page.waitForURL(ROUTES.dashboard, { timeout: TIMEOUTS.authentication });
  });

  // ============================================================================
  // Happy Path: Complete Generation Flow
  // ============================================================================

  test('should successfully generate a meal plan', async ({ page }) => {
    // Navigate to dashboard or meal plan generation page
    await page.goto(ROUTES.dashboard);

    // Click generate button
    await page.click(SELECTORS.generateButton);

    // Verify generation started
    await expect(page.locator(SELECTORS.statusMessage))
      .toContainText('Generating', { timeout: TIMEOUTS.apiResponse });

    // Wait for job to start processing
    await expect(page.locator(SELECTORS.statusMessage))
      .toContainText('Processing', { timeout: TIMEOUTS.apiResponse });

    // Verify progress bar appears and updates
    const progressBar = page.locator(SELECTORS.progressBar);
    await expect(progressBar).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Wait for all processing steps to complete
    // The agent goes through multiple steps:
    // 1. Planning meals
    // 2. Generating recipes
    // 3. Saving to database
    // 4. Sending email (if configured)

    // Wait for completion (this may take a while with AI processing)
    await expect(page.locator(SELECTORS.statusMessage))
      .toContainText('Completed', { timeout: TIMEOUTS.mealPlanGeneration });

    // Verify auto-redirect to meal plan detail page
    await page.waitForURL(/\/meal-plans\/[a-z0-9-]+/, {
      timeout: TIMEOUTS.navigation,
    });

    // Verify meal plan is displayed
    const mealPlanCard = page.locator(SELECTORS.mealPlanCard);
    await expect(mealPlanCard).toBeVisible();

    // Verify meal plan contains expected data
    await expect(mealPlanCard).toContainText('Day 1');
    await expect(mealPlanCard).toContainText('Meal 1');

    // Verify meal details are present
    const firstMeal = mealPlanCard.first();
    await expect(firstMeal).toContainText('Ingredients');
    await expect(firstMeal).toContainText('Instructions');
  });

  // ============================================================================
  // Progress Tracking
  // ============================================================================

  test('should show progress updates during generation', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Start generation
    await page.click(SELECTORS.generateButton);

    // Verify progress bar starts at 0 or low percentage
    const progressBar = page.locator(SELECTORS.progressBar);
    await expect(progressBar).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Track progress updates (should increase over time)
    const initialProgress = await progressBar.getAttribute('aria-valuenow');

    // Wait a bit and check progress increased
    await page.waitForTimeout(5000);
    const updatedProgress = await progressBar.getAttribute('aria-valuenow');

    // Progress should have increased (or stayed the same if very fast)
    expect(Number(updatedProgress)).toBeGreaterThanOrEqual(Number(initialProgress));

    // Verify different status messages appear
    // Note: These may appear very quickly depending on API response time
    const statusMessage = page.locator(SELECTORS.statusMessage);

    // Should eventually reach completed status
    await expect(statusMessage)
      .toContainText('Completed', { timeout: TIMEOUTS.mealPlanGeneration });
  });

  // ============================================================================
  // Status Polling
  // ============================================================================

  test('should poll for status updates', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Monitor network requests for polling
    const statusRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/meal-plans/') && request.url().includes('/status')) {
        statusRequests.push(request.url());
      }
    });

    // Start generation
    await page.click(SELECTORS.generateButton);

    // Wait for completion
    await expect(page.locator(SELECTORS.statusMessage))
      .toContainText('Completed', { timeout: TIMEOUTS.mealPlanGeneration });

    // Verify polling occurred (should have multiple status requests)
    expect(statusRequests.length).toBeGreaterThan(1);
  });

  // ============================================================================
  // All Steps Complete
  // ============================================================================

  test('should complete all processing steps', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Start generation
    await page.click(SELECTORS.generateButton);

    // Track which steps complete
    const completedSteps: string[] = [];

    // Monitor status messages
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('step') || text.includes('completed')) {
        completedSteps.push(text);
      }
    });

    // Wait for completion
    await expect(page.locator(SELECTORS.statusMessage))
      .toContainText('Completed', { timeout: TIMEOUTS.mealPlanGeneration });

    // Verify we reached the meal plan detail page
    await page.waitForURL(/\/meal-plans\/[a-z0-9-]+/, {
      timeout: TIMEOUTS.navigation,
    });

    // Verify all expected data is present in the generated meal plan
    const mealPlanCard = page.locator(SELECTORS.mealPlanCard);

    // Should have meals for each day
    await expect(page.locator('[data-day="1"]')).toBeVisible();

    // Should have nutritional information if available
    const nutrition = page.locator('[data-testid="nutrition-info"]');
    if (await nutrition.isVisible()) {
      await expect(nutrition).toContainText('Calories');
    }
  });

  // ============================================================================
  // Auto-redirect After Completion
  // ============================================================================

  test('should auto-redirect to meal plan after completion', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Start generation
    await page.click(SELECTORS.generateButton);

    // Wait for completion
    await expect(page.locator(SELECTORS.statusMessage))
      .toContainText('Completed', { timeout: TIMEOUTS.mealPlanGeneration });

    // Should automatically redirect to the new meal plan
    await page.waitForURL(/\/meal-plans\/[a-z0-9-]+/, {
      timeout: TIMEOUTS.navigation,
    });

    // Verify we're on the meal plan detail page
    expect(page.url()).toMatch(/\/meal-plans\/[a-z0-9-]+/);

    // Verify meal plan content is loaded
    await expect(page.locator(SELECTORS.mealPlanCard)).toBeVisible();
  });

  // ============================================================================
  // Error Handling
  // ============================================================================

  test('should handle generation failures gracefully', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Mock a failure scenario (if possible)
    // This might require intercepting the API call and returning an error
    await page.route('**/api/meal-plans/generate', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Generation failed' }),
      });
    });

    // Start generation
    await page.click(SELECTORS.generateButton);

    // Should show error message
    await expect(page.locator('[role="alert"]'))
      .toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Error message should be descriptive
    await expect(page.locator('[role="alert"]'))
      .toContainText(/error|fail/i);

    // User should still be able to retry
    await expect(page.locator(SELECTORS.generateButton)).toBeEnabled();
  });

  test('should handle network timeouts', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Simulate network timeout
    await page.route('**/api/meal-plans/generate', (route) => {
      // Don't fulfill the route, causing a timeout
      setTimeout(() => {
        route.abort('timedout');
      }, 1000);
    });

    // Start generation
    await page.click(SELECTORS.generateButton);

    // Should show timeout or error message
    await expect(page.locator('[role="alert"]'))
      .toBeVisible({ timeout: TIMEOUTS.apiResponse + 5000 });
  });

  // ============================================================================
  // View Generated Meal Plan
  // ============================================================================

  test('should display complete meal plan details', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Generate meal plan
    await page.click(SELECTORS.generateButton);

    // Wait for completion and redirect
    await page.waitForURL(/\/meal-plans\/[a-z0-9-]+/, {
      timeout: TIMEOUTS.mealPlanGeneration,
    });

    // Verify meal plan structure
    const mealPlanCard = page.locator(SELECTORS.mealPlanCard);
    await expect(mealPlanCard).toBeVisible();

    // Check for meal details
    await expect(mealPlanCard).toContainText('Day');
    await expect(mealPlanCard).toContainText('Meal');

    // Check for ingredients
    await expect(page.locator('text=Ingredients')).toBeVisible();

    // Check for instructions
    await expect(page.locator('text=Instructions')).toBeVisible();

    // Verify we can navigate between days (if multi-day plan)
    const dayTabs = page.locator('[role="tab"]');
    if ((await dayTabs.count()) > 1) {
      // Click second day
      await dayTabs.nth(1).click();

      // Verify content updates
      await expect(mealPlanCard).toContainText('Day 2');
    }
  });

  // ============================================================================
  // Multiple Generations
  // ============================================================================

  test('should allow generating multiple meal plans', async ({ page }) => {
    await page.goto(ROUTES.dashboard);

    // Generate first meal plan
    await page.click(SELECTORS.generateButton);
    await page.waitForURL(/\/meal-plans\/[a-z0-9-]+/, {
      timeout: TIMEOUTS.mealPlanGeneration,
    });

    const firstMealPlanUrl = page.url();

    // Navigate back to dashboard
    await page.goto(ROUTES.dashboard);

    // Generate second meal plan
    await page.click(SELECTORS.generateButton);
    await page.waitForURL(/\/meal-plans\/[a-z0-9-]+/, {
      timeout: TIMEOUTS.mealPlanGeneration,
    });

    const secondMealPlanUrl = page.url();

    // Should be different meal plans
    expect(firstMealPlanUrl).not.toBe(secondMealPlanUrl);

    // Both should be accessible
    await page.goto(firstMealPlanUrl);
    await expect(page.locator(SELECTORS.mealPlanCard)).toBeVisible();

    await page.goto(secondMealPlanUrl);
    await expect(page.locator(SELECTORS.mealPlanCard)).toBeVisible();
  });
});
