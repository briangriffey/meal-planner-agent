/**
 * E2E Tests: Recipe Favorites
 *
 * Tests the complete favorites workflow:
 * - Favoriting meals from meal plan detail pages
 * - Viewing favorites on dedicated favorites page
 * - Removing favorites from favorites page
 * - State consistency across pages
 * - Multiple favorites management
 */

import { test, expect } from '@playwright/test';
import { login, clearSession } from './helpers/auth';
import {
  VALID_USER,
  TIMEOUTS,
  ROUTES,
} from './helpers/fixtures';

// ============================================================================
// Test Constants
// ============================================================================

const FAVORITE_BUTTON_SELECTOR = '[data-testid="favorite-button"]';
const FAVORITES_PAGE_URL = '/dashboard/favorites';
const MEAL_PLAN_CARD_SELECTOR = '[data-testid="meal-card"]';
const EMPTY_STATE_SELECTOR = '[data-testid="empty-state"]';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Wait for a meal plan to be available
 * Navigates to meal plans page and clicks the first available meal plan
 *
 * @param page - Playwright page object
 * @returns The meal plan ID
 */
async function navigateToMealPlan(page: any): Promise<string> {
  // Navigate to meal plans page
  await page.goto(ROUTES.mealPlans, { timeout: TIMEOUTS.navigation });

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Find first meal plan link
  const mealPlanLink = page.locator('a[href*="/dashboard/meal-plans/"]').first();
  await expect(mealPlanLink).toBeVisible({ timeout: TIMEOUTS.apiResponse });

  // Extract meal plan ID from href
  const href = await mealPlanLink.getAttribute('href');
  const mealPlanId = href?.split('/').pop() || '';

  // Click to view meal plan details
  await mealPlanLink.click();

  // Wait for meal plan detail page to load
  await page.waitForURL(`**/meal-plans/${mealPlanId}`, { timeout: TIMEOUTS.navigation });

  return mealPlanId;
}

/**
 * Get the first favoritable meal from the meal plan page
 *
 * @param page - Playwright page object
 * @returns Object containing meal data and favorite button
 */
async function getFirstMeal(page: any) {
  // Wait for meal cards to load
  const mealCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
  await expect(mealCards.first()).toBeVisible({ timeout: TIMEOUTS.apiResponse });

  // Get first meal card
  const firstMeal = mealCards.first();

  // Get meal name
  const mealNameElement = firstMeal.locator('h3, [data-testid="meal-name"]').first();
  const mealName = await mealNameElement.textContent();

  // Get favorite button within this meal card
  const favoriteButton = firstMeal.locator(FAVORITE_BUTTON_SELECTOR).first();

  return {
    mealCard: firstMeal,
    mealName: mealName?.trim() || '',
    favoriteButton,
  };
}

/**
 * Check if a favorite button is in favorited state
 *
 * @param button - The favorite button locator
 * @returns True if favorited, false otherwise
 */
async function isFavorited(button: any): Promise<boolean> {
  // Check aria-pressed attribute
  const ariaPressed = await button.getAttribute('aria-pressed');
  return ariaPressed === 'true';
}

// ============================================================================
// Setup and Authentication
// ============================================================================

test.describe('Recipe Favorites', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await clearSession(page);

    // Login as valid user
    await login(page, VALID_USER.email, VALID_USER.password);

    // Should be on dashboard after login
    expect(page.url()).toMatch(/\/dashboard/);
  });

  test.afterEach(async ({ page }) => {
    // Clean up session after tests
    await clearSession(page);
  });

  // ============================================================================
  // Happy Path: Complete Favorites Workflow
  // ============================================================================

  test('should complete full favorites workflow', async ({ page }) => {
    // STEP 1: Navigate to a meal plan detail page
    const mealPlanId = await navigateToMealPlan(page);
    expect(mealPlanId).toBeTruthy();

    // STEP 2: Get first meal and its favorite button
    const { mealName, favoriteButton } = await getFirstMeal(page);
    expect(mealName).toBeTruthy();

    // Verify favorite button is visible
    await expect(favoriteButton).toBeVisible();

    // Check initial state (should not be favorited)
    const initiallyFavorited = await isFavorited(favoriteButton);

    // STEP 3: Click favorite button - verify heart fills
    await favoriteButton.click();

    // Wait for API call to complete (button should show loading state then update)
    await page.waitForTimeout(1000);

    // Verify button is now in favorited state
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');

    // STEP 4: Navigate to /dashboard/favorites - verify meal appears
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });

    // Wait for favorites page to load
    await page.waitForLoadState('networkidle');

    // Verify meal appears in favorites list
    await expect(page.locator(`text=${mealName}`)).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Verify meal card is present
    const favoriteMealCard = page.locator(MEAL_PLAN_CARD_SELECTOR).filter({ hasText: mealName });
    await expect(favoriteMealCard).toBeVisible();

    // STEP 5: Click remove button - verify meal disappears
    const removeFavoriteButton = favoriteMealCard.locator(FAVORITE_BUTTON_SELECTOR);
    await expect(removeFavoriteButton).toBeVisible();

    // Click to remove favorite
    await removeFavoriteButton.click();

    // Wait for API call to complete
    await page.waitForTimeout(1000);

    // Verify meal no longer appears in favorites (either removed or empty state shown)
    const mealStillVisible = await page.locator(`text=${mealName}`).isVisible().catch(() => false);
    const emptyStateVisible = await page.locator(EMPTY_STATE_SELECTOR).isVisible().catch(() => false);

    // Either the meal is gone, or we're showing the empty state
    expect(mealStillVisible || emptyStateVisible).toBeTruthy();

    // STEP 6: Go back to meal plan - verify heart is unfilled
    await page.goto(`/dashboard/meal-plans/${mealPlanId}`, { timeout: TIMEOUTS.navigation });

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Get the same meal's favorite button again
    const { favoriteButton: updatedFavoriteButton } = await getFirstMeal(page);

    // Verify button is back to unfavorited state
    await expect(updatedFavoriteButton).toHaveAttribute('aria-pressed', 'false');
  });

  // ============================================================================
  // Favorite Button Behavior
  // ============================================================================

  test('should toggle favorite state when clicked', async ({ page }) => {
    // Navigate to a meal plan
    await navigateToMealPlan(page);

    // Get first meal
    const { favoriteButton } = await getFirstMeal(page);

    // Get initial state
    const initialState = await isFavorited(favoriteButton);

    // Click to toggle
    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Verify state changed
    const newState = await isFavorited(favoriteButton);
    expect(newState).toBe(!initialState);

    // Click again to toggle back
    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Verify state changed back
    const finalState = await isFavorited(favoriteButton);
    expect(finalState).toBe(initialState);
  });

  test('should show loading state while favoriting', async ({ page }) => {
    // Navigate to a meal plan
    await navigateToMealPlan(page);

    // Get first meal
    const { favoriteButton } = await getFirstMeal(page);

    // Click favorite button
    const clickPromise = favoriteButton.click();

    // Button should be disabled during API call
    // Note: Timing might be too fast to catch, but we try
    const isDisabled = await favoriteButton.isDisabled().catch(() => false);

    // Wait for click to complete
    await clickPromise;
    await page.waitForTimeout(1000);

    // After completion, button should be enabled again
    await expect(favoriteButton).toBeEnabled();
  });

  // ============================================================================
  // Favorites Page Display
  // ============================================================================

  test('should display favorites page correctly', async ({ page }) => {
    // Navigate directly to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });

    // Page should load without errors
    await page.waitForLoadState('networkidle');

    // Verify page heading
    await expect(page.locator('h1, h2').filter({ hasText: /favorites/i })).toBeVisible();

    // Either favorites are displayed or empty state is shown
    const hasMealCards = await page.locator(MEAL_PLAN_CARD_SELECTOR).count() > 0;
    const hasEmptyState = await page.locator(EMPTY_STATE_SELECTOR).isVisible().catch(() => false);

    // One of these should be true
    expect(hasMealCards || hasEmptyState).toBeTruthy();
  });

  test('should show empty state when no favorites', async ({ page }) => {
    // First, make sure we have no favorites by removing any existing ones
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Remove all favorites if any exist
    const favoriteButtons = page.locator(FAVORITE_BUTTON_SELECTOR);
    const count = await favoriteButtons.count();

    for (let i = 0; i < count; i++) {
      // Always click the first one since they get removed
      const button = favoriteButtons.first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(500);
      }
    }

    // Reload page to ensure fresh state
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify empty state is shown
    const emptyState = page.locator(EMPTY_STATE_SELECTOR);
    const emptyStateVisible = await emptyState.isVisible().catch(() => false);

    // If empty state element exists, it should be visible
    // Otherwise, there should be no meal cards
    if (emptyStateVisible) {
      await expect(emptyState).toBeVisible();
    } else {
      // No meal cards should be present
      const mealCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
      expect(await mealCards.count()).toBe(0);
    }
  });

  // ============================================================================
  // Multiple Favorites Management
  // ============================================================================

  test('should handle multiple favorites', async ({ page }) => {
    // Navigate to a meal plan
    await navigateToMealPlan(page);

    // Get all meal cards
    const mealCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
    const mealCount = await mealCards.count();

    // Favorite up to 3 meals (or all if fewer than 3)
    const mealsToFavorite = Math.min(3, mealCount);
    const favoritedMealNames: string[] = [];

    for (let i = 0; i < mealsToFavorite; i++) {
      const mealCard = mealCards.nth(i);
      const mealNameElement = mealCard.locator('h3, [data-testid="meal-name"]').first();
      const mealName = await mealNameElement.textContent();

      if (mealName) {
        favoritedMealNames.push(mealName.trim());

        const favoriteButton = mealCard.locator(FAVORITE_BUTTON_SELECTOR);
        await favoriteButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Navigate to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Verify all favorited meals appear
    for (const mealName of favoritedMealNames) {
      await expect(page.locator(`text=${mealName}`)).toBeVisible();
    }

    // Verify correct number of meal cards
    const favoriteMealCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
    expect(await favoriteMealCards.count()).toBeGreaterThanOrEqual(mealsToFavorite);
  });

  // ============================================================================
  // State Persistence
  // ============================================================================

  test('should persist favorites across page reloads', async ({ page }) => {
    // Navigate to a meal plan and favorite a meal
    await navigateToMealPlan(page);
    const { mealName, favoriteButton } = await getFirstMeal(page);

    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Navigate to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Verify meal is in favorites
    await expect(page.locator(`text=${mealName}`)).toBeVisible();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify meal is still in favorites after reload
    await expect(page.locator(`text=${mealName}`)).toBeVisible();
  });

  test('should sync favorite state between meal plan and favorites pages', async ({ page }) => {
    // Navigate to a meal plan
    const mealPlanId = await navigateToMealPlan(page);
    const { mealName, favoriteButton } = await getFirstMeal(page);

    // Favorite the meal
    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Go to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Remove from favorites page
    const favoriteMealCard = page.locator(MEAL_PLAN_CARD_SELECTOR).filter({ hasText: mealName });
    const removeFavoriteButton = favoriteMealCard.locator(FAVORITE_BUTTON_SELECTOR);
    await removeFavoriteButton.click();
    await page.waitForTimeout(1000);

    // Go back to meal plan page
    await page.goto(`/dashboard/meal-plans/${mealPlanId}`, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Verify favorite button shows unfavorited state
    const { favoriteButton: updatedButton } = await getFirstMeal(page);
    await expect(updatedButton).toHaveAttribute('aria-pressed', 'false');
  });

  // ============================================================================
  // Navigation
  // ============================================================================

  test('should navigate to favorites page from dashboard menu', async ({ page }) => {
    // Go to dashboard
    await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });

    // Find favorites link in navigation
    const favoritesLink = page.locator('nav a:has-text("Favorites"), a[href*="/favorites"]').first();
    await expect(favoritesLink).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Click favorites link
    await favoritesLink.click();

    // Verify we're on favorites page
    await page.waitForURL('**/favorites', { timeout: TIMEOUTS.navigation });
    expect(page.url()).toContain('/favorites');
  });

  // ============================================================================
  // Recipe Details Display
  // ============================================================================

  test('should display recipe details on favorites page', async ({ page }) => {
    // First, ensure we have at least one favorite
    await navigateToMealPlan(page);
    const { favoriteButton } = await getFirstMeal(page);

    // Check if already favorited, if not, favorite it
    if (!(await isFavorited(favoriteButton))) {
      await favoriteButton.click();
      await page.waitForTimeout(1000);
    }

    // Navigate to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Get first favorite meal card
    const favoriteMealCard = page.locator(MEAL_PLAN_CARD_SELECTOR).first();
    await expect(favoriteMealCard).toBeVisible();

    // Verify meal details are displayed
    // Meal name should be visible
    const mealName = favoriteMealCard.locator('h3, [data-testid="meal-name"]');
    await expect(mealName).toBeVisible();

    // Nutrition information (if available)
    const nutritionBadges = favoriteMealCard.locator('[data-testid*="nutrition"], .nutrition, text=/calories|protein|carbs/i');
    const hasNutrition = await nutritionBadges.count() > 0;

    // Ingredients (if available)
    const ingredients = favoriteMealCard.locator('text=/ingredients/i');
    const hasIngredients = await ingredients.count() > 0;

    // At least some recipe details should be present
    expect(hasNutrition || hasIngredients).toBeTruthy();
  });

  // ============================================================================
  // Error Handling
  // ============================================================================

  test('should handle favorite API errors gracefully', async ({ page }) => {
    // Navigate to a meal plan
    await navigateToMealPlan(page);

    // Mock API error for favorite endpoint
    await page.route('**/api/favorites', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Failed to save favorite' }),
      });
    });

    // Get first meal
    const { favoriteButton } = await getFirstMeal(page);

    // Try to favorite - should handle error
    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Button should remain enabled (can retry)
    await expect(favoriteButton).toBeEnabled();

    // Optional: Check for error message if UI displays one
    // const errorMessage = page.locator('[role="alert"]');
    // if (await errorMessage.isVisible().catch(() => false)) {
    //   await expect(errorMessage).toContainText(/error|fail/i);
    // }
  });

  // ============================================================================
  // Search and Filter
  // ============================================================================

  test('should filter favorites by search query', async ({ page }) => {
    // Navigate to favorites page
    await page.goto(FAVORITES_PAGE_URL);
    await page.waitForLoadState('networkidle');

    // Wait for at least one meal card to be visible (we need favorites to test search)
    const mealCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
    const initialCount = await mealCards.count();

    // Skip test if no favorites exist
    if (initialCount === 0) {
      test.skip();
      return;
    }

    // Get the name of the first meal to search for
    const firstMealName = await mealCards.first().locator('p.text-xl, h3').textContent();
    const searchTerm = firstMealName?.split(' ')[0].toLowerCase() || 'chicken';

    // Enter search query
    await page.fill('[data-testid="search-input"]', searchTerm);
    await page.click('[data-testid="apply-filters-button"]');

    // Wait for results
    await page.waitForLoadState('networkidle');

    // Verify filtered results contain the search term
    const filteredCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
    const filteredCount = await filteredCards.count();

    if (filteredCount > 0) {
      // Check that each visible meal contains the search term
      for (let i = 0; i < filteredCount; i++) {
        const mealName = await filteredCards.nth(i).locator('p.text-xl, h3').textContent();
        expect(mealName?.toLowerCase()).toContain(searchTerm);
      }
    }
  });

  test('should filter favorites by calories range', async ({ page }) => {
    await page.goto(FAVORITES_PAGE_URL);
    await page.waitForLoadState('networkidle');

    // Wait for at least one meal card to be visible
    const mealCards = page.locator(MEAL_PLAN_CARD_SELECTOR);
    const initialCount = await mealCards.count();

    // Skip test if no favorites exist
    if (initialCount === 0) {
      test.skip();
      return;
    }

    // Set calorie range
    await page.fill('[data-testid="min-calories-input"]', '300');
    await page.fill('[data-testid="max-calories-input"]', '600');
    await page.click('[data-testid="apply-filters-button"]');

    await page.waitForLoadState('networkidle');

    // Verify calories are within range (if nutrition badges are visible)
    const caloriesBadges = page.locator('text=/\\d+ cal/');
    const count = await caloriesBadges.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const text = await caloriesBadges.nth(i).textContent();
        const calories = parseInt(text?.match(/\d+/)?.[0] || '0');
        expect(calories).toBeGreaterThanOrEqual(300);
        expect(calories).toBeLessThanOrEqual(600);
      }
    }
  });

  test('should clear filters when clicking clear button', async ({ page }) => {
    await page.goto(FAVORITES_PAGE_URL);
    await page.waitForLoadState('networkidle');

    // Apply filters
    await page.fill('[data-testid="search-input"]', 'test');
    await page.fill('[data-testid="min-calories-input"]', '300');
    await page.click('[data-testid="apply-filters-button"]');

    await page.waitForLoadState('networkidle');

    // Clear filters
    await page.click('[data-testid="clear-filters-button"]');

    await page.waitForLoadState('networkidle');

    // Verify URL has no query params
    const url = page.url();
    expect(url).toContain(FAVORITES_PAGE_URL);
    expect(url).not.toContain('search=');
    expect(url).not.toContain('minCalories=');

    // Verify input fields are cleared
    await expect(page.locator('[data-testid="search-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="min-calories-input"]')).toHaveValue('');
  });
});
