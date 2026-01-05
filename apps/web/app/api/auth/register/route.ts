import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email/verification';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user with default preferences
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        userPreferences: {
          create: {
            emailRecipients: [email],
            numberOfMeals: 7,
            servingsPerMeal: 2,
            minProteinPerMeal: 40,
            maxCaloriesPerMeal: 600,
            dietaryRestrictions: [],
            hebEnabled: true,
            // scheduleEnabled defaults to true from schema
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate verification token (24-hour expiry)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email (don't fail registration if email fails)
    try {
      await sendVerificationEmail(email, token, name || null);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Registration still succeeds
    }

    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email to verify your account.',
        user,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
