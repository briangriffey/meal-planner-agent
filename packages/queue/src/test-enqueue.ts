#!/usr/bin/env node

/**
 * Test script to enqueue a meal plan generation job
 * Usage: ts-node src/test-enqueue.ts
 */

import { config } from 'dotenv';
import { PrismaClient } from '@meal-planner/database';
import { enqueueMealPlanGeneration } from './client';

config();

async function testEnqueue() {
  console.log('🧪 Testing meal plan job enqueueing...\n');

  const prisma = new PrismaClient();

  try {
    // Get a user (or create a test user)
    let user = await prisma.user.findFirst({
      include: { userPreferences: true },
    });

    if (!user) {
      console.log('📝 Creating test user...');
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          externalUserId: 'test-user',
          userPreferences: {
            create: {
              emailRecipients: ['test@example.com'],
              numberOfMeals: 3,
              servingsPerMeal: 2,
              minProteinPerMeal: 40,
              maxCaloriesPerMeal: 600,
              dietaryRestrictions: [],
              hebEnabled: false, // Disable HEB for testing
            },
          },
        },
        include: { userPreferences: true },
      });
    }

    console.log(`✅ User: ${user.email} (${user.id})\n`);

    if (!user.userPreferences) {
      throw new Error('User has no preferences');
    }

    // Create a meal plan record
    const claudeModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() + (7 - weekStart.getDay()) % 7);
    weekStart.setHours(0, 0, 0, 0);

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        weekStartDate: weekStart,
        status: 'PENDING',
        claudeModel,
      },
    });

    console.log(`📝 Created meal plan: ${mealPlan.id}`);
    console.log(`   Week starting: ${weekStart.toISOString()}\n`);

    // Enqueue the job
    const prefs = user.userPreferences;
    const { jobId, mealPlanId } = await enqueueMealPlanGeneration({
      userId: user.id,
      mealPlanId: mealPlan.id,
      preferences: {
        numberOfMeals: prefs.numberOfMeals,
        servingsPerMeal: prefs.servingsPerMeal,
        minProteinPerMeal: prefs.minProteinPerMeal,
        maxCaloriesPerMeal: prefs.maxCaloriesPerMeal,
        dietaryRestrictions: prefs.dietaryRestrictions,
      },
      hebEnabled: prefs.hebEnabled,
      claudeModel,
      emailConfig: {
        user: process.env.GMAIL_USER || 'test@example.com',
        appPassword: process.env.GMAIL_APP_PASSWORD || 'test',
        recipients: prefs.emailRecipients,
      },
      testMode: true, // Test mode - saves email to file instead of sending
    });

    console.log(`✅ Job enqueued successfully!`);
    console.log(`   Job ID: ${jobId}`);
    console.log(`   Meal Plan ID: ${mealPlanId}\n`);
    console.log(`👉 Make sure the worker is running to process this job:`);
    console.log(`   pnpm --filter @meal-planner/queue dev\n`);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testEnqueue().catch(console.error);
