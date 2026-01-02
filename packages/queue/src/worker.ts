#!/usr/bin/env node

import { Worker, Job } from 'bullmq';
import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@meal-planner/database';
import { getRedisConnection } from './config';
import { QUEUE_NAMES, MealPlanJobData, ScheduledJobData, setupScheduledJobs } from './client';
import { processMealPlanGeneration } from './jobs/meal-plan-generator';
import { processScheduledGeneration } from './jobs/scheduled-generator';

// Load environment variables from project root
config({ path: resolve(__dirname, '../../../.env') });

console.log('🚀 Starting BullMQ Workers...');

// Validate required environment variables
const requiredEnvVars = ['ANTHROPIC_API_KEY', 'DATABASE_URL', 'REDIS_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

console.log('✅ Environment variables validated');

// Meal Plan Generation Worker
const mealPlanWorker = new Worker<MealPlanJobData>(
  QUEUE_NAMES.MEAL_PLAN_GENERATION,
  async (job: Job<MealPlanJobData>) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Processing job ${job.id} - ${job.name}`);
    console.log(`   User: ${job.data.userId}`);
    console.log(`   Meal Plan ID: ${job.data.mealPlanId}`);
    console.log(`${'='.repeat(60)}\n`);

    const result = await processMealPlanGeneration(job);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Job ${job.id} completed successfully`);
    console.log(`${'='.repeat(60)}\n`);

    return result;
  },
  {
    connection: getRedisConnection(),
    concurrency: 2, // Process up to 2 meal plans simultaneously
    limiter: {
      max: 10, // Max 10 jobs per duration
      duration: 60000, // Per minute (rate limiting for Claude API)
    },
  }
);

// Scheduled Generation Worker
const scheduledWorker = new Worker<ScheduledJobData>(
  QUEUE_NAMES.SCHEDULED_GENERATION,
  async (job: Job<ScheduledJobData>) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📅 Processing scheduled job ${job.id} - ${job.name}`);
    console.log(`   User: ${job.data.userId}`);
    console.log(`${'='.repeat(60)}\n`);

    const result = await processScheduledGeneration(job);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Scheduled job ${job.id} completed`);
    console.log(`${'='.repeat(60)}\n`);

    return result;
  },
  {
    connection: getRedisConnection(),
    concurrency: 1, // Process scheduled jobs one at a time
  }
);

// Event listeners for meal plan worker
mealPlanWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

mealPlanWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
  if (job) {
    console.error(`   Attempt ${job.attemptsMade} of ${job.opts.attempts}`);
  }
});

mealPlanWorker.on('progress', (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

mealPlanWorker.on('error', (err) => {
  console.error('❌ Meal plan worker error:', err);
});

// Event listeners for scheduled worker
scheduledWorker.on('completed', (job) => {
  console.log(`✅ Scheduled job ${job.id} completed`);
});

scheduledWorker.on('failed', (job, err) => {
  console.error(`❌ Scheduled job ${job?.id} failed:`, err.message);
});

scheduledWorker.on('error', (err) => {
  console.error('❌ Scheduled worker error:', err);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down workers...');

  await mealPlanWorker.close();
  await scheduledWorker.close();

  console.log('✅ Workers closed');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('✅ Workers started successfully');
console.log(`   - Meal Plan Generation Worker: Concurrency ${mealPlanWorker.opts.concurrency}`);
console.log(`   - Scheduled Generation Worker: Concurrency ${scheduledWorker.opts.concurrency}`);

// Sync all scheduled jobs on startup
(async () => {
  console.log('\n🔄 Syncing scheduled jobs...');
  const prisma = new PrismaClient();

  try {
    const users = await prisma.userPreferences.findMany({
      select: {
        userId: true,
        scheduleDayOfWeek: true,
        scheduleHour: true,
        scheduleMinute: true,
        scheduleEnabled: true,
      },
    });

    await setupScheduledJobs(users);
  } catch (error) {
    console.error('❌ Error syncing scheduled jobs:', error);
  } finally {
    await prisma.$disconnect();
  }
})();

console.log('\n👂 Listening for jobs...\n');
