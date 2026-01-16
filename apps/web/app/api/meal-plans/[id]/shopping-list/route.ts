import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import {
  aggregateIngredients,
  formatShoppingListText,
  type MealRecord,
} from '@/lib/shopping-list-utils';

/**
 * Get shopping list as downloadable text file
 * GET /api/meal-plans/[id]/shopping-list
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: params.id,
        userId: session.user.id, // Ensure user can only access their own plans
      },
      include: {
        mealRecords: {
          select: {
            ingredients: true,
            day: true,
            name: true,
          },
        },
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found' },
        { status: 404 }
      );
    }

    // Aggregate ingredients from meal records
    const mealRecords = mealPlan.mealRecords as unknown as MealRecord[];
    const aggregatedIngredients = aggregateIngredients(mealRecords);

    // Format shopping list with title and categories
    const weekStartDate = new Date(mealPlan.weekStartDate);
    const formattedDate = weekStartDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const title = `Shopping List - Week of ${formattedDate}`;
    const textContent = formatShoppingListText(aggregatedIngredients, {
      title,
      includeCategories: true,
    });

    // Generate filename with date
    const filename = `shopping-list-${weekStartDate.toISOString().split('T')[0]}.txt`;

    // Return as downloadable text file
    return new NextResponse(textContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
