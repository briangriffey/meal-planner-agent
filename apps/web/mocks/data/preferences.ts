/**
 * Mock user preferences data for testing
 */

export interface MockUserPreferences {
  id: string;
  userId: string;
  mealCount: number;
  servingSize: number;
  preferredProteins: string[];
  dietaryRestrictions: string[];
  targetCaloriesPerMeal: number | null;
  targetProteinGramsPerMeal: number | null;
  enableHEB: boolean;
  emailRecipients: string[];
  scheduleEnabled: boolean;
  scheduleDay: number;
  scheduleTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mockPreferences: MockUserPreferences[] = [
  {
    id: "pref-brian-001",
    userId: "user-brian-001",
    mealCount: 7,
    servingSize: 4,
    preferredProteins: ["chicken", "beef", "fish", "tofu"],
    dietaryRestrictions: ["no shellfish", "no peanuts"],
    targetCaloriesPerMeal: 600,
    targetProteinGramsPerMeal: 40,
    enableHEB: true,
    emailRecipients: ["brian@test.com", "family@test.com"],
    scheduleEnabled: true,
    scheduleDay: 0, // Sunday
    scheduleTime: "09:00",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2025-12-15T10:00:00Z"),
  },
  {
    id: "pref-allison-002",
    userId: "user-allison-002",
    mealCount: 5,
    servingSize: 2,
    preferredProteins: ["chicken", "fish", "turkey"],
    dietaryRestrictions: ["gluten-free", "dairy-free"],
    targetCaloriesPerMeal: 500,
    targetProteinGramsPerMeal: 35,
    enableHEB: false,
    emailRecipients: ["allison@test.com"],
    scheduleEnabled: true,
    scheduleDay: 1, // Monday
    scheduleTime: "08:00",
    createdAt: new Date("2024-06-20T14:30:00Z"),
    updatedAt: new Date("2025-11-10T08:00:00Z"),
  },
  {
    id: "pref-newuser-003",
    userId: "user-newuser-003",
    mealCount: 14,
    servingSize: 2,
    preferredProteins: ["chicken", "fish"],
    dietaryRestrictions: [],
    targetCaloriesPerMeal: null,
    targetProteinGramsPerMeal: null,
    enableHEB: true,
    emailRecipients: ["newuser@test.com"],
    scheduleEnabled: false,
    scheduleDay: 0,
    scheduleTime: "09:00",
    createdAt: new Date("2025-12-01T09:00:00Z"),
    updatedAt: new Date("2025-12-01T09:00:00Z"),
  },
];

/**
 * Get preferences by user ID
 */
export function getMockPreferencesByUserId(
  userId: string
): MockUserPreferences | undefined {
  return mockPreferences.find((pref) => pref.userId === userId);
}

/**
 * Get preferences by ID
 */
export function getMockPreferencesById(
  id: string
): MockUserPreferences | undefined {
  return mockPreferences.find((pref) => pref.id === id);
}

/**
 * Check if user has preferences
 */
export function mockUserHasPreferences(userId: string): boolean {
  return mockPreferences.some((pref) => pref.userId === userId);
}
