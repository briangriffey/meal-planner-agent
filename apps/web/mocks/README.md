# Mock Data System

This directory contains mock data and handlers for testing and development using [Mock Service Worker (MSW)](https://mswjs.io/).

## Overview

The mock data system allows you to run the application without external dependencies like databases, Redis, or external APIs. This is useful for:

- E2E testing with Playwright
- Frontend development without backend
- Demo environments
- CI/CD pipelines

## Structure

```
mocks/
├── data/              # Mock data fixtures
│   ├── users.ts       # User accounts
│   ├── preferences.ts # User preferences
│   └── meal-plans.ts  # Meal plans and records
├── handlers/          # MSW request handlers
│   ├── auth.ts        # Authentication endpoints
│   ├── preferences.ts # Preferences endpoints
│   ├── meal-plans.ts  # Meal plan endpoints
│   └── index.ts       # Export all handlers
├── index.ts           # Main export file
└── README.md          # This file
```

## Enabling Mock Mode

### Environment Variable

Set the `MOCK_MODE` environment variable to `"true"`:

```bash
# .env or .env.test
MOCK_MODE="true"
```

### In Code

Use the `lib/mock-mode.ts` utilities:

```typescript
import { isMockModeEnabled, withMockMode } from "@/lib/mock-mode";

// Check if mock mode is enabled
if (isMockModeEnabled()) {
  console.log("Running in mock mode");
}

// Conditional execution
const data = await withMockMode(
  () => mockData,        // Executed when MOCK_MODE=true
  () => fetchRealData()  // Executed when MOCK_MODE=false
);
```

## Using in API Routes

To add mock mode support to an API route:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { isMockModeEnabled } from "@/lib/mock-mode";
import { mockMealPlans } from "@/mocks/data/meal-plans";

export async function GET(request: NextRequest) {
  // Return mock data if mock mode is enabled
  if (isMockModeEnabled()) {
    return NextResponse.json(mockMealPlans);
  }

  // Otherwise, fetch real data
  const realData = await fetchFromDatabase();
  return NextResponse.json(realData);
}
```

## Using in Tests

### Playwright E2E Tests

Mock mode is automatically enabled in E2E tests via `.env.test`:

```typescript
// tests/e2e/meal-plans.spec.ts
import { test, expect } from "@playwright/test";

test("should display meal plans", async ({ page }) => {
  await page.goto("/dashboard");

  // Mock data will be returned automatically
  await expect(page.locator(".meal-plan")).toHaveCount(3);
});
```

### Unit/Integration Tests with MSW

For unit or integration tests, set up MSW manually:

```typescript
import { setupServer } from "msw/node";
import { handlers } from "@/mocks";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("should fetch meal plans", async () => {
  const response = await fetch("/api/meal-plans");
  const data = await response.json();
  expect(data).toHaveLength(3);
});
```

## Mock Data

### Users

Default mock users (password: `Password123!`):

- `brian@test.com` - Full preferences, multiple meal plans
- `jane@test.com` - Basic preferences, one meal plan
- `john@test.com` - No preferences, no meal plans

### Preferences

Pre-configured dietary preferences including:
- Dietary type (vegetarian, vegan, etc.)
- Allergies and restrictions
- Cooking time preferences
- Cuisine preferences

### Meal Plans

Sample meal plans with:
- Multiple days of meals
- Breakfast, lunch, dinner, and snacks
- Nutritional information
- Ingredients and instructions

## Adding New Mock Data

### 1. Add Data Fixture

Create or update a file in `data/`:

```typescript
// data/my-resource.ts
export const mockMyResource = [
  {
    id: "1",
    name: "Example",
    // ... other fields
  },
];
```

### 2. Create Handler

Create or update a handler in `handlers/`:

```typescript
// handlers/my-resource.ts
import { http, HttpResponse } from "msw";
import { mockMyResource } from "../data/my-resource";

export const myResourceHandlers = [
  http.get("/api/my-resource", () => {
    return HttpResponse.json(mockMyResource);
  }),
];
```

### 3. Export Handler

Update `handlers/index.ts`:

```typescript
import { myResourceHandlers } from "./my-resource";

export const handlers = [
  ...authHandlers,
  ...preferencesHandlers,
  ...mealPlanHandlers,
  ...myResourceHandlers, // Add your handlers
];
```

## Mock Authentication

In mock mode, authentication is simplified:

- **Password**: All users accept `Password123!`
- **Session**: Stored in-memory (cleared on server restart)
- **Default User**: `brian@test.com` is logged in by default if no session

### Auth Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/callback/credentials` - Login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout
- `GET /api/auth/csrf` - Get CSRF token
- `GET /api/auth/providers` - Get auth providers

## Troubleshooting

### Mock mode not working

1. Check environment variable: `echo $MOCK_MODE`
2. Ensure it's set to exactly `"true"` (string, not boolean)
3. Restart the application after changing `.env`

### Getting real data instead of mock data

1. Verify `MOCK_MODE="true"` in your `.env` or `.env.test`
2. Check that the API route uses `isMockModeEnabled()` check
3. Ensure handlers are properly exported in `handlers/index.ts`

### Mock data not updating

1. Clear MSW cache: `server.resetHandlers()`
2. Restart the test runner
3. Check that data fixtures are properly exported

## Best Practices

1. **Keep mock data realistic**: Match production data structure
2. **Cover edge cases**: Include error scenarios in mock data
3. **Keep handlers simple**: Avoid complex logic in handlers
4. **Document mock users**: Update this README when adding users
5. **Version mock data**: Update mock data when schemas change

## References

- [MSW Documentation](https://mswjs.io/)
- [Playwright Testing](https://playwright.dev/)
- [Mock Mode Utilities](/apps/web/lib/mock-mode.ts)
