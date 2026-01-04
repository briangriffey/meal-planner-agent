# Claude AI Developer Guide

This document provides guidelines for AI assistants (particularly Claude) working on the Meal Planner Agent codebase. Following these practices ensures code quality, prevents breakages, and maintains a professional development workflow.

## Table of Contents

- [Project Overview](#project-overview)
- [Before Making Changes](#before-making-changes)
- [Development Workflow](#development-workflow)
- [Testing Requirements](#testing-requirements)
- [Commit Guidelines](#commit-guidelines)
- [Common Commands](#common-commands)
- [Architecture](#architecture)
- [Best Practices](#best-practices)

---

## Project Overview

**Meal Planner Agent** is an AI-powered meal planning web application built with:
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js API Routes, BullMQ workers
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Redis + BullMQ for async job processing
- **AI**: Claude (Anthropic) for meal plan generation
- **Monorepo**: pnpm workspaces

### Workspace Structure

```
meal-planner-agent/
├── apps/
│   └── web/              # Next.js web application
│       └── mocks/        # Mock data and handlers for testing
├── packages/
│   ├── core/             # Shared agent logic and types
│   ├── database/         # Prisma schema and migrations
│   │   └── fixtures/     # Seed data for testing
│   └── queue/            # BullMQ workers and job processors
├── tests/
│   └── e2e/              # Playwright end-to-end tests
├── scripts/              # Utility scripts
└── docs/
    └── testing/          # Testing guides and documentation
```

---

## Before Making Changes

### 1. Understand the Context

- Read related code files thoroughly before making changes
- Check for dependencies and imports
- Review recent commits for context: `git log --oneline -10`

### 2. Check Current State

```bash
git status                    # Check for uncommitted changes
git diff                      # Review current changes
pnpm build                    # Ensure project builds
```

---

## Development Workflow

### 📋 Standard Workflow for Code Changes

Follow these steps **in order** for every code change:

#### 1. Make Code Changes
- Edit files as needed
- Update types/interfaces if schemas change
- Add comments for complex logic

#### 2. Build All Packages
```bash
pnpm build
```

**Critical**: This command MUST succeed before committing. It:
- Compiles TypeScript for all packages
- Validates types across the monorepo
- Builds Next.js production bundle
- Catches compilation errors

**Expected Output**: All packages should build successfully:
```
✓ @meal-planner/database build
✓ @meal-planner/core build
✓ @meal-planner/queue build
✓ @meal-planner/web build
```

#### 3. Run Relevant Tests

**Agent Testing** (if you modified core agent logic):
```bash
pnpm test:agent
```

**Email Testing** (if you modified email templates):
```bash
pnpm test:email
```

#### 4. Review Changes
```bash
git status                    # See what changed
git diff                      # Review all changes
git diff <specific-file>      # Review specific file
```

#### 5. Stage and Commit
```bash
git add <files>
git commit -m "descriptive message"
```

#### 6. Push to Remote
```bash
git push
```

---

## Testing Requirements

### Test Pyramid

The project uses a comprehensive testing strategy:

```
        /\
       /  \     E2E Tests (Playwright)
      /____\    - Full user workflows
     /      \   - Critical paths
    /________\  Integration Tests
   /          \ - API endpoints
  /____________\ - Database operations
 /              \ Unit Tests + Build
/______________  \ - TypeScript compilation
                  - Agent logic
                  - Email generation
```

### When to Run Tests

| Change Type | Required Tests | Optional Tests |
|------------|----------------|----------------|
| Database schema changes | `pnpm build` + verify migrations + `pnpm db:seed` | `pnpm test:integration` |
| Core agent logic | `pnpm build` + `pnpm test:agent` | `pnpm test:e2e` |
| Email templates | `pnpm build` + `pnpm test:email` | - |
| Queue/worker changes | `pnpm build` + manual worker test | `pnpm test:integration` |
| API routes | `pnpm build` + `pnpm test:integration` | `pnpm test:e2e` |
| UI components | `pnpm build` + `pnpm test:e2e` | - |
| Authentication | `pnpm build` + `pnpm test:e2e` | - |
| Critical workflows | `pnpm build` + `pnpm test:e2e` | `pnpm test:integration` |

### Build Testing (Level 1: REQUIRED)

**ALWAYS run before committing**:
```bash
pnpm build
```

This is the most critical test. A successful build ensures:
- No TypeScript errors
- No missing dependencies
- Proper type safety across packages
- Next.js can compile successfully

**Expected Output**: All packages should build successfully:
```
✓ @meal-planner/database build
✓ @meal-planner/core build
✓ @meal-planner/queue build
✓ @meal-planner/web build
```

### Unit Testing (Level 2)

#### Agent Testing

Test the meal planning agent end-to-end:
```bash
pnpm test:agent
```

This runs the agent with real Claude API and generates a sample meal plan.

**When to run**:
- After modifying `packages/core/src/MealPlannerAgent.ts`
- After changing prompt templates
- After updating agent configuration

#### Email Testing

Test email generation:
```bash
pnpm test:email
```

Generates a test email HTML file without sending.

**When to run**:
- After modifying `packages/core/src/EmailConnector.ts`
- After changing email templates
- After updating email configuration

### Integration Testing (Level 3)

Integration tests verify the system works with real services (database, Redis, etc.).

#### Setup Test Environment

```bash
# Start test infrastructure
pnpm test:docker:up

# Run setup script (creates database, seeds data)
pnpm test:setup
```

#### Run Integration Tests

```bash
# Run all integration tests
pnpm test:integration

# This includes:
# - API endpoint tests
# - Database operations
# - Job queue processing
# - Email generation (without sending)
```

#### Teardown Test Environment

```bash
# Stop test infrastructure
pnpm test:teardown

# Or stop Docker services
pnpm test:docker:down
```

**When to run**:
- After modifying API routes
- After changing database schema
- After updating queue/worker logic
- Before submitting pull requests

### E2E Testing (Level 4)

End-to-end tests use Playwright to verify complete user workflows in a real browser.

#### Available E2E Commands

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run with UI (interactive mode)
pnpm test:e2e:ui

# Run with visible browser
pnpm test:e2e:headed
```

#### E2E Test Coverage

Current E2E tests cover:
- **Authentication**: Registration, login, logout
- **Preferences**: Creating and updating user preferences
- **Meal Plan Generation**: Full workflow from preferences to meal plan
- **Meal Plan Management**: Viewing, deleting meal plans
- **Critical Paths**: Complete user journeys

#### E2E Test Structure

```
tests/e2e/
├── helpers/
│   └── fixtures.ts          # Shared test data and utilities
├── meal-plan-generation.spec.ts
└── preferences.spec.ts
```

**When to run**:
- After modifying UI components
- After changing user workflows
- After updating API endpoints used by the frontend
- Before deploying to production
- When validating critical path functionality

### Database Seeding

Seed the database with realistic test data:

```bash
# Seed database with fixture data
pnpm db:seed

# This loads data from:
# - packages/database/fixtures/users.json
# - packages/database/fixtures/preferences.json
# - packages/database/fixtures/meal-plans.json
# - packages/database/fixtures/meal-records.json
```

**When to run**:
- After database migrations
- When setting up a new development environment
- Before running integration tests
- When you need test data for manual testing

### Mock Data for Development

The project includes comprehensive mock data for frontend development:

```
apps/web/mocks/
├── data/
│   ├── users.ts          # Mock user accounts
│   ├── preferences.ts    # Mock user preferences
│   └── meal-plans.ts     # Mock meal plans and records
└── handlers/
    ├── auth.ts           # Mock authentication API
    ├── preferences.ts    # Mock preferences API
    └── meal-plans.ts     # Mock meal plan API
```

**Mock mode** allows frontend development without running backend services.

### Testing Best Practices

#### Pre-Commit Checklist

Before committing, ensure:
- [ ] `pnpm build` succeeds
- [ ] Relevant tests pass (see table above)
- [ ] No new TypeScript errors introduced
- [ ] No new console errors or warnings
- [ ] Changes are manually tested (if UI changes)

#### Pre-Release Checklist

Before releasing to production:
- [ ] All builds succeed: `pnpm build`
- [ ] Agent test passes: `pnpm test:agent`
- [ ] Email test passes: `pnpm test:email`
- [ ] Integration tests pass: `pnpm test:integration`
- [ ] E2E tests pass: `pnpm test:e2e`
- [ ] Database migrations tested
- [ ] Smoke tests pass (see docs/testing/SMOKE_TESTS.md)
- [ ] Regression tests pass (see docs/testing/REGRESSION_TESTS.md)

#### Continuous Integration

The project uses GitHub Actions for CI/CD:
- Build verification on all PRs
- Integration tests on all PRs
- E2E tests on main branch
- Automated deployment on successful tests

---

## Commit Guidelines

### Commit Message Format

```
<type>: <short summary>

<detailed description>

<footer with co-authorship>
```

### Example Commit Message

```
Fix ingredient rendering to handle object structure

Fixed React error "Objects are not valid as a React child" by properly
handling ingredients as objects with {item, amount} structure instead of
strings.

Changes:
- Added Ingredient interface with item and amount fields
- Updated Meal interface to use Ingredient[] instead of string[]
- Updated ingredient rendering to display "amount item" format

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Co-Authorship

Always include co-authorship footer for AI-assisted commits:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Common Commands

### Development

```bash
# Start web app (development mode)
pnpm dev

# Start worker (development mode)
pnpm dev:worker

# Run worker (production mode)
pnpm worker
```

### Building

```bash
# Build all packages
pnpm build

# Clean build (removes all artifacts)
pnpm build:clean

# Production build
pnpm build:production

# Docker build
pnpm build:docker
```

### Database

```bash
# Generate Prisma client
pnpm db:generate

# Create new migration (development)
pnpm db:migrate

# Apply migrations (production)
pnpm db:migrate:deploy

# Open Prisma Studio
pnpm db:studio

# Push schema without migration
pnpm db:push
```

### Testing

```bash
# Build testing (ALWAYS run before committing)
pnpm build

# Unit tests
pnpm test:agent         # Test meal planning agent
pnpm test:email         # Test email generation

# Integration tests
pnpm test:setup         # Setup test environment
pnpm test:integration   # Run integration tests
pnpm test:teardown      # Teardown test environment

# E2E tests
pnpm test:e2e           # Run E2E tests (headless)
pnpm test:e2e:ui        # Run E2E tests with UI
pnpm test:e2e:headed    # Run E2E tests with visible browser
```

### Docker

```bash
# Development services
pnpm docker:up          # Start all services
pnpm docker:down        # Stop all services

# Test services
pnpm test:docker:up     # Start test infrastructure
pnpm test:docker:down   # Stop test infrastructure
```

---

## Architecture

### Data Flow

```
User Request → Next.js API Route → BullMQ Queue → Worker
                                                     ↓
                                                 Agent (Claude)
                                                     ↓
                                              Save to Database
                                                     ↓
                                              Send Email
```

### Key Components

#### 1. Web App (`apps/web`)
- Next.js 14 with App Router
- Server-side rendering (SSR)
- API routes for CRUD operations
- NextAuth.js for authentication

#### 2. Core (`packages/core`)
- `MealPlannerAgent`: Main agent logic
- `EmailConnector`: Email generation
- `DatabaseMealHistoryService`: Meal history tracking
- Type definitions

#### 3. Database (`packages/database`)
- Prisma schema
- Migrations
- Database client

#### 4. Queue (`packages/queue`)
- BullMQ workers
- Job processors
- Schedule management

### Database Schema

**Key Tables**:
- `users` - User accounts (NextAuth)
- `user_preferences` - Meal preferences and settings
- `meal_plans` - Meal plan metadata and status
- `meal_records` - Individual meal data (normalized)

**Important**: `meal_records` is the source of truth for meal data, not the deprecated `meals` JSON field.

---

## Testing Infrastructure

### Test Environments

The project supports multiple test environments:

#### 1. Local Development
- Uses Docker Compose for services
- Database: PostgreSQL (local)
- Redis: Local instance
- Configuration: `.env.local`

#### 2. Test Environment
- Uses `docker-compose.test.yml`
- Isolated database: PostgreSQL (test)
- Isolated Redis instance
- Configuration: `.env.test`
- Automatically cleaned between test runs

#### 3. CI/CD Environment
- GitHub Actions runners
- Ephemeral containers
- Automated testing on PRs and merges

### Playwright Configuration

E2E tests use Playwright with the following configuration:

```typescript
// playwright.config.ts
{
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
}
```

**Key Features**:
- Parallel execution for faster tests
- Automatic retries on failure (CI only)
- Screenshots and traces on failure
- Multi-browser testing (Chrome, Firefox, Safari)

### Fixture Data

The project includes comprehensive fixture data for testing:

**Location**: `packages/database/fixtures/`

**Files**:
- `users.json` - 5 test users with varied history
- `preferences.json` - User preferences with different configurations
- `meal-plans.json` - 20+ meal plans in various states
- `meal-records.json` - 140+ realistic meal records

**Loading Fixtures**:
```bash
pnpm db:seed
```

This command:
1. Validates DATABASE_URL
2. Clears existing data (test mode only)
3. Loads fixture data in correct order
4. Maintains referential integrity
5. Logs progress and errors

### Mock Data System

For frontend development without backend services:

**Location**: `apps/web/mocks/`

**Structure**:
```
mocks/
├── data/           # Mock data modules
│   ├── users.ts
│   ├── preferences.ts
│   └── meal-plans.ts
└── handlers/       # MSW request handlers
    ├── auth.ts
    ├── preferences.ts
    └── meal-plans.ts
```

**Mock Users**:
- `brian@test.com` - Admin with extensive history
- `allison@test.com` - Regular user with some history
- `newuser@test.com` - New user with no history

**Usage**:
Mock mode is automatically enabled in development when backend services are unavailable.

### Test Scripts

**Setup Scripts**:
- `scripts/test-setup.sh` - Setup test environment
- `scripts/test-teardown.sh` - Cleanup test environment
- `scripts/run-integration-tests.sh` - Run full integration suite

**Test Configuration**:
- `docker-compose.test.yml` - Test infrastructure
- `playwright.config.ts` - E2E test configuration
- `.env.test` - Test environment variables

### Testing Documentation

Comprehensive testing guides are available:

- `docs/testing/SMOKE_TESTS.md` - Quick smoke test procedures
- `docs/testing/REGRESSION_TESTS.md` - Pre-release regression suite
- `docs/testing/TESTING.md` - Complete testing guide (coming soon)

---

## Best Practices

### 1. Always Build Before Committing

```bash
pnpm build  # MUST succeed
```

### 2. Update Related Files Together

When changing a schema:
- Update Prisma schema
- Create migration
- Update TypeScript types
- Update queries
- Update UI components
- Build and test

### 3. Handle JSON Types Properly

Prisma JSON fields require double casting:
```typescript
// Correct
const data = (record.data as unknown as MyType[])

// Incorrect (TypeScript error)
const data = record.data as MyType[]
```

### 4. Use Proper Error Handling

```typescript
try {
  // Operation
} catch (error) {
  console.error('Context:', error);
  // Don't swallow errors silently
}
```

### 5. Follow TypeScript Best Practices

- Define interfaces for complex types
- Avoid `any` - use `unknown` and type guards
- Use optional chaining: `record?.field`
- Use nullish coalescing: `value ?? default`

### 6. Database Changes Require Migrations

Never modify the Prisma schema without creating a migration:

```bash
# After editing schema.prisma
pnpm db:migrate

# Name it descriptively
# Example: "add_fiber_to_meal_records"
```

### 7. Keep Packages in Sync

After changing shared code:
```bash
pnpm --filter @meal-planner/core build
pnpm --filter @meal-planner/queue build
pnpm --filter @meal-planner/web build
```

### 8. Review Generated Files

Some files are auto-generated:
- `packages/database/prisma/client/` - Generated by Prisma
- `apps/web/.next/` - Generated by Next.js
- `packages/*/dist/` - Generated by TypeScript

**Never** commit these files.

### 9. Use TodoWrite Tool

For complex tasks, use the TodoWrite tool to track progress:
- Break down tasks into steps
- Mark tasks as in_progress/completed
- Don't mark completed until fully done

### 10. Test End-to-End When Possible

For major changes:
1. Start the app: `pnpm dev`
2. Start the worker: `pnpm worker` (in another terminal)
3. Generate a meal plan through the UI
4. Verify it works end-to-end

---

## Common Issues and Solutions

### Issue: Build fails with TypeScript errors

**Solution**:
1. Check for missing types
2. Verify imports are correct
3. Run `pnpm db:generate` if database types changed
4. Check for circular dependencies

### Issue: Prisma client out of sync

**Solution**:
```bash
pnpm db:generate
pnpm build
```

### Issue: Migration fails

**Solution**:
1. Check database is running
2. Verify DATABASE_URL in .env
3. Check migration SQL syntax
4. Ensure no conflicting migrations

### Issue: Worker can't connect to Redis

**Solution**:
1. Ensure Redis is running
2. Check REDIS_URL in .env
3. Verify network connectivity

---

## Emergency Procedures

### Rollback Last Commit

```bash
git revert HEAD
git push
```

### Rollback Database Migration

```bash
# In development only!
pnpm db:migrate:reset

# In production, create a new migration to undo changes
```

### Clean Build (Nuclear Option)

```bash
pnpm build:clean
```

---

## Questions?

- Check `README.md` for setup instructions
- Review recent commits for examples: `git log --oneline -20`
- Look at existing code patterns
- When in doubt, ask the user for clarification

---

## Remember

✅ **ALWAYS** run `pnpm build` before committing
✅ Test your changes appropriately (see Testing Requirements)
✅ Run E2E tests for UI/workflow changes: `pnpm test:e2e`
✅ Run integration tests for API changes: `pnpm test:integration`
✅ Follow commit message conventions
✅ Update documentation when needed
✅ Don't commit generated files
✅ Use TypeScript properly (no `any`)
✅ Seed database after schema changes: `pnpm db:seed`

❌ **NEVER** commit without building
❌ Don't skip migrations for schema changes
❌ Don't modify generated files
❌ Don't use `any` type unless absolutely necessary
❌ Don't commit directly to main without testing
❌ Don't skip E2E tests for critical path changes
❌ Don't deploy without passing all test levels
