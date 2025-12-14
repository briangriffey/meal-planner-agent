# Meal Planner Agent

An automated weekly meal planning agent that uses Claude AI to generate high-protein, low-calorie dinner plans and emails them to you. The agent can also browse HEB's website to find ingredients and include shopping links.

## Features

- **AI-Powered Meal Planning**: Uses Claude to generate personalized, nutritious dinner plans
- **Multi-User Support**: Independent configurations, preferences, and meal history for multiple users
- **High Protein, Low Calorie**: Configurable nutritional targets (default: 40g+ protein, <600 calories)
- **Meal Variety Tracking**: Automatically tracks previous meals to avoid repetition week-to-week
- **Email Delivery**: Automatically sends formatted meal plans via Gmail
- **HEB Integration**: Browses HEB website to find ingredients and create shopping links
- **Weekly Scheduling**: Runs automatically on a schedule (default: Sunday 10:00 AM)
- **Extensible Connectors**: Easy to add new capabilities (delivery services, other stores, etc.)

## Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- Anthropic API key
- Gmail account with App Password enabled

## Installation

1. Clone or navigate to the project directory:
```bash
cd meal-planner-agent
```

2. Install dependencies:
```bash
pnpm install
# or: npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. Configure Gmail:

You need to create a Gmail App Password (not your regular Gmail password):

- Go to your Google Account settings
- Navigate to Security > 2-Step Verification (enable if not already)
- Scroll down to "App passwords"
- Generate a new app password for "Mail"
- Copy the 16-character password

5. Create user configuration file:
```bash
cp config/users.json.example config/users.json
nano config/users.json
```

Add your user(s) to the configuration:
```json
{
  "users": {
    "your-name": {
      "userId": "your-name",
      "email": {
        "recipients": ["your-email@gmail.com"]
      },
      "schedule": {
        "dayOfWeek": 0,
        "hour": 10,
        "minute": 0
      },
      "preferences": {
        "numberOfMeals": 7,
        "servingsPerMeal": 2,
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

See [Multi-User Documentation](./docs/MULTI_USER.md) for complete configuration options and examples.

## Usage

**Important**: All commands require the `--user <userId>` flag to specify which user configuration to use.

### Test Mode (Email Saved to File)

Run the agent immediately and save the email to `TESTEMAIL.html`:

```bash
pnpm test:now --user your-name
```

### Production Mode (Send Email)

Run the agent immediately and send the email to configured recipients:

```bash
pnpm test:now:send --user your-name
# or: pnpm run dev -- --now --sendemail --user your-name
```

### Scheduled Mode

Run the agent on a schedule (using the schedule from user config):

```bash
pnpm start --user your-name
# or after building: node dist/index.js --user your-name
```

**Test Mode** saves the email content to `TESTEMAIL.html` instead of sending it. This is perfect for testing your configuration without sending actual emails. Open `TESTEMAIL.html` in your browser to preview the meal plan.

For more usage examples and multi-user scenarios, see [Multi-User Documentation](./docs/MULTI_USER.md).

## How It Works

1. **Scheduling**: The agent uses node-cron to run at your specified day/time
2. **Meal History**: Loads previous meal plans to ensure variety across weeks
3. **AI Generation**: Claude generates a 7-day meal plan based on your preferences and recent meal history
4. **Tool Use**: Claude autonomously uses connectors to:
   - Browse HEB for ingredients (optional)
   - Format and send email with meal plan
5. **Saving History**: After generation, the new meal plan is saved to `data/meal-history.json`
6. **Extensibility**: Add new connectors in `src/connectors/` to enable new capabilities

For more details on the meal history feature, see [docs/MEAL_HISTORY.md](./docs/MEAL_HISTORY.md).

## Testing

The project includes comprehensive test scripts for validating functionality:

```bash
# Run agent with email saved to file (test mode)
pnpm test:now

# Run agent immediately AND send actual email ⚠️
pnpm test:now:send

# Test HEB scraping standalone
pnpm test:heb-scraper

# Test HEB connector integration
pnpm test:heb-connector

# Test meal history tracking and variety
pnpm test:meal-history

# Test multi-user functionality
pnpm test:multi-user

# Alternative: Send actual email (requires confirmation)
CONFIRM_EMAIL_SEND=true pnpm test:email-send
```

See [tests/README.md](./tests/README.md) for detailed test documentation.

## Project Structure

```
meal-planner-agent/
├── src/
│   ├── connectors/
│   │   ├── base.ts          # Connector base class and registry
│   │   ├── email.ts         # Gmail email connector
│   │   └── web.ts           # HEB browsing and web search connectors
│   ├── services/
│   │   ├── agent.ts         # Main agent logic with Claude integration
│   │   ├── mealHistory.ts   # Meal history tracking service
│   │   └── userConfig.ts    # Multi-user configuration service
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── index.ts             # Entry point with scheduling
├── config/
│   ├── config.json          # Legacy single-user configuration (gitignored)
│   ├── users.json           # Multi-user configurations (gitignored)
│   └── users.json.example   # Example multi-user config
├── data/
│   ├── meal-history.json    # Legacy meal history (gitignored)
│   └── users/               # User-specific data (gitignored)
│       ├── user1/
│       │   └── meal-history.json
│       └── user2/
│           └── meal-history.json
├── docs/
│   ├── MEAL_HISTORY.md      # Meal history feature documentation
│   └── MULTI_USER.md        # Multi-user feature documentation
├── tests/
│   ├── heb-scraper/         # HEB scraping tests
│   ├── test-email-send.ts   # Production email test
│   ├── test-meal-history.ts # Meal history tests
│   ├── test-multi-user.ts   # Multi-user tests
│   └── README.md            # Test documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Adding New Connectors

To add a new connector (e.g., for Instacart, meal tracking, etc.):

1. Create a new file in `src/connectors/`:
```typescript
import { BaseConnector } from './base';

export class MyNewConnector extends BaseConnector {
  name = 'my_new_tool';

  async execute(params: any): Promise<any> {
    // Your implementation
    return { success: true, data: 'result' };
  }
}
```

2. Register it in `src/index.ts`:
```typescript
registry.register(new MyNewConnector());
```

3. Add the tool definition in `src/connectors/base.ts` in the `getDescription` and `getInputSchema` methods.

Claude will automatically discover and use your new connector!

## Troubleshooting

### Email not sending:
- Verify your Gmail App Password is correct (16 characters, no spaces)
- Check that 2-Step Verification is enabled on your Google account
- Make sure the email addresses in config.json are correct

### HEB browsing fails:
- This feature requires Puppeteer which downloads Chromium
- First run may take longer to download browser
- Set `heb.enabled: false` in config if you don't need this feature

### Agent doesn't run on schedule:
- Make sure the process is running (`npm start`)
- Check your cron expression is correct
- Use `--now` flag to test immediately

### ANTHROPIC_API_KEY error:
- Ensure your API key is set in `.env` file
- The key should start with `sk-ant-`
- Get your key from: https://console.anthropic.com/

## License

MIT
