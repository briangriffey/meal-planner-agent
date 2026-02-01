import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Meal data structure stored in EmailActionToken
 */
interface MealData {
  name: string;
  day?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  ingredients?: unknown[];
  instructions?: unknown[];
  prepTime?: string;
  cookTime?: string;
  mealRecordId?: string;
}

/**
 * GET /api/favorites/email-action?token=xxx
 *
 * Handles "Add to Favorites" clicks from emails. Validates the token,
 * creates a favorite recipe, and redirects to dashboard with status.
 *
 * This endpoint does NOT require authentication because the token itself
 * serves as proof of authorization (it was generated for a specific user).
 */
export async function GET(request: NextRequest) {
  try {
    // Extract token from query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Get the actual origin from the request headers to ensure correct redirect in production
    const origin = request.headers.get('x-forwarded-proto') && request.headers.get('x-forwarded-host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
      : new URL(request.url).origin;

    // Missing token
    if (!token) {
      console.log('Email action failed: Missing token');
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_link', origin)
      );
    }

    // Find token in database
    const emailActionToken = await prisma.emailActionToken.findUnique({
      where: { token }
    });

    // Invalid token
    if (!emailActionToken) {
      console.log('Email action failed: Invalid token');
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_link', origin)
      );
    }

    // Check if token was already used
    if (emailActionToken.usedAt) {
      console.log('Email action failed: Token already used');
      return NextResponse.redirect(
        new URL('/dashboard?error=already_added', origin)
      );
    }

    // Check if token is expired (48 hours)
    const now = new Date();
    if (emailActionToken.expiresAt < now) {
      console.log('Email action failed: Expired token');

      // Delete expired token
      await prisma.emailActionToken.delete({
        where: { token }
      });

      return NextResponse.redirect(
        new URL('/dashboard?error=expired_link', origin)
      );
    }

    // Validate action type
    if (emailActionToken.actionType !== 'add_favorite') {
      console.log(`Email action failed: Unknown action type "${emailActionToken.actionType}"`);
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_action', origin)
      );
    }

    // Parse meal data from token
    const mealData = emailActionToken.mealData as unknown as MealData;

    if (!mealData || !mealData.name) {
      console.log('Email action failed: Invalid meal data');

      // Delete invalid token
      await prisma.emailActionToken.delete({
        where: { token }
      });

      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_data', origin)
      );
    }

    // Check if this recipe is already in favorites (by name for this user)
    const existingFavorite = await prisma.favoriteRecipe.findFirst({
      where: {
        userId: emailActionToken.userId,
        name: mealData.name,
      }
    });

    if (existingFavorite) {
      console.log(`Recipe "${mealData.name}" is already in favorites for user ${emailActionToken.userId}`);

      // Mark token as used (so we know it was a duplicate, not invalid)
      await prisma.emailActionToken.update({
        where: { token },
        data: { usedAt: new Date() }
      });

      return NextResponse.redirect(
        new URL('/dashboard?error=already_favorited', origin)
      );
    }

    // Create the favorite recipe
    await prisma.favoriteRecipe.create({
      data: {
        userId: emailActionToken.userId,
        name: mealData.name,
        day: mealData.day,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        fiber: mealData.fiber,
        ingredients: mealData.ingredients,
        instructions: mealData.instructions,
        prepTime: mealData.prepTime,
        cookTime: mealData.cookTime,
        mealRecordId: mealData.mealRecordId,
      },
    });

    // Mark token as used (delete it to prevent reuse)
    await prisma.emailActionToken.delete({
      where: { token }
    });

    console.log(`Successfully added "${mealData.name}" to favorites for user ${emailActionToken.userId}`);

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL('/dashboard?favorite_added=true', origin)
    );

  } catch (error) {
    console.error('Error during email favorite action:', error);

    // Get origin for error redirect
    const origin = request.headers.get('x-forwarded-proto') && request.headers.get('x-forwarded-host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
      : new URL(request.url).origin;

    // Generic error redirect
    return NextResponse.redirect(
      new URL('/dashboard?error=action_failed', origin)
    );
  }
}
