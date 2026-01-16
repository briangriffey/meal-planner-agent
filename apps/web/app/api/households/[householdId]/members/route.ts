import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const addMemberSchema = z.object({
  userId: z.string(),
});

/**
 * Get all household members with preferences
 * GET /api/households/[householdId]/members
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

    // Verify household exists
    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!household) {
      return NextResponse.json(
        { error: 'Household not found' },
        { status: 404 }
      );
    }

    // Check if user is a member or owner
    const membership = await prisma.householdMember.findUnique({
      where: {
        householdId_userId: {
          householdId: params.householdId,
          userId: session.user.id,
        },
      },
    });

    const isOwner = household.ownerId === session.user.id;

    if (!membership && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You are not a member of this household' },
        { status: 403 }
      );
    }

    // Get all members with their user data and preferences
    const members = await prisma.householdMember.findMany({
      where: { householdId: params.householdId },
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
      orderBy: [
        { role: 'asc' }, // OWNER first
        { joinedAt: 'asc' },
      ],
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching household members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Add member to household (used during invitation acceptance)
 * POST /api/households/[householdId]/members
 */
export async function POST(
  request: Request,
  { params }: { params: { householdId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = addMemberSchema.parse(body);

    // Verify household exists
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

    // Check if user is owner or the user being added
    const isOwner = household.ownerId === session.user.id;
    const isSelf = data.userId === session.user.id;

    if (!isOwner && !isSelf) {
      return NextResponse.json(
        { error: 'Forbidden: Only the household owner or the user themselves can add members' },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.householdMember.findUnique({
      where: {
        householdId_userId: {
          householdId: params.householdId,
          userId: data.userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this household' },
        { status: 409 }
      );
    }

    // Add member with default preferences
    const member = await prisma.householdMember.create({
      data: {
        householdId: params.householdId,
        userId: data.userId,
        role: 'MEMBER',
        preferences: {
          create: {
            dietaryRestrictions: [],
          },
        },
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

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding household member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
