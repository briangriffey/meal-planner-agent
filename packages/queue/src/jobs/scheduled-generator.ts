import { Job } from 'bullmq';
import { PrismaClient } from '@meal-planner/database';
import { CLAUDE_MODEL } from '@meal-planner/core';
import { ScheduledJobData, enqueueMealPlanGeneration } from '../client';

/**
 * Process a scheduled meal plan generation
 * This runs on a schedule (cron) and creates a new meal plan generation job
 */
export async function processScheduledGeneration(job: Job<ScheduledJobData>): Promise<any> {
  const { userId } = job.data;

  console.log(`📅 Processing scheduled generation for user ${userId}`);

  const prisma = new PrismaClient();

  try {
    // Get user and preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userPreferences: true },
    });

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    if (!user.userPreferences) {
      throw new Error(`User ${userId} has no preferences configured`);
    }

    const prefs = user.userPreferences;

    // Check if user belongs to a household and get member emails
    const householdMember = await prisma.householdMember.findFirst({
      where: { userId },
      include: {
        household: {
          include: {
            members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Determine email recipients based on household membership
    let emailRecipients: string[] = [];
    if (householdMember?.household) {
      // Extract emails from all household members
      emailRecipients = householdMember.household.members.map((member) => member.user.email);
    } else if (user.email) {
      // Fall back to user's own email if not in household
      emailRecipients = [user.email];
    }

    // Check if scheduling is enabled
    if (!prefs.scheduleEnabled) {
      console.log(`⏸️  Scheduled generation disabled for user ${userId}`);
      return { success: true, skipped: true, reason: 'Scheduling disabled' };
    }

    // Calculate week start date (next Sunday)
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (7 - today.getDay()) % 7);
    weekStart.setHours(0, 0, 0, 0);

    // Check if a meal plan already exists for this week
    const existingPlan = await prisma.mealPlan.findFirst({
      where: {
        userId,
        weekStartDate: weekStart,
        status: {
          in: ['PENDING', 'PROCESSING', 'COMPLETED'],
        },
      },
    });

    if (existingPlan) {
      console.log(`ℹ️  Meal plan already exists for week starting ${weekStart.toISOString()}`);
      return {
        success: true,
        skipped: true,
        reason: 'Meal plan already exists for this week',
        existingPlanId: existingPlan.id,
      };
    }

    // Create a new meal plan record
    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId,
        weekStartDate: weekStart,
        status: 'PENDING',
        claudeModel: CLAUDE_MODEL,
      },
    });

    console.log(`📝 Created meal plan ${mealPlan.id} for week starting ${weekStart.toISOString()}`);

    // Enqueue the meal plan generation job
    const { jobId } = await enqueueMealPlanGeneration({
      userId,
      mealPlanId: mealPlan.id,
      preferences: {
        numberOfMeals: prefs.numberOfMeals,
        servingsPerMeal: prefs.servingsPerMeal,
        minProteinPerMeal: prefs.minProteinPerMeal,
        maxCaloriesPerMeal: prefs.maxCaloriesPerMeal,
        dietaryRestrictions: prefs.dietaryRestrictions,
      },
      hebEnabled: prefs.hebEnabled,
      claudeModel: CLAUDE_MODEL,
      emailConfig: {
        recipients: emailRecipients,
      },
      testMode: false,
    });

    // Update meal plan with job ID
    await prisma.mealPlan.update({
      where: { id: mealPlan.id },
      data: { jobId },
    });

    console.log(`✅ Enqueued meal plan generation job ${jobId}`);

    return {
      success: true,
      mealPlanId: mealPlan.id,
      jobId,
      weekStartDate: weekStart.toISOString(),
    };
  } catch (error) {
    console.error(`❌ Error in scheduled generation:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
