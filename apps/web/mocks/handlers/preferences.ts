/**
 * Mock preferences API handlers for MSW (Mock Service Worker)
 *
 * These handlers provide mock responses for user preferences and schedule endpoints
 * for testing and development without a real backend.
 */

import { http, HttpResponse } from "msw";
import {
  mockPreferences,
  getMockPreferencesByUserId,
  type MockUserPreferences,
} from "../data/preferences";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * In-memory storage for preferences updates (for testing)
 */
const preferencesStore = new Map<string, MockUserPreferences>(
  mockPreferences.map((pref) => [pref.userId, { ...pref }])
);

export const preferencesHandlers = [
  /**
   * GET /api/users/preferences
   * Get current user's preferences
   */
  http.get(`${BASE_URL}/api/users/preferences`, ({ request }) => {
    // Extract user ID from auth header (in real app, from session)
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

    const preferences = preferencesStore.get(userId);

    if (!preferences) {
      return HttpResponse.json(
        { error: "Preferences not found. Please create preferences first." },
        { status: 404 }
      );
    }

    return HttpResponse.json(preferences, { status: 200 });
  }),

  /**
   * PUT /api/users/preferences
   * Update current user's preferences
   */
  http.put(`${BASE_URL}/api/users/preferences`, async ({ request }) => {
    try {
      // Extract user ID from auth header
      const authHeader = request.headers.get("authorization");
      const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

      const body = (await request.json()) as Partial<MockUserPreferences>;

      // Get existing preferences or create new
      const existingPrefs = preferencesStore.get(userId);

      const updatedPreferences: MockUserPreferences = {
        id: existingPrefs?.id || `pref-${userId}`,
        userId,
        mealCount: body.mealCount ?? existingPrefs?.mealCount ?? 7,
        servingSize: body.servingSize ?? existingPrefs?.servingSize ?? 2,
        preferredProteins:
          body.preferredProteins ?? existingPrefs?.preferredProteins ?? [],
        dietaryRestrictions:
          body.dietaryRestrictions ??
          existingPrefs?.dietaryRestrictions ??
          [],
        targetCaloriesPerMeal:
          body.targetCaloriesPerMeal ??
          existingPrefs?.targetCaloriesPerMeal ??
          null,
        targetProteinGramsPerMeal:
          body.targetProteinGramsPerMeal ??
          existingPrefs?.targetProteinGramsPerMeal ??
          null,
        enableHEB: body.enableHEB ?? existingPrefs?.enableHEB ?? false,
        emailRecipients:
          body.emailRecipients ?? existingPrefs?.emailRecipients ?? [],
        scheduleEnabled:
          body.scheduleEnabled ?? existingPrefs?.scheduleEnabled ?? false,
        scheduleDay: body.scheduleDay ?? existingPrefs?.scheduleDay ?? 0,
        scheduleTime: body.scheduleTime ?? existingPrefs?.scheduleTime ?? "09:00",
        createdAt: existingPrefs?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      // Save to store
      preferencesStore.set(userId, updatedPreferences);

      return HttpResponse.json(updatedPreferences, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),

  /**
   * POST /api/users/preferences
   * Create new preferences for current user
   */
  http.post(`${BASE_URL}/api/users/preferences`, async ({ request }) => {
    try {
      // Extract user ID from auth header
      const authHeader = request.headers.get("authorization");
      const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

      // Check if preferences already exist
      if (preferencesStore.has(userId)) {
        return HttpResponse.json(
          { error: "Preferences already exist. Use PUT to update." },
          { status: 409 }
        );
      }

      const body = (await request.json()) as Partial<MockUserPreferences>;

      const newPreferences: MockUserPreferences = {
        id: `pref-${userId}`,
        userId,
        mealCount: body.mealCount ?? 7,
        servingSize: body.servingSize ?? 2,
        preferredProteins: body.preferredProteins ?? [],
        dietaryRestrictions: body.dietaryRestrictions ?? [],
        targetCaloriesPerMeal: body.targetCaloriesPerMeal ?? null,
        targetProteinGramsPerMeal: body.targetProteinGramsPerMeal ?? null,
        enableHEB: body.enableHEB ?? false,
        emailRecipients: body.emailRecipients ?? [],
        scheduleEnabled: body.scheduleEnabled ?? false,
        scheduleDay: body.scheduleDay ?? 0,
        scheduleTime: body.scheduleTime ?? "09:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to store
      preferencesStore.set(userId, newPreferences);

      return HttpResponse.json(newPreferences, { status: 201 });
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),

  /**
   * GET /api/users/schedule
   * Get current user's schedule settings
   */
  http.get(`${BASE_URL}/api/users/schedule`, ({ request }) => {
    // Extract user ID from auth header
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

    const preferences = preferencesStore.get(userId);

    if (!preferences) {
      return HttpResponse.json(
        { error: "Preferences not found" },
        { status: 404 }
      );
    }

    const schedule = {
      scheduleEnabled: preferences.scheduleEnabled,
      scheduleDay: preferences.scheduleDay,
      scheduleTime: preferences.scheduleTime,
    };

    return HttpResponse.json(schedule, { status: 200 });
  }),

  /**
   * PUT /api/users/schedule
   * Update current user's schedule settings
   */
  http.put(`${BASE_URL}/api/users/schedule`, async ({ request }) => {
    try {
      // Extract user ID from auth header
      const authHeader = request.headers.get("authorization");
      const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

      const body = (await request.json()) as {
        scheduleEnabled?: boolean;
        scheduleDay?: number;
        scheduleTime?: string;
      };

      const preferences = preferencesStore.get(userId);

      if (!preferences) {
        return HttpResponse.json(
          { error: "Preferences not found" },
          { status: 404 }
        );
      }

      // Update schedule settings
      const updatedPreferences: MockUserPreferences = {
        ...preferences,
        scheduleEnabled: body.scheduleEnabled ?? preferences.scheduleEnabled,
        scheduleDay: body.scheduleDay ?? preferences.scheduleDay,
        scheduleTime: body.scheduleTime ?? preferences.scheduleTime,
        updatedAt: new Date(),
      };

      // Save to store
      preferencesStore.set(userId, updatedPreferences);

      const schedule = {
        scheduleEnabled: updatedPreferences.scheduleEnabled,
        scheduleDay: updatedPreferences.scheduleDay,
        scheduleTime: updatedPreferences.scheduleTime,
      };

      return HttpResponse.json(schedule, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),
];

/**
 * Helper function to get preferences from store (for testing)
 */
export function getMockPreferencesFromStore(
  userId: string
): MockUserPreferences | undefined {
  return preferencesStore.get(userId);
}

/**
 * Helper function to reset preferences store (for testing)
 */
export function resetPreferencesStore(): void {
  preferencesStore.clear();
  mockPreferences.forEach((pref) => {
    preferencesStore.set(pref.userId, { ...pref });
  });
}

export default preferencesHandlers;
