import { PrismaClient } from '@meal-planner/database';
import { IMealHistoryService, MealRecord } from '../types';

/**
 * Database-backed implementation of IMealHistoryService
 * Used for web application and worker
 */
export class DatabaseMealHistoryService implements IMealHistoryService {
  private prisma: PrismaClient;
  private userId: string;

  constructor(prisma: PrismaClient, userId: string) {
    this.prisma = prisma;
    this.userId = userId;
  }

  /**
   * Get recent meal names for variety checking
   */
  async getRecentMealNames(count: number = 4): Promise<string[]> {
    const recentPlans = await this.prisma.mealPlan.findMany({
      where: {
        userId: this.userId,
        status: 'COMPLETED',
      },
      orderBy: { generatedAt: 'desc' },
      take: count,
      select: { meals: true },
    });

    const meals: string[] = [];
    for (const plan of recentPlans) {
      const planMeals = plan.meals as any as MealRecord[];
      meals.push(...planMeals.map(m => m.name));
    }

    return meals;
  }

  /**
   * Save meal plan to history
   * Note: In web app, this is handled by the job processor
   * This can be a no-op or used for additional processing
   */
  async saveMealPlan(meals: MealRecord[]): Promise<void> {
    // Already saved by job processor
    // This could be extended for additional processing if needed
    console.log(`✅ Meal plan saved to database (${meals.length} meals)`);
  }

  /**
   * Get formatted history summary for agent context
   */
  async getHistorySummary(weekCount: number = 4): Promise<string> {
    const recentPlans = await this.prisma.mealPlan.findMany({
      where: {
        userId: this.userId,
        status: 'COMPLETED',
      },
      orderBy: { generatedAt: 'desc' },
      take: weekCount,
      select: {
        generatedAt: true,
        meals: true,
      },
    });

    if (recentPlans.length === 0) {
      return 'No previous meal history available.';
    }

    let summary = `Recent meal history (last ${recentPlans.length} weeks):\n\n`;

    recentPlans.forEach((plan: any, index: number) => {
      const meals = plan.meals as any as MealRecord[];
      const date = plan.generatedAt.toISOString().split('T')[0];

      summary += `Week ${index + 1} (${date}):\n`;
      meals.forEach((meal: MealRecord) => {
        summary += `  - ${meal.day}: ${meal.name}\n`;
      });
      summary += '\n';
    });

    return summary;
  }

  /**
   * Parse meal plan from agent response (JSON format)
   */
  parseMealPlanFromResponse(response: string): MealRecord[] {
    try {
      const data = JSON.parse(response);

      if (!data.meals || !Array.isArray(data.meals)) {
        console.warn('Invalid meal plan format: missing meals array');
        return [];
      }

      return data.meals.map((meal: any) => ({
        day: meal.day || 'Unknown',
        name: meal.name || 'Unnamed Meal',
        calories: meal.nutrition?.calories,
        protein: meal.nutrition?.protein,
        carbs: meal.nutrition?.carbs,
        fat: meal.nutrition?.fat,
        fiber: meal.nutrition?.fiber,
        ingredients: meal.ingredients || [],
        instructions: meal.instructions || [],
        prepTime: meal.prepTime,
        cookTime: meal.cookTime,
      }));
    } catch (error) {
      console.error('Failed to parse meal plan JSON:', error);
      return [];
    }
  }
}
