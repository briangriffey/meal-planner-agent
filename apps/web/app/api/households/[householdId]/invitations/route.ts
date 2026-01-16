import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';
import { sendHouseholdInvitationEmail } from '@/lib/email/household-invitation';

const inviteSchema = z.object({
  email: z.string().email(),
});

/**
 * List pending invitations for a household
 * GET /api/households/[householdId]/invitations
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

    // Get pending invitations (not yet accepted)
    const invitations = await prisma.householdInvitation.findMany({
      where: {
        householdId: params.householdId,
        acceptedAt: null,
      },
      include: {
        inviterUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error('Error fetching household invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send household invitation email
 * POST /api/households/[householdId]/invitations
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
    const { email } = inviteSchema.parse(body);

    // Verify household exists and get details
    const household = await prisma.household.findUnique({
      where: { id: params.householdId },
      select: {
        id: true,
        name: true,
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

    // Check if email is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      const existingMember = await prisma.householdMember.findUnique({
        where: {
          householdId_userId: {
            householdId: params.householdId,
            userId: existingUser.id,
          },
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a member of this household' },
          { status: 409 }
        );
      }
    }

    // Check if there's already a pending invitation for this email
    const existingInvitation = await prisma.householdInvitation.findFirst({
      where: {
        householdId: params.householdId,
        email,
        acceptedAt: null,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 409 }
      );
    }

    // Generate invitation token (7-day expiry)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create invitation
    const invitation = await prisma.householdInvitation.create({
      data: {
        householdId: params.householdId,
        inviterUserId: session.user.id,
        email,
        token,
        expiresAt,
      },
      include: {
        inviterUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send invitation email (don't fail if email fails)
    try {
      await sendHouseholdInvitationEmail(
        email,
        token,
        household.name,
        session.user.name || null
      );
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      // Invitation record still created
    }

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating household invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
