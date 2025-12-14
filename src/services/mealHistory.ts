import * as fs from 'fs';
import * as path from 'path';

export interface MealRecord {
  day: string;
  name: string;
  calories?: number;
  protein?: number;
}

export interface MealPlanHistory {
  date: string;
  meals: MealRecord[];
}

export interface MealHistoryData {
  history: MealPlanHistory[];
}

export class MealHistoryService {
  private historyPath: string;
  private maxHistoryEntries: number;

  constructor(historyPath?: string, maxEntries: number = 12) {
    this.historyPath = historyPath || path.join(process.cwd(), 'data', 'meal-history.json');
    this.maxHistoryEntries = maxEntries; // Keep last ~3 months of weekly plans
    this.ensureDataDirectory();
  }

  private ensureDataDirectory(): void {
    const dir = path.dirname(this.historyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Load meal history from file
   */
  loadHistory(): MealHistoryData {
    try {
      if (!fs.existsSync(this.historyPath)) {
        return { history: [] };
      }

      const data = fs.readFileSync(this.historyPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading meal history:', error);
      return { history: [] };
    }
  }

  /**
   * Save meal plan to history
   */
  saveMealPlan(meals: MealRecord[]): void {
    try {
      const historyData = this.loadHistory();

      const newEntry: MealPlanHistory = {
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        meals
      };

      // Add new entry at the beginning
      historyData.history.unshift(newEntry);

      // Trim to max entries
      if (historyData.history.length > this.maxHistoryEntries) {
        historyData.history = historyData.history.slice(0, this.maxHistoryEntries);
      }

      fs.writeFileSync(this.historyPath, JSON.stringify(historyData, null, 2));
      console.log(`✅ Saved meal plan to history: ${this.historyPath}`);
    } catch (error) {
      console.error('Error saving meal history:', error);
    }
  }

  /**
   * Get recent meal names for variety checking
   */
  getRecentMealNames(count: number = 4): string[] {
    const historyData = this.loadHistory();
    const recentMeals: string[] = [];

    // Get meals from the most recent N plans
    for (let i = 0; i < Math.min(count, historyData.history.length); i++) {
      const plan = historyData.history[i];
      plan.meals.forEach(meal => {
        if (meal.name) {
          recentMeals.push(meal.name);
        }
      });
    }

    return recentMeals;
  }

  /**
   * Get formatted history summary for agent context
   */
  getHistorySummary(weekCount: number = 4): string {
    const historyData = this.loadHistory();

    if (historyData.history.length === 0) {
      return 'No previous meal history available.';
    }

    const recentPlans = historyData.history.slice(0, weekCount);
    let summary = `Recent meal history (last ${recentPlans.length} weeks):\n\n`;

    recentPlans.forEach((plan, index) => {
      summary += `Week ${index + 1} (${plan.date}):\n`;
      plan.meals.forEach(meal => {
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

  /**
   * Clear all history (useful for testing)
   */
  clearHistory(): void {
    if (fs.existsSync(this.historyPath)) {
      fs.unlinkSync(this.historyPath);
      console.log('✅ Meal history cleared');
    }
  }
}
