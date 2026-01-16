import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Cancel/delete a pending invitation
 * DELETE /api/households/[householdId]/invitations/[invitationId]
 */
export async function DELETE(
  request: Request,
  { params }: { params: { householdId: string; invitationId: string } }
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

    // Verify invitation exists and belongs to this household
    const invitation = await prisma.householdInvitation.findUnique({
      where: { id: params.invitationId },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (invitation.householdId !== params.householdId) {
      return NextResponse.json(
        { error: 'Invitation does not belong to this household' },
        { status: 403 }
      );
    }

    // Check if invitation is already accepted
    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: 'Cannot cancel an accepted invitation' },
        { status: 409 }
      );
    }

    // Delete the invitation
    await prisma.householdInvitation.delete({
      where: { id: params.invitationId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting household invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
