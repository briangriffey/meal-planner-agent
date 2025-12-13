# Meal Planner Agent

An automated weekly meal planning agent that uses Claude AI to generate high-protein, low-calorie dinner plans and emails them to you. The agent can also browse HEB's website to find ingredients and include shopping links.

## Features

- **AI-Powered Meal Planning**: Uses Claude to generate personalized, nutritious dinner plans
- **High Protein, Low Calorie**: Configurable nutritional targets (default: 40g+ protein, <600 calories)
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

5. Edit the configuration file:
```bash
nano config/config.json
```

Update with your details:
```json
{
  "email": {
    "user": "your-email@gmail.com",
    "appPassword": "your-16-char-app-password",
    "recipient": "your-email@gmail.com"
  },
  "schedule": {
    "dayOfWeek": 0,
    "hour": 10,
    "minute": 0
  },
  "preferences": {
    "minProteinPerMeal": 40,
    "maxCaloriesPerMeal": 600,
    "dietaryRestrictions": []
  },
  "heb": {
    "enabled": true
  }
}
```

### Configuration Options

- `schedule.dayOfWeek`: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
- `schedule.hour`: Hour in 24-hour format (0-23)
- `schedule.minute`: Minute (0-59)
- `preferences.minProteinPerMeal`: Minimum grams of protein per meal
- `preferences.maxCaloriesPerMeal`: Maximum calories per meal
- `preferences.dietaryRestrictions`: Array of restrictions (e.g., ["gluten-free", "dairy-free"])
- `heb.enabled`: Set to false to disable HEB browsing feature

## Usage

### Test immediately (without cron):
```bash
pnpm test:now
# or: pnpm run dev -- --now
# or: pnpm run dev -- -n
```

This runs the agent once immediately in **TEST MODE**. Instead of sending an email, it will:
- Generate a meal plan
- Browse HEB for ingredients (if enabled)
- Save the email content to `TESTEMAIL.html` in the project root
- Overwrite any existing `TESTEMAIL.html` file

Perfect for testing your configuration without sending actual emails. Open `TESTEMAIL.html` in your browser to preview the meal plan email.

### Build the project:
```bash
pnpm run build
```

### Run on schedule:
```bash
pnpm start
# or after building: node dist/index.js
```

The agent will run in the background and execute at your scheduled time each week. Press Ctrl+C to stop.

### Development mode with auto-reload:
```bash
pnpm run watch
```

## How It Works

1. **Scheduling**: The agent uses node-cron to run at your specified day/time
2. **AI Generation**: Claude generates a 7-day meal plan based on your preferences
3. **Tool Use**: Claude autonomously uses connectors to:
   - Browse HEB for ingredients (optional)
   - Format and send email with meal plan
4. **Extensibility**: Add new connectors in `src/connectors/` to enable new capabilities

## Testing

The project includes comprehensive test scripts for validating functionality:

```bash
# Run agent with email saved to file (test mode)
pnpm test:now

# Test HEB scraping standalone
pnpm test:heb-scraper

# Test HEB connector integration
pnpm test:heb-connector

# Send actual email (requires confirmation)
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
│   │   └── agent.ts         # Main agent logic with Claude integration
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── index.ts             # Entry point with scheduling
├── config/
│   └── config.json          # User configuration
├── tests/
│   ├── heb-scraper/         # HEB scraping tests
│   ├── test-email-send.ts   # Production email test
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
