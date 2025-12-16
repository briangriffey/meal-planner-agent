import Anthropic from '@anthropic-ai/sdk';
import { ConnectorRegistry } from '../connectors/base';
import { MealPlannerAgentConfig, MealPlanGenerationResult, UserPreferences } from '../types';

export class MealPlannerAgent {
  private client: Anthropic;
  private connectorRegistry: ConnectorRegistry;
  private mealHistory: MealPlannerAgentConfig['mealHistoryService'];
  private preferences: UserPreferences;
  private claudeModel: string;
  private onProgress?: (percent: number, message: string) => Promise<void>;

  constructor(config: MealPlannerAgentConfig) {
    this.client = new Anthropic({
      apiKey: config.anthropicApiKey
    });
    this.connectorRegistry = config.connectorRegistry;
    this.mealHistory = config.mealHistoryService;
    this.preferences = config.preferences;
    this.claudeModel = config.claudeModel || 'claude-sonnet-4-20250514';
    this.onProgress = config.onProgress;
  }

  async generateMealPlan(): Promise<MealPlanGenerationResult> {
    console.log('Starting meal plan generation...');

    if (this.onProgress) {
      await this.onProgress(0, 'Starting meal plan generation');
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = await this.buildUserPrompt();

    if (this.onProgress) {
      await this.onProgress(10, 'Building prompts');
    }

    let messages: Anthropic.MessageParam[] = [
      { role: 'user', content: userPrompt }
    ];

    let continueLoop = true;
    let iterationCount = 0;
    const maxIterations = 10;
    let finalResponse: string = '';
    let emailSent = false;
    let emailHtml: string | undefined;

    while (continueLoop && iterationCount < maxIterations) {
      iterationCount++;
      console.log(`Agent iteration ${iterationCount}...`);

      const progress = 10 + (iterationCount / maxIterations) * 70; // 10% to 80%
      if (this.onProgress) {
        await this.onProgress(progress, `Agent iteration ${iterationCount}/${maxIterations}`);
      }

      const response = await this.client.messages.create({
        model: this.claudeModel,
        max_tokens: 4096,
        system: systemPrompt,
        messages,
        tools: this.connectorRegistry.getToolDefinitions()
      });

      console.log(`Stop reason: ${response.stop_reason}`);

      // Capture text content for meal history parsing
      for (const block of response.content) {
        if (block.type === 'text') {
          finalResponse += block.text + '\n';
        }
      }

      if (response.stop_reason === 'end_turn') {
        continueLoop = false;
        console.log('Agent completed task');
      } else if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type === 'tool_use') {
            console.log(`Executing tool: ${block.name}`);
            const connector = this.connectorRegistry.get(block.name);

            if (connector) {
              try {
                const result = await connector.execute(block.input);
                console.log(`Tool result:`, result);

                // Track if email was sent
                if (block.name === 'send_email' && result.success) {
                  emailSent = true;
                  const input = block.input as { subject: string; body: string };
                  if (input && 'body' in input) {
                    emailHtml = input.body;
                  }
                }

                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: JSON.stringify(result)
                });
              } catch (error) {
                console.error(`Error executing tool ${block.name}:`, error);
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: JSON.stringify({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                  }),
                  is_error: true
                });
              }
            } else {
              console.error(`Tool not found: ${block.name}`);
              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: JSON.stringify({
                  success: false,
                  error: `Tool ${block.name} not found`
                }),
                is_error: true
              });
            }
          }
        }

        messages.push({ role: 'user', content: toolResults });
      } else {
        continueLoop = false;
        console.log('Agent stopped for unexpected reason:', response.stop_reason);
      }
    }

    if (iterationCount >= maxIterations) {
      console.warn('Agent reached maximum iterations');
    }

    if (this.onProgress) {
      await this.onProgress(85, 'Parsing meal plan and saving to history');
    }

    // Save meal plan to history
    let meals: any[] = [];
    if (finalResponse) {
      meals = this.mealHistory.parseMealPlanFromResponse(finalResponse);
      if (meals.length > 0) {
        await this.mealHistory.saveMealPlan(meals);
        console.log(`📝 Saved ${meals.length} meals to history`);
      } else {
        console.warn('⚠️  Could not parse meals from response for history');
      }
    }

    if (this.onProgress) {
      await this.onProgress(100, 'Meal plan generation complete');
    }

    console.log('Meal plan generation complete!');

    return {
      success: true,
      meals,
      emailSent,
      emailHtml,
      iterationCount
    };
  }

  private buildSystemPrompt(): string {
    return `You are a meal planning assistant specialized in creating high-protein, low-calorie dinner plans.

Your task is to:
1. Generate a ${this.preferences.numberOfMeals}-day meal plan for dinners only
2. Each meal should serve ${this.preferences.servingsPerMeal} ${this.preferences.servingsPerMeal === 1 ? 'person' : 'people'}
3. Each meal should meet these nutritional requirements (per serving):
   - Minimum ${this.preferences.minProteinPerMeal}g of protein per serving
   - Maximum ${this.preferences.maxCaloriesPerMeal} calories per serving
   - Focus on whole foods, lean proteins, and vegetables
4. Include detailed nutritional information for each meal (calories, protein, carbs, fat, fiber) - provide both per-serving and total
5. Provide a complete ingredient list with amounts (for ${this.preferences.servingsPerMeal} ${this.preferences.servingsPerMeal === 1 ? 'serving' : 'servings'})
6. Include clear cooking instructions
7. Include prep time and cook time

After generating the meal plan, you should:
1. Use the browse_heb tool to search for all unique ingredients on HEB website (if available)
2. Create a consolidated shopping list by combining like ingredients across all meals
   - Combine quantities for duplicate ingredients (e.g., if multiple meals use chicken breast, sum the total needed)
   - Organize ingredients by category (proteins, vegetables, pantry items, etc.)
   - Include HEB shopping links for each ingredient found on their website
3. Format the meal plan and shopping list as an attractive, MOBILE-FRIENDLY HTML email
   - Use responsive design with proper viewport meta tags and max-width: 600px for desktop
   - Include the meal plan with all recipes
   - Add a dedicated shopping list section at the end with combined ingredients
   - Make ingredient names clickable links to add them to HEB cart

   **BRAND COLORS - Use these consistently throughout the email:**
   - Primary Teal: #3F9BA6 (use for headers, buttons, primary accents)
   - Primary Teal Dark: #2A6B73 (use for gradients and hover states)
   - Accent Terracotta: #A66A5D (use for secondary accents, links)
   - Accent Terracotta Dark: #8B4F44 (use for gradients)
   - Background: #f5f5f5 or white
   - Text: #1f2937 (dark gray)

   **Email Design Guidelines:**
   - Use gradient backgrounds: linear-gradient(135deg, #3F9BA6, #2A6B73) for headers
   - Apply rounded corners (border-radius: 8-12px) to cards and sections
   - For buttons/CTAs: background with gradient from #3F9BA6 to #2A6B73, white text
   - For links: color #A66A5D with hover effect
   - Use card-style layouts with subtle shadows for each meal
   - Add the "Easy Meal Planner" branding at the top with logo styling

   - For the ingredient list specifically, use this mobile-friendly format:
     <div style="background: #f9f9f9; padding: 15px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #3F9BA6;">
       <a href="[link]" style="display: block; color: #A66A5D; text-decoration: none; font-size: 16px; line-height: 1.6;">
         <strong>Ingredient Name</strong> - Quantity
       </a>
     </div>
   - Key requirements for ingredient list:
     * Use larger font sizes (minimum 16px for body text, 18px for links)
     * Add generous padding/spacing between items (at least 12-15px)
     * Make clickable links full-width blocks for easy tapping (minimum 44px height)
     * Use a single-column layout
     * Add background colors or rounded borders to make items visually distinct and tappable
     * Ensure adequate contrast for readability
     * Use brand colors (#3F9BA6 for accents, #A66A5D for links)
4. Use the send_email tool to send the complete email

Make the meal plans varied, delicious, and practical for home cooking. Consider seasonal ingredients when possible.`;
  }

  private async buildUserPrompt(): Promise<string> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (7 - today.getDay()) % 7);

    const weekString = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

    let prompt = `Create a dinner meal plan for ${weekString}.

Requirements:
- High protein (minimum ${this.preferences.minProteinPerMeal}g per meal)
- Low calorie (maximum ${this.preferences.maxCaloriesPerMeal} calories per meal)
- ${this.preferences.numberOfMeals} different dinners
- Include complete nutritional information
- Include ingredient lists and cooking instructions`;

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

    prompt += `\n\nAfter creating the meal plan:
1. Create a consolidated shopping list that combines all ingredients across all meals
2. Organize the shopping list by category (proteins, vegetables, grains, dairy, pantry, etc.)
3. Sum quantities for duplicate ingredients
4. Search HEB for all ingredients and get shopping links
5. Format everything as an attractive HTML email with the shopping list at the end, with clickable HEB links for each ingredient`;

    return prompt;
  }
}
