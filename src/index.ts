import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { MealPlannerAgent } from './services/agent';
import { ConnectorRegistry } from './connectors/base';
import { EmailConnector } from './connectors/email';
import { HEBBrowsingConnector, WebSearchConnector } from './connectors/web';
import { Config } from './types';
import { UserConfigService } from './services/userConfig';

const envPath = path.join(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  console.error('Attempted path:', envPath);
  console.error('process.cwd():', process.cwd());
}

/**
 * Load legacy single-user config (for backwards compatibility)
 */
function loadLegacyConfig(): Config {
  const configPath = process.env.CONFIG_PATH || './config/config.json';

  try {
    const fs = require('fs');
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`Failed to load config from ${configPath}:`, error);
    console.log('Using default configuration...');

    return {
      email: {
        user: process.env.GMAIL_USER || '',
        appPassword: process.env.GMAIL_APP_PASSWORD || '',
        recipients: process.env.EMAIL_RECIPIENTS?.split(',').map(r => r.trim()) || []
      },
      schedule: {
        dayOfWeek: 0,
        hour: 10,
        minute: 0
      },
      preferences: {
        numberOfMeals: 7,
        servingsPerMeal: 2,
        minProteinPerMeal: 40,
        maxCaloriesPerMeal: 600,
        dietaryRestrictions: []
      },
      heb: {
        enabled: true
      },
      claude: {
        model: 'claude-3-sonnet-20240229'
      }
    };
  }
}

async function runMealPlanner(config: Config, testMode: boolean = false, userId?: string): Promise<void> {
  console.log('\n=== Starting Meal Planner Agent ===');
  if (userId) {
    console.log(`User: ${userId}`);
  }
  console.log(`Time: ${new Date().toLocaleString()}`);
  if (testMode) {
    console.log('Mode: TEST (email will be saved to TESTEMAIL.html)\n');
  } else {
    console.log('Mode: PRODUCTION (email will be sent)\n');
  }

  const registry = new ConnectorRegistry();

  registry.register(new EmailConnector(config.email, testMode));
  registry.register(new HEBBrowsingConnector());
  registry.register(new WebSearchConnector());

  const agent = new MealPlannerAgent(config, registry, userId);

  try {
    await agent.generateMealPlan();
    console.log('\n=== Meal Planner Agent Complete ===\n');
    if (testMode) {
      console.log('Email content saved to: TESTEMAIL.html\n');
    }
  } catch (error) {
    console.error('Error running meal planner:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  const args = process.argv.slice(2);

  // Parse command-line arguments
  const userIdIndex = args.indexOf('--user');
  const userId = userIdIndex !== -1 && args[userIdIndex + 1] ? args[userIdIndex + 1] : undefined;

  // Initialize user config service
  const systemEmail = {
    user: process.env.GMAIL_USER || '',
    appPassword: process.env.GMAIL_APP_PASSWORD || ''
  };
  const claudeModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
  const userConfigService = new UserConfigService(undefined, systemEmail, claudeModel);

  // Determine which config to use
  let config: Config;

  if (userId) {
    // Multi-user mode: load config for specific user
    const userConfig = userConfigService.getUserConfig(userId);
    if (!userConfig) {
      console.error(`Error: User '${userId}' not found in users.json`);
      console.log('\nAvailable users:', userConfigService.getAllUserIds().join(', ') || 'none');
      console.log('\nTo create a user, add them to config/users.json or use the migration command.');
      process.exit(1);
    }
    config = userConfigService.toSystemConfig(userConfig);
    console.log(`Loading configuration for user: ${userId}`);
  } else {
    // Legacy mode: load from config.json
    config = loadLegacyConfig();
    console.log('Loading legacy single-user configuration from config.json');
    console.log('Tip: Use --user <userId> to specify a user from users.json');
  }

  if (!config.email.user || !config.email.appPassword) {
    console.warn('Warning: Gmail credentials not configured. Email sending will fail.');
  }

  // Handle immediate execution
  if (args.includes('--now') || args.includes('-n')) {
    console.log('Running meal planner immediately...');
    const sendEmail = args.includes('--sendemail');
    const testMode = !sendEmail;

    if (sendEmail) {
      console.log('⚠️  --sendemail flag detected: Email will be SENT to recipients!');
    }

    await runMealPlanner(config, testMode, userId);
    return;
  }

  // Handle scheduled execution
  if (userId) {
    // For multi-user scheduled mode, run for all users with their own schedules
    console.error('Error: Scheduled multi-user mode not yet implemented in this version.');
    console.error('Use --now --user <userId> to run immediately for a specific user.');
    process.exit(1);
  } else {
    // Legacy scheduled mode for single user
    const { dayOfWeek, hour, minute } = config.schedule;
    const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;

    console.log('Meal Planner Agent started!');
    console.log(`Scheduled to run: Every ${getDayName(dayOfWeek)} at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    console.log(`Cron expression: ${cronExpression}`);
    console.log('\nWaiting for scheduled time...');
    console.log('Press Ctrl+C to stop\n');
    console.log('Run with --now flag to execute immediately: npm run dev -- --now');
    console.log('Add --sendemail to actually send emails: npm run dev -- --now --sendemail\n');

    cron.schedule(cronExpression, async () => {
      try {
        await runMealPlanner(config);
      } catch (error) {
        console.error('Scheduled run failed:', error);
      }
    });
  }
}

function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
