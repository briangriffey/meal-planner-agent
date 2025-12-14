import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { enqueueMealPlanGeneration } from '@/lib/queue';
import { CLAUDE_MODEL } from '@meal-planner/core/src/constants';
import { z } from 'zod';

const generateSchema = z.object({
  weekStartDate: z.string().optional(),
  sendEmail: z.boolean().default(true),
});

/**
 * Generate a new meal plan
 * POST /api/meal-plans/generate
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { weekStartDate, sendEmail } = generateSchema.parse(body);

    // Get user preferences
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'User preferences not found' },
        { status: 404 }
      );
    }

    // Calculate week start date (defaults to next Sunday)
    let weekStart: Date;
    if (weekStartDate) {
      weekStart = new Date(weekStartDate);
    } else {
      const today = new Date();
      weekStart = new Date(today);
      weekStart.setDate(today.getDate() + (7 - today.getDay()) % 7);
    }
    weekStart.setHours(0, 0, 0, 0);

    // Check if meal plan already exists for this week
    const existingPlan = await prisma.mealPlan.findFirst({
      where: {
        userId: session.user.id,
        weekStartDate: weekStart,
        status: {
          in: ['PENDING', 'PROCESSING', 'COMPLETED'],
        },
      },
    });

    if (existingPlan) {
      return NextResponse.json(
        {
          error: 'Meal plan already exists for this week',
          mealPlanId: existingPlan.id,
          status: existingPlan.status,
        },
        { status: 409 }
      );
    }

    // Create meal plan record
    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        weekStartDate: weekStart,
        status: 'PENDING',
        claudeModel: CLAUDE_MODEL,
      },
    });

    // Enqueue job
    const { jobId } = await enqueueMealPlanGeneration({
      userId: session.user.id,
      mealPlanId: mealPlan.id,
      preferences: {
        numberOfMeals: userPreferences.numberOfMeals,
        servingsPerMeal: userPreferences.servingsPerMeal,
        minProteinPerMeal: userPreferences.minProteinPerMeal,
        maxCaloriesPerMeal: userPreferences.maxCaloriesPerMeal,
        dietaryRestrictions: userPreferences.dietaryRestrictions,
      },
      hebEnabled: userPreferences.hebEnabled,
      claudeModel: CLAUDE_MODEL,
      emailConfig: {
        recipients: sendEmail ? userPreferences.emailRecipients : [],
      },
      testMode: !sendEmail,
    });

    // Update meal plan with job ID
    await prisma.mealPlan.update({
      where: { id: mealPlan.id },
      data: { jobId },
    });

    return NextResponse.json(
      {
        message: 'Meal plan generation started',
        mealPlanId: mealPlan.id,
        jobId,
        status: 'PENDING',
        weekStartDate: weekStart.toISOString(),
        estimatedDuration: 120, // 2 minutes estimate
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
