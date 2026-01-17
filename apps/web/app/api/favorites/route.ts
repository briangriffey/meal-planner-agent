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
 * GET /api/favorites?page=1&limit=10&search=chicken&minCalories=300&maxCalories=600&minProtein=20&maxProtein=50
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

    // Search and filter parameters
    const search = searchParams.get('search') || '';
    const minCalories = searchParams.get('minCalories') ? parseInt(searchParams.get('minCalories')!) : undefined;
    const maxCalories = searchParams.get('maxCalories') ? parseInt(searchParams.get('maxCalories')!) : undefined;
    const minProtein = searchParams.get('minProtein') ? parseInt(searchParams.get('minProtein')!) : undefined;
    const maxProtein = searchParams.get('maxProtein') ? parseInt(searchParams.get('maxProtein')!) : undefined;

    // Build where clause with filters
    const whereClause: any = {
      userId: session.user.id,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      }),
    };

    // Add calories filter if either min or max is set
    if (minCalories !== undefined || maxCalories !== undefined) {
      whereClause.calories = {};
      if (minCalories !== undefined) whereClause.calories.gte = minCalories;
      if (maxCalories !== undefined) whereClause.calories.lte = maxCalories;
    }

    // Add protein filter if either min or max is set
    if (minProtein !== undefined || maxProtein !== undefined) {
      whereClause.protein = {};
      if (minProtein !== undefined) whereClause.protein.gte = minProtein;
      if (maxProtein !== undefined) whereClause.protein.lte = maxProtein;
    }

    const [favorites, total] = await Promise.all([
      prisma.favoriteRecipe.findMany({
        where: whereClause,
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
        where: whereClause,
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
