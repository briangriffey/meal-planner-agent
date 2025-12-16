import { PrismaClient } from '@meal-planner/database';
import { MealPlannerAgent } from './meal-planner';
import { EmailConnector } from '../connectors/email';
import { DatabaseMealHistoryService } from '../services';
import { UserPreferences } from '../types';

/**
 * Factory for creating MealPlannerAgent instances
 */
export class MealPlannerAgentFactory {
  /**
   * Create agent for web application
   */
  static create(
    userId: string,
    preferences: UserPreferences,
    prisma: PrismaClient,
    emailConnector: EmailConnector,
    anthropicApiKey: string,
    claudeModel?: string,
    onProgress?: (percent: number, message: string) => Promise<void>,
    hebEnabled?: boolean
  ): MealPlannerAgent {
    const mealHistoryService = new DatabaseMealHistoryService(prisma, userId);

    return new MealPlannerAgent({
      anthropicApiKey,
      preferences,
      mealHistoryService,
      emailConnector,
      claudeModel,
      onProgress,
      hebEnabled: hebEnabled ?? false
    });
  }
}
