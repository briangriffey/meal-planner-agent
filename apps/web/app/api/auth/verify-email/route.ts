import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/auth/verify-email?token=xxx
 *
 * Handles email verification link clicks. Validates the token,
 * updates the user's emailVerified field, and redirects to login
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
      console.log('Verification failed: Missing token');
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', origin)
      );
    }

    // Find token in database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    // Invalid token
    if (!verificationToken) {
      console.log('Verification failed: Invalid token');
      return NextResponse.redirect(
        new URL('/login?error=invalid_token', origin)
      );
    }

    // Check if token is expired (>24 hours)
    const now = new Date();
    if (verificationToken.expires < now) {
      console.log('Verification failed: Expired token');

      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token }
      });

      return NextResponse.redirect(
        new URL('/login?error=expired_token', origin)
      );
    }

    // Find user by email (stored in identifier field)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    });

    // User not found
    if (!user) {
      console.log('Verification failed: User not found');

      // Delete orphaned token
      await prisma.verificationToken.delete({
        where: { token }
      });

      return NextResponse.redirect(
        new URL('/login?error=user_not_found', origin)
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      console.log(`User ${user.email} is already verified`);

      // Delete token
      await prisma.verificationToken.delete({
        where: { token }
      });

      return NextResponse.redirect(
        new URL('/login?success=already_verified', origin)
      );
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email: user.email },
      data: { emailVerified: new Date() }
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token }
    });

    console.log(`Successfully verified email for user: ${user.email}`);

    // Redirect to login with success message
    return NextResponse.redirect(
      new URL('/login?success=verified', origin)
    );

  } catch (error) {
    console.error('Error during email verification:', error);

    // Get origin for error redirect
    const origin = request.headers.get('x-forwarded-proto') && request.headers.get('x-forwarded-host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
      : new URL(request.url).origin;

    // Generic error redirect
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', origin)
    );
  }
}
