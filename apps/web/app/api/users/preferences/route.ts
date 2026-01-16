import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { updateUserScheduledJob } from '@meal-planner/queue';

const preferencesSchema = z.object({
  numberOfMeals: z.number().int().min(1).max(14).optional(),
  servingsPerMeal: z.number().int().min(1).max(10).optional(),
  minProteinPerMeal: z.number().int().min(0).optional(),
  maxCaloriesPerMeal: z.number().int().min(0).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  hebEnabled: z.boolean().optional(),
  scheduleDayOfWeek: z.number().int().min(0).max(6).optional(),
  scheduleHour: z.number().int().min(0).max(23).optional(),
  scheduleMinute: z.number().int().min(0).max(59).optional(),
  scheduleEnabled: z.boolean().optional(),
});

/**
 * Get user preferences
 * GET /api/users/preferences
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update user preferences
 * PUT /api/users/preferences
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = preferencesSchema.parse(body);

    // Always enable schedules regardless of what the user sends
    const updateData = {
      ...data,
      scheduleEnabled: true,
    };

    const preferences = await prisma.userPreferences.update({
      where: { userId: session.user.id },
      data: updateData,
    });

    // Always update the scheduled job to ensure it's in sync
    try {
      await updateUserScheduledJob({
        userId: session.user.id,
        scheduleDayOfWeek: preferences.scheduleDayOfWeek,
        scheduleHour: preferences.scheduleHour,
        scheduleMinute: preferences.scheduleMinute,
        scheduleEnabled: true, // Always enabled
      });
      console.log(`✅ Updated scheduled job for user ${session.user.id}`);
    } catch (queueError) {
      // Log the error but don't fail the preference update
      console.error('Error updating scheduled job:', queueError);
    }

    return NextResponse.json(preferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
