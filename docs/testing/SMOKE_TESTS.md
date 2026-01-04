# Smoke Tests

**Purpose**: Quick confidence checks to verify core system functionality
**Time to Complete**: < 5 minutes
**When to Run**: After deployments, environment changes, or significant updates

---

## Overview

Smoke tests are lightweight, automated checks that verify the application's core services are running and accessible. They're designed to catch critical failures quickly without requiring extensive test coverage.

Think of smoke tests as "is it on fire?" checks:
- ✅ Services are running
- ✅ Can connect to dependencies
- ✅ Basic endpoints respond correctly

---

## Automated Smoke Test Scripts

The project includes two automated smoke test scripts:

### 1. Web Service Smoke Test

**Script**: `scripts/smoke-test-web.sh`

**Tests**:
- ✅ Web service is responding (HTTP 200)
- ✅ Health endpoint returns correct structure
- ✅ Database connection is established
- ✅ Redis connection is established
- ✅ Required environment variables are set

**Usage**:
```bash
# Default: http://localhost:3000
./scripts/smoke-test-web.sh

# Custom URL
WEB_URL=https://staging.example.com ./scripts/smoke-test-web.sh
```

**Expected Output**:
```
🧪 Running Web Service Smoke Tests
==================================

📍 Testing endpoint: http://localhost:3000/api/health

⏳ Waiting for web service to be ready...
✅ Web service is responding

Test 1: Health endpoint returns 200
✅ PASS - Health endpoint returned 200

Test 2: Health response structure
✅ PASS - Status is healthy

Test 3: Database connectivity
✅ PASS - Database is connected

Test 4: Redis connectivity
✅ PASS - Redis is connected

Test 5: Environment variables
✅ PASS - Required environment variables are set

==================================
✅ All smoke tests passed!
==================================
```

---

### 2. Worker Service Smoke Test

**Script**: `scripts/smoke-test-worker.sh`

**Tests**:
- ✅ Worker process is running
- ✅ Required environment variables are set (Docker mode)

**Usage**:
```bash
# Test local worker process
./scripts/smoke-test-worker.sh

# Test Docker container
CONTAINER_NAME=meal-planner-worker ./scripts/smoke-test-worker.sh
```

**Expected Output**:
```
🧪 Running Worker Service Smoke Tests
=====================================

💻 Testing local process

⏳ Waiting for worker process to start...
✅ Worker process is running locally

Test 1: Worker process status
✅ PASS - Worker process is running (count: 1)

Test 2: Environment variables (skipped - local mode)

=====================================
✅ All smoke tests passed!
=====================================
```

---

## Manual Smoke Test Checklist

If automated scripts fail or for comprehensive validation, use this manual checklist:

### Core Services

- [ ] **Web Service**
  ```bash
  curl http://localhost:3000/api/health
  # Expected: {"status":"healthy","database":"connected","redis":"connected"}
  ```

- [ ] **Database**
  ```bash
  pnpm db:studio
  # Expected: Prisma Studio opens at http://localhost:5555
  ```

- [ ] **Redis**
  ```bash
  redis-cli ping
  # Expected: PONG
  ```

- [ ] **Worker Process**
  ```bash
  ps aux | grep worker
  # Expected: Node process running worker script
  ```

### Basic Functionality

- [ ] **Can Load Homepage**
  - Visit: http://localhost:3000
  - Expected: Login/register page loads

- [ ] **Can View API Health**
  - Visit: http://localhost:3000/api/health
  - Expected: JSON response with status "healthy"

- [ ] **Can Access Dashboard** (requires login)
  - Login with test user
  - Expected: Dashboard loads without errors

### Database Operations

- [ ] **Can Query Database**
  ```bash
  pnpm db:studio
  # Open Users table, verify test data exists
  ```

- [ ] **Can Create User** (via API or UI)
  - Register new test user
  - Expected: User appears in database

- [ ] **Can Login**
  - Login with existing user
  - Expected: Redirects to dashboard with session

### Job Queue

- [ ] **Can Queue Job**
  - Trigger meal plan generation
  - Expected: Job appears in Redis queue

- [ ] **Can Process Job**
  - Worker picks up job
  - Expected: Job status changes from PENDING → PROCESSING → COMPLETED

---

## Quick Smoke Test Procedure

**For rapid validation (< 2 minutes)**:

```bash
# 1. Check web service
curl -sf http://localhost:3000/api/health || echo "❌ Web service down"

# 2. Check worker process
pgrep -f worker.js > /dev/null && echo "✅ Worker running" || echo "❌ Worker down"

# 3. Check database connection
psql $DATABASE_URL -c "SELECT 1" > /dev/null && echo "✅ Database connected" || echo "❌ Database down"

# 4. Check Redis
redis-cli ping > /dev/null && echo "✅ Redis connected" || echo "❌ Redis down"
```

---

## Health Endpoint Details

The `/api/health` endpoint provides comprehensive service status:

**Endpoint**: `GET /api/health`

**Response Structure**:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "environment": "ok",
  "timestamp": "2026-01-03T18:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

**Status Values**:
- `healthy` - All services operational
- `degraded` - Some services have issues but app is functional
- `unhealthy` - Critical service failures

---

## Troubleshooting Failed Smoke Tests

### Web Service Not Responding

**Symptoms**: `curl` timeout or connection refused

**Solutions**:
1. Verify service is running: `pnpm dev`
2. Check port is not in use: `lsof -i :3000`
3. Check logs: `docker logs meal-planner-web` (if Docker)
4. Verify environment variables: Check `.env.local`

### Database Connection Failed

**Symptoms**: `"database": "disconnected"` in health response

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   # or
   brew services list | grep postgresql
   ```
2. Test connection manually:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```
3. Check DATABASE_URL in `.env.local`
4. Run migrations: `pnpm db:migrate`

### Redis Connection Failed

**Symptoms**: `"redis": "disconnected"` in health response

**Solutions**:
1. Verify Redis is running:
   ```bash
   docker ps | grep redis
   # or
   brew services list | grep redis
   ```
2. Test connection manually:
   ```bash
   redis-cli ping
   ```
3. Check REDIS_URL in `.env.local`
4. Start Redis: `docker-compose up -d redis` or `brew services start redis`

### Worker Not Running

**Symptoms**: No worker process found

**Solutions**:
1. Start worker: `pnpm worker`
2. Check logs for errors
3. Verify environment variables (DATABASE_URL, REDIS_URL, ANTHROPIC_API_KEY)
4. Ensure Redis is running (worker requires Redis for job queue)

---

## Integration with CI/CD

Smoke tests should run automatically in CI/CD pipelines:

**GitHub Actions Example**:
```yaml
- name: Run Smoke Tests
  run: |
    ./scripts/smoke-test-web.sh
    ./scripts/smoke-test-worker.sh
```

**Docker Compose Health Checks**:
```yaml
web:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

---

## Best Practices

1. **Run Before Committing**: Quick sanity check before pushing changes
2. **Run After Deployment**: Verify services came up correctly
3. **Run After Config Changes**: Ensure environment changes didn't break anything
4. **Automate in CI**: Catch issues before they reach production
5. **Keep Tests Fast**: Smoke tests should complete in < 5 minutes
6. **Test Real Dependencies**: Don't mock critical services in smoke tests
7. **Clear Failure Messages**: Make it obvious what broke and why

---

## Next Steps

After smoke tests pass:
- Run integration tests: `pnpm test:integration`
- Run E2E tests: `pnpm test:e2e`
- Review regression test suite: See [REGRESSION_TESTS.md](./REGRESSION_TESTS.md)

---

## Summary

Smoke tests provide a **quick confidence check** that:
- All services are running
- Critical dependencies are accessible
- Basic functionality works

They're the **first line of defense** against major breakages and should be:
- Fast (< 5 minutes)
- Automated
- Run frequently
- Easy to debug when they fail

**Remember**: Smoke tests don't replace comprehensive testing. They just tell you if it's safe to proceed with more detailed testing.
