import Anthropic from '@anthropic-ai/sdk';
import { ConnectorRegistry } from '../connectors/base';
import { Config, MealPlan } from '../types';

export class MealPlannerAgent {
  private client: Anthropic;
  private connectorRegistry: ConnectorRegistry;
  private config: Config;

  constructor(config: Config, connectorRegistry: ConnectorRegistry) {
    this.config = config;
    this.connectorRegistry = connectorRegistry;
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateMealPlan(): Promise<void> {
    console.log('Starting meal plan generation...');

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt();

    let messages: Anthropic.MessageParam[] = [
      { role: 'user', content: userPrompt }
    ];

    let continueLoop = true;
    let iterationCount = 0;
    const maxIterations = 10;

    while (continueLoop && iterationCount < maxIterations) {
      iterationCount++;
      console.log(`Agent iteration ${iterationCount}...`);

      const response = await this.client.messages.create({
        model: this.config.claude.model,
        max_tokens: 8192,
        system: systemPrompt,
        messages,
        tools: this.connectorRegistry.getToolDefinitions()
      });

      console.log(`Stop reason: ${response.stop_reason}`);

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

    console.log('Meal plan generation complete!');
  }

  private buildSystemPrompt(): string {
    return `You are a meal planning assistant specialized in creating high-protein, low-calorie dinner plans.

Your task is to:
1. Generate a 7-day meal plan for dinners only
2. Each meal should meet these nutritional requirements:
   - Minimum ${this.config.preferences.minProteinPerMeal}g of protein per meal
   - Maximum ${this.config.preferences.maxCaloriesPerMeal} calories per meal
   - Focus on whole foods, lean proteins, and vegetables
3. Include detailed nutritional information for each meal (calories, protein, carbs, fat, fiber)
4. Provide a complete ingredient list with amounts
5. Include clear cooking instructions
6. Include prep time and cook time

After generating the meal plan, you should:
1. Format it as an attractive HTML email
2. Use the send_email tool to send the meal plan
${this.config.heb.enabled ? '3. Use the browse_heb tool to search for key ingredients on HEB website and include shopping links in the email' : ''}

Make the meal plans varied, delicious, and practical for home cooking. Consider seasonal ingredients when possible.`;
  }

  private buildUserPrompt(): string {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (7 - today.getDay()) % 7);

    const weekString = `Week of ${weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

    let prompt = `Create a weekly dinner meal plan for ${weekString}.

Requirements:
- High protein (minimum ${this.config.preferences.minProteinPerMeal}g per meal)
- Low calorie (maximum ${this.config.preferences.maxCaloriesPerMeal} calories per meal)
- 7 different dinners (Monday through Sunday)
- Include complete nutritional information
- Include ingredient lists and cooking instructions`;

    if (this.config.preferences.dietaryRestrictions.length > 0) {
      prompt += `\n- Dietary restrictions: ${this.config.preferences.dietaryRestrictions.join(', ')}`;
    }

    prompt += `\n\nAfter creating the meal plan, send it via email with an attractive HTML format.`;

    if (this.config.heb.enabled) {
      prompt += ` Also search HEB for the main protein ingredients and include shopping links in the email.`;
    }

    return prompt;
  }
}
