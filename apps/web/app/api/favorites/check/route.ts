import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Check if a meal is favorited
 * GET /api/favorites/check?name=Grilled+Chicken
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Name parameter is required' },
        { status: 400 }
      );
    }

    const favorite = await prisma.favoriteRecipe.findFirst({
      where: {
        userId: session.user.id,
        name: name,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      isFavorited: favorite !== null,
      favoriteId: favorite?.id ?? null,
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
