import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateMemberPreferencesSchema = z.object({
  dietaryRestrictions: z.array(z.string()).optional(),
  minProteinPerMeal: z.number().int().min(0).optional(),
  maxCaloriesPerMeal: z.number().int().min(0).optional(),
});

/**
 * Update member preferences
 * PUT /api/households/[householdId]/members/[memberId]
 */
export async function PUT(
  request: Request,
  { params }: { params: { householdId: string; memberId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateMemberPreferencesSchema.parse(body);

    // Get household and member
    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      select: { id: true, ownerId: true },
    });

    if (!household) {
      return NextResponse.json(
        { error: 'Household not found' },
        { status: 404 }
      );
    }

    const member = await prisma.householdMember.findUnique({
      where: {
        id: params.memberId,
        householdId: params.householdId,
      },
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
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or updating their own preferences
    const isOwner = household.ownerId === session.user.id;
    const isSelf = member.userId === session.user.id;

    if (!isOwner && !isSelf) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own preferences or must be the household owner' },
        { status: 403 }
      );
    }

    // Update or create preferences
    const preferences = await prisma.memberPreferences.upsert({
      where: { householdMemberId: params.memberId },
      update: data,
      create: {
        householdMemberId: params.memberId,
        ...data,
      },
    });

    // Return updated member with preferences
    const updatedMember = await prisma.householdMember.findUnique({
      where: { id: params.memberId },
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
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating member preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Remove member from household (owner only)
 * DELETE /api/households/[householdId]/members/[memberId]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { householdId: string; memberId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get household
    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      select: { id: true, ownerId: true },
    });

    if (!household) {
      return NextResponse.json(
        { error: 'Household not found' },
        { status: 404 }
      );
    }

    // Check if user is owner
    const isOwner = household.ownerId === session.user.id;

    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: Only the household owner can remove members' },
        { status: 403 }
      );
    }

    // Get member to check role and user ID
    const member = await prisma.householdMember.findUnique({
      where: {
        id: params.memberId,
        householdId: params.householdId,
      },
      select: {
        id: true,
        role: true,
        userId: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Cannot remove owner from household
    if (member.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Forbidden: Cannot remove the household owner' },
        { status: 403 }
      );
    }

    // Delete member (cascade will handle preferences)
    await prisma.householdMember.delete({
      where: { id: params.memberId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error removing household member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
