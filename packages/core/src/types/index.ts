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
export interface Connector {
  name: string;
  execute(params: any): Promise<any>;
}

// Agent configuration with dependency injection
export interface MealPlannerAgentConfig {
  anthropicApiKey: string;
  preferences: UserPreferences;
  mealHistoryService: IMealHistoryService;
  connectorRegistry: any; // ConnectorRegistry from '../connectors/base'
  claudeModel?: string;
  onProgress?: (percent: number, message: string) => Promise<void>;
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
