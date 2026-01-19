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
- **Automated Marketing Emails**: GitHub webhook integration to send release announcements to all users

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

## Automated Marketing Emails

The application automatically sends marketing emails to all users when you publish a new GitHub release. This feature uses GitHub webhooks to trigger email generation and delivery.

### Features

- **Automatic Triggering**: Emails are sent automatically when you publish a release on GitHub
- **AI-Powered Content**: Claude AI generates user-friendly marketing copy from your changelog
- **Professional Templates**: Branded HTML email templates with responsive design
- **Batch Processing**: Emails are sent in batches with rate limiting to avoid issues
- **Secure Webhooks**: GitHub signature validation ensures only legitimate webhooks are processed

### Setting Up GitHub Webhook

#### 1. Generate a Webhook Secret

First, generate a secure random secret for webhook signature validation:

```bash
openssl rand -hex 32
```

Save this value - you'll need it in steps 2 and 3.

#### 2. Configure Environment Variable

Add the webhook secret to your `.env` file:

```env
GITHUB_WEBHOOK_SECRET="your-generated-secret-here"
```

**Important**: Use the same secret value in both your `.env` file and GitHub webhook settings.

#### 3. Configure Webhook in GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Configure the webhook:
   - **Payload URL**: `https://yourdomain.com/api/webhooks/github`
     - For local testing: `http://localhost:3000/api/webhooks/github`
     - For production: Use your deployed URL (e.g., `https://meal-planner.example.com/api/webhooks/github`)
   - **Content type**: `application/json`
   - **Secret**: Paste the secret you generated in step 1
   - **SSL verification**: Enable SSL verification (recommended for production)
   - **Which events would you like to trigger this webhook?**
     - Select "Let me select individual events"
     - Check only **Releases** (uncheck everything else)
   - **Active**: Check this box to enable the webhook

4. Click **Add webhook**

#### 4. Verify Webhook Configuration

After adding the webhook, GitHub will send a test ping. You should see:
- A green checkmark next to the webhook in GitHub settings
- A "Recent Deliveries" entry with HTTP 200 response

### Testing the Integration

#### Local Testing

Before deploying to production, test the webhook integration locally:

1. **Start Services**:
   ```bash
   # Terminal 1 - Web app
   pnpm dev

   # Terminal 2 - Worker
   export EMAIL_TEST_MODE=true
   pnpm dev:worker
   ```

2. **Send Test Webhook**:
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/github \
     -H "Content-Type: application/json" \
     -d '{
       "action": "published",
       "release": {
         "tag_name": "v1.0.0",
         "name": "Version 1.0.0",
         "body": "## Features\n- New feature 1\n- New feature 2"
       }
     }'
   ```

3. **Expected Result**:
   - HTTP response: `202 Accepted`
   - Worker logs show job processing
   - `TESTEMAIL.html` file is created in project root
   - Email contains release notes with proper formatting

#### Automated Test Script

For comprehensive testing, use the automated test script:

```bash
# Ensure test mode is enabled
export EMAIL_TEST_MODE=true

# Run automated test
bash scripts/test-marketing-email-flow.sh
```

The script will verify:
- ✅ Webhook endpoint receives and validates the payload
- ✅ Job is enqueued in BullMQ
- ✅ Worker processes job successfully
- ✅ Claude AI generates marketing copy
- ✅ HTML email is rendered with brand styling
- ✅ Email contains release information

### Testing with Real GitHub Releases

Once deployed to production:

1. Create a new release in your GitHub repository
2. Publish the release
3. GitHub will automatically trigger the webhook
4. Within 30-60 seconds, all users will receive a marketing email
5. Check worker logs for job processing details

### Webhook Security

The webhook endpoint validates GitHub signatures to ensure authenticity:

- **Valid signature**: Webhook is processed, email job is queued (HTTP 202)
- **Invalid/missing signature**: Webhook is rejected (HTTP 401)
- **Non-release events**: Webhook is acknowledged but ignored (HTTP 200)

**Important**: Never commit your `GITHUB_WEBHOOK_SECRET` to version control. Always use environment variables.

### Email Test Mode

For testing without sending real emails, enable test mode:

```bash
export EMAIL_TEST_MODE=true
```

When enabled:
- Emails are written to `TESTEMAIL.html` in the project root
- No actual emails are sent via SMTP
- Perfect for development and testing

### Troubleshooting

#### Webhook Returns 401 Unauthorized

**Cause**: Signature validation failed

**Solutions**:
- Verify `GITHUB_WEBHOOK_SECRET` matches in both `.env` and GitHub webhook settings
- Ensure the secret has no extra whitespace or quotes
- Regenerate the secret and update both locations

#### No Email Generated

**Possible causes**:
1. **Worker not running**: Start worker with `pnpm dev:worker`
2. **Redis not accessible**: Check `REDIS_URL` and ensure Redis is running
3. **No users in database**: Run `pnpm db:seed` to create test users
4. **Email test mode not enabled**: Set `EMAIL_TEST_MODE=true` for local testing

#### Worker Fails with "ANTHROPIC_API_KEY not set"

**Solution**: Add your Anthropic API key to `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### Email Looks Wrong or Has Errors

**Solutions**:
- Check worker logs for Claude API errors
- Verify all packages built successfully: `pnpm build`
- Review `TESTEMAIL.html` for rendering issues
- Check marketing email renderer: `packages/core/src/services/marketing-email-renderer.ts`

### Related Documentation

- **Detailed Testing Guide**: `.auto-claude/specs/010-automated-marketing/E2E_TEST_GUIDE.md`
- **Quick Test Reference**: `.auto-claude/specs/010-automated-marketing/QUICK_TEST.md`
- **Test Script**: `scripts/test-marketing-email-flow.sh`

### Architecture

This feature uses an event-driven architecture:
1. GitHub publishes release → Webhook triggered
2. Webhook endpoint validates signature → Enqueues job
3. BullMQ worker picks up job
4. Worker queries all users from database
5. Claude AI generates user-friendly marketing copy
6. Email renderer creates branded HTML
7. Emails sent in batches to all users

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
GITHUB_WEBHOOK_SECRET="your-github-webhook-secret"  # Optional: for automated marketing emails
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
