# Testing Guide

This is the comprehensive testing guide for the Meal Planner Agent application. This document serves as the main entry point for all testing-related documentation and practices.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Testing Strategy](#testing-strategy)
4. [Test Types](#test-types)
5. [Running Tests](#running-tests)
6. [Test Environment Setup](#test-environment-setup)
7. [Writing Tests](#writing-tests)
8. [Continuous Integration](#continuous-integration)
9. [Troubleshooting](#troubleshooting)
10. [Additional Resources](#additional-resources)

---

## Overview

The Meal Planner Agent uses a multi-layered testing strategy to ensure quality and reliability:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components and services
- **E2E Tests**: Test complete user workflows from end to end
- **Manual Tests**: Critical path testing and exploratory testing
- **Smoke Tests**: Quick health checks for deployments
- **Regression Tests**: Pre-release validation suite

### Testing Philosophy

1. **Test at the right level**: Unit tests for logic, E2E tests for workflows
2. **Favor integration over mocks**: Use real services when practical
3. **Keep tests maintainable**: DRY, readable, and well-documented
4. **Fast feedback**: Run quick tests frequently, slow tests in CI
5. **Realistic data**: Use production-like test data and fixtures

---

## Quick Start

### First-Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Install Playwright browsers
pnpm exec playwright install

# 3. Copy environment files
cp .env.example .env.test

# 4. Start test environment
./scripts/test-setup.sh

# 5. Run tests
pnpm test:e2e
```

### Daily Testing Workflow

```bash
# Start test environment (if not already running)
./scripts/test-setup.sh

# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm exec playwright test tests/e2e/auth.spec.ts

# Run tests in headed mode (see browser)
pnpm exec playwright test --headed

# Stop test environment
./scripts/test-teardown.sh
```

---

## Testing Strategy

### Testing Pyramid

```
           /\
          /  \         ← E2E Tests (Few, Slow, Comprehensive)
         /____\
        /      \       ← Integration Tests (Moderate)
       /________\
      /          \     ← Unit Tests (Many, Fast, Focused)
     /____________\
```

### Test Coverage Goals

- **Critical Paths**: 100% coverage (auth, meal generation, preferences)
- **Business Logic**: 80%+ coverage (agents, calculators, validators)
- **UI Components**: 60%+ coverage (key interactions)
- **Edge Cases**: Cover known failure scenarios

### When to Use Each Test Type

| Test Type | Use When | Example |
|-----------|----------|---------|
| **Unit** | Testing pure functions, utilities | Calorie calculator, date formatter |
| **Integration** | Testing API routes, database queries | User creation, meal plan storage |
| **E2E** | Testing user workflows | Login → Preferences → Generate Plan |
| **Manual** | Testing UX, design, edge cases | Visual regression, accessibility |
| **Smoke** | Verifying deployment health | All services up, basic API calls work |
| **Regression** | Pre-release validation | All critical paths still working |

---

## Test Types

### 1. End-to-End (E2E) Tests

**Location**: `/tests/e2e/`

**Tool**: [Playwright](https://playwright.dev/)

**Purpose**: Test complete user workflows in a browser

**Run**:
```bash
pnpm test:e2e                    # All E2E tests
pnpm test:e2e:headed             # With browser visible
pnpm test:e2e:debug              # With debugger
pnpm exec playwright test auth.spec.ts  # Specific file
```

**Examples**:
- User registration and login flow
- Generating a meal plan
- Updating preferences
- Viewing meal plan history

**Writing E2E Tests**: See [Writing Tests](#writing-tests) section

---

### 2. Unit Tests

**Location**: `/packages/*/src/**/*.test.ts`

**Tool**: Jest or Vitest (to be implemented)

**Purpose**: Test individual functions and classes in isolation

**Run**:
```bash
pnpm test:unit                   # All unit tests
pnpm test:unit --watch           # Watch mode
pnpm test:unit -- --coverage     # With coverage report
```

**Examples**:
- Agent message formatting
- Email template generation
- Nutrition calculations
- Date/time utilities

---

### 3. Integration Tests

**Location**: `/tests/integration/`

**Tool**: Jest with test database (to be implemented)

**Purpose**: Test interactions between components

**Run**:
```bash
pnpm test:integration            # All integration tests
```

**Examples**:
- API routes with database
- Queue jobs with Redis
- Email sending with SMTP
- Database migrations

---

### 4. Manual Testing

**Location**: [`/docs/testing/MANUAL_CHECKLIST.md`](./testing/MANUAL_CHECKLIST.md)

**Purpose**: Human validation of UX, design, and complex scenarios

**When**: Before releases, after UI changes, for exploratory testing

**Guide**: See [Manual Testing Checklist](./testing/MANUAL_CHECKLIST.md)

---

### 5. Smoke Tests

**Location**: [`/scripts/smoke-test-*.sh`](./testing/SMOKE_TESTS.md)

**Purpose**: Quick health checks after deployment

**Run**:
```bash
./scripts/smoke-test-web.sh      # Test web app
./scripts/smoke-test-worker.sh   # Test worker
```

**Guide**: See [Smoke Testing Guide](./testing/SMOKE_TESTS.md)

---

### 6. Regression Tests

**Location**: [`/docs/testing/REGRESSION_TESTS.md`](./testing/REGRESSION_TESTS.md)

**Purpose**: Pre-release validation of critical paths

**When**: Before production deployments, after major changes

**Guide**: See [Regression Testing Guide](./testing/REGRESSION_TESTS.md)

---

## Running Tests

### Prerequisites

1. **Docker**: All services running in test mode
2. **Node.js**: v18+ with pnpm installed
3. **Environment**: `.env.test` configured
4. **Database**: Test database seeded with fixtures

### Local Testing

#### Option 1: Using Test Environment (Recommended)

```bash
# Start complete test environment
./scripts/test-setup.sh

# Run E2E tests
pnpm test:e2e

# Clean up when done
./scripts/test-teardown.sh
```

**What this does**:
1. Starts Docker containers (PostgreSQL, Redis, Web, Worker)
2. Runs database migrations
3. Seeds test data
4. Verifies all services are healthy
5. Runs smoke tests

#### Option 2: Manual Setup

```bash
# 1. Start test services
docker-compose -f docker-compose.test.yml up -d

# 2. Wait for services (or use test-setup.sh)
sleep 10

# 3. Run migrations
DATABASE_URL=postgresql://mealplanner:test@localhost:5433/meal_planner_test pnpm db:migrate:deploy

# 4. Seed database
DATABASE_URL=postgresql://mealplanner:test@localhost:5433/meal_planner_test pnpm db:seed

# 5. Run tests
pnpm test:e2e
```

### Running in Docker

All tests can run inside Docker containers for consistency:

```bash
# Build test containers
docker-compose -f docker-compose.test.yml build

# Run E2E tests in container
docker-compose -f docker-compose.test.yml run web-test pnpm test:e2e

# Run with CI reporter
docker-compose -f docker-compose.test.yml run web-test pnpm test:e2e --reporter=json
```

### CI/CD Testing

Tests run automatically in CI/CD pipelines:

```bash
# GitHub Actions workflow
.github/workflows/e2e-tests.yml
```

**CI Process**:
1. Checkout code
2. Setup Node.js and pnpm
3. Install dependencies
4. Start test environment
5. Run tests with retries
6. Upload test reports and artifacts
7. Clean up environment

---

## Test Environment Setup

### Environment Variables

Create `.env.test` from `.env.example`:

```bash
# Test Database (different port than dev)
DATABASE_URL="postgresql://mealplanner:test@localhost:5433/meal_planner_test"

# Test Redis (different port than dev)
REDIS_URL="redis://localhost:6380"

# Test Web App (different port than dev)
NEXTAUTH_URL="http://localhost:3001"

# Test Mode
NODE_ENV="test"

# Mock Mode (optional - use mock data instead of real services)
MOCK_MODE="true"
```

### Docker Compose

Two compose files:

1. **`docker-compose.yml`**: Development environment (ports 5432, 6379, 3000)
2. **`docker-compose.test.yml`**: Test environment (ports 5433, 6380, 3001)

**Isolation**: Test environment is completely isolated from development

### Test Fixtures

Test data is located in `/packages/database/fixtures/`:

- `users.json`: Test user accounts
- `preferences.json`: User preferences
- `meal-plans.json`: Sample meal plans
- `meal-records.json`: Individual meals

**Seeding**:
```bash
DATABASE_URL=postgresql://mealplanner:test@localhost:5433/meal_planner_test pnpm db:seed
```

### Mock Mode

Enable mock mode to use mock data instead of real services:

```bash
# .env.test
MOCK_MODE="true"
```

**Benefits**:
- No external API calls (Anthropic Claude)
- No real email sending
- Faster test execution
- Deterministic results

**See**: `/apps/web/mocks/README.md` for mock data documentation

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

### E2E Test Structure

```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { VALID_USER, ROUTES } from './helpers/fixtures';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate user before each test
    await login(page, VALID_USER.email, VALID_USER.password);
  });

  test('should perform action', async ({ page }) => {
    // Arrange: Navigate to page
    await page.goto(ROUTES.myFeature);

    // Act: Perform action
    await page.click('button:has-text("Do Something")');

    // Assert: Verify result
    await expect(page.locator('.result'))
      .toContainText('Success');
  });
});
```

### Authentication Helpers

Use authentication helpers for cleaner tests:

```typescript
import {
  login,
  register,
  logout,
  getAuthenticatedPage,
  isAuthenticated,
} from './helpers/auth';

// Login
await login(page, 'user@example.com', 'Password123!');

// Register
await register(page, {
  name: 'New User',
  email: 'new@example.com',
  password: 'SecurePass123!',
});

// Logout
await logout(page);

// Get authenticated page
const authenticatedPage = await getAuthenticatedPage(
  browser,
  'user@example.com',
  'Password123!'
);

// Check if authenticated
if (!(await isAuthenticated(page))) {
  await login(page, email, password);
}
```

### Test Data Fixtures

Use shared fixtures for consistent test data:

```typescript
import {
  VALID_USER,
  ROUTES,
  SELECTORS,
  TIMEOUTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './helpers/fixtures';

// Navigate
await page.goto(ROUTES.dashboard);

// Fill form
await page.fill(SELECTORS.emailInput, VALID_USER.email);

// Wait with timeout
await page.waitForSelector('.result', { timeout: TIMEOUTS.apiResponse });

// Verify error
await expect(page.locator('.error'))
  .toContainText(ERROR_MESSAGES.invalidEmail);
```

### Best Practices

1. **Use Page Objects**: Extract complex page interactions
2. **DRY Principle**: Reuse helpers and fixtures
3. **Clear Names**: Test names should describe the behavior
4. **Arrange-Act-Assert**: Structure tests clearly
5. **Independent Tests**: Each test should work in isolation
6. **Wait Strategically**: Use `waitForSelector`, not arbitrary delays
7. **Descriptive Assertions**: Use meaningful error messages
8. **Clean Up**: Reset state after tests

### Example: Complete Test File

```typescript
import { test, expect } from '@playwright/test';
import { login, logout } from './helpers/auth';
import { VALID_USER, ROUTES, SELECTORS } from './helpers/fixtures';

test.describe('Preferences Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, VALID_USER.email, VALID_USER.password);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('should update meal preferences', async ({ page }) => {
    // Navigate to preferences
    await page.goto(ROUTES.preferences);

    // Update preferences
    await page.fill(SELECTORS.mealsPerDayInput, '4');
    await page.click(SELECTORS.savePreferencesButton);

    // Verify success
    await expect(page.locator('.success-message'))
      .toContainText('Preferences saved successfully');

    // Reload and verify persistence
    await page.reload();
    const mealsInput = page.locator(SELECTORS.mealsPerDayInput);
    await expect(mealsInput).toHaveValue('4');
  });
});
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

#### Tests Timing Out

**Problem**: Tests fail with timeout errors

**Solutions**:
1. Increase timeout in test: `{ timeout: 60000 }`
2. Check if services are running: `docker-compose ps`
3. Verify database connection: `psql` to test database
4. Check worker logs: `docker-compose logs worker-test`

#### Database Connection Errors

**Problem**: `connection refused` or `ECONNREFUSED`

**Solutions**:
1. Verify Docker is running: `docker info`
2. Check if PostgreSQL is healthy: `docker-compose ps`
3. Verify port 5433 is available: `lsof -i :5433`
4. Check DATABASE_URL in `.env.test`

#### Mock Data Not Loading

**Problem**: Tests expect mock data but get real data (or vice versa)

**Solutions**:
1. Check `MOCK_MODE` in `.env.test`
2. Restart test environment: `./scripts/test-teardown.sh && ./scripts/test-setup.sh`
3. Verify mock handlers are exported: Check `/apps/web/mocks/index.ts`

#### Playwright Browser Not Found

**Problem**: `Executable doesn't exist` error

**Solution**:
```bash
pnpm exec playwright install
```

#### Port Already in Use

**Problem**: `EADDRINUSE` error

**Solutions**:
1. Stop development environment: `docker-compose down`
2. Find process using port: `lsof -i :3001`
3. Kill process: `kill -9 <PID>`
4. Change test port in `docker-compose.test.yml`

#### Tests Pass Locally But Fail in CI

**Problem**: Tests work on your machine but fail in CI

**Solutions**:
1. Run in Docker locally: `docker-compose -f docker-compose.test.yml run web-test pnpm test:e2e`
2. Check for hardcoded paths or URLs
3. Verify environment variables in CI
4. Check for timezone or locale differences
5. Enable retries for flaky tests

### Debug Mode

Run tests in debug mode to investigate failures:

```bash
# Headed mode (see browser)
pnpm exec playwright test --headed

# Debug mode (step through)
pnpm exec playwright test --debug

# Specific test with debug
pnpm exec playwright test auth.spec.ts --debug
```

### Viewing Test Reports

```bash
# Generate HTML report
pnpm exec playwright show-report

# Open specific report
open playwright-report/index.html
```

### Logs

View logs for debugging:

```bash
# All services
docker-compose -f docker-compose.test.yml logs

# Specific service
docker-compose -f docker-compose.test.yml logs web-test

# Follow logs
docker-compose -f docker-compose.test.yml logs -f worker-test
```

---

## Additional Resources

### Documentation

- [Manual Testing Checklist](./testing/MANUAL_CHECKLIST.md)
- [Smoke Testing Guide](./testing/SMOKE_TESTS.md)
- [Regression Testing Guide](./testing/REGRESSION_TESTS.md)
- [Mock Data Documentation](/apps/web/mocks/README.md)
- [CLAUDE.md Developer Guide](/CLAUDE.md)

### External Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)

### Scripts Reference

| Script | Location | Purpose |
|--------|----------|---------|
| `test-setup.sh` | `/scripts/` | Start test environment |
| `test-teardown.sh` | `/scripts/` | Stop test environment |
| `smoke-test-web.sh` | `/scripts/` | Quick web app health check |
| `smoke-test-worker.sh` | `/scripts/` | Quick worker health check |

### Commands Reference

```bash
# Environment
./scripts/test-setup.sh          # Start test environment
./scripts/test-teardown.sh       # Stop test environment

# E2E Tests
pnpm test:e2e                    # Run all E2E tests
pnpm test:e2e:headed             # Run with visible browser
pnpm test:e2e:debug              # Run in debug mode
pnpm exec playwright test <file> # Run specific file

# Smoke Tests
./scripts/smoke-test-web.sh      # Test web app
./scripts/smoke-test-worker.sh   # Test worker

# Database
pnpm db:seed                     # Seed test database
pnpm db:migrate:deploy           # Run migrations

# Docker
docker-compose -f docker-compose.test.yml up -d    # Start
docker-compose -f docker-compose.test.yml down     # Stop
docker-compose -f docker-compose.test.yml ps       # Status
docker-compose -f docker-compose.test.yml logs -f  # Logs

# Reports
pnpm exec playwright show-report # View test report
```

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review test logs: `docker-compose logs`
3. Search existing GitHub issues
4. Ask in team chat
5. Create a new GitHub issue with:
   - Description of the problem
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)

---

## Contributing

When adding new tests:

1. Follow existing patterns and conventions
2. Use shared helpers and fixtures
3. Add documentation for new test types
4. Update this guide if adding new testing capabilities
5. Ensure tests pass in CI before merging

---

**Last Updated**: 2026-01-03

**Maintained By**: Development Team
