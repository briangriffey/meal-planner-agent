# Meal Planner Agent - Web Application

An AI-powered meal planning web application that uses Claude AI to generate personalized, nutritious meal plans. Built with Next.js, Prisma, and BullMQ for scalable, multi-user meal planning.

## Features

- **AI-Powered Meal Planning**: Uses Claude to generate personalized, nutritious meal plans
- **Multi-User Support**: Independent user accounts with secure authentication
- **Customizable Preferences**: Configure meals per week, servings, nutrition targets, and dietary restrictions
- **Meal History & Analytics**: Track previous meals and view nutritional analytics
- **Async Job Processing**: Queue-based meal plan generation with real-time progress tracking
- **Email Delivery**: Automatically sends formatted meal plans via email
- **HEB Integration**: Optional integration to browse HEB website for ingredients
- **Automated Scheduling**: Configure automatic weekly meal plan generation
- **Email Verification**: Secure email verification for new user accounts

## Email Verification

New users must verify their email address before logging in to ensure account security and valid email addresses.

### Verification Flow

1. **Registration**: User creates account with email, password, and name
2. **Verification Email**: System automatically sends email with verification link (24-hour expiry)
3. **Email Verification**: User clicks link in email to verify their account
4. **Login**: User can now log in with their credentials

### Key Points

- Verification tokens expire after 24 hours
- Users cannot log in until email is verified
- Verification emails can be resent from the login page
- Existing users (created before verification was enabled) are automatically verified

### For Users

- Check your spam folder if you don't receive the verification email
- Click "Resend Verification Email" from the login page if needed
- Verification link expires in 24 hours - request a new one if expired

### For Developers

Email verification requires proper email configuration in `.env`:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NEXTAUTH_URL=http://localhost:3000  # or your production URL
```

**Resending Verification:**

Users can resend verification emails at: `/resend-verification`

**API Endpoints:**

- `POST /api/auth/register` - Creates user and sends verification email
- `GET /api/auth/verify-email?token=xxx` - Verifies email with token
- `POST /api/auth/resend-verification` - Resends verification email

## Architecture

This is a monorepo containing:

- **apps/web**: Next.js 14 web application with App Router and NextAuth.js authentication
- **packages/core**: Shared meal planning agent logic with Claude AI integration
- **packages/database**: Prisma ORM schema and database client
- **packages/queue**: BullMQ job queue for async meal plan generation

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- PostgreSQL database
- Redis server
- Anthropic API key
- Gmail account with App Password (for email delivery)

## Quick Start

### 1. Clone and Install

```bash
cd meal-planner-agent
pnpm install
```

### 2. Start Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

### 3. Environment Variables

Create `.env` file in the **root directory** (shared across all packages):

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

**Note:** All database operations (migrations, schema management) run from the `packages/database` package, which is the single source of truth for the database schema.

### 4. Run Database Migrations

```bash
# From root directory
pnpm db:migrate

# Or directly from database package
cd packages/database
pnpm migrate
```

### 5. Start Development Servers

Terminal 1 - Web Application:
```bash
pnpm dev
```

Terminal 2 - Queue Worker:
```bash
pnpm dev:worker
```

### 6. Access the Application

Open http://localhost:3000 in your browser and create an account!

## Usage

### User Registration

1. Navigate to http://localhost:3000
2. Click "Create an account"
3. Fill in your email, password, and name
4. Submit to create your account
5. Check your email for the verification link
6. Click the verification link to verify your email
7. Return to the login page and sign in

### Configure Preferences

1. Sign in to your account
2. Navigate to "Preferences" in the dashboard
3. Configure:
   - Number of meals per week
   - Servings per meal
   - Nutritional targets (protein, calories, etc.)
   - Dietary restrictions
   - Email recipients
   - Automatic generation schedule

### Generate a Meal Plan

1. Click "Generate New Meal Plan" from the dashboard
2. Select a week start date
3. Click "Generate Meal Plan"
4. Watch real-time progress as Claude AI:
   - Analyzes your meal history
   - Generates personalized meals
   - Sends email with meal plan
5. View your completed meal plan with:
   - Detailed nutrition information
   - Ingredients and instructions
   - Shopping lists

### View Analytics

Navigate to "History & Analytics" to see:
- Total meal plans generated
- Average nutrition per meal
- Most frequently generated meals
- Recent meal history

## Project Structure

```
meal-planner-agent/
├── apps/
│   └── web/                    # Next.js web application
│       ├── app/                # App Router pages
│       │   ├── api/           # API routes
│       │   ├── dashboard/     # Dashboard pages
│       │   ├── login/         # Authentication pages
│       │   └── register/
│       ├── components/        # React components
│       └── lib/               # Auth & database config
├── packages/
│   ├── database/              # Database Package (Source of Truth)
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Single database schema
│   │   │   └── migrations/       # Migration history
│   │   └── src/
│   │       └── index.ts          # Exports PrismaClient singleton
│   ├── core/                  # Meal planning agent
│   │   ├── src/
│   │   │   ├── agent/        # MealPlannerAgent class
│   │   │   ├── connectors/   # Email, HEB, web search
│   │   │   ├── services/     # Meal history service
│   │   │   └── types/        # TypeScript types
│   └── queue/                 # BullMQ job processing
│       └── src/
│           ├── client.ts      # Queue client
│           ├── worker.ts      # Job worker
│           └── jobs/          # Job processors
├── docker-compose.yml         # PostgreSQL + Redis
└── pnpm-workspace.yaml        # Monorepo config
```

## API Documentation

See [apps/web/API_TESTING.md](apps/web/API_TESTING.md) for comprehensive API endpoint documentation and testing instructions.

## Development Scripts

```bash
# Build all packages
pnpm build

# Start web dev server
pnpm dev

# Start queue worker
pnpm dev:worker
```

## Database Operations

All database operations run from `packages/database/` (single source of truth):

```bash
# Development migrations (interactive)
pnpm db:migrate

# Production migrations (non-interactive)
pnpm db:migrate:deploy

# Generate Prisma client
pnpm db:generate

# Open Prisma Studio (database GUI)
pnpm db:studio

# Push schema without migration (prototyping)
pnpm db:push

# Seed database
pnpm db:seed
```

**Note:** The `.env` file at the root is shared across all packages.

## How It Works

1. **User Registration**: Users create accounts with NextAuth.js authentication
2. **Configuration**: Users set preferences for meals, nutrition, and scheduling
3. **Job Queue**: When a user requests a meal plan, a job is queued in BullMQ
4. **Worker Processing**: The queue worker:
   - Loads user preferences and meal history from database
   - Creates MealPlannerAgent with connectors
   - Generates meal plan using Claude AI
   - Saves results to database
   - Sends email with meal plan
5. **Real-Time Updates**: User sees progress updates via polling
6. **Analytics**: Meal records are stored for analytics and variety tracking

## Gmail Setup

To enable email delivery:

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification (enable if not already)
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Add the 16-character password to your user preferences in the web app

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL in `.env`
- Run migrations: `pnpm db:migrate`

### Redis Connection Error
- Ensure Redis is running: `docker-compose ps`
- Check REDIS_URL in `.env`

### Queue Jobs Not Processing
- Make sure the worker is running: `pnpm dev:worker`
- Check worker logs for errors
- Verify Redis connection

### Email Not Sending
- Configure Gmail App Password in user preferences
- Check email connector configuration
- Review worker logs for SMTP errors

## Production Deployment

For production deployment:

1. Set up PostgreSQL and Redis instances
2. Configure environment variables
3. Build the application: `pnpm build`
4. Run database migrations
5. Start web server: `cd apps/web && pnpm start`
6. Start worker: `cd packages/queue && node dist/worker.js`

## License

MIT
