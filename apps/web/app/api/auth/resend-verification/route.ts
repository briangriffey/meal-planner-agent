import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email/verification';
import { z } from 'zod';
import crypto from 'crypto';

// Zod schema for request validation
const resendSchema = z.object({
  email: z.string().email('Invalid email format')
});

/**
 * POST /api/auth/resend-verification
 *
 * Allows users to request a new verification email with a fresh 24-hour token.
 * For security, always returns a generic success message regardless of whether
 * the email exists in the database.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = resendSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        emailVerified: true
      }
    });

    // If user doesn't exist, return generic success message for security
    // (prevents email enumeration attacks)
    if (!user) {
      console.log(`Resend verification requested for non-existent email: ${email}`);
      return NextResponse.json(
        {
          message: 'If the email exists, a verification link has been sent.'
        },
        { status: 200 }
      );
    }

    // If user is already verified, return error
    if (user.emailVerified) {
      console.log(`Resend verification failed: User ${email} is already verified`);
      return NextResponse.json(
        { error: 'This email address is already verified.' },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    // Generate new crypto-secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiry to 24 hours from now
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new verification token in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, token, user.name);

    if (!emailResult.success) {
      console.error(`Failed to send verification email to ${email}:`, emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log(`Verification email resent successfully to ${email}`);

    // Return generic success message
    return NextResponse.json(
      {
        message: 'If the email exists, a verification link has been sent.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in resend verification endpoint:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
