# API Testing Guide

This guide provides step-by-step instructions for testing the Meal Planner API endpoints.

## Prerequisites

### 1. Start Docker Services

```bash
# From project root
docker-compose up -d
```

This starts PostgreSQL and Redis services.

### 2. Run Database Migrations

```bash
# From project root
cd apps/web
pnpm prisma migrate dev
```

### 3. Start the Development Server

```bash
# From apps/web directory
pnpm dev
```

The API will be available at `http://localhost:3000/api`

### 4. Start the Queue Worker

```bash
# From project root (in a separate terminal)
cd packages/queue
pnpm worker
```

## Environment Variables

Create `.env` file in `apps/web/`:

```env
DATABASE_URL="postgresql://mealplanner:mealplanner123@localhost:5432/mealplanner"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="your-anthropic-api-key"
# Claude model is defined in packages/core/src/constants.ts
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"
```

## API Endpoints

### 1. Health Check

Test if the API is running and database is connected.

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-13T...",
  "services": {
    "database": "connected"
  }
}
```

### 2. User Registration

Create a new user account.

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### 3. User Login

Authenticate and get session cookies.

```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }' \
  -c cookies.txt
```

For subsequent requests, use the session cookie:
```bash
-b cookies.txt
```

### 4. Get User Preferences

Retrieve current user preferences.

```bash
curl http://localhost:3000/api/users/preferences \
  -b cookies.txt
```

Expected response:
```json
{
  "emailRecipients": [],
  "scheduleDayOfWeek": 0,
  "scheduleHour": 10,
  "scheduleMinute": 0,
  "scheduleEnabled": true,
  "numberOfMeals": 7,
  "servingsPerMeal": 2,
  "minProteinPerMeal": 40,
  "maxCaloriesPerMeal": 600,
  "dietaryRestrictions": [],
  "hebEnabled": true,
  "claudeModel": "claude-sonnet-4-20250514"
}
```

### 5. Update User Preferences

Modify user preferences.

```bash
curl -X PUT http://localhost:3000/api/users/preferences \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "emailRecipients": ["user@example.com"],
    "numberOfMeals": 5,
    "servingsPerMeal": 4,
    "minProteinPerMeal": 50,
    "maxCaloriesPerMeal": 700,
    "dietaryRestrictions": ["gluten-free", "dairy-free"],
    "hebEnabled": true
  }'
```

Expected response:
```json
{
  "success": true,
  "preferences": { ... }
}
```

### 6. Get Schedule Settings

Retrieve scheduling configuration.

```bash
curl http://localhost:3000/api/users/schedule \
  -b cookies.txt
```

Expected response:
```json
{
  "scheduleDayOfWeek": 0,
  "scheduleHour": 10,
  "scheduleMinute": 0,
  "scheduleEnabled": true
}
```

### 7. Update Schedule Settings

Modify when meal plans are automatically generated.

```bash
curl -X PUT http://localhost:3000/api/users/schedule \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "scheduleDayOfWeek": 1,
    "scheduleHour": 8,
    "scheduleMinute": 30,
    "scheduleEnabled": true
  }'
```

Days: 0=Sunday, 1=Monday, 2=Tuesday, etc.

### 8. Generate Meal Plan

Create a new meal plan for the current week.

```bash
curl -X POST http://localhost:3000/api/meal-plans/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "weekStartDate": "2025-12-15"
  }'
```

Expected response:
```json
{
  "success": true,
  "mealPlanId": "clx...",
  "jobId": "1234567890",
  "status": "PENDING",
  "message": "Meal plan generation started"
}
```

### 9. Check Job Status

Poll the status of meal plan generation.

```bash
curl http://localhost:3000/api/meal-plans/status/1234567890 \
  -b cookies.txt
```

Response (in progress):
```json
{
  "jobId": "1234567890",
  "state": "active",
  "progress": 45,
  "estimatedTimeRemaining": 120000
}
```

Response (completed):
```json
{
  "jobId": "1234567890",
  "state": "completed",
  "progress": 100,
  "mealPlanId": "clx...",
  "returnvalue": {
    "success": true,
    "mealPlanId": "clx..."
  }
}
```

Response (failed):
```json
{
  "jobId": "1234567890",
  "state": "failed",
  "failedReason": "Error message here"
}
```

### 10. Get Meal Plan

Retrieve a completed meal plan.

```bash
curl http://localhost:3000/api/meal-plans/clx... \
  -b cookies.txt
```

Expected response:
```json
{
  "id": "clx...",
  "weekStartDate": "2025-12-15T00:00:00.000Z",
  "status": "COMPLETED",
  "generatedAt": "2025-12-13T...",
  "meals": [
    {
      "day": "Monday",
      "name": "Grilled Chicken with Quinoa",
      "calories": 580,
      "protein": 45,
      "carbs": 52,
      "fat": 18,
      "fiber": 8,
      "ingredients": [...],
      "instructions": [...],
      "prepTime": "15 minutes",
      "cookTime": "25 minutes"
    },
    ...
  ],
  "emailSent": true,
  "emailSentAt": "2025-12-13T...",
  "iterationCount": 2,
  "claudeModel": "claude-sonnet-4-20250514"
}
```

### 11. List Meal Plans

Get all meal plans for the current user.

```bash
curl "http://localhost:3000/api/meal-plans?limit=10&offset=0" \
  -b cookies.txt
```

Expected response:
```json
{
  "mealPlans": [
    {
      "id": "clx...",
      "weekStartDate": "2025-12-15T00:00:00.000Z",
      "status": "COMPLETED",
      "generatedAt": "2025-12-13T...",
      "emailSent": true
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### 12. Delete Meal Plan

Remove a meal plan.

```bash
curl -X DELETE http://localhost:3000/api/meal-plans/clx... \
  -b cookies.txt
```

Expected response:
```json
{
  "success": true,
  "message": "Meal plan deleted successfully"
}
```

## Testing Workflow

### Complete End-to-End Test

1. **Register a user**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

2. **Login and save cookies**
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  -c cookies.txt
```

3. **Update preferences**
```bash
curl -X PUT http://localhost:3000/api/users/preferences \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"emailRecipients":["test@example.com"],"numberOfMeals":5,"servingsPerMeal":2}'
```

4. **Generate meal plan**
```bash
curl -X POST http://localhost:3000/api/meal-plans/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"weekStartDate":"2025-12-15"}' | jq .
```

5. **Check job status (use jobId from step 4)**
```bash
watch -n 5 'curl -s http://localhost:3000/api/meal-plans/status/JOBID -b cookies.txt | jq .'
```

6. **Get completed meal plan (use mealPlanId from job status)**
```bash
curl http://localhost:3000/api/meal-plans/MEALPLANID \
  -b cookies.txt | jq .
```

## Using Postman/Insomnia

### Import Collection

1. Create a new request collection
2. Set base URL: `http://localhost:3000/api`
3. Add requests for each endpoint above
4. Use environment variables for tokens and IDs

### Authentication Setup

1. After login, NextAuth will set session cookies
2. Enable cookie jar in your HTTP client
3. Cookies will be automatically included in subsequent requests

### Environment Variables

```
BASE_URL=http://localhost:3000/api
JOB_ID={{jobId}}
MEAL_PLAN_ID={{mealPlanId}}
```

## Common Issues

### Database Connection Error

```
error: Environment variable not found: DATABASE_URL
```

Solution: Ensure `.env` file exists in `apps/web/` with `DATABASE_URL` set.

### Unauthorized Error

```
{
  "error": "Unauthorized"
}
```

Solution: Ensure you're including session cookies from login (`-b cookies.txt`).

### Meal Plan Already Exists

```
{
  "error": "A meal plan already exists for this week"
}
```

Solution: Choose a different week or delete the existing meal plan first.

### Job Not Found

```
{
  "error": "Job not found"
}
```

Solution: Ensure the queue worker is running (`pnpm worker` in packages/queue).

## Next Steps

After successful API testing:
- Phase 5: Build Next.js UI components
- Phase 6: Refactor CLI to use API
- Phase 7: Deploy to production
- Phase 8: Add monitoring and analytics
