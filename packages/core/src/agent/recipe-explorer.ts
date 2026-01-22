import Anthropic from '@anthropic-ai/sdk';
import { UserPreferences, Meal } from '../types';

// JSON schema for Claude's structured output
const RECIPE_SCHEMA = {
  type: 'object',
  properties: {
    recipes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'string', description: 'Always "Standalone" for explorer recipes' },
          name: { type: 'string', description: 'Recipe name' },
          description: { type: 'string', description: '2-3 sentences about flavor and appeal' },
          ingredients: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                item: { type: 'string', description: 'Ingredient name' },
                amount: { type: 'string', description: 'Quantity with units' }
              },
              required: ['item', 'amount']
            },
            description: 'List of ingredients with quantities'
          },
          instructions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Step-by-step cooking instructions'
          },
          prepTime: { type: 'string', description: 'Preparation time (e.g., "15 min")' },
          cookTime: { type: 'string', description: 'Cooking time (e.g., "25 min")' },
          nutrition: {
            type: 'object',
            properties: {
              calories: { type: 'number', description: 'Calories per serving' },
              protein: { type: 'number', description: 'Protein in grams per serving' },
              carbs: { type: 'number', description: 'Carbohydrates in grams per serving' },
              fat: { type: 'number', description: 'Fat in grams per serving' },
              fiber: { type: 'number', description: 'Fiber in grams per serving' }
            },
            required: ['calories', 'protein', 'carbs', 'fat', 'fiber'],
            description: 'Nutritional information per serving'
          }
        },
        required: ['day', 'name', 'description', 'ingredients', 'instructions', 'prepTime', 'cookTime', 'nutrition']
      }
    }
  },
  required: ['recipes']
};

export interface RecipeExplorerFilters {
  search?: string;
  cuisine?: string;
  prepTime?: string; // e.g., "under-30", "30-60", "over-60"
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  count?: number; // Number of recipes to generate
}

export interface RecipeExplorerConfig {
  anthropicApiKey: string;
  preferences: UserPreferences;
  claudeModel?: string;
}

export interface RecipeExplorerResult {
  success: boolean;
  recipes?: Meal[];
  error?: string;
}

export class RecipeExplorerAgent {
  private client: Anthropic;
  private preferences: UserPreferences;
  private claudeModel: string;

  constructor(config: RecipeExplorerConfig) {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey
    });
    this.preferences = config.preferences;
    this.claudeModel = config.claudeModel || 'claude-sonnet-4-20250514';
  }

  async generateRecipes(filters: RecipeExplorerFilters = {}): Promise<RecipeExplorerResult> {
    console.log('Starting recipe exploration with filters:', filters);

    try {
      // Build prompts
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(filters);

      console.log('Calling Claude API for recipe suggestions...');
      const response = await this.client.messages.create({
        model: this.claudeModel,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });

      // Parse JSON response
      const textContent = response.content.find((block: any) => block.type === 'text');
      if (!textContent || !('text' in textContent)) {
        throw new Error('No text content in Claude response');
      }

      const recipeData = JSON.parse(textContent.text);
      const recipes: Meal[] = recipeData.recipes;

      console.log(`Received ${recipes.length} recipes from Claude`);

      return {
        success: true,
        recipes
      };
    } catch (error) {
      console.error('Error generating recipes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert recipe generator for a meal planning application.

Your role is to generate creative, delicious recipe suggestions that users can browse and explore.

CRITICAL REQUIREMENTS:
1. Always return VALID JSON matching the exact schema provided
2. Each recipe MUST have ALL required fields: day, name, description, ingredients, instructions, prepTime, cookTime, nutrition
3. Nutrition values must be realistic and accurate per serving
4. Ingredients must have both "item" and "amount" fields
5. Instructions must be clear, numbered steps
6. Prep and cook times should be realistic (e.g., "15 min", "30 min")

DIETARY RESTRICTIONS:
${this.preferences.dietaryRestrictions.length > 0
  ? `User has these dietary restrictions: ${this.preferences.dietaryRestrictions.join(', ')}`
  : 'No dietary restrictions'}

NUTRITION TARGETS (per serving):
- Minimum protein: ${this.preferences.minProteinPerMeal}g
- Maximum calories: ${this.preferences.maxCaloriesPerMeal}
- Servings per meal: ${this.preferences.servingsPerMeal}

RECIPE GUIDELINES:
- Focus on flavor, variety, and appeal
- Make recipes practical and achievable for home cooks
- Provide accurate nutritional information
- Ensure recipes meet the user's dietary needs
- Be creative and inspiring

Remember: Users are browsing for inspiration, so make each recipe sound delicious and exciting!`;
  }

  private buildUserPrompt(filters: RecipeExplorerFilters): string {
    const count = filters.count || 5;
    let prompt = `Generate ${count} delicious recipe${count > 1 ? 's' : ''} that meet the following criteria:\n\n`;

    // Add filter criteria
    const criteria: string[] = [];

    if (filters.search) {
      criteria.push(`- Recipe name or key ingredients should include: "${filters.search}"`);
    }

    if (filters.cuisine) {
      criteria.push(`- Cuisine type: ${filters.cuisine}`);
    }

    if (filters.prepTime) {
      const prepTimeDesc = this.getPrepTimeDescription(filters.prepTime);
      criteria.push(`- Preparation time: ${prepTimeDesc}`);
    }

    if (filters.minCalories !== undefined || filters.maxCalories !== undefined) {
      const min = filters.minCalories ?? 0;
      const max = filters.maxCalories ?? this.preferences.maxCaloriesPerMeal;
      criteria.push(`- Calories per serving: ${min}-${max}`);
    }

    if (filters.minProtein !== undefined || filters.maxProtein !== undefined) {
      const min = filters.minProtein ?? this.preferences.minProteinPerMeal;
      const max = filters.maxProtein ?? 100;
      criteria.push(`- Protein per serving: ${min}g-${max}g`);
    }

    if (criteria.length > 0) {
      prompt += criteria.join('\n') + '\n\n';
    } else {
      prompt += 'No specific filters applied - provide a diverse variety of recipes.\n\n';
    }

    prompt += `Requirements:
- Each recipe must have complete ingredients with amounts
- Provide step-by-step instructions
- Include accurate nutritional information (calories, protein, carbs, fat, fiber)
- Respect user's dietary restrictions: ${this.preferences.dietaryRestrictions.join(', ') || 'none'}
- Meet nutrition targets: min ${this.preferences.minProteinPerMeal}g protein, max ${this.preferences.maxCaloriesPerMeal} calories
- Make ${this.preferences.servingsPerMeal} servings per recipe

Return ONLY valid JSON matching the recipe schema. No additional text or formatting.`;

    return prompt;
  }

  private getPrepTimeDescription(prepTime: string): string {
    switch (prepTime) {
      case 'under-30':
        return 'under 30 minutes total (prep + cook)';
      case '30-60':
        return '30-60 minutes total (prep + cook)';
      case 'over-60':
        return 'over 60 minutes total (prep + cook)';
      default:
        return 'any duration';
    }
  }
}
