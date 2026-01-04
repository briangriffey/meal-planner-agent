/**
 * Mock meal plan data for testing
 */

export interface MockIngredient {
  item: string;
  amount: string;
}

export interface MockNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface MockMeal {
  name: string;
  ingredients: MockIngredient[];
  instructions: string[];
  nutrition: MockNutrition;
  prepTime: number;
  cookTime: number;
  hebAvailable?: boolean;
}

export interface MockMealRecord {
  id: string;
  mealPlanId: string;
  dayNumber: number;
  data: MockMeal;
  createdAt: Date;
}

export interface MockMealPlan {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  weekStartDate: Date;
  generatedAt: Date | null;
  claudeModel: string | null;
  iterationCount: number | null;
  emailSent: boolean;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  mealRecords?: MockMealRecord[];
}

// Sample meal recipes
const SAMPLE_MEALS: MockMeal[] = [
  {
    name: "Grilled Chicken Breast with Roasted Vegetables",
    ingredients: [
      { item: "chicken breast", amount: "1.5 lbs" },
      { item: "broccoli florets", amount: "2 cups" },
      { item: "bell peppers", amount: "2 medium" },
      { item: "olive oil", amount: "2 tbsp" },
      { item: "garlic", amount: "3 cloves" },
      { item: "lemon", amount: "1 medium" },
      { item: "salt and pepper", amount: "to taste" },
    ],
    instructions: [
      "Preheat oven to 425°F.",
      "Season chicken breasts with salt, pepper, and minced garlic.",
      "Heat olive oil in oven-safe skillet over medium-high heat.",
      "Sear chicken for 3-4 minutes per side until golden brown.",
      "Add broccoli and peppers to the skillet around the chicken.",
      "Transfer skillet to oven and roast for 15-20 minutes.",
      "Check chicken reaches internal temperature of 165°F.",
      "Squeeze fresh lemon juice over chicken before serving.",
    ],
    nutrition: {
      calories: 420,
      protein: 45,
      carbs: 18,
      fat: 16,
      fiber: 5,
    },
    prepTime: 15,
    cookTime: 30,
    hebAvailable: true,
  },
  {
    name: "Honey Garlic Salmon with Quinoa",
    ingredients: [
      { item: "salmon fillets", amount: "1.5 lbs" },
      { item: "quinoa", amount: "1 cup" },
      { item: "honey", amount: "3 tbsp" },
      { item: "soy sauce", amount: "2 tbsp" },
      { item: "garlic", amount: "4 cloves" },
      { item: "green beans", amount: "2 cups" },
      { item: "sesame seeds", amount: "1 tbsp" },
    ],
    instructions: [
      "Cook quinoa according to package directions.",
      "Mix honey, soy sauce, and minced garlic in a bowl.",
      "Brush salmon fillets with honey-garlic mixture.",
      "Bake salmon at 400°F for 12-15 minutes.",
      "Steam green beans for 5-7 minutes until tender-crisp.",
      "Serve salmon over quinoa with green beans on the side.",
      "Garnish with sesame seeds.",
    ],
    nutrition: {
      calories: 520,
      protein: 42,
      carbs: 45,
      fat: 18,
      fiber: 6,
    },
    prepTime: 10,
    cookTime: 20,
    hebAvailable: true,
  },
  {
    name: "Turkey Meatballs with Marinara and Zucchini Noodles",
    ingredients: [
      { item: "ground turkey", amount: "1.5 lbs" },
      { item: "breadcrumbs", amount: "1/2 cup" },
      { item: "egg", amount: "1 large" },
      { item: "marinara sauce", amount: "2 cups" },
      { item: "zucchini", amount: "4 medium" },
      { item: "parmesan cheese", amount: "1/4 cup" },
      { item: "Italian seasoning", amount: "2 tsp" },
    ],
    instructions: [
      "Mix ground turkey, breadcrumbs, egg, and Italian seasoning.",
      "Form mixture into 16-20 meatballs.",
      "Brown meatballs in skillet over medium heat.",
      "Add marinara sauce and simmer for 15 minutes.",
      "Spiralize zucchini into noodles.",
      "Sauté zucchini noodles for 2-3 minutes until tender.",
      "Serve meatballs and sauce over zucchini noodles.",
      "Top with parmesan cheese.",
    ],
    nutrition: {
      calories: 380,
      protein: 38,
      carbs: 22,
      fat: 14,
      fiber: 4,
    },
    prepTime: 20,
    cookTime: 25,
    hebAvailable: false,
  },
  {
    name: "Beef Stir-Fry with Brown Rice",
    ingredients: [
      { item: "sirloin steak", amount: "1.5 lbs" },
      { item: "brown rice", amount: "1.5 cups" },
      { item: "broccoli", amount: "2 cups" },
      { item: "snap peas", amount: "1 cup" },
      { item: "carrots", amount: "1 cup sliced" },
      { item: "soy sauce", amount: "3 tbsp" },
      { item: "ginger", amount: "1 tbsp minced" },
      { item: "sesame oil", amount: "2 tsp" },
    ],
    instructions: [
      "Cook brown rice according to package directions.",
      "Slice beef into thin strips against the grain.",
      "Heat sesame oil in wok or large skillet over high heat.",
      "Stir-fry beef for 3-4 minutes until browned, remove.",
      "Add vegetables and stir-fry for 5-6 minutes.",
      "Return beef to pan with soy sauce and ginger.",
      "Cook for 2 more minutes, tossing to combine.",
      "Serve over brown rice.",
    ],
    nutrition: {
      calories: 480,
      protein: 44,
      carbs: 42,
      fat: 14,
      fiber: 5,
    },
    prepTime: 15,
    cookTime: 20,
    hebAvailable: true,
  },
  {
    name: "Baked Tofu Buddha Bowl",
    ingredients: [
      { item: "firm tofu", amount: "14 oz" },
      { item: "sweet potato", amount: "2 medium" },
      { item: "kale", amount: "2 cups chopped" },
      { item: "chickpeas", amount: "1 can" },
      { item: "tahini", amount: "3 tbsp" },
      { item: "lemon juice", amount: "2 tbsp" },
      { item: "quinoa", amount: "1 cup" },
    ],
    instructions: [
      "Press tofu and cut into cubes, toss with soy sauce.",
      "Dice sweet potatoes and drain chickpeas.",
      "Roast tofu, sweet potatoes, and chickpeas at 400°F for 25 minutes.",
      "Cook quinoa according to package directions.",
      "Massage kale with a bit of olive oil until softened.",
      "Make tahini dressing with tahini, lemon juice, and water.",
      "Assemble bowls with quinoa, kale, roasted vegetables, and tofu.",
      "Drizzle with tahini dressing.",
    ],
    nutrition: {
      calories: 450,
      protein: 22,
      carbs: 58,
      fat: 16,
      fiber: 12,
    },
    prepTime: 20,
    cookTime: 30,
    hebAvailable: false,
  },
  {
    name: "Lemon Herb Chicken Thighs with Roasted Potatoes",
    ingredients: [
      { item: "chicken thighs", amount: "2 lbs" },
      { item: "baby potatoes", amount: "1.5 lbs" },
      { item: "lemon", amount: "2 medium" },
      { item: "fresh rosemary", amount: "2 tbsp" },
      { item: "garlic", amount: "6 cloves" },
      { item: "olive oil", amount: "3 tbsp" },
    ],
    instructions: [
      "Preheat oven to 425°F.",
      "Halve baby potatoes and toss with olive oil, salt, and pepper.",
      "Season chicken with lemon zest, rosemary, and minced garlic.",
      "Arrange chicken and potatoes on a baking sheet.",
      "Roast for 35-40 minutes until chicken is cooked through.",
      "Squeeze fresh lemon juice over chicken before serving.",
    ],
    nutrition: {
      calories: 510,
      protein: 38,
      carbs: 32,
      fat: 24,
      fiber: 4,
    },
    prepTime: 15,
    cookTime: 40,
    hebAvailable: true,
  },
  {
    name: "Shrimp Tacos with Cabbage Slaw",
    ingredients: [
      { item: "large shrimp", amount: "1.5 lbs" },
      { item: "corn tortillas", amount: "12 small" },
      { item: "red cabbage", amount: "2 cups shredded" },
      { item: "lime", amount: "2 medium" },
      { item: "cilantro", amount: "1/2 cup" },
      { item: "avocado", amount: "2 medium" },
      { item: "chili powder", amount: "1 tbsp" },
    ],
    instructions: [
      "Season shrimp with chili powder, cumin, and lime juice.",
      "Make slaw by mixing cabbage, lime juice, and cilantro.",
      "Sauté shrimp in hot skillet for 2-3 minutes per side.",
      "Warm tortillas in a separate pan.",
      "Mash avocado with lime juice for guacamole.",
      "Assemble tacos with shrimp, slaw, and guacamole.",
    ],
    nutrition: {
      calories: 440,
      protein: 36,
      carbs: 38,
      fat: 16,
      fiber: 10,
    },
    prepTime: 20,
    cookTime: 10,
    hebAvailable: true,
  },
];

// Generate meal records for a meal plan
function generateMealRecords(
  mealPlanId: string,
  mealCount: number,
  createdAt: Date
): MockMealRecord[] {
  const records: MockMealRecord[] = [];

  for (let i = 0; i < mealCount; i++) {
    const meal = SAMPLE_MEALS[i % SAMPLE_MEALS.length];
    records.push({
      id: `meal-record-${mealPlanId}-${i + 1}`,
      mealPlanId,
      dayNumber: i + 1,
      data: meal,
      createdAt,
    });
  }

  return records;
}

export const mockMealPlans: MockMealPlan[] = [
  // COMPLETED meal plans for Brian (user with extensive history)
  {
    id: "plan-brian-001",
    userId: "user-brian-001",
    status: "COMPLETED",
    weekStartDate: new Date("2024-02-05"),
    generatedAt: new Date("2024-02-04T10:30:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 1,
    emailSent: true,
    error: null,
    createdAt: new Date("2024-02-04T10:00:00Z"),
    updatedAt: new Date("2024-02-04T10:35:00Z"),
  },
  {
    id: "plan-brian-002",
    userId: "user-brian-001",
    status: "COMPLETED",
    weekStartDate: new Date("2024-04-15"),
    generatedAt: new Date("2024-04-14T09:15:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 2,
    emailSent: true,
    error: null,
    createdAt: new Date("2024-04-14T09:00:00Z"),
    updatedAt: new Date("2024-04-14T09:20:00Z"),
  },
  {
    id: "plan-brian-003",
    userId: "user-brian-001",
    status: "COMPLETED",
    weekStartDate: new Date("2024-08-12"),
    generatedAt: new Date("2024-08-11T11:00:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 1,
    emailSent: true,
    error: null,
    createdAt: new Date("2024-08-11T10:45:00Z"),
    updatedAt: new Date("2024-08-11T11:10:00Z"),
  },
  {
    id: "plan-brian-004",
    userId: "user-brian-001",
    status: "COMPLETED",
    weekStartDate: new Date("2024-11-04"),
    generatedAt: new Date("2024-11-03T08:30:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 1,
    emailSent: true,
    error: null,
    createdAt: new Date("2024-11-03T08:00:00Z"),
    updatedAt: new Date("2024-11-03T08:40:00Z"),
  },
  {
    id: "plan-brian-005",
    userId: "user-brian-001",
    status: "COMPLETED",
    weekStartDate: new Date("2025-12-15"),
    generatedAt: new Date("2025-12-14T09:00:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 1,
    emailSent: true,
    error: null,
    createdAt: new Date("2025-12-14T08:45:00Z"),
    updatedAt: new Date("2025-12-14T09:10:00Z"),
  },

  // COMPLETED meal plans for Allison (moderate history)
  {
    id: "plan-allison-001",
    userId: "user-allison-002",
    status: "COMPLETED",
    weekStartDate: new Date("2024-07-08"),
    generatedAt: new Date("2024-07-07T14:00:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 1,
    emailSent: true,
    error: null,
    createdAt: new Date("2024-07-07T13:45:00Z"),
    updatedAt: new Date("2024-07-07T14:10:00Z"),
  },
  {
    id: "plan-allison-002",
    userId: "user-allison-002",
    status: "COMPLETED",
    weekStartDate: new Date("2025-11-17"),
    generatedAt: new Date("2025-11-16T15:30:00Z"),
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 2,
    emailSent: true,
    error: null,
    createdAt: new Date("2025-11-16T15:00:00Z"),
    updatedAt: new Date("2025-11-16T15:40:00Z"),
  },

  // PROCESSING meal plans
  {
    id: "plan-brian-processing",
    userId: "user-brian-001",
    status: "PROCESSING",
    weekStartDate: new Date("2026-01-06"),
    generatedAt: null,
    claudeModel: null,
    iterationCount: null,
    emailSent: false,
    error: null,
    createdAt: new Date("2026-01-03T10:00:00Z"),
    updatedAt: new Date("2026-01-03T10:00:00Z"),
  },

  // PENDING meal plan
  {
    id: "plan-allison-pending",
    userId: "user-allison-002",
    status: "PENDING",
    weekStartDate: new Date("2026-01-13"),
    generatedAt: null,
    claudeModel: null,
    iterationCount: null,
    emailSent: false,
    error: null,
    createdAt: new Date("2026-01-03T11:00:00Z"),
    updatedAt: new Date("2026-01-03T11:00:00Z"),
  },

  // FAILED meal plan
  {
    id: "plan-brian-failed",
    userId: "user-brian-001",
    status: "FAILED",
    weekStartDate: new Date("2025-10-20"),
    generatedAt: null,
    claudeModel: "claude-3-5-sonnet-20241022",
    iterationCount: 3,
    emailSent: false,
    error: "Max iterations reached without valid meal plan",
    createdAt: new Date("2025-10-19T09:00:00Z"),
    updatedAt: new Date("2025-10-19T09:45:00Z"),
  },
];

// Add meal records to completed plans
mockMealPlans.forEach((plan) => {
  if (plan.status === "COMPLETED") {
    // Determine meal count based on user
    const mealCount = plan.userId === "user-brian-001" ? 7 : 5;
    plan.mealRecords = generateMealRecords(
      plan.id,
      mealCount,
      plan.generatedAt!
    );
  }
});

/**
 * Get meal plans by user ID
 */
export function getMockMealPlansByUserId(userId: string): MockMealPlan[] {
  return mockMealPlans.filter((plan) => plan.userId === userId);
}

/**
 * Get meal plan by ID
 */
export function getMockMealPlanById(id: string): MockMealPlan | undefined {
  return mockMealPlans.find((plan) => plan.id === id);
}

/**
 * Get meal records for a meal plan
 */
export function getMockMealRecordsByPlanId(
  mealPlanId: string
): MockMealRecord[] {
  const plan = getMockMealPlanById(mealPlanId);
  return plan?.mealRecords || [];
}

/**
 * Get latest meal plan for user
 */
export function getLatestMockMealPlan(
  userId: string
): MockMealPlan | undefined {
  const userPlans = getMockMealPlansByUserId(userId);
  return userPlans.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )[0];
}
