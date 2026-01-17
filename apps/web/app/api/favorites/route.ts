import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const favoriteRecipeSchema = z.object({
  name: z.string().min(1),
  day: z.string().optional(),
  calories: z.number().int().min(0).optional(),
  protein: z.number().int().min(0).optional(),
  carbs: z.number().int().min(0).optional(),
  fat: z.number().int().min(0).optional(),
  fiber: z.number().int().min(0).optional(),
  ingredients: z.array(z.any()).optional(),
  instructions: z.array(z.any()).optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  mealRecordId: z.string().optional(),
});

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

/**
 * Add a favorite recipe
 * POST /api/favorites
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = favoriteRecipeSchema.parse(body);

    const favorite = await prisma.favoriteRecipe.create({
      data: {
        userId: session.user.id,
        ...data,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
