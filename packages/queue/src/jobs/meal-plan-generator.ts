import { Job } from 'bullmq';
import { PrismaClient } from '@meal-planner/database';
import { MealPlannerAgentFactory, EmailConnector } from '@meal-planner/core';
import { MealPlanJobData } from '../client';

/**
 * Process a meal plan generation job
 * This is the main worker job that generates meal plans using the agent
 */
export async function processMealPlanGeneration(job: Job<MealPlanJobData>): Promise<any> {
  const { userId, mealPlanId, preferences, hebEnabled, claudeModel, emailConfig, testMode } = job.data;

  console.log(`🚀 Starting meal plan generation for user ${userId}, plan ${mealPlanId}`);
  console.log(`Payload: ${JSON.stringify(job.data)}`);

  const prisma = new PrismaClient();

  try {
    // Update status to PROCESSING
    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: {
        status: 'PROCESSING',
        jobStartedAt: new Date(),
      },
    });

    // Progress reporting
    await job.updateProgress(10);

    // Email connector - retrieve credentials from environment
    const emailConnector = new EmailConnector(
      {
        user: process.env.GMAIL_USER!,
        appPassword: process.env.GMAIL_APP_PASSWORD!,
        recipients: emailConfig.recipients,
      },
      testMode || false
    );

    await job.updateProgress(20);

    // Create agent with database-backed services and progress callback
    const agent = MealPlannerAgentFactory.create(
      userId,
      preferences,
      prisma,
      emailConnector,
      process.env.ANTHROPIC_API_KEY!,
      claudeModel,
      async (percent: number, message: string) => {
        // Map agent progress (0-100) to job progress (20-90)
        const jobProgress = 20 + (percent / 100) * 70;
        await job.updateProgress(Math.round(jobProgress));
        console.log(`📊 ${Math.round(jobProgress)}%: ${message}`);
      },
      hebEnabled // hebEnabled controls whether MealPlanPostProcessor generates HEB search URLs
    );

    console.log('🤖 Running meal planner agent...');

    // Generate meal plan (this takes 1-5 minutes)
    const result = await agent.generateMealPlan();

    await job.updateProgress(90);

    console.log(`✅ Meal plan generated with ${result.meals?.length || 0} meals`);

    // Save to database
    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: {
        status: 'COMPLETED',
        meals: result.meals as any,
        emailHtml: result.emailHtml,
        emailSent: result.emailSent,
        emailSentAt: result.emailSent ? new Date() : null,
        jobCompletedAt: new Date(),
        iterationCount: result.iterationCount,
        claudeModel: claudeModel,
      },
    });

    // Create individual meal records for analytics
    if (result.meals && result.meals.length > 0) {
      for (const meal of result.meals) {
        await prisma.mealRecord.create({
          data: {
            userId,
            mealPlanId,
            day: meal.day,
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            fiber: meal.fiber,
            ingredients: meal.ingredients as any, // Array of strings
            instructions: meal.instructions as any, // Array of strings
            prepTime: meal.prepTime,
            cookTime: meal.cookTime,
          },
        });
      }
    }

    await job.updateProgress(100);

    console.log(`✅ Meal plan saved to database`);

    return {
      success: true,
      mealPlanId,
      mealsGenerated: result.meals?.length || 0,
      emailSent: result.emailSent,
    };
  } catch (error) {
    console.error(`❌ Error generating meal plan:`, error);

    // Update status to FAILED
    await prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: {
        status: 'FAILED',
        jobError: error instanceof Error ? error.message : 'Unknown error',
        jobCompletedAt: new Date(),
      },
    });

    throw error; // BullMQ will handle retries
  } finally {
    await prisma.$disconnect();
  }
}
