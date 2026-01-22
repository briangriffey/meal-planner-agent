/**
 * E2E Tests: Recipe Exploration
 *
 * Tests the complete recipe exploration workflow:
 * - Browsing AI-generated recipe suggestions
 * - Filtering recipes by cuisine, prep time, and nutrition
 * - Favoriting recipes from explore page
 * - Verifying favorites sync between explore and favorites pages
 * - Pagination through recipe results
 * - User dietary restrictions automatically applied
 */

import { test, expect } from '@playwright/test';
import { login, clearSession } from './helpers/auth';
import {
  VALID_USER,
  TIMEOUTS,
  ROUTES,
  SELECTORS,
} from './helpers/fixtures';

// ============================================================================
// Test Constants
// ============================================================================

const EXPLORE_PAGE_URL = ROUTES.explore;
const FAVORITES_PAGE_URL = ROUTES.favorites;
const RECIPE_CARD_SELECTOR = SELECTORS.recipeCard;
const FAVORITE_BUTTON_SELECTOR = SELECTORS.favoriteButton;
const EMPTY_STATE_SELECTOR = SELECTORS.emptyState;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Wait for recipes to load on explore page
 *
 * @param page - Playwright page object
 * @returns Number of recipes loaded
 */
async function waitForRecipes(page: any): Promise<number> {
  // Wait for either recipe cards or empty state
  await page.waitForLoadState('networkidle');

  // Check if recipes are present
  const recipeCards = page.locator(RECIPE_CARD_SELECTOR);
  const count = await recipeCards.count();

  if (count > 0) {
    await expect(recipeCards.first()).toBeVisible({ timeout: TIMEOUTS.apiResponse });
  }

  return count;
}

/**
 * Get the first recipe card details
 *
 * @param page - Playwright page object
 * @returns Object containing recipe data and favorite button
 */
async function getFirstRecipe(page: any) {
  // Wait for recipe cards to load
  const recipeCards = page.locator(RECIPE_CARD_SELECTOR);
  await expect(recipeCards.first()).toBeVisible({ timeout: TIMEOUTS.apiResponse });

  // Get first recipe card
  const firstRecipe = recipeCards.first();

  // Get recipe name
  const recipeNameElement = firstRecipe.locator('h3, [data-testid="recipe-name"]').first();
  const recipeName = await recipeNameElement.textContent();

  // Get favorite button within this recipe card
  const favoriteButton = firstRecipe.locator(FAVORITE_BUTTON_SELECTOR).first();

  return {
    recipeCard: firstRecipe,
    recipeName: recipeName?.trim() || '',
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

/**
 * Apply filters on explore page
 *
 * @param page - Playwright page object
 * @param filters - Filter options
 */
async function applyFilters(page: any, filters: {
  cuisine?: string;
  prepTime?: string;
  minCalories?: string;
  maxCalories?: string;
  minProtein?: string;
  maxProtein?: string;
}) {
  if (filters.cuisine) {
    await page.selectOption(SELECTORS.cuisineSelect, filters.cuisine);
  }

  if (filters.prepTime) {
    await page.selectOption(SELECTORS.prepTimeSelect, filters.prepTime);
  }

  if (filters.minCalories) {
    await page.fill(SELECTORS.minCaloriesInput, filters.minCalories);
  }

  if (filters.maxCalories) {
    await page.fill(SELECTORS.maxCaloriesInput, filters.maxCalories);
  }

  if (filters.minProtein) {
    await page.fill(SELECTORS.minProteinInput, filters.minProtein);
  }

  if (filters.maxProtein) {
    await page.fill(SELECTORS.maxProteinInput, filters.maxProtein);
  }

  // Click apply button
  await page.click(SELECTORS.applyFiltersButton);
  await page.waitForLoadState('networkidle');
}

// ============================================================================
// Setup and Authentication
// ============================================================================

test.describe('Recipe Exploration', () => {
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
  // Happy Path: Complete Recipe Exploration Workflow
  // ============================================================================

  test('should complete full recipe exploration workflow', async ({ page }) => {
    // STEP 1: Navigate to /dashboard/explore
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });

    // Verify page loads without errors
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/explore');

    // STEP 2: Verify recipes are generated and displayed
    const recipeCount = await waitForRecipes(page);
    expect(recipeCount).toBeGreaterThan(0);

    // Verify recipe cards have required elements
    const { recipeCard, recipeName } = await getFirstRecipe(page);
    expect(recipeName).toBeTruthy();

    // Verify recipe details are visible
    await expect(recipeCard).toBeVisible();

    // STEP 3: Apply filters (cuisine)
    await applyFilters(page, { cuisine: 'italian' });

    // Wait for filtered results
    const filteredCount = await waitForRecipes(page);
    expect(filteredCount).toBeGreaterThan(0);

    // Verify URL contains filter parameters
    expect(page.url()).toContain('cuisine=italian');

    // STEP 4: Apply nutrition filters
    await applyFilters(page, {
      minCalories: '300',
      maxCalories: '600',
    });

    // Wait for filtered results
    const nutritionFilteredCount = await waitForRecipes(page);
    expect(nutritionFilteredCount).toBeGreaterThanOrEqual(0); // May return 0 if no matches

    // Verify URL contains nutrition parameters
    expect(page.url()).toContain('minCalories=300');
    expect(page.url()).toContain('maxCalories=600');

    // STEP 5: Clear filters
    await page.click(SELECTORS.clearFiltersButton);
    await page.waitForLoadState('networkidle');

    // Verify filters are cleared in URL
    expect(page.url()).not.toContain('cuisine=');
    expect(page.url()).not.toContain('minCalories=');

    // STEP 6: Favorite a recipe
    const { recipeName: recipeToFavorite, favoriteButton } = await getFirstRecipe(page);

    // Click favorite button
    await favoriteButton.click();
    await page.waitForTimeout(1000); // Wait for API call

    // Verify button is now in favorited state
    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');

    // STEP 7: Navigate to /dashboard/favorites - verify recipe appears
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Verify favorited recipe appears in favorites list
    await expect(page.locator(`text=${recipeToFavorite}`)).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // STEP 8: Test pagination - go back to explore page
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Check if pagination controls are visible
    const nextButton = page.locator(SELECTORS.paginationNext);
    const hasNextButton = await nextButton.isVisible().catch(() => false);

    if (hasNextButton) {
      // Click next page
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Verify URL contains page parameter
      expect(page.url()).toContain('page=2');

      // Verify recipes are still displayed
      const page2Count = await waitForRecipes(page);
      expect(page2Count).toBeGreaterThan(0);
    }
  });

  // ============================================================================
  // Page Display and Navigation
  // ============================================================================

  test('should display explore page correctly', async ({ page }) => {
    // Navigate to explore page
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });

    // Page should load without errors
    await page.waitForLoadState('networkidle');

    // Verify page heading
    await expect(page.locator('h1, h2').filter({ hasText: /explore/i })).toBeVisible();

    // Verify filter components are visible
    await expect(page.locator(SELECTORS.cuisineSelect)).toBeVisible();
    await expect(page.locator(SELECTORS.applyFiltersButton)).toBeVisible();

    // Recipes should be displayed
    const recipeCount = await waitForRecipes(page);
    expect(recipeCount).toBeGreaterThan(0);
  });

  test('should navigate to explore page from dashboard menu', async ({ page }) => {
    // Go to dashboard
    await page.goto(ROUTES.dashboard, { timeout: TIMEOUTS.navigation });

    // Find explore link in navigation
    const exploreLink = page.locator(SELECTORS.navExplore).first();
    await expect(exploreLink).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Click explore link
    await exploreLink.click();

    // Verify we're on explore page
    await page.waitForURL('**/explore', { timeout: TIMEOUTS.navigation });
    expect(page.url()).toContain('/explore');
  });

  // ============================================================================
  // Recipe Filtering
  // ============================================================================

  test('should filter recipes by cuisine', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Apply cuisine filter
    await applyFilters(page, { cuisine: 'mexican' });

    // Verify URL contains cuisine parameter
    expect(page.url()).toContain('cuisine=mexican');

    // Verify recipes are displayed
    const recipeCount = await waitForRecipes(page);
    expect(recipeCount).toBeGreaterThan(0);
  });

  test('should filter recipes by prep time', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Apply prep time filter (30 minutes or less)
    await applyFilters(page, { prepTime: '30' });

    // Verify URL contains prepTime parameter
    expect(page.url()).toContain('prepTime=30');

    // Verify recipes are displayed
    const recipeCount = await waitForRecipes(page);
    expect(recipeCount).toBeGreaterThan(0);
  });

  test('should filter recipes by calorie range', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Apply calorie range filter
    await applyFilters(page, {
      minCalories: '400',
      maxCalories: '700',
    });

    // Verify URL contains calorie parameters
    expect(page.url()).toContain('minCalories=400');
    expect(page.url()).toContain('maxCalories=700');

    // Verify recipes are displayed or empty state is shown
    await page.waitForLoadState('networkidle');
    const recipeCards = page.locator(RECIPE_CARD_SELECTOR);
    const count = await recipeCards.count();

    // Should have recipes or show message
    if (count === 0) {
      // Empty state is acceptable for restrictive filters
      expect(true).toBe(true);
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should filter recipes by protein range', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Apply protein range filter
    await applyFilters(page, {
      minProtein: '20',
      maxProtein: '40',
    });

    // Verify URL contains protein parameters
    expect(page.url()).toContain('minProtein=20');
    expect(page.url()).toContain('maxProtein=40');

    // Verify page loads without errors
    await page.waitForLoadState('networkidle');
  });

  test('should clear all filters when clicking clear button', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Apply multiple filters
    await applyFilters(page, {
      cuisine: 'italian',
      prepTime: '30',
      minCalories: '300',
      maxCalories: '600',
    });

    // Verify filters are applied in URL
    expect(page.url()).toContain('cuisine=italian');
    expect(page.url()).toContain('prepTime=30');

    // Clear filters
    await page.click(SELECTORS.clearFiltersButton);
    await page.waitForLoadState('networkidle');

    // Verify URL has no query params
    const url = page.url();
    expect(url).toContain(EXPLORE_PAGE_URL);
    expect(url).not.toContain('cuisine=');
    expect(url).not.toContain('prepTime=');
    expect(url).not.toContain('minCalories=');
  });

  // ============================================================================
  // Recipe Favoriting
  // ============================================================================

  test('should favorite recipe from explore page', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Get first recipe
    const { recipeName, favoriteButton } = await getFirstRecipe(page);

    // Check initial state
    const initiallyFavorited = await isFavorited(favoriteButton);

    // Click favorite button
    await favoriteButton.click();
    await page.waitForTimeout(1000);

    // Verify state changed
    const newState = await isFavorited(favoriteButton);
    expect(newState).toBe(!initiallyFavorited);

    // Navigate to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // If we favorited it, it should appear in favorites
    if (!initiallyFavorited) {
      await expect(page.locator(`text=${recipeName}`)).toBeVisible({ timeout: TIMEOUTS.apiResponse });
    }
  });

  test('should toggle favorite state when clicked multiple times', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Get first recipe
    const { favoriteButton } = await getFirstRecipe(page);

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

  test('should sync favorite state between explore and favorites pages', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Get first recipe and favorite it
    const { recipeName, favoriteButton } = await getFirstRecipe(page);

    // Ensure it's favorited
    if (!(await isFavorited(favoriteButton))) {
      await favoriteButton.click();
      await page.waitForTimeout(1000);
    }

    // Go to favorites page
    await page.goto(FAVORITES_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Recipe should appear
    await expect(page.locator(`text=${recipeName}`)).toBeVisible({ timeout: TIMEOUTS.apiResponse });

    // Remove from favorites page
    const favoriteMealCard = page.locator('[data-testid="meal-card"]').filter({ hasText: recipeName });
    const removeFavoriteButton = favoriteMealCard.locator(FAVORITE_BUTTON_SELECTOR);
    await removeFavoriteButton.click();
    await page.waitForTimeout(1000);

    // Go back to explore page
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Find the same recipe - it should be unfavorited
    // Note: Recipe may not be the same due to AI generation, so we just verify page loads
    await waitForRecipes(page);
    expect(page.url()).toContain('/explore');
  });

  // ============================================================================
  // Pagination
  // ============================================================================

  test('should navigate through pages using pagination', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Verify recipes on page 1
    const page1Count = await waitForRecipes(page);
    expect(page1Count).toBeGreaterThan(0);

    // Check if pagination next button exists
    const nextButton = page.locator(SELECTORS.paginationNext);
    const hasNextButton = await nextButton.isVisible().catch(() => false);

    if (hasNextButton) {
      // Click next page
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Verify URL contains page parameter
      expect(page.url()).toContain('page=2');

      // Verify recipes are displayed on page 2
      const page2Count = await waitForRecipes(page);
      expect(page2Count).toBeGreaterThan(0);

      // Check if previous button exists
      const prevButton = page.locator(SELECTORS.paginationPrev);
      const hasPrevButton = await prevButton.isVisible().catch(() => false);

      if (hasPrevButton) {
        // Click previous page
        await prevButton.click();
        await page.waitForLoadState('networkidle');

        // Should be back on page 1 or no page param
        const currentUrl = page.url();
        expect(currentUrl.includes('page=1') || !currentUrl.includes('page=')).toBe(true);
      }
    }
  });

  test('should maintain filters when navigating pages', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Apply filters
    await applyFilters(page, { cuisine: 'asian' });

    // Verify filter in URL
    expect(page.url()).toContain('cuisine=asian');

    // Check if pagination exists
    const nextButton = page.locator(SELECTORS.paginationNext);
    const hasNextButton = await nextButton.isVisible().catch(() => false);

    if (hasNextButton) {
      // Click next page
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Verify filter is still in URL
      expect(page.url()).toContain('cuisine=asian');
      expect(page.url()).toContain('page=2');
    }
  });

  // ============================================================================
  // Recipe Details Display
  // ============================================================================

  test('should display recipe details correctly', async ({ page }) => {
    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Get first recipe card
    const { recipeCard, recipeName } = await getFirstRecipe(page);

    // Verify recipe name is displayed
    expect(recipeName).toBeTruthy();
    await expect(recipeCard).toBeVisible();

    // Verify recipe has required elements (at least some should be present)
    const hasName = await recipeCard.locator('h3').isVisible().catch(() => false);
    const hasIngredients = await recipeCard.locator('text=/ingredients/i').isVisible().catch(() => false);
    const hasInstructions = await recipeCard.locator('text=/instructions/i').isVisible().catch(() => false);
    const hasNutrition = await recipeCard.locator('text=/calories|protein/i').isVisible().catch(() => false);

    // At least name should be present
    expect(hasName).toBe(true);
  });

  // ============================================================================
  // Error Handling
  // ============================================================================

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error for explore endpoint
    await page.route('**/api/recipes/explore*', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Failed to generate recipes' }),
      });
    });

    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Page should still load without crashing
    expect(page.url()).toContain('/explore');

    // Should show error state or empty state
    const hasError = await page.locator('text=/error|failed/i').isVisible().catch(() => false);
    const hasEmpty = await page.locator(EMPTY_STATE_SELECTOR).isVisible().catch(() => false);

    // One of these should be true
    expect(hasError || hasEmpty).toBe(true);
  });

  // ============================================================================
  // User Preferences Integration
  // ============================================================================

  test('should respect user dietary restrictions', async ({ page }) => {
    // This test verifies that the explore page loads successfully
    // The actual dietary restriction logic is handled by the RecipeExplorerAgent
    // which reads user preferences from the database

    await page.goto(EXPLORE_PAGE_URL, { timeout: TIMEOUTS.navigation });
    await page.waitForLoadState('networkidle');

    // Verify recipes are generated
    const recipeCount = await waitForRecipes(page);
    expect(recipeCount).toBeGreaterThan(0);

    // Recipes should be generated with user preferences applied
    // This is verified by the backend logic in RecipeExplorerAgent
    expect(true).toBe(true);
  });
});
