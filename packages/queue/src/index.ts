// Export queue client functions
export {
  getMealPlanQueue,
  getScheduledQueue,
  getMarketingEmailQueue,
  enqueueMealPlanGeneration,
  enqueueMarketingEmail,
  getJobStatus,
  cancelJob,
  updateUserScheduledJob,
  setupScheduledJobs,
  closeQueues,
  QUEUE_NAMES,
  type MealPlanJobData,
  type ScheduledJobData,
  type MarketingEmailJobData,
} from './client';

// Export configuration
export { getRedisConnection } from './config';

// Export job processors (for testing or direct use)
export { processMealPlanGeneration } from './jobs/meal-plan-generator';
export { processScheduledGeneration } from './jobs/scheduled-generator';
export { processMarketingEmail } from './jobs/marketing-email-sender';
