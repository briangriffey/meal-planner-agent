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
├── packages/
│   ├── core/             # Shared agent logic and types
│   ├── database/         # Prisma schema and migrations
│   └── queue/            # BullMQ workers and job processors
└── scripts/              # Utility scripts
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

### When to Run Tests

| Change Type | Required Tests |
|------------|----------------|
| Database schema changes | `pnpm build` + verify migrations |
| Core agent logic | `pnpm test:agent` |
| Email templates | `pnpm test:email` |
| Queue/worker changes | `pnpm build` + manual worker test |
| API routes | `pnpm build` |
| UI components | `pnpm build` + manual browser test |

### Build Testing

**ALWAYS run before committing**:
```bash
pnpm build
```

This is the most critical test. A successful build ensures:
- No TypeScript errors
- No missing dependencies
- Proper type safety across packages
- Next.js can compile successfully

### Agent Testing

Test the meal planning agent:
```bash
pnpm test:agent
```

This runs the agent end-to-end and generates a sample meal plan.

### Email Testing

Test email generation:
```bash
pnpm test:email
```

Generates a test email HTML file without sending.

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
# Test agent
pnpm test:agent

# Test email
pnpm test:email
```

### Docker

```bash
# Start all services
pnpm docker:up

# Stop all services
pnpm docker:down
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
✅ Test your changes appropriately
✅ Follow commit message conventions
✅ Update documentation when needed
✅ Don't commit generated files
✅ Use TypeScript properly (no `any`)

❌ **NEVER** commit without building
❌ Don't skip migrations for schema changes
❌ Don't modify generated files
❌ Don't use `any` type unless absolutely necessary
❌ Don't commit directly to main without testing
