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

  // Require --user flag
  if (!userId) {
    console.error('Error: --user <userId> flag is required');
    console.log('\nUsage:');
    console.log('  pnpm test:now --user <userId>          # Test mode');
    console.log('  pnpm test:now:send --user <userId>     # Production mode');
    console.log('  pnpm start --user <userId>             # Scheduled mode');
    console.log('\nExample:');
    console.log('  pnpm test:now --user brian');

    const systemEmail = {
      user: process.env.GMAIL_USER || '',
      appPassword: process.env.GMAIL_APP_PASSWORD || ''
    };
    const claudeModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
    const tempConfigService = new UserConfigService(undefined, systemEmail, claudeModel);
    const availableUsers = tempConfigService.getAllUserIds();

    if (availableUsers.length > 0) {
      console.log('\nAvailable users:', availableUsers.join(', '));
    } else {
      console.log('\nNo users found in config/users.json');
      console.log('Create a user by editing config/users.json (see config/users.json.example)');
    }

    process.exit(1);
  }

  // Initialize user config service
  const systemEmail = {
    user: process.env.GMAIL_USER || '',
    appPassword: process.env.GMAIL_APP_PASSWORD || ''
  };
  const claudeModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
  const userConfigService = new UserConfigService(undefined, systemEmail, claudeModel);

  // Load config for specific user
  const userConfig = userConfigService.getUserConfig(userId);
  if (!userConfig) {
    console.error(`Error: User '${userId}' not found in users.json`);
    console.log('\nAvailable users:', userConfigService.getAllUserIds().join(', ') || 'none');
    console.log('\nTo create a user, edit config/users.json (see config/users.json.example)');
    process.exit(1);
  }

  const config = userConfigService.toSystemConfig(userConfig);
  console.log(`Loading configuration for user: ${userId}`);

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
  const { dayOfWeek, hour, minute } = config.schedule;
  const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;

  console.log('Meal Planner Agent started!');
  console.log(`User: ${userId}`);
  console.log(`Scheduled to run: Every ${getDayName(dayOfWeek)} at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  console.log(`Cron expression: ${cronExpression}`);
  console.log('\nWaiting for scheduled time...');
  console.log('Press Ctrl+C to stop\n');
  console.log('Run with --now flag to execute immediately: pnpm test:now --user ' + userId);
  console.log('Add --sendemail to actually send emails: pnpm test:now:send --user ' + userId + '\n');

  cron.schedule(cronExpression, async () => {
    try {
      await runMealPlanner(config, false, userId);
    } catch (error) {
      console.error('Scheduled run failed:', error);
    }
  });
}

function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
