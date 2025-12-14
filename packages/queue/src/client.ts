import { Queue } from 'bullmq';
import { getRedisConnection } from './config';

/**
 * BullMQ Queue Client
 * Used by web app to enqueue jobs
 */

// Job data types
export interface MealPlanJobData {
  userId: string;
  mealPlanId: string;
  preferences: {
    numberOfMeals: number;
    servingsPerMeal: number;
    minProteinPerMeal: number;
    maxCaloriesPerMeal: number;
    dietaryRestrictions: string[];
  };
  hebEnabled: boolean;
  claudeModel: string;
  emailConfig: {
    user: string;
    recipients: string[];
  };
  testMode?: boolean;
}

export interface ScheduledJobData {
  userId: string;
}

// Queue names
export const QUEUE_NAMES = {
  MEAL_PLAN_GENERATION: 'meal-plan-generation',
  SCHEDULED_GENERATION: 'scheduled-generation',
} as const;

/**
 * Get or create the meal plan generation queue
 */
export function getMealPlanQueue(): Queue<MealPlanJobData> {
  return new Queue<MealPlanJobData>(QUEUE_NAMES.MEAL_PLAN_GENERATION, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: {
        count: 100, // Keep last 100 completed jobs
        age: 60 * 60 * 24 * 7, // Keep for 7 days
      },
      removeOnFail: {
        count: 500, // Keep last 500 failed jobs for debugging
      },
    },
  });
}

/**
 * Get or create the scheduled generation queue
 */
export function getScheduledQueue(): Queue<ScheduledJobData> {
  return new Queue<ScheduledJobData>(QUEUE_NAMES.SCHEDULED_GENERATION, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  });
}

/**
 * Enqueue a meal plan generation job
 */
export async function enqueueMealPlanGeneration(data: MealPlanJobData) {
  const queue = getMealPlanQueue();

  const job = await queue.add('generate-meal-plan', data, {
    jobId: `meal-plan-${data.mealPlanId}`,
  });

  return {
    jobId: job.id,
    mealPlanId: data.mealPlanId,
  };
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  const queue = getMealPlanQueue();
  const job = await queue.getJob(jobId);

  if (!job) {
    return null;
  }

  const state = await job.getState();
  const progress = job.progress as number;

  return {
    jobId: job.id,
    status: state,
    progress,
    data: job.data,
    failedReason: job.failedReason,
    finishedOn: job.finishedOn,
    processedOn: job.processedOn,
  };
}

/**
 * Cancel a job
 */
export async function cancelJob(jobId: string) {
  const queue = getMealPlanQueue();
  const job = await queue.getJob(jobId);

  if (!job) {
    throw new Error('Job not found');
  }

  await job.remove();
  return true;
}

/**
 * Setup scheduled jobs for all users
 * This should be called on server startup
 */
export async function setupScheduledJobs(
  users: Array<{
    userId: string;
    scheduleDayOfWeek: number;
    scheduleHour: number;
    scheduleMinute: number;
  }>
) {
  const queue = getScheduledQueue();

  // Remove all existing repeatable jobs
  const repeatableJobs = await queue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await queue.removeRepeatableByKey(job.key);
  }

  // Add new repeatable jobs for each user
  for (const user of users) {
    // Create cron pattern: "minute hour * * dayOfWeek"
    const cronPattern = `${user.scheduleMinute} ${user.scheduleHour} * * ${user.scheduleDayOfWeek}`;

    await queue.add(
      'scheduled-generation',
      { userId: user.userId },
      {
        repeat: {
          pattern: cronPattern,
        },
        jobId: `scheduled-${user.userId}`,
      }
    );

    console.log(`📅 Scheduled meal plan for user ${user.userId}: ${cronPattern}`);
  }

  console.log(`✅ Set up ${users.length} scheduled jobs`);
}

/**
 * Close all queues (for graceful shutdown)
 */
export async function closeQueues() {
  const mealPlanQueue = getMealPlanQueue();
  const scheduledQueue = getScheduledQueue();

  await mealPlanQueue.close();
  await scheduledQueue.close();
}
