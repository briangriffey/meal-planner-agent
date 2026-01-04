# Regression Tests

**Purpose**: Comprehensive pre-release validation to prevent regressions
**Time to Complete**: 30-60 minutes (manual) or 15-20 minutes (automated)
**When to Run**: Before production deployments, major releases, or after significant changes

---

## Overview

Regression tests verify that new changes haven't broken existing functionality. This is a **comprehensive test suite** that validates all critical user workflows, edge cases, and integration points.

**Think of regression tests as your safety net before deployment.**

Unlike smoke tests (quick sanity checks), regression tests thoroughly validate:
- ✅ Complete user workflows
- ✅ All CRUD operations
- ✅ Edge cases and error handling
- ✅ Integration between components
- ✅ Multi-user scenarios
- ✅ Email and notification systems

---

## Automated Regression Tests

### Quick Start

Run the complete automated regression suite:

```bash
# Setup test environment
pnpm test:setup

# Run all regression tests
pnpm build                    # Build verification
pnpm test:agent              # Agent tests
pnpm test:email              # Email tests
pnpm test:integration        # API integration tests
pnpm test:e2e                # End-to-end tests

# Teardown
pnpm test:teardown
```

**Expected Duration**: 15-20 minutes

---

## Test Categories

### 1. Build Verification Tests (BVT)

**Purpose**: Ensure code compiles and builds correctly

**Commands**:
```bash
pnpm build
```

**What it tests**:
- ✅ TypeScript compilation (all packages)
- ✅ Next.js production build
- ✅ No missing dependencies
- ✅ Type safety across monorepo

**Success Criteria**:
- All packages build without errors
- No TypeScript errors
- Build output generated correctly

**Common Failures**:
- TypeScript type errors
- Missing imports
- Circular dependencies
- Invalid Prisma schema

---

### 2. Agent Tests

**Purpose**: Verify meal planning agent functionality

**Commands**:
```bash
pnpm test:agent
```

**What it tests**:
- ✅ Agent can generate meal plans
- ✅ Meal plans meet nutritional requirements
- ✅ Meal plans respect dietary restrictions
- ✅ Agent handles iteration and refinement
- ✅ Output format is valid

**Success Criteria**:
- Agent generates 7 meals
- Each meal has complete nutrition data
- Meals match dietary preferences
- No duplicate meals
- Valid JSON output

**Common Failures**:
- Claude API key invalid
- Network connectivity issues
- Agent prompt issues
- Invalid response format

---

### 3. Email Tests

**Purpose**: Verify email generation and formatting

**Commands**:
```bash
pnpm test:email
```

**What it tests**:
- ✅ Email HTML generation
- ✅ Proper template rendering
- ✅ Meal data formatting
- ✅ Shopping list generation
- ✅ Email styling (responsive design)

**Success Criteria**:
- HTML email generated
- All meals rendered correctly
- Shopping list is accurate
- Email renders in common clients
- No broken images or styles

**Common Failures**:
- Template syntax errors
- Missing meal data
- Incorrect nutrition calculations
- Broken CSS

---

### 4. Integration Tests

**Purpose**: Verify API endpoints and database operations

**Commands**:
```bash
# Setup
pnpm test:docker:up
pnpm test:setup

# Run tests
pnpm test:integration

# Cleanup
pnpm test:teardown
pnpm test:docker:down
```

**What it tests**:
- ✅ All API endpoints respond correctly
- ✅ Database CRUD operations
- ✅ Authentication flows
- ✅ User preferences management
- ✅ Meal plan creation and retrieval
- ✅ Job queue operations
- ✅ Multi-user isolation

**Test Scenarios**:

#### User Management
- Create user account
- Login with credentials
- Update user profile
- Session management
- Logout

#### Preferences Management
- Create initial preferences
- Update meal count
- Update dietary restrictions
- Update schedule settings
- Toggle HEB integration

#### Meal Plan Lifecycle
- Generate meal plan (create job)
- Check job status (PENDING → PROCESSING → COMPLETED)
- Retrieve completed meal plan
- View individual meals
- Delete meal plan

#### Error Handling
- Invalid authentication
- Missing required fields
- Duplicate entries
- Non-existent resources (404)
- Permission violations (403)

**Success Criteria**:
- All API endpoints return expected status codes
- Data persists correctly to database
- Foreign key relationships maintained
- Error responses are informative
- Multi-user data is properly isolated

---

### 5. End-to-End (E2E) Tests

**Purpose**: Verify complete user workflows in a real browser

**Commands**:
```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI (interactive mode)
pnpm test:e2e:ui

# Run specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

**What it tests**:
- ✅ User registration flow
- ✅ Login and authentication
- ✅ Preferences creation and editing
- ✅ Meal plan generation workflow
- ✅ Viewing meal plans and recipes
- ✅ Deleting meal plans
- ✅ Schedule configuration
- ✅ Multi-page workflows

**Test Scenarios**:

#### New User Journey
1. Register new account
2. Login with credentials
3. Create initial preferences
4. Generate first meal plan
5. View meal plan and recipes
6. Logout

#### Returning User Journey
1. Login with existing account
2. View dashboard with meal history
3. Update preferences
4. Generate new meal plan
5. View and compare with previous plans
6. Delete old meal plan

#### Edge Cases
- Form validation errors
- Concurrent meal plan generation
- Network failures and retries
- Session expiration
- Browser back/forward navigation

**Success Criteria**:
- All user workflows complete without errors
- Pages render correctly (no layout issues)
- Forms validate properly
- Loading states display correctly
- Error messages are user-friendly
- Tests pass in all browsers (Chrome, Firefox, Safari)

---

## Manual Regression Test Checklist

Use this checklist for manual validation or to supplement automated tests:

### Critical Path Testing

#### Path 1: New User Registration → First Meal Plan

- [ ] **Register**
  - Navigate to `/register`
  - Enter email and password
  - Submit form
  - Verify redirect to preferences

- [ ] **Set Preferences**
  - Select meal count (7)
  - Set serving size (4)
  - Add dietary restrictions
  - Set nutritional goals
  - Enable HEB integration
  - Save preferences

- [ ] **Generate Meal Plan**
  - Click "Generate Meal Plan"
  - Verify job creation
  - Wait for completion (PROCESSING → COMPLETED)
  - Verify redirect to meal plan view

- [ ] **View Meal Plan**
  - Verify 7 meals displayed
  - Check nutrition data for each meal
  - Verify ingredients and instructions
  - Check shopping list generation

#### Path 2: Returning User → Update Preferences → New Plan

- [ ] **Login**
  - Navigate to `/login`
  - Enter credentials
  - Verify redirect to dashboard

- [ ] **View Dashboard**
  - Verify past meal plans displayed
  - Check meal plan status indicators
  - Verify dates are correct

- [ ] **Update Preferences**
  - Navigate to `/preferences`
  - Change meal count to 14
  - Update dietary restrictions
  - Save changes

- [ ] **Generate New Plan**
  - Click "Generate Meal Plan"
  - Verify new plan respects updated preferences
  - Verify 14 meals generated

- [ ] **Delete Old Plan**
  - Navigate to meal plan list
  - Delete oldest plan
  - Verify deletion confirmation
  - Verify plan removed from list

### CRUD Operation Testing

#### Users
- [ ] Create user
- [ ] Read user data
- [ ] Update user profile
- [ ] Delete user account (if applicable)

#### Preferences
- [ ] Create preferences
- [ ] Read preferences
- [ ] Update preferences (all fields)
- [ ] Verify preferences persist

#### Meal Plans
- [ ] Create meal plan (generate)
- [ ] Read meal plan (view)
- [ ] Read meal plan list (dashboard)
- [ ] Delete meal plan

#### Meals
- [ ] View meal details
- [ ] View meal nutrition
- [ ] View meal instructions
- [ ] View shopping list

### Email Functionality

- [ ] **Email Generation**
  - Generate meal plan
  - Verify email sent flag
  - Check email HTML is generated
  - Verify email content is correct

- [ ] **Email Recipients**
  - Set multiple email recipients
  - Generate meal plan
  - Verify all recipients receive email

### Job Queue Testing

- [ ] **Job Creation**
  - Generate meal plan
  - Verify job created in queue
  - Check job ID returned

- [ ] **Job Status**
  - Poll job status endpoint
  - Verify status transitions: PENDING → PROCESSING → COMPLETED
  - Check timestamps are correct

- [ ] **Job Failure Handling**
  - (Simulate failure if possible)
  - Verify error message is captured
  - Verify job marked as FAILED
  - Verify user sees error message

### Schedule Functionality

- [ ] **Enable Schedule**
  - Navigate to schedule settings
  - Enable scheduled generation
  - Set day (e.g., Sunday)
  - Set time (e.g., 9:00 AM)
  - Save settings

- [ ] **Verify Schedule**
  - Check schedule in database
  - Verify schedule reflected in UI

- [ ] **Disable Schedule**
  - Disable scheduled generation
  - Verify schedule is not triggered

### Multi-User Isolation

- [ ] **User 1**
  - Login as User 1
  - Create meal plan A
  - Note meal plan ID

- [ ] **User 2**
  - Login as User 2
  - Verify cannot see User 1's meal plan A
  - Create meal plan B

- [ ] **Verify Isolation**
  - User 1 can see meal plan A, not B
  - User 2 can see meal plan B, not A

### Edge Cases and Error Handling

- [ ] **Form Validation**
  - Submit preferences with invalid data
  - Verify error messages displayed
  - Verify form doesn't submit

- [ ] **Network Errors**
  - Disable network (if testing locally)
  - Attempt operations
  - Verify graceful error handling

- [ ] **Session Expiration**
  - Login
  - Wait for session to expire (or delete session)
  - Attempt authenticated operation
  - Verify redirect to login

- [ ] **Concurrent Operations**
  - Generate two meal plans simultaneously
  - Verify both complete successfully
  - Verify no data corruption

- [ ] **Large Data Sets**
  - User with 100+ meal plans
  - Verify pagination works
  - Verify performance is acceptable

- [ ] **Special Characters**
  - Enter special characters in forms
  - Verify proper escaping
  - Verify no XSS vulnerabilities

---

## Performance Regression Tests

### Response Time Baselines

Monitor these endpoints for performance regressions:

| Endpoint | Expected Response Time |
|----------|------------------------|
| GET /api/health | < 100ms |
| GET /api/users/preferences | < 200ms |
| POST /api/meal-plans/generate | < 500ms (job creation) |
| GET /api/meal-plans | < 300ms |
| GET /api/meal-plans/:id | < 200ms |

**Test**:
```bash
# Use curl to measure response times
time curl http://localhost:3000/api/health
```

### Load Testing (Optional)

For production deployments, consider load testing:

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/health

# Expected:
# - Requests per second: > 100
# - Failed requests: 0
# - Average response time: < 100ms
```

---

## Regression Test Execution

### Pre-Release Checklist

Before deploying to production:

1. **Environment Setup**
   - [ ] Fresh database with seed data
   - [ ] All services running
   - [ ] Environment variables configured

2. **Automated Tests**
   - [ ] Build passes: `pnpm build`
   - [ ] Agent tests pass: `pnpm test:agent`
   - [ ] Email tests pass: `pnpm test:email`
   - [ ] Integration tests pass: `pnpm test:integration`
   - [ ] E2E tests pass: `pnpm test:e2e` (all browsers)

3. **Manual Validation**
   - [ ] Critical path 1 (new user) works
   - [ ] Critical path 2 (returning user) works
   - [ ] All CRUD operations work
   - [ ] Email functionality works
   - [ ] No console errors in browser
   - [ ] No errors in server logs

4. **Performance Check**
   - [ ] Page load times acceptable
   - [ ] API response times within baseline
   - [ ] No memory leaks

5. **Documentation**
   - [ ] CHANGELOG updated
   - [ ] Breaking changes documented
   - [ ] Migration guide (if needed)

---

## Troubleshooting Failed Regression Tests

### Build Failures

**Symptoms**: TypeScript errors, compilation failures

**Solutions**:
1. Run `pnpm db:generate` (Prisma types)
2. Delete `.next` and `dist` folders
3. Run `pnpm build:clean`
4. Check for circular dependencies

### Agent Test Failures

**Symptoms**: Agent doesn't generate meal plans

**Solutions**:
1. Verify ANTHROPIC_API_KEY is set
2. Check API key has credits
3. Check network connectivity
4. Review agent prompts for issues

### Integration Test Failures

**Symptoms**: API endpoints return errors

**Solutions**:
1. Verify test database is running
2. Run migrations: `pnpm db:migrate`
3. Seed database: `pnpm db:seed`
4. Check service logs for errors

### E2E Test Failures

**Symptoms**: Browser tests timeout or fail

**Solutions**:
1. Run `pnpm test:e2e:ui` to see what's happening
2. Check browser console for errors
3. Verify web service is running
4. Increase timeouts in `playwright.config.ts`
5. Check screenshots in `test-results/`

---

## Continuous Regression Testing

### CI/CD Integration

Configure GitHub Actions or your CI system to run regression tests:

```yaml
name: Regression Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Setup test environment
        run: |
          docker-compose -f docker-compose.test.yml up -d
          pnpm test:setup

      - name: Run integration tests
        run: pnpm test:integration

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Teardown
        if: always()
        run: |
          pnpm test:teardown
          docker-compose -f docker-compose.test.yml down
```

### Scheduled Regression Tests

Run nightly to catch issues early:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

---

## Best Practices

1. **Run Before Every Release**: Never skip regression tests before production
2. **Keep Tests Updated**: When adding features, add regression tests
3. **Document Failures**: Track regression test failures and root causes
4. **Maintain Baselines**: Update performance baselines as system evolves
5. **Automate Where Possible**: Manual testing is slow and error-prone
6. **Test in Production-Like Environment**: Use staging that mirrors production
7. **Version Test Data**: Keep fixture data in sync with schema changes

---

## Summary

Regression tests are your **final validation** before deployment. They ensure:
- No existing functionality broke
- New features work correctly
- Performance hasn't degraded
- Edge cases are handled

**Time Investment**: 30-60 minutes
**Risk Reduction**: Prevents production incidents
**Confidence Level**: High

Run regression tests:
- ✅ Before every production deployment
- ✅ After major refactors
- ✅ When changing core functionality
- ✅ Before releasing new features

**Remember**: The cost of a production incident far exceeds the time spent on thorough regression testing.

---

## Next Steps

After regression tests pass:
- Review deployment checklist
- Update CHANGELOG
- Tag release
- Deploy to staging
- Run smoke tests on staging
- Deploy to production
- Monitor for issues

**See Also**:
- [SMOKE_TESTS.md](./SMOKE_TESTS.md) - Quick confidence checks
- [TESTING.md](./TESTING.md) - Complete testing guide (coming soon)
- [CLAUDE.md](/CLAUDE.md) - Testing requirements for AI assistants
