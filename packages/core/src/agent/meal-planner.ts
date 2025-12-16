import Anthropic from '@anthropic-ai/sdk';
import { ConnectorRegistry } from '../connectors/base';
import { EmailConnector } from '../connectors/email';
import { MealPlannerAgentConfig, MealPlanGenerationResult, UserPreferences, Meal } from '../types';
import { MealPlanPostProcessor } from '../services/meal-plan-post-processor';
import { EmailTemplateRenderer } from '../services/email-template-renderer';

// JSON schema for Claude's structured output
const MEAL_PLAN_SCHEMA = {
  type: 'object',
  properties: {
    meals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'string', description: 'Day identifier (e.g., "Day 1", "Monday")' },
          name: { type: 'string', description: 'Meal name' },
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
  required: ['meals']
};

export class MealPlannerAgent {
  private client: Anthropic;
  private connectorRegistry: ConnectorRegistry;
  private mealHistory: MealPlannerAgentConfig['mealHistoryService'];
  private preferences: UserPreferences;
  private claudeModel: string;
  private onProgress?: (percent: number, message: string) => Promise<void>;
  private hebEnabled: boolean;
  private postProcessor: MealPlanPostProcessor;
  private emailRenderer: EmailTemplateRenderer;

  constructor(config: MealPlannerAgentConfig & { hebEnabled?: boolean }) {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey
    });
    this.connectorRegistry = config.connectorRegistry;
    this.mealHistory = config.mealHistoryService;
    this.preferences = config.preferences;
    this.claudeModel = config.claudeModel || 'claude-sonnet-4-20250514';
    this.onProgress = config.onProgress;
    this.hebEnabled = config.hebEnabled ?? false;
    this.postProcessor = new MealPlanPostProcessor();
    this.emailRenderer = new EmailTemplateRenderer();
  }

  async generateMealPlan(): Promise<MealPlanGenerationResult> {
    console.log('Starting meal plan generation (optimized)...');

    if (this.onProgress) {
      await this.onProgress(0, 'Starting meal plan generation');
    }

    try {
      // Build prompts
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = await this.buildUserPrompt();

      if (this.onProgress) {
        await this.onProgress(10, 'Sending request to Claude API');
      }

      // Single Claude API call with JSON schema
      console.log('Calling Claude API with JSON schema...');
      const response = await this.client.messages.create({
        model: this.claudeModel,
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'meal_plan',
            schema: MEAL_PLAN_SCHEMA,
            strict: true
          }
        }
      } as any); // Type assertion needed until SDK supports response_format

      if (this.onProgress) {
        await this.onProgress(50, 'Received meal plan from Claude');
      }

      // Parse JSON response
      const textContent = response.content.find((block: any) => block.type === 'text');
      if (!textContent || !('text' in textContent)) {
        throw new Error('No text content in Claude response');
      }

      const mealPlanData = JSON.parse(textContent.text);
      const meals: Meal[] = mealPlanData.meals;

      console.log(`Received ${meals.length} meals from Claude`);

      if (this.onProgress) {
        await this.onProgress(60, 'Processing shopping list and HEB links');
      }

      // Post-process: aggregate ingredients, categorize, generate HEB links
      const processedData = await this.postProcessor.process(meals, this.hebEnabled);

      if (this.onProgress) {
        await this.onProgress(75, 'Generating HTML email');
      }

      // Generate HTML email
      const weekLabel = this.getWeekLabel();
      const emailHtml = this.emailRenderer.render(processedData, {
        weekLabel,
        includeHEBLinks: this.hebEnabled,
        servingsPerMeal: this.preferences.servingsPerMeal,
        minProteinPerMeal: this.preferences.minProteinPerMeal,
        maxCaloriesPerMeal: this.preferences.maxCaloriesPerMeal
      });

      if (this.onProgress) {
        await this.onProgress(85, 'Sending email');
      }

      // Send email directly via EmailConnector
      const emailConnector = this.connectorRegistry.get('send_email') as EmailConnector;
      if (!emailConnector) {
        throw new Error('Email connector not found');
      }

      const emailResult = await emailConnector.execute({
        subject: `🍽️ Your High-Protein Dinner Meal Plan - ${weekLabel}`,
        body: emailHtml
      });

      console.log('Email sent:', emailResult);

      if (this.onProgress) {
        await this.onProgress(95, 'Saving meal plan to history');
      }

      // Save meal plan to history
      const mealRecords = this.mealHistory.parseMealPlanFromResponse(JSON.stringify(mealPlanData));
      if (mealRecords.length > 0) {
        await this.mealHistory.saveMealPlan(mealRecords);
        console.log(`📝 Saved ${mealRecords.length} meals to history`);
      } else {
        console.warn('⚠️  Could not parse meals from response for history');
      }

      if (this.onProgress) {
        await this.onProgress(100, 'Meal plan generation complete');
      }

      console.log('Meal plan generation complete!');

      return {
        success: true,
        meals: mealRecords,
        emailSent: emailResult.success === true,
        emailHtml,
        iterationCount: 1 // Always 1 in optimized version
      };
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return {
        success: false,
        emailSent: false,
        iterationCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildSystemPrompt(): string {
    return `You are a meal planning expert. Generate a weekly dinner meal plan based on user preferences.

Requirements:
- Create ${this.preferences.numberOfMeals} unique dinner recipes
- Each meal serves ${this.preferences.servingsPerMeal} ${this.preferences.servingsPerMeal === 1 ? 'person' : 'people'}
- Meet nutritional targets: minimum ${this.preferences.minProteinPerMeal}g protein, maximum ${this.preferences.maxCaloriesPerMeal} calories per serving
- Respect dietary restrictions: ${this.preferences.dietaryRestrictions.length > 0 ? this.preferences.dietaryRestrictions.join(', ') : 'none'}
- Ensure variety (avoid recent meals if provided)

For each meal, provide:
- Name (clear, appetizing)
- Description (2-3 sentences about flavor and appeal)
- Ingredients with specific quantities (for ${this.preferences.servingsPerMeal} ${this.preferences.servingsPerMeal === 1 ? 'serving' : 'servings'})
- Step-by-step cooking instructions
- Prep time and cook time estimates
- Nutritional information per serving (calories, protein, carbs, fat, fiber)

Output Format: Return valid JSON matching the provided schema.`;
  }

  private async buildUserPrompt(): Promise<string> {
    const weekLabel = this.getWeekLabel();

    let prompt = `Create a dinner meal plan for ${weekLabel}.

Requirements:
- High protein (minimum ${this.preferences.minProteinPerMeal}g per serving)
- Low calorie (maximum ${this.preferences.maxCaloriesPerMeal} calories per serving)
- ${this.preferences.numberOfMeals} different dinners
- Each meal serves ${this.preferences.servingsPerMeal} ${this.preferences.servingsPerMeal === 1 ? 'person' : 'people'}
- Include complete nutritional information per serving
- Include ingredient lists with quantities for ${this.preferences.servingsPerMeal} ${this.preferences.servingsPerMeal === 1 ? 'serving' : 'servings'}
- Include step-by-step cooking instructions`;

    if (this.preferences.dietaryRestrictions.length > 0) {
      prompt += `\n- Dietary restrictions: ${this.preferences.dietaryRestrictions.join(', ')}`;
    }

    // Add meal history for variety
    const recentMeals = await this.mealHistory.getRecentMealNames(4);
    if (recentMeals.length > 0) {
      prompt += `\n\n**IMPORTANT - Meal Variety:**
The following meals were recommended in recent weeks. Please ensure variety by creating DIFFERENT meals:
${recentMeals.map((meal, i) => `${i + 1}. ${meal}`).join('\n')}

Avoid repeating these exact meals or very similar variations. Aim for diverse proteins, cooking methods, and flavor profiles.`;
    }

    return prompt;
  }

  private getWeekLabel(): string {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (7 - today.getDay()) % 7);

    return `Week of ${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  }
}
