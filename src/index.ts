import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import { MealPlannerAgent } from './services/agent';
import { ConnectorRegistry } from './connectors/base';
import { EmailConnector } from './connectors/email';
import { HEBBrowsingConnector, WebSearchConnector } from './connectors/web';
import { Config } from './types';

dotenv.config();

function loadConfig(): Config {
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
        recipient: process.env.EMAIL_RECIPIENT || ''
      },
      schedule: {
        dayOfWeek: 0,
        hour: 10,
        minute: 0
      },
      preferences: {
        minProteinPerMeal: 40,
        maxCaloriesPerMeal: 600,
        dietaryRestrictions: []
      },
      heb: {
        enabled: true
      }
    };
  }
}

async function runMealPlanner(config: Config): Promise<void> {
  console.log('\n=== Starting Meal Planner Agent ===');
  console.log(`Time: ${new Date().toLocaleString()}\n`);

  const registry = new ConnectorRegistry();

  registry.register(new EmailConnector(config.email));
  registry.register(new HEBBrowsingConnector());
  registry.register(new WebSearchConnector());

  const agent = new MealPlannerAgent(config, registry);

  try {
    await agent.generateMealPlan();
    console.log('\n=== Meal Planner Agent Complete ===\n');
  } catch (error) {
    console.error('Error running meal planner:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  const config = loadConfig();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!config.email.user || !config.email.appPassword) {
    console.warn('Warning: Gmail credentials not configured. Email sending will fail.');
  }

  const args = process.argv.slice(2);

  if (args.includes('--now') || args.includes('-n')) {
    console.log('Running meal planner immediately...');
    await runMealPlanner(config);
    return;
  }

  const { dayOfWeek, hour, minute } = config.schedule;
  const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;

  console.log('Meal Planner Agent started!');
  console.log(`Scheduled to run: Every ${getDayName(dayOfWeek)} at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  console.log(`Cron expression: ${cronExpression}`);
  console.log('\nWaiting for scheduled time...');
  console.log('Press Ctrl+C to stop\n');
  console.log('Run with --now flag to execute immediately: npm run dev -- --now\n');

  cron.schedule(cronExpression, async () => {
    try {
      await runMealPlanner(config);
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
