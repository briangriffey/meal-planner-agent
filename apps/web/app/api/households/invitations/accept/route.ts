import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

/**
 * GET /api/households/invitations/accept?token=xxx
 *
 * Handles household invitation link clicks. Validates the token,
 * creates household membership, and redirects to household page
 * with appropriate status messages.
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
      console.log('Invitation acceptance failed: Missing token');
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_invitation', origin)
      );
    }

    // Check if user is logged in
    const session = await auth();
    if (!session?.user?.id) {
      // Redirect to login with return URL
      return NextResponse.redirect(
        new URL(`/login?error=not_authenticated&returnUrl=/api/households/invitations/accept?token=${token}`, origin)
      );
    }

    // Find invitation in database
    const invitation = await prisma.householdInvitation.findUnique({
      where: { token },
      include: {
        household: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });

    // Invalid token
    if (!invitation) {
      console.log('Invitation acceptance failed: Invalid token');
      return NextResponse.redirect(
        new URL('/dashboard?error=invalid_invitation', origin)
      );
    }

    // Check if invitation is expired (>7 days)
    const now = new Date();
    if (invitation.expiresAt < now) {
      console.log('Invitation acceptance failed: Expired token');

      // Delete expired invitation
      await prisma.householdInvitation.delete({
        where: { token }
      });

      return NextResponse.redirect(
        new URL('/dashboard?error=expired_invitation', origin)
      );
    }

    // Check if invitation is already accepted
    if (invitation.acceptedAt) {
      console.log(`Invitation already accepted for household ${invitation.householdId}`);

      return NextResponse.redirect(
        new URL(`/dashboard/household?success=already_accepted`, origin)
      );
    }

    // Verify user email matches invitation email
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true },
    });

    if (!user) {
      console.log('Invitation acceptance failed: User not found');
      return NextResponse.redirect(
        new URL('/dashboard?error=user_not_found', origin)
      );
    }

    if (user.email !== invitation.email) {
      console.log(`Invitation acceptance failed: Email mismatch (invited: ${invitation.email}, logged in: ${user.email})`);
      return NextResponse.redirect(
        new URL('/dashboard?error=email_mismatch', origin)
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.householdMember.findUnique({
      where: {
        householdId_userId: {
          householdId: invitation.householdId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      console.log(`User ${user.email} is already a member of household ${invitation.householdId}`);

      // Mark invitation as accepted
      await prisma.householdInvitation.update({
        where: { token },
        data: {
          acceptedAt: new Date(),
          acceptedByUserId: user.id,
        },
      });

      return NextResponse.redirect(
        new URL(`/dashboard/household?success=already_member`, origin)
      );
    }

    // Create household membership with default preferences
    await prisma.householdMember.create({
      data: {
        householdId: invitation.householdId,
        userId: user.id,
        role: 'MEMBER',
        preferences: {
          create: {
            dietaryRestrictions: [],
          },
        },
      },
    });

    // Mark invitation as accepted
    await prisma.householdInvitation.update({
      where: { token },
      data: {
        acceptedAt: new Date(),
        acceptedByUserId: user.id,
      },
    });

    console.log(`Successfully added user ${user.email} to household ${invitation.household.name}`);

    // Redirect to household page with success message
    return NextResponse.redirect(
      new URL(`/dashboard/household?success=invitation_accepted&household=${encodeURIComponent(invitation.household.name)}`, origin)
    );

  } catch (error) {
    console.error('Error during invitation acceptance:', error);

    // Get origin for error redirect
    const origin = request.headers.get('x-forwarded-proto') && request.headers.get('x-forwarded-host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
      : new URL(request.url).origin;

    // Generic error redirect
    return NextResponse.redirect(
      new URL('/dashboard?error=invitation_failed', origin)
    );
  }
}
