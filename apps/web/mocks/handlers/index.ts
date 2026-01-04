/**
 * Mock Service Worker (MSW) handlers index
 *
 * Exports all mock API handlers for use in testing and development.
 */

import { authHandlers } from "./auth";
import { preferencesHandlers } from "./preferences";
import { mealPlanHandlers } from "./meal-plans";

/**
 * All mock handlers combined
 */
export const handlers = [
  ...authHandlers,
  ...preferencesHandlers,
  ...mealPlanHandlers,
];

export default handlers;

/**
 * Individual handler exports for selective mocking
 */
export { authHandlers, preferencesHandlers, mealPlanHandlers };
