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
    recipients: string[];
  };
  testMode?: boolean;
  householdId?: string;
  householdMembers?: Array<{
    userId: string;
    name: string | null;
    email: string;
    preferences: {
      dietaryRestrictions: string[];
      minProteinPerMeal: number | null;
      maxCaloriesPerMeal: number | null;
    };
  }>;
}

export interface ScheduledJobData {
  userId: string;
}

export interface MarketingEmailJobData {
  releaseVersion: string;
  releaseNotes: string;
  changelogContent: string;
}

// Queue names
export const QUEUE_NAMES = {
  MEAL_PLAN_GENERATION: 'meal-plan-generation',
  SCHEDULED_GENERATION: 'scheduled-generation',
  MARKETING_EMAIL: 'marketing-email',
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
 * Get or create the marketing email queue
 */
export function getMarketingEmailQueue(): Queue<MarketingEmailJobData> {
  return new Queue<MarketingEmailJobData>(QUEUE_NAMES.MARKETING_EMAIL, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: {
        count: 50, // Keep last 50 completed jobs
        age: 60 * 60 * 24 * 30, // Keep for 30 days
      },
      removeOnFail: {
        count: 100, // Keep last 100 failed jobs for debugging
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
 * Enqueue a marketing email job
 */
export async function enqueueMarketingEmail(data: MarketingEmailJobData) {
  const queue = getMarketingEmailQueue();

  const job = await queue.add('send-marketing-email', data, {
    jobId: `marketing-email-${data.releaseVersion}`,
  });

  return {
    jobId: job.id,
    releaseVersion: data.releaseVersion,
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
 * Update or remove a scheduled job for a single user
 * Called when user preferences are updated
 */
export async function updateUserScheduledJob(user: {
  userId: string;
  scheduleDayOfWeek: number;
  scheduleHour: number;
  scheduleMinute: number;
  scheduleEnabled: boolean;
}) {
  const queue = getScheduledQueue();
  const jobId = `scheduled-${user.userId}`;

  // Remove existing job for this user if it exists
  const repeatableJobs = await queue.getRepeatableJobs();
  const existingJob = repeatableJobs.find((j) => j.id === jobId);

  if (existingJob) {
    await queue.removeRepeatableByKey(existingJob.key);
    console.log(`🗑️  Removed existing scheduled job for user ${user.userId}`);
  }

  // If scheduling is disabled, we're done
  if (!user.scheduleEnabled) {
    console.log(`⏸️  Scheduled generation disabled for user ${user.userId}`);
    return { removed: true, added: false };
  }

  // Create cron pattern: "minute hour * * dayOfWeek"
  const cronPattern = `${user.scheduleMinute} ${user.scheduleHour} * * ${user.scheduleDayOfWeek}`;

  // Add new repeatable job
  await queue.add(
    'scheduled-generation',
    { userId: user.userId },
    {
      repeat: {
        pattern: cronPattern,
      },
      jobId,
    }
  );

  console.log(`📅 Scheduled meal plan for user ${user.userId}: ${cronPattern}`);
  return { removed: !!existingJob, added: true, cronPattern };
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
    scheduleEnabled: boolean;
  }>
) {
  const queue = getScheduledQueue();

  // Remove all existing repeatable jobs
  const repeatableJobs = await queue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    await queue.removeRepeatableByKey(job.key);
  }

  console.log(`🗑️  Removed ${repeatableJobs.length} existing scheduled jobs`);

  // Add new repeatable jobs for each user who has scheduling enabled
  let addedCount = 0;
  for (const user of users) {
    if (!user.scheduleEnabled) {
      console.log(`⏸️  Skipping disabled schedule for user ${user.userId}`);
      continue;
    }

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
    addedCount++;
  }

  console.log(`✅ Set up ${addedCount} scheduled jobs (${users.length - addedCount} disabled)`);
}

/**
 * Close all queues (for graceful shutdown)
 */
export async function closeQueues() {
  const mealPlanQueue = getMealPlanQueue();
  const scheduledQueue = getScheduledQueue();
  const marketingEmailQueue = getMarketingEmailQueue();

  await mealPlanQueue.close();
  await scheduledQueue.close();
  await marketingEmailQueue.close();
}
