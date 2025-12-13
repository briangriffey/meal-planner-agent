#!/usr/bin/env ts-node
/**
 * Test script for sending actual emails
 *
 * This script runs the meal planner agent in PRODUCTION mode,
 * which means it will actually send emails to the configured recipients.
 *
 * USE WITH CAUTION - This will send real emails!
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { MealPlannerAgent } from '../src/services/agent';
import { ConnectorRegistry } from '../src/connectors/base';
import { EmailConnector } from '../src/connectors/email';
import { HEBBrowsingConnector, WebSearchConnector } from '../src/connectors/web';
import { Config } from '../src/types';

// Load environment variables
const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

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
        recipients: process.env.EMAIL_RECIPIENTS?.split(',').map(r => r.trim()) || []
      },
      schedule: {
        dayOfWeek: 0,
        hour: 10,
        minute: 0
      },
      preferences: {
        numberOfMeals: 7,
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

async function testEmailSend(): Promise<void> {
  console.log('\n========================================');
  console.log('🚨 EMAIL SEND TEST - PRODUCTION MODE 🚨');
  console.log('========================================\n');

  const config = loadConfig();

  // Validate required environment variables
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!config.email.user || !config.email.appPassword) {
    console.error('❌ Error: Gmail credentials not configured');
    console.error('   Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env');
    process.exit(1);
  }

  if (!config.email.recipients || config.email.recipients.length === 0) {
    console.error('❌ Error: No email recipients configured');
    console.error('   Please set EMAIL_RECIPIENTS in .env or config/config.json');
    process.exit(1);
  }

  // Show configuration summary
  console.log('📧 Email Configuration:');
  console.log(`   From: ${config.email.user}`);
  console.log(`   To: ${config.email.recipients.join(', ')}`);
  console.log('');
  console.log('🍽️  Meal Preferences:');
  console.log(`   Number of meals: ${config.preferences.numberOfMeals}`);
  console.log(`   Min protein: ${config.preferences.minProteinPerMeal}g per meal`);
  console.log(`   Max calories: ${config.preferences.maxCaloriesPerMeal} per meal`);
  console.log('');
  console.log('🛒 HEB Integration: ' + (config.heb.enabled ? 'Enabled ✅' : 'Disabled ❌'));
  console.log('');

  // Confirmation prompt
  console.log('⚠️  WARNING: This will send ACTUAL EMAILS to the recipients above!');
  console.log('');
  console.log('To confirm, set the environment variable CONFIRM_EMAIL_SEND=true');
  console.log('Example: CONFIRM_EMAIL_SEND=true npx ts-node tests/test-email-send.ts');
  console.log('');

  if (process.env.CONFIRM_EMAIL_SEND !== 'true') {
    console.log('❌ Email send not confirmed. Exiting safely.');
    console.log('   (This is a safety measure to prevent accidental email sends)');
    process.exit(0);
  }

  console.log('✅ Email send confirmed! Starting meal planner...\n');
  console.log('=== Starting Meal Planner Agent ===');
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('Mode: PRODUCTION (email WILL be sent)\n');

  const registry = new ConnectorRegistry();

  // testMode = false means production mode (actually send emails)
  registry.register(new EmailConnector(config.email, false));
  registry.register(new HEBBrowsingConnector());
  registry.register(new WebSearchConnector());

  const agent = new MealPlannerAgent(config, registry);

  try {
    console.log('Starting meal plan generation...');
    await agent.generateMealPlan();
    console.log('\n=== Meal Planner Agent Complete ===\n');
    console.log('✅ Email sent successfully!');
    console.log(`📧 Check inbox: ${config.email.recipients.join(', ')}`);
  } catch (error) {
    console.error('\n❌ Error running meal planner:', error);
    throw error;
  }
}

testEmailSend()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
