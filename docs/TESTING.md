# Testing Guide

This document provides comprehensive guidelines for testing the Meal Planner Agent application.

## Table of Contents

- [Testing Overview](#testing-overview)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Test Data & Fixtures](#test-data--fixtures)
- [Writing Tests](#writing-tests)
- [Continuous Integration](#continuous-integration)

---

## Testing Overview

The Meal Planner Agent uses a multi-layered testing strategy:

1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test interactions between services
3. **E2E Tests** - Test complete user workflows

### Test Environment

Tests run in isolated environments using:
- **Test Database** - Separate PostgreSQL instance
- **Test Redis** - Separate Redis instance
- **Mock Data** - Fixtures and mock handlers
- **Docker Compose** - Container orchestration for test dependencies

---

## Test Types

### Unit Tests

Test individual functions, classes, and components in isolation.

**Location**: `packages/*/tests/` or colocated with source files

**Tools**: Jest, React Testing Library

**Example**:
```typescript
// packages/core/tests/agent.test.ts
describe('MealPlannerAgent', () => {
  it('should generate meal plan with correct format', async () => {
    // Test implementation
  });
});
```

### Integration Tests

Test interactions between multiple services, database operations, and API endpoints.

**Location**: `tests/integration/`

**Tools**: Jest, Supertest

**Example**:
```typescript
// tests/integration/meal-plans.test.ts
describe('Meal Plans API', () => {
  it('should create and retrieve meal plan', async () => {
    // Test implementation
  });
});
```

### End-to-End (E2E) Tests

Test complete user workflows through the browser.

**Location**: `tests/e2e/`

**Tools**: Playwright

**Example**:
```typescript
// tests/e2e/meal-plan-generation.spec.ts
test('user can generate meal plan', async ({ page }) => {
  // Test implementation
});
```

---

## Running Tests

### Setup Test Environment

```bash
# Start test dependencies (database, redis)
pnpm test:docker:up

# Setup test database
pnpm test:setup
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in headed mode (see browser)
pnpm test:e2e:headed
```

### Cleanup

```bash
# Teardown test environment
pnpm test:teardown

# Stop test dependencies
pnpm test:docker:down
```

---

## Test Data & Fixtures

### Database Fixtures

Located in `packages/database/fixtures/`:
- `users.json` - Test user accounts
- `preferences.json` - User preferences
- `meal-plans.json` - Sample meal plans
- `meal-records.json` - Individual meals

**Loading Fixtures**:
```bash
pnpm db:seed:test
```

### Mock Data

Located in `apps/web/mocks/`:
- `data/` - Mock data modules
- `handlers/` - MSW request handlers

**Using Mocks**:
```typescript
import { mockMealPlans } from '@/mocks/data/meal-plans';
import { handlers } from '@/mocks/handlers';
```

### E2E Test Fixtures

Located in `tests/e2e/helpers/fixtures.ts`:
- Test credentials
- Sample form data
- Expected responses

---

## Writing Tests

### Best Practices

1. **Arrange-Act-Assert Pattern**
   ```typescript
   test('example', () => {
     // Arrange - setup test data
     const input = { ... };

     // Act - perform action
     const result = functionUnderTest(input);

     // Assert - verify result
     expect(result).toEqual(expected);
   });
   ```

2. **Use Descriptive Names**
   ```typescript
   // Good
   test('should generate 7-day meal plan when user has no dietary restrictions', ...)

   // Bad
   test('meal plan test', ...)
   ```

3. **Test One Thing**
   - Each test should verify a single behavior
   - Use multiple tests for multiple scenarios

4. **Clean Up After Tests**
   ```typescript
   afterEach(async () => {
     await cleanupTestData();
   });
   ```

5. **Use Test Utilities**
   ```typescript
   import { createTestUser, createTestMealPlan } from '@/tests/helpers';
   ```

### Test Coverage

Aim for:
- **80%+ code coverage** for core business logic
- **100% coverage** for critical paths (authentication, payment, data integrity)
- **Key user flows** covered by E2E tests

Check coverage:
```bash
pnpm test:coverage
```

---

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled nightly builds

### CI Pipeline

1. Lint code
2. Type check
3. Build packages
4. Run unit tests
5. Run integration tests
6. Run E2E tests
7. Generate coverage report

### Pre-commit Hooks

Automatically run before commits:
- Linting
- Type checking
- Unit tests for changed files

---

## Troubleshooting

### Common Issues

**Database connection errors**:
```bash
# Ensure test database is running
pnpm test:docker:up
```

**Stale test data**:
```bash
# Reset test database
pnpm test:teardown
pnpm test:setup
```

**E2E tests failing**:
```bash
# Update browser binaries
npx playwright install
```

**Port conflicts**:
```bash
# Check for running services
lsof -i :3000
lsof -i :5432
lsof -i :6379
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

## Contributing

When adding new features:
1. Write tests BEFORE implementation (TDD)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this documentation if needed
