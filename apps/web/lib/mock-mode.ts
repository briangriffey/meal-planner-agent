/**
 * Mock Mode Configuration
 *
 * Provides utilities to check if the application is running in mock mode.
 * When MOCK_MODE is enabled, API routes will return mock data instead of
 * making real database queries or external API calls.
 *
 * This is useful for:
 * - E2E testing without external dependencies
 * - Frontend development without backend
 * - Demo environments
 */

/**
 * Check if mock mode is enabled
 *
 * Mock mode is enabled when MOCK_MODE environment variable is set to "true"
 *
 * @returns {boolean} True if mock mode is enabled
 */
export function isMockModeEnabled(): boolean {
  return process.env.MOCK_MODE === "true";
}

/**
 * Get mock mode status with detailed information
 *
 * @returns {object} Mock mode status object
 */
export function getMockModeStatus() {
  const enabled = isMockModeEnabled();
  return {
    enabled,
    envVar: process.env.MOCK_MODE,
    message: enabled
      ? "Mock mode is enabled - using mock data"
      : "Mock mode is disabled - using real data",
  };
}

/**
 * Conditional execution based on mock mode
 *
 * Executes mockFn when in mock mode, otherwise executes realFn
 *
 * @template T
 * @param {() => T | Promise<T>} mockFn - Function to execute in mock mode
 * @param {() => T | Promise<T>} realFn - Function to execute in real mode
 * @returns {T | Promise<T>} Result of the executed function
 *
 * @example
 * const data = await withMockMode(
 *   () => mockData,
 *   () => fetchRealData()
 * );
 */
export async function withMockMode<T>(
  mockFn: () => T | Promise<T>,
  realFn: () => T | Promise<T>
): Promise<T> {
  if (isMockModeEnabled()) {
    return await mockFn();
  }
  return await realFn();
}

/**
 * Log mock mode status (for debugging)
 */
export function logMockModeStatus(): void {
  const status = getMockModeStatus();
  console.log(`[Mock Mode] ${status.message} (MOCK_MODE=${status.envVar})`);
}

/**
 * Default export with all mock mode utilities
 */
const mockMode = {
  isMockModeEnabled,
  getMockModeStatus,
  withMockMode,
  logMockModeStatus,
};

export default mockMode;
