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

export interface Config {
  email: {
    user: string;
    appPassword: string;
    recipients: string[];
  };
  schedule: {
    dayOfWeek: number;
    hour: number;
    minute: number;
  };
  preferences: {
    minProteinPerMeal: number;
    maxCaloriesPerMeal: number;
    dietaryRestrictions: string[];
  };
  heb: {
    enabled: boolean;
  };
  claude: {
    model: string;
  };
}

export interface Connector {
  name: string;
  execute(params: any): Promise<any>;
}
