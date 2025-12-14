#!/usr/bin/env ts-node
/**
 * Test script for email sending only
 *
 * This script tests the email connector in PRODUCTION mode
 * by sending a sample meal plan email to configured recipients.
 *
 * NOTE: This does NOT generate a meal plan with AI - it uses
 * a hardcoded sample for testing email functionality only.
 *
 * USE WITH CAUTION - This will send real emails!
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { ConnectorRegistry } from '../src/connectors/base';
import { EmailConnector } from '../src/connectors/email';
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

// Sample meal plan for testing
const SAMPLE_MEAL_PLAN = `
# Weekly Meal Plan - Test Email

## Monday
**Grilled Chicken with Roasted Vegetables**
- Calories: 520
- Protein: 45g
- [Chicken Breast](https://www.heb.com/product-detail/313243)
- [Broccoli](https://www.heb.com/product-detail/319052)

## Tuesday
**Salmon with Quinoa and Asparagus**
- Calories: 580
- Protein: 42g

## Wednesday
**Turkey Chili with Black Beans**
- Calories: 490
- Protein: 48g

## Thursday
**Baked Cod with Sweet Potato**
- Calories: 540
- Protein: 41g

## Friday
**Lean Beef Stir-Fry with Brown Rice**
- Calories: 595
- Protein: 46g

## Saturday
**Greek Chicken Bowl**
- Calories: 510
- Protein: 44g

## Sunday
**Shrimp Tacos with Cabbage Slaw**
- Calories: 485
- Protein: 43g

---

## Shopping List

### Proteins
- Chicken breast (2 lbs)
- Salmon fillet (1 lb)
- Ground turkey (1 lb)
- Cod fillet (1 lb)
- Lean beef (1 lb)
- Large shrimp (1 lb)

### Vegetables
- Broccoli (2 heads)
- Asparagus (1 bunch)
- Sweet potato (2 large)
- Bell peppers (3)
- Cabbage (1 head)
- Mixed vegetables

### Pantry
- Quinoa
- Brown rice
- Black beans
- Taco shells

---

**Note:** This is a TEST email generated to verify email sending functionality.
`;

async function testEmailSend(): Promise<void> {
  console.log('\n========================================');
  console.log('📧 EMAIL SEND TEST - PRODUCTION MODE');
  console.log('========================================\n');

  const config = loadConfig();

  // Validate email configuration
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

  // Confirmation prompt
  console.log('⚠️  WARNING: This will send a TEST EMAIL to the recipients above!');
  console.log('');
  console.log('   Content: Sample meal plan (not AI-generated)');
  console.log('   Purpose: Test email sending functionality only');
  console.log('');
  console.log('To confirm, set the environment variable CONFIRM_EMAIL_SEND=true');
  console.log('Example: CONFIRM_EMAIL_SEND=true pnpm test:email-send');
  console.log('');

  if (process.env.CONFIRM_EMAIL_SEND !== 'true') {
    console.log('❌ Email send not confirmed. Exiting safely.');
    console.log('   (This is a safety measure to prevent accidental email sends)');
    console.log('');
    console.log('💡 Tip: To test with a FULL meal plan, use:');
    console.log('   pnpm test:now:send');
    process.exit(0);
  }

  console.log('✅ Email send confirmed!\n');
  console.log('=== Testing Email Connector ===');
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('Mode: PRODUCTION (email WILL be sent)\n');

  const registry = new ConnectorRegistry();

  // testMode = false means production mode (actually send emails)
  const emailConnector = new EmailConnector(config.email, false);
  registry.register(emailConnector);

  try {
    console.log('📤 Sending test email with sample meal plan...');

    // Execute the email connector directly with sample content
    await emailConnector.execute({
      subject: 'Test Email - Weekly Meal Plan',
      body: SAMPLE_MEAL_PLAN
    });

    console.log('\n=== Email Test Complete ===\n');
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Check inbox: ${config.email.recipients.join(', ')}`);
    console.log('');
    console.log('📝 Note: This was a test email with sample content.');
    console.log('   To generate a real meal plan with AI, use: pnpm test:now:send');
  } catch (error) {
    console.error('\n❌ Error sending email:', error);
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
