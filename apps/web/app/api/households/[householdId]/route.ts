import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateHouseholdSchema = z.object({
  name: z.string().min(1).max(100),
});

/**
 * Get specific household with members
 * GET /api/households/[householdId]
 */
export async function GET(
  request: Request,
  { params }: { params: { householdId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            preferences: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!household) {
      return NextResponse.json(
        { error: 'Household not found' },
        { status: 404 }
      );
    }

    // Check if user is a member or owner
    const isMember = household.members.some(
      (member) => member.userId === session.user.id
    );
    const isOwner = household.ownerId === session.user.id;

    if (!isMember && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a member of this household' },
        { status: 403 }
      );
    }

    return NextResponse.json(household);
  } catch (error) {
    console.error('Error fetching household:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update household name (owner only)
 * PUT /api/households/[householdId]
 */
export async function PUT(
  request: Request,
  { params }: { params: { householdId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateHouseholdSchema.parse(body);

    // Check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      select: { ownerId: true },
    });

    if (!household) {
      return NextResponse.json(
        { error: 'Household not found' },
        { status: 404 }
      );
    }

    if (household.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the household owner can update the household' },
        { status: 403 }
      );
    }

    // Update household
    const updatedHousehold = await prisma.household.update({
      where: { id: params.householdId },
      data: { name: data.name },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedHousehold);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating household:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Delete household (owner only)
 * DELETE /api/households/[householdId]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { householdId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is the owner
    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      select: { ownerId: true },
    });

    if (!household) {
      return NextResponse.json(
        { error: 'Household not found' },
        { status: 404 }
      );
    }

    if (household.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the household owner can delete the household' },
        { status: 403 }
      );
    }

    // Delete household (cascade will handle members, invitations, etc.)
    await prisma.household.delete({
      where: { id: params.householdId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting household:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
