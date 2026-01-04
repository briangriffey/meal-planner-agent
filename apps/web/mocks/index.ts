/**
 * Mock Data and Handlers Export
 *
 * This file exports all mock handlers and data for use in testing
 * and development with Mock Service Worker (MSW).
 *
 * Usage:
 * ```typescript
 * import { handlers } from '@/mocks';
 * import { setupServer } from 'msw/node';
 *
 * const server = setupServer(...handlers);
 * ```
 */

// Export all handlers
import { handlers as allHandlers, authHandlers, preferencesHandlers, mealPlanHandlers } from "./handlers";

export { allHandlers as handlers, authHandlers, preferencesHandlers, mealPlanHandlers };

// Export mock data
export * from "./data/users";
export * from "./data/preferences";
export * from "./data/meal-plans";

// Export handler utilities
export { getCurrentMockSession, clearMockSessions } from "./handlers/auth";

export default allHandlers;
