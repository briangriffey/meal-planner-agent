import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { RecipeExplorerAgent } from '@meal-planner/core/src/agent/recipe-explorer';
import { z } from 'zod';

const exploreSchema = z.object({
  cuisine: z.string().optional(),
  prepTime: z.enum(['under-30', '30-60', 'over-60']).optional(),
  minCalories: z.coerce.number().int().min(0).optional(),
  maxCalories: z.coerce.number().int().min(0).optional(),
  minProtein: z.coerce.number().int().min(0).optional(),
  maxProtein: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(20).default(5),
  page: z.coerce.number().int().min(1).default(1),
});

/**
 * Explore AI-generated recipe suggestions with filtering
 * GET /api/recipes/explore?cuisine=italian&prepTime=under-30&limit=5&page=1
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const params = exploreSchema.parse({
      cuisine: searchParams.get('cuisine'),
      prepTime: searchParams.get('prepTime'),
      minCalories: searchParams.get('minCalories'),
      maxCalories: searchParams.get('maxCalories'),
      minProtein: searchParams.get('minProtein'),
      maxProtein: searchParams.get('maxProtein'),
      limit: searchParams.get('limit'),
      page: searchParams.get('page'),
    });

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

    // Check for Anthropic API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Recipe generation service not configured' },
        { status: 503 }
      );
    }

    // Create RecipeExplorerAgent
    const agent = new RecipeExplorerAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      preferences: {
        numberOfMeals: userPreferences.numberOfMeals,
        servingsPerMeal: userPreferences.servingsPerMeal,
        minProteinPerMeal: userPreferences.minProteinPerMeal,
        maxCaloriesPerMeal: userPreferences.maxCaloriesPerMeal,
        dietaryRestrictions: userPreferences.dietaryRestrictions,
      },
    });

    // Generate recipes with filters
    const result = await agent.generateRecipes({
      cuisine: params.cuisine,
      prepTime: params.prepTime,
      minCalories: params.minCalories,
      maxCalories: params.maxCalories,
      minProtein: params.minProtein,
      maxProtein: params.maxProtein,
      count: params.limit,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to generate recipes', details: result.error },
        { status: 500 }
      );
    }

    const recipes = result.recipes || [];

    // Note: For now, we're generating fresh recipes on each request.
    // In a production system, you might want to cache or paginate stored recipes.
    // The page parameter is accepted for future pagination support.
    return NextResponse.json({
      recipes,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: recipes.length,
        totalPages: 1,
      },
      filters: {
        cuisine: params.cuisine,
        prepTime: params.prepTime,
        minCalories: params.minCalories,
        maxCalories: params.maxCalories,
        minProtein: params.minProtein,
        maxProtein: params.maxProtein,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
