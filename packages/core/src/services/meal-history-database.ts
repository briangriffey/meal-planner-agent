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
   * Parse meal plan from agent response
   * This is a simple parser - can be enhanced based on actual output format
   */
  parseMealPlanFromResponse(response: string): MealRecord[] {
    const meals: MealRecord[] = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Simple regex-based parsing
    // Looking for patterns like "## Monday\n**Meal Name**"
    days.forEach(day => {
      const dayRegex = new RegExp(`##\\s*${day}\\s*\\n\\*\\*([^*]+)\\*\\*`, 'i');
      const match = response.match(dayRegex);

      if (match && match[1]) {
        const mealName = match[1].trim();

        // Try to extract calories and protein
        const caloriesMatch = response.match(new RegExp(`${day}[\\s\\S]{0,300}Calories?:\\s*(\\d+)`, 'i'));
        const proteinMatch = response.match(new RegExp(`${day}[\\s\\S]{0,300}Protein:\\s*(\\d+)`, 'i'));

        meals.push({
          day,
          name: mealName,
          calories: caloriesMatch ? parseInt(caloriesMatch[1]) : undefined,
          protein: proteinMatch ? parseInt(proteinMatch[1]) : undefined
        });
      }
    });

    return meals;
  }
}
