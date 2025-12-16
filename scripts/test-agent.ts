#!/usr/bin/env ts-node

/**
 * Test the Meal Planner Agent locally
 *
 * This script runs the meal planner agent directly without the queue,
 * allowing you to test meal plan generation quickly during development.
 *
 * Usage:
 *   pnpm test:agent
 *
 * The generated email will be saved to TESTEMAIL.html in the project root.
 */

import { config } from 'dotenv';
import { PrismaClient } from '@meal-planner/database';
import {
  MealPlannerAgentFactory,
  ConnectorRegistry,
  EmailConnector,
  HEBOfflineConnector,
  CLAUDE_MODEL
} from '@meal-planner/core';

// Load environment variables
config();

async function testAgent() {
  console.log('🧪 Testing Meal Planner Agent Locally\n');
  console.log('═'.repeat(60));

  const prisma = new PrismaClient();

  try {
    // Get or create test user
    let user = await prisma.user.findFirst({
      where: { email: 'brian.a.griffey@gmail.com' },
      include: { userPreferences: true },
    });

    if (!user) {
      console.log('📝 Creating test user...');
      user = await prisma.user.create({
        data: {
          email: 'brian.a.griffey@gmail.com',
          name: 'Brian Griffey',
          password: 'test-hash',
          userPreferences: {
            create: {
              emailRecipients: ['brian.a.griffey@gmail.com'],
              numberOfMeals: 3,
              servingsPerMeal: 2,
              minProteinPerMeal: 40,
              maxCaloriesPerMeal: 600,
              dietaryRestrictions: [],
              hebEnabled: false, // Set to true to test HEB integration
            },
          },
        },
        include: { userPreferences: true },
      });
      console.log('✅ Test user created\n');
    } else {
      console.log('✅ Using existing test user\n');
    }

    if (!user || !user.userPreferences) {
      throw new Error('User or user preferences not found');
    }

    const prefs = user.userPreferences;

    console.log('User Configuration:');
    console.log('  Email:', user.email);
    console.log('  Number of Meals:', prefs.numberOfMeals);
    console.log('  Servings per Meal:', prefs.servingsPerMeal);
    console.log('  Min Protein:', prefs.minProteinPerMeal + 'g');
    console.log('  Max Calories:', prefs.maxCaloriesPerMeal);
    console.log('  HEB Enabled:', prefs.hebEnabled);
    console.log('  Dietary Restrictions:', prefs.dietaryRestrictions.join(', ') || 'None');
    console.log('═'.repeat(60) + '\n');

    // Verify environment variables
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not set in environment');
    }
    if (!process.env.GMAIL_USER) {
      console.warn('⚠️  GMAIL_USER not set - using default test email');
    }

    console.log('🤖 Initializing agent...\n');

    // Create connector registry
    const connectorRegistry = new ConnectorRegistry();

    // Email connector (test mode - saves to file)
    const emailConnector = new EmailConnector(
      {
        user: process.env.GMAIL_USER || 'test@example.com',
        appPassword: process.env.GMAIL_APP_PASSWORD || 'test',
        recipients: prefs.emailRecipients,
      },
      true // Test mode - saves to TESTEMAIL.html
    );
    connectorRegistry.register(emailConnector);

    // HEB connector - always use offline for testing (generates search URLs only)
    console.log('🛒 Using HEB offline connector (URL generation only)...');
    const hebConnector = new HEBOfflineConnector();
    connectorRegistry.register(hebConnector);

    console.log('✅ Connectors initialized\n');

    // Create agent with progress callback
    const agent = MealPlannerAgentFactory.create(
      user.id,
      {
        numberOfMeals: prefs.numberOfMeals,
        servingsPerMeal: prefs.servingsPerMeal,
        minProteinPerMeal: prefs.minProteinPerMeal,
        maxCaloriesPerMeal: prefs.maxCaloriesPerMeal,
        dietaryRestrictions: prefs.dietaryRestrictions,
      },
      prisma,
      connectorRegistry,
      process.env.ANTHROPIC_API_KEY!,
      CLAUDE_MODEL,
      async (percent: number, message: string) => {
        const barLength = 40;
        const filled = Math.round((percent / 100) * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        process.stdout.write(`\r[${bar}] ${percent.toFixed(0)}% - ${message}`);
      },
      false // hebEnabled: false (use offline HEB connector)
    );

    console.log('🚀 Starting meal plan generation...\n');
    console.log('═'.repeat(60));

    const startTime = Date.now();

    // Generate meal plan
    const result = await agent.generateMealPlan();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ Meal plan generation complete!\n');

    console.log('Results:');
    console.log('  Duration:', duration + 's');
    console.log('  Meals Generated:', result.meals?.length || 0);
    console.log('  Email Sent:', result.emailSent ? 'Yes (saved to TESTEMAIL.html)' : 'No');
    console.log('  Iterations:', result.iterationCount);

    if (result.meals && result.meals.length > 0) {
      console.log('\nGenerated Meals:');
      result.meals.forEach((meal: any, i: number) => {
        console.log(`  ${i + 1}. ${meal.name}`);
        console.log(`     - Protein: ${meal.protein}g, Calories: ${meal.calories}`);
      });
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📧 Email saved to: TESTEMAIL.html');
    console.log('💡 Open the file in a browser to view the meal plan');
    console.log('═'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAgent()
  .then(() => {
    console.log('✅ Test completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
