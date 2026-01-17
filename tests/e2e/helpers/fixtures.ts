/**
 * E2E Test Fixtures
 *
 * This file contains test data and constants used across E2E tests.
 * All test data should be defined here for consistency and maintainability.
 */

// ============================================================================
// User Credentials
// ============================================================================

/**
 * Valid test user credentials for authentication
 */
export const VALID_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User',
} as const;

/**
 * Additional valid test users for multi-user scenarios
 */
export const VALID_USERS = [
  VALID_USER,
  {
    email: 'user2@example.com',
    password: 'SecurePass456!',
    name: 'Second User',
  },
] as const;

/**
 * Invalid credentials for negative testing
 */
export const INVALID_CREDENTIALS = {
  wrongEmail: {
    email: 'nonexistent@example.com',
    password: 'WrongPassword123!',
  },
  wrongPassword: {
    email: VALID_USER.email,
    password: 'WrongPassword123!',
  },
  invalidEmail: {
    email: 'not-an-email',
    password: 'TestPassword123!',
  },
  emptyFields: {
    email: '',
    password: '',
  },
} as const;

// ============================================================================
// Registration Data
// ============================================================================

/**
 * Valid registration data for new user signup
 */
export const REGISTRATION_DATA = {
  valid: {
    name: 'New Test User',
    email: `test-${Date.now()}@example.com`, // Unique email
    password: 'NewUserPass123!',
    confirmPassword: 'NewUserPass123!',
  },
  invalid: {
    weakPassword: {
      name: 'Weak Password User',
      email: `test-weak-${Date.now()}@example.com`,
      password: '123',
      confirmPassword: '123',
    },
    mismatchPassword: {
      name: 'Mismatch User',
      email: `test-mismatch-${Date.now()}@example.com`,
      password: 'StrongPass123!',
      confirmPassword: 'DifferentPass456!',
    },
    existingEmail: {
      name: 'Duplicate User',
      email: VALID_USER.email, // Already exists
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    },
  },
} as const;

// ============================================================================
// User Preferences
// ============================================================================

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES = {
  mealsPerDay: 3,
  daysPerPlan: 7,
  dietaryRestrictions: [],
  emailRecipients: [],
  scheduleEnabled: false,
} as const;

/**
 * Sample preference updates for testing
 */
export const PREFERENCE_UPDATES = {
  basic: {
    mealsPerDay: 4,
    daysPerPlan: 5,
  },
  withRestrictions: {
    mealsPerDay: 3,
    daysPerPlan: 7,
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
  },
  withEmails: {
    mealsPerDay: 3,
    daysPerPlan: 7,
    emailRecipients: ['recipient1@example.com', 'recipient2@example.com'],
  },
  fullUpdate: {
    mealsPerDay: 4,
    daysPerPlan: 5,
    dietaryRestrictions: ['vegan', 'nut-free'],
    emailRecipients: ['family@example.com'],
    scheduleEnabled: false, // Schedule cannot be modified via UI (read-only)
  },
} as const;

/**
 * Invalid email addresses for validation testing
 */
export const INVALID_EMAILS = [
  'not-an-email',
  '@example.com',
  'test@',
  'test',
  '',
  ' ',
] as const;

/**
 * Valid email addresses for validation testing
 */
export const VALID_EMAILS = [
  'test@example.com',
  'user.name@example.co.uk',
  'test+tag@example.com',
] as const;

// ============================================================================
// Meal Plan Data
// ============================================================================

/**
 * Expected structure of a generated meal plan
 */
export interface ExpectedMealPlan {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  meals?: Array<{
    day: number;
    mealNumber: number;
    name: string;
    ingredients: Array<{
      item: string;
      amount: string;
    }>;
    instructions: string;
    prepTime?: string;
    cookTime?: string;
    servings?: number;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  }>;
}

/**
 * Sample meal plan for testing display
 */
export const SAMPLE_MEAL_PLAN: Omit<ExpectedMealPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  status: 'completed',
  meals: [
    {
      day: 1,
      mealNumber: 1,
      name: 'Oatmeal with Berries',
      ingredients: [
        { item: 'Rolled oats', amount: '1 cup' },
        { item: 'Mixed berries', amount: '1/2 cup' },
        { item: 'Almond milk', amount: '1 cup' },
        { item: 'Honey', amount: '1 tbsp' },
      ],
      instructions: 'Cook oats with almond milk. Top with berries and honey.',
      prepTime: '5 min',
      cookTime: '5 min',
      servings: 1,
      calories: 350,
      protein: 10,
      carbs: 65,
      fat: 8,
      fiber: 10,
    },
  ],
} as const;

// ============================================================================
// Dietary Restrictions
// ============================================================================

/**
 * Available dietary restrictions
 */
export const DIETARY_RESTRICTIONS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'low-carb',
  'keto',
  'paleo',
] as const;

// ============================================================================
// API Response Timeouts
// ============================================================================

/**
 * Timeout values for different operations (in milliseconds)
 */
export const TIMEOUTS = {
  navigation: 30000,        // Page navigation
  apiResponse: 10000,       // Standard API calls
  mealPlanGeneration: 120000, // Meal plan generation (AI processing)
  authentication: 5000,     // Login/logout
  formSubmission: 5000,     // Form submissions
} as const;

// ============================================================================
// URL Paths
// ============================================================================

/**
 * Application routes for navigation
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  resendVerification: '/resend-verification',
  dashboard: '/dashboard',
  preferences: '/dashboard/preferences',
  mealPlans: '/dashboard/meal-plans',
  mealPlanDetail: (id: string) => `/dashboard/meal-plans/${id}`,
  favorites: '/dashboard/favorites',
  generate: '/dashboard/generate',
  analytics: '/dashboard/analytics',
} as const;

// ============================================================================
// Test Selectors
// ============================================================================

/**
 * Common test selectors for UI elements
 */
export const SELECTORS = {
  // Authentication
  emailInput: 'input[name="email"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[type="submit"]',
  logoutButton: 'button:has-text("Logout")',

  // Meal Plan Generation
  generateButton: 'button:has-text("Generate Meal Plan")',
  progressBar: '[role="progressbar"]',
  statusMessage: '[data-testid="status-message"]',
  mealPlanCard: '[data-testid="meal-plan-card"]',

  // Preferences
  mealsPerDayInput: 'input[name="mealsPerDay"]',
  daysPerPlanInput: 'input[name="daysPerPlan"]',
  dietaryRestrictionsSelect: 'select[name="dietaryRestrictions"]',
  emailRecipientsInput: 'input[name="emailRecipient"]',
  addEmailButton: 'button:has-text("Add Email")',
  savePreferencesButton: 'button:has-text("Save Preferences")',

  // Navigation
  navDashboard: 'nav a:has-text("Dashboard")',
  navPreferences: 'nav a:has-text("Preferences")',
  navMealPlans: 'nav a:has-text("Meal Plans")',
  navFavorites: 'nav a:has-text("Favorites")',

  // Favorites
  favoriteButton: '[data-testid="favorite-button"]',
  mealCard: '[data-testid="meal-card"]',
  emptyState: '[data-testid="empty-state"]',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

/**
 * Expected error messages for validation
 */
export const ERROR_MESSAGES = {
  invalidEmail: 'Please enter a valid email address',
  invalidPassword: 'Password must be at least 8 characters',
  loginFailed: 'Invalid email or password',
  registrationFailed: 'Registration failed',
  passwordMismatch: 'Passwords do not match',
  emailExists: 'Email already exists',
  requiredField: 'This field is required',
  emailNotVerified: 'Please verify your email',
  expiredToken: 'Verification link expired',
  invalidToken: 'Invalid verification link',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

/**
 * Expected success messages
 */
export const SUCCESS_MESSAGES = {
  loginSuccess: 'Login successful',
  registrationSuccess: 'Registration successful',
  preferencesSaved: 'Preferences saved successfully',
  mealPlanGenerated: 'Meal plan generated successfully',
  emailSent: 'Email sent successfully',
  emailVerified: 'Email verified successfully',
  checkYourEmail: 'Check your email',
} as const;
