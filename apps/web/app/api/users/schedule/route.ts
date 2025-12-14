import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const scheduleSchema = z.object({
  scheduleDayOfWeek: z.number().int().min(0).max(6).optional(),
  scheduleHour: z.number().int().min(0).max(23).optional(),
  scheduleMinute: z.number().int().min(0).max(59).optional(),
  scheduleEnabled: z.boolean().optional(),
});

/**
 * Get user schedule settings
 * GET /api/users/schedule
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
      select: {
        scheduleDayOfWeek: true,
        scheduleHour: true,
        scheduleMinute: true,
        scheduleEnabled: true,
      },
    });

    if (!preferences) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update user schedule settings
 * PUT /api/users/schedule
 */
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = scheduleSchema.parse(body);

    const preferences = await prisma.userPreferences.update({
      where: { userId: session.user.id },
      data,
      select: {
        scheduleDayOfWeek: true,
        scheduleHour: true,
        scheduleMinute: true,
        scheduleEnabled: true,
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
