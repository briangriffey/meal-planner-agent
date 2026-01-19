import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Delete a favorite recipe
 * DELETE /api/favorites/[id]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const favoriteRecipe = await prisma.favoriteRecipe.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!favoriteRecipe) {
      return NextResponse.json(
        { error: 'Favorite recipe not found' },
        { status: 404 }
      );
    }

    // Delete favorite recipe
    await prisma.favoriteRecipe.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Favorite recipe deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting favorite recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
