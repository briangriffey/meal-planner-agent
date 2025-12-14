import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Redis from 'ioredis';

export const runtime = 'nodejs';

/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET() {
  const checks = {
    database: 'unknown',
    redis: 'unknown',
    environment: 'unknown',
  };

  try {
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = 'connected';
    } catch (dbError) {
      checks.database = 'disconnected';
      throw new Error(`Database check failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

    // Check Redis connection
    try {
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        connectTimeout: 5000,
      });

      await redis.ping();
      checks.redis = 'connected';

      // Clean up Redis connection
      redis.disconnect();
    } catch (redisError) {
      checks.redis = 'disconnected';
      throw new Error(`Redis check failed: ${redisError instanceof Error ? redisError.message : 'Unknown error'}`);
    }

    // Check required environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'REDIS_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'ANTHROPIC_API_KEY',
      'GMAIL_USER',
      'GMAIL_APP_PASSWORD',
    ];

    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingEnvVars.length > 0) {
      checks.environment = 'missing_vars';
      throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    checks.environment = 'ok';

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: checks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: checks,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
