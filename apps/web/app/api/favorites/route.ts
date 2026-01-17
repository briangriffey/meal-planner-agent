import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * List all favorite recipes for the current user
 * GET /api/favorites?page=1&limit=10
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

    const [favorites, total] = await Promise.all([
      prisma.favoriteRecipe.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          day: true,
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
          fiber: true,
          ingredients: true,
          instructions: true,
          prepTime: true,
          cookTime: true,
          createdAt: true,
          mealRecordId: true,
        },
      }),
      prisma.favoriteRecipe.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
