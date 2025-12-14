import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * List all meal plans for the current user
 * GET /api/meal-plans?page=1&limit=10
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [mealPlans, total] = await Promise.all([
      prisma.mealPlan.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          weekStartDate: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          weekStartDate: true,
          status: true,
          generatedAt: true,
          emailSent: true,
          jobId: true,
          claudeModel: true,
        },
      }),
      prisma.mealPlan.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      mealPlans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
