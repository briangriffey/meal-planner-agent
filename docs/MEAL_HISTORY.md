# Meal History Feature

The meal planner agent automatically tracks previously recommended meals to ensure variety week over week.

## Overview

When the agent generates a meal plan, it:
1. Loads previous meal history from storage
2. Provides the AI with a list of recently recommended meals
3. Instructs the AI to avoid repeating those meals
4. Saves the new meal plan to history after generation

This ensures you don't eat the same meals every week!

## Storage

Meal history is stored in `data/meal-history.json` as a JSON file.

**Format:**
```json
{
  "history": [
    {
      "date": "2025-12-14",
      "meals": [
        {
          "day": "Monday",
          "name": "Grilled Chicken with Roasted Vegetables",
          "calories": 520,
          "protein": 45
        }
      ]
    }
  ]
}
```

## Configuration

- **Max History**: 12 weeks (configurable in `MealHistoryService` constructor)
- **Variety Check**: Last 4 weeks of meals are provided to the AI
- **Auto-Pruning**: Old entries beyond the max limit are automatically removed

## How It Works

### 1. Loading History
On agent startup, the `MealHistoryService` loads previous meal plans:

```typescript
const recentMeals = this.mealHistory.getRecentMealNames(4);
// Returns: ["Grilled Chicken...", "Salmon...", "Turkey Chili..."]
```

### 2. Providing Context to AI
The agent includes recent meals in the user prompt:

```
**IMPORTANT - Meal Variety:**
The following meals were recommended in recent weeks. Please ensure variety by creating DIFFERENT meals:
1. Grilled Chicken with Roasted Vegetables
2. Salmon with Quinoa and Asparagus
3. Turkey Chili with Black Beans
...

Avoid repeating these exact meals or very similar variations.
```

### 3. Parsing & Saving New Meals
After generation, the agent:
- Parses meal names from the AI response
- Saves them to `meal-history.json`
- Prunes old entries if over the limit

## Testing

Run the meal history test:

```bash
pnpm test:meal-history
```

**Tests:**
- Saving meal plans to history
- Loading meal history
- Parsing meals from AI responses
- Getting recent meal names for variety
- History summary generation
- Max entries limit/pruning

## File Structure

```
data/
└── meal-history.json      # Meal history storage (gitignored)

src/services/
└── mealHistory.ts         # Meal history service

tests/
└── test-meal-history.ts   # Tests for meal history
```

## API

### `MealHistoryService`

```typescript
class MealHistoryService {
  constructor(historyPath?: string, maxEntries: number = 12)

  // Load full history
  loadHistory(): MealHistoryData

  // Save a new meal plan
  saveMealPlan(meals: MealRecord[]): void

  // Get recent meal names for variety checking
  getRecentMealNames(count: number = 4): string[]

  // Get formatted summary for agent context
  getHistorySummary(weekCount: number = 4): string

  // Parse meals from agent response
  parseMealPlanFromResponse(response: string): MealRecord[]

  // Clear all history (testing)
  clearHistory(): void
}
```

### Types

```typescript
interface MealRecord {
  day: string;
  name: string;
  calories?: number;
  protein?: number;
}

interface MealPlanHistory {
  date: string;
  meals: MealRecord[];
}

interface MealHistoryData {
  history: MealPlanHistory[];
}
```

## Future Enhancements

This implementation uses file-based storage for simplicity. Future versions could:

- **Database Integration**: Store history in SQLite, PostgreSQL, or MongoDB
- **User Profiles**: Track history per user/household
- **Smart Variety**: ML-based similarity detection (e.g., "Grilled Chicken" vs "Baked Chicken")
- **Ingredient Tracking**: Avoid repeating key ingredients, not just meal names
- **Seasonal Awareness**: Prefer seasonal ingredients
- **Nutrition Trends**: Track nutritional patterns over time
- **Favorite Meals**: Allow marking meals to repeat intentionally

## Notes

- The `data/meal-history.json` file is gitignored to keep your meal history private
- History is user/machine specific (not shared across deployments)
- Parsing relies on consistent markdown formatting from the AI
- If parsing fails, the agent continues but doesn't save history for that run
