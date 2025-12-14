# Multi-User Support

The meal planner agent supports multiple users with independent configurations, preferences, schedules, and meal history.

## Overview

Each user has their own:
- **Email recipients**: Who receives the meal plan emails
- **Schedule**: When their meal plans are generated
- **Preferences**: Meal count, servings, protein/calorie targets, dietary restrictions
- **Meal history**: Separate history to ensure variety for each user

This allows multiple people (or households) to use the same meal planner instance with personalized settings.

## Configuration

### File Structure

User configurations are stored in `config/users.json`:

```json
{
  "users": {
    "brian": {
      "userId": "brian",
      "email": {
        "recipients": ["brian@example.com"]
      },
      "schedule": {
        "dayOfWeek": 0,
        "hour": 10,
        "minute": 0
      },
      "preferences": {
        "numberOfMeals": 3,
        "servingsPerMeal": 2,
        "minProteinPerMeal": 40,
        "maxCaloriesPerMeal": 500,
        "dietaryRestrictions": []
      },
      "heb": {
        "enabled": true
      }
    },
    "family": {
      "userId": "family",
      "email": {
        "recipients": ["brian@example.com", "allison@example.com"]
      },
      "schedule": {
        "dayOfWeek": 6,
        "hour": 18,
        "minute": 0
      },
      "preferences": {
        "numberOfMeals": 7,
        "servingsPerMeal": 4,
        "minProteinPerMeal": 40,
        "maxCaloriesPerMeal": 600,
        "dietaryRestrictions": []
      },
      "heb": {
        "enabled": true
      }
    }
  }
}
```

### Setup

1. **Copy the example file**:
   ```bash
   cp config/users.json.example config/users.json
   ```

2. **Edit `config/users.json`** with your user configurations

3. **System email credentials** are still configured in `.env`:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ANTHROPIC_API_KEY=your-api-key
   ```

   The system email credentials are used to send all emails, while each user configuration specifies the recipients.

## Usage

### Run for a Specific User

Generate a meal plan for a specific user immediately:

```bash
# Test mode (saves to TESTEMAIL.html)
pnpm test:now --user brian

# Production mode (sends email)
pnpm test:now:send --user brian

# Using ts-node directly
ts-node src/index.ts --now --user family
ts-node src/index.ts --now --sendemail --user family
```

### Legacy Single-User Mode

The agent still supports the original `config/config.json` for backwards compatibility:

```bash
# Runs with config/config.json (no --user flag)
pnpm test:now
pnpm test:now:send
```

## User-Specific Data

Each user's data is stored separately:

```
data/
├── meal-history.json          # Legacy single-user history
└── users/
    ├── brian/
    │   └── meal-history.json  # Brian's meal history
    └── family/
        └── meal-history.json  # Family's meal history
```

This ensures meal variety tracking is independent per user.

## User Configuration Options

### userId
- **Type**: `string`
- **Required**: Yes
- **Description**: Unique identifier for the user
- **Example**: `"brian"`, `"family"`, `"user1"`

### email.recipients
- **Type**: `string[]`
- **Required**: Yes
- **Description**: List of email addresses to receive meal plans
- **Example**: `["brian@example.com"]` or `["person1@example.com", "person2@example.com"]`

### schedule
- **Type**: `object`
- **Required**: Yes
- **Properties**:
  - `dayOfWeek`: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  - `hour`: Hour in 24-hour format (0-23)
  - `minute`: Minute (0-59)
- **Example**: `{ "dayOfWeek": 0, "hour": 10, "minute": 0 }` (Sunday at 10:00 AM)

### preferences.numberOfMeals
- **Type**: `number`
- **Default**: 7
- **Description**: Number of meals to generate per plan
- **Example**: `3` for 3 meals, `7` for a full week

### preferences.servingsPerMeal
- **Type**: `number`
- **Default**: 2
- **Description**: Number of servings each meal should provide
- **Example**: `1` for single person, `4` for family of 4

### preferences.minProteinPerMeal
- **Type**: `number`
- **Default**: 40
- **Description**: Minimum grams of protein per serving
- **Example**: `35`, `40`, `50`

### preferences.maxCaloriesPerMeal
- **Type**: `number`
- **Default**: 600
- **Description**: Maximum calories per serving
- **Example**: `450`, `500`, `600`

### preferences.dietaryRestrictions
- **Type**: `string[]`
- **Default**: `[]`
- **Description**: Array of dietary restrictions
- **Example**: `["gluten-free"]`, `["dairy-free", "vegan"]`, `[]`

### heb.enabled
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to browse HEB for ingredients and shopping links
- **Example**: `true` or `false`

## Examples

### Example 1: Individual User

Brian wants meal plans for himself (2 servings) every Sunday:

```json
{
  "userId": "brian",
  "email": {
    "recipients": ["brian@example.com"]
  },
  "schedule": {
    "dayOfWeek": 0,
    "hour": 10,
    "minute": 0
  },
  "preferences": {
    "numberOfMeals": 3,
    "servingsPerMeal": 2,
    "minProteinPerMeal": 40,
    "maxCaloriesPerMeal": 500,
    "dietaryRestrictions": []
  },
  "heb": {
    "enabled": true
  }
}
```

Run with: `pnpm test:now --user brian`

### Example 2: Family Meal Plan

Family meal plan for 4 people every Saturday evening:

```json
{
  "userId": "family",
  "email": {
    "recipients": ["parent1@example.com", "parent2@example.com"]
  },
  "schedule": {
    "dayOfWeek": 6,
    "hour": 18,
    "minute": 0
  },
  "preferences": {
    "numberOfMeals": 7,
    "servingsPerMeal": 4,
    "minProteinPerMeal": 40,
    "maxCaloriesPerMeal": 600,
    "dietaryRestrictions": []
  },
  "heb": {
    "enabled": true
  }
}
```

Run with: `pnpm test:now --user family`

### Example 3: Dietary Restrictions

Gluten-free meal plan for single person:

```json
{
  "userId": "allison",
  "email": {
    "recipients": ["allison@example.com"]
  },
  "schedule": {
    "dayOfWeek": 0,
    "hour": 10,
    "minute": 0
  },
  "preferences": {
    "numberOfMeals": 7,
    "servingsPerMeal": 1,
    "minProteinPerMeal": 35,
    "maxCaloriesPerMeal": 450,
    "dietaryRestrictions": ["gluten-free"]
  },
  "heb": {
    "enabled": true
  }
}
```

Run with: `pnpm test:now --user allison`

## Testing

Test the multi-user functionality:

```bash
pnpm test:multi-user
```

This runs comprehensive tests for:
- Creating and saving user configurations
- Loading user configurations
- User-specific meal history isolation
- Converting to system config format
- Deleting user configurations

## Migration from Single-User

If you're currently using `config/config.json`, you have two options:

### Option 1: Continue Using Legacy Mode
Keep using `config/config.json` and don't specify a `--user` flag. The system is fully backwards compatible.

### Option 2: Migrate to Multi-User

1. **Backup your current config**:
   ```bash
   cp config/config.json config/config.json.backup
   ```

2. **Create `config/users.json`**:
   ```bash
   cp config/users.json.example config/users.json
   ```

3. **Copy your settings** from `config.json` to a user in `users.json`

4. **Test the migration**:
   ```bash
   pnpm test:now --user your-user-id
   ```

5. **Your existing meal history** at `data/meal-history.json` will remain intact for legacy mode

## Future Enhancements

Planned improvements for multi-user support:

- **Scheduled Multi-User Mode**: Automatic scheduling for all users with their individual schedules
- **Web UI**: Manage users and configurations through a web interface
- **Database Storage**: Move from file-based to database storage (PostgreSQL, MongoDB)
- **User Authentication**: Secure user management with authentication
- **Shared Meal Plans**: Allow users to share meal plans with each other
- **Household Groups**: Group users into households with shared preferences

## Architecture

### UserConfigService

The `UserConfigService` manages multi-user configurations:

```typescript
import { UserConfigService } from './services/userConfig';

const systemEmail = {
  user: process.env.GMAIL_USER,
  appPassword: process.env.GMAIL_APP_PASSWORD
};

const userConfigService = new UserConfigService(
  undefined,              // Config path (default: config/users.json)
  systemEmail,            // System email credentials
  'claude-sonnet-4-...'   // Claude model
);

// Get a user's config
const userConfig = userConfigService.getUserConfig('brian');

// Convert to system config format
const config = userConfigService.toSystemConfig(userConfig);

// Get all user IDs
const allUsers = userConfigService.getAllUserIds();
```

### Meal History Isolation

Each user has their own meal history:

```typescript
import { MealHistoryService } from './services/mealHistory';

// User-specific history
const userHistory = new MealHistoryService(
  undefined,  // Path (auto-determined from userId)
  12,         // Max entries
  'brian'     // userId
);

// Stored at: data/users/brian/meal-history.json
```

### Agent Execution

The agent accepts a `userId` parameter:

```typescript
import { MealPlannerAgent } from './services/agent';

const agent = new MealPlannerAgent(
  config,          // System config
  registry,        // Connector registry
  'brian'          // userId (optional)
);

await agent.generateMealPlan();
```

## Troubleshooting

### User not found error

```
Error: User 'john' not found in users.json
```

**Solution**: Check that the user ID exists in `config/users.json` and matches exactly (case-sensitive).

### No meal history for user

If a user has no meal history, the agent will still work but won't have variety constraints. Meal history builds up automatically after each run.

### Email not sending

Make sure:
1. System email credentials are set in `.env`:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

2. User's `email.recipients` array is not empty in `users.json`

3. You're using `--sendemail` flag for production mode

## Best Practices

1. **Use Descriptive User IDs**: Use clear identifiers like `"brian"`, `"family"`, `"vegan-plan"` instead of `"user1"`, `"user2"`

2. **Test Before Sending**: Always test with `--now` (without `--sendemail`) first to preview the email in `TESTEMAIL.html`

3. **Backup Configurations**: Keep backups of `users.json` before making major changes

4. **Separate Concerns**: Use different users for different purposes (individual vs family vs special diets) rather than trying to combine everything in one config

5. **Security**: Keep `config/users.json` in `.gitignore` to avoid committing personal email addresses

## Support

For issues or questions about multi-user support:
- Check the [main README](../README.md) for general setup
- Review [test-multi-user.ts](../tests/test-multi-user.ts) for code examples
- File issues at the repository's issue tracker
