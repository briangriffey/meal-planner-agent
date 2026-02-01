// Core types for Meal Planner Agent

export interface MealPlan {
  week: string;
  meals: DailyMeal[];
  shoppingList?: ShoppingItem[];
}

export interface DailyMeal {
  day: string;
  dinner: Meal;
}

export interface Meal {
  day: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  prepTime: string;
  cookTime: string;
}

export interface Ingredient {
  item: string;
  amount: string;
  calories?: number;
  protein?: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface ShoppingItem {
  item: string;
  amount: string;
  category?: string;
}

// Meal history types
export interface MealRecord {
  day: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
}

export interface MealPlanHistory {
  date: string;
  meals: MealRecord[];
}

export interface MealHistoryData {
  history: MealPlanHistory[];
}

// Configuration types
export interface UserPreferences {
  numberOfMeals: number;
  servingsPerMeal: number;
  minProteinPerMeal: number;
  maxCaloriesPerMeal: number;
  dietaryRestrictions: string[];
}

export interface EmailConfig {
  user: string;
  appPassword: string;
  recipients: string[];
}


// Connector types
export interface ConnectorInputSchema {
  type: 'object';
  properties: Record<string, any>;
  required?: string[];
}

export interface Connector {
  name: string;
  description: string;
  inputSchema: ConnectorInputSchema;
  execute(params: any): Promise<any>;
}

/**
 * Callback type for generating email action tokens
 * Called for each meal when generating the email to create "Add to Favorites" buttons
 * Returns the unique token string that will be used in the email link
 */
export type EmailActionTokenGenerator = (mealIndex: number, meal: Meal) => Promise<string>;

// Agent configuration with dependency injection
export interface MealPlannerAgentConfig {
  anthropicApiKey: string;
  preferences: UserPreferences;
  mealHistoryService: IMealHistoryService;
  claudeModel?: string;
  onProgress?: (percent: number, message: string) => Promise<void>;
  householdMembers?: Array<{
    userId: string;
    name: string | null;
    email: string;
    preferences: {
      dietaryRestrictions: string[];
      minProteinPerMeal: number | null;
      maxCaloriesPerMeal: number | null;
    };
  }>;
  /** Base URL for email action links (e.g., https://example.com) */
  baseUrl?: string;
  /** Callback to generate tokens for email action buttons (e.g., Add to Favorites) */
  emailActionTokenGenerator?: EmailActionTokenGenerator;
}

// Meal history service interface
export interface IMealHistoryService {
  /**
   * Get recent meal names for variety checking
   */
  getRecentMealNames(count: number): Promise<string[]>;

  /**
   * Save meal plan to history
   */
  saveMealPlan(meals: MealRecord[]): Promise<void>;

  /**
   * Get formatted history summary for agent context
   */
  getHistorySummary(weekCount: number): Promise<string>;

  /**
   * Parse meal plan from agent response
   */
  parseMealPlanFromResponse(response: string): MealRecord[];
}

// Result types
export interface MealPlanGenerationResult {
  success: boolean;
  meals?: MealRecord[];
  emailSent: boolean;
  emailHtml?: string;
  iterationCount: number;
  error?: string;
}

// ConnectorRegistry is exported from connectors/base.ts
// It's available via: import { ConnectorRegistry } from '@meal-planner/core'

// ============================================================================
// Household Management Types
// ============================================================================

export enum HouseholdRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

export interface Household {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId: string;
  role: HouseholdRole;
  joinedAt: Date;
}

export interface MemberPreferences {
  id: string;
  householdMemberId: string;
  dietaryRestrictions: string[];
  minProteinPerMeal?: number;
  maxCaloriesPerMeal?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HouseholdInvitation {
  id: string;
  householdId: string;
  inviterUserId: string;
  email: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  acceptedByUserId?: string;
  createdAt: Date;
}
