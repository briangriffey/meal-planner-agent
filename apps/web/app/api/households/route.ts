import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createHouseholdSchema = z.object({
  name: z.string().min(1).max(100),
});

/**
 * Get user's households
 * GET /api/households
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get households where user is owner or member
    const ownedHouseholds = await prisma.household.findMany({
      where: { ownerId: session.user.id },
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

    const memberHouseholds = await prisma.household.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
        ownerId: {
          not: session.user.id,
        },
      },
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

    const households = [...ownedHouseholds, ...memberHouseholds];

    return NextResponse.json(households);
  } catch (error) {
    console.error('Error fetching households:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create new household
 * POST /api/households
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createHouseholdSchema.parse(body);

    // Create household with the current user as owner
    const household = await prisma.household.create({
      data: {
        name: data.name,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'OWNER',
          },
        },
      },
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

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating household:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
