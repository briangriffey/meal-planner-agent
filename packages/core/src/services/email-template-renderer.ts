import { Meal } from '../types';
import { ProcessedMealPlan } from './meal-plan-post-processor';

// Brand colors - consistent throughout the email
const BRAND_COLORS = {
  primaryTeal: '#3F9BA6',
  primaryTealDark: '#2A6B73',
  accentTerracotta: '#A66A5D',
  accentTerracottaDark: '#8B4F44',
  backgroundGray: '#f5f5f5',
  textDark: '#1f2937',
  white: '#ffffff',
  lightGray: '#f9f9f9',
  mediumGray: '#666'
};

export interface EmailRenderOptions {
  weekLabel: string;
  includeHEBLinks: boolean;
  servingsPerMeal: number;
  minProteinPerMeal: number;
  maxCaloriesPerMeal: number;
}

export class EmailTemplateRenderer {
  /**
   * Render complete HTML email from processed meal plan data
   */
  render(data: ProcessedMealPlan, options: EmailRenderOptions): string {
    const { meals, shoppingList, hebLinks } = data;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>High-Protein Dinner Meal Plan</title>
    ${this.renderStyles()}
</head>
<body>
    <div class="container">
        ${this.renderHeader(options.weekLabel, meals.length, options.servingsPerMeal, options.minProteinPerMeal, options.maxCaloriesPerMeal)}

        <div class="content">
            ${this.renderSummary(meals.length, options.minProteinPerMeal, options.maxCaloriesPerMeal, options.servingsPerMeal)}
            ${meals.map((meal, index) => this.renderMealCard(meal, index + 1, options.servingsPerMeal)).join('\n')}
        </div>

        ${this.renderShoppingSection(shoppingList, hebLinks, options.includeHEBLinks)}

        ${this.renderFooter(options.minProteinPerMeal, options.maxCaloriesPerMeal)}
    </div>
</body>
</html>`;
  }

  /**
   * Render CSS styles
   */
  private renderStyles(): string {
    return `<style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: ${BRAND_COLORS.backgroundGray};
            color: ${BRAND_COLORS.textDark};
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: ${BRAND_COLORS.white};
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, ${BRAND_COLORS.primaryTeal}, ${BRAND_COLORS.primaryTealDark});
            color: ${BRAND_COLORS.white};
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 20px;
        }
        .meal-card {
            background: ${BRAND_COLORS.white};
            border-radius: 12px;
            margin: 20px 0;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid ${BRAND_COLORS.primaryTeal};
        }
        .meal-header {
            background: linear-gradient(135deg, ${BRAND_COLORS.accentTerracotta}, ${BRAND_COLORS.accentTerracottaDark});
            color: ${BRAND_COLORS.white};
            padding: 15px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
        }
        .meal-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0;
        }
        .meal-subtitle {
            font-size: 14px;
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        .nutrition-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 15px 0;
            background: ${BRAND_COLORS.lightGray};
            padding: 15px;
            border-radius: 8px;
        }
        .nutrition-item {
            text-align: center;
        }
        .nutrition-value {
            font-size: 18px;
            font-weight: bold;
            color: ${BRAND_COLORS.primaryTeal};
        }
        .nutrition-label {
            font-size: 12px;
            color: ${BRAND_COLORS.mediumGray};
            text-transform: uppercase;
        }
        .ingredients {
            background: #f0f8f9;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .ingredients h4 {
            color: ${BRAND_COLORS.primaryTealDark};
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .ingredients ul {
            margin: 0;
            padding-left: 20px;
        }
        .ingredients li {
            margin: 5px 0;
            font-size: 14px;
        }
        .instructions {
            margin: 15px 0;
        }
        .instructions h4 {
            color: ${BRAND_COLORS.primaryTealDark};
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .instructions ol {
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
            font-size: 14px;
        }
        .shopping-section {
            background: linear-gradient(135deg, ${BRAND_COLORS.primaryTeal}, ${BRAND_COLORS.primaryTealDark});
            color: ${BRAND_COLORS.white};
            padding: 30px 20px;
            margin-top: 30px;
        }
        .shopping-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 20px 0;
            text-align: center;
        }
        .category {
            margin: 25px 0;
        }
        .category-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 15px 0;
            color: ${BRAND_COLORS.white};
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 6px;
        }
        .ingredient-item {
            background: ${BRAND_COLORS.lightGray};
            padding: 15px;
            margin: 8px 0;
            border-radius: 8px;
            border-left: 4px solid ${BRAND_COLORS.accentTerracotta};
            min-height: 44px;
            display: flex;
            align-items: center;
        }
        .ingredient-item a {
            display: block;
            color: ${BRAND_COLORS.accentTerracotta};
            text-decoration: none;
            font-size: 16px;
            line-height: 1.6;
            width: 100%;
        }
        .ingredient-item a:hover {
            color: ${BRAND_COLORS.accentTerracottaDark};
        }
        .ingredient-item strong {
            color: ${BRAND_COLORS.textDark};
        }
        .ingredient-text {
            color: ${BRAND_COLORS.textDark};
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: ${BRAND_COLORS.mediumGray};
            font-size: 14px;
        }
        @media (max-width: 480px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            .nutrition-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .header h1 {
                font-size: 24px;
            }
            .meal-title {
                font-size: 18px;
            }
        }
    </style>`;
  }

  /**
   * Render email header
   */
  private renderHeader(weekLabel: string, mealCount: number, servings: number, minProtein: number, maxCalories: number): string {
    return `<div class="header">
            <h1>🍽️ Easy Meal Planner</h1>
            <p>High-Protein Dinner Plan | ${weekLabel}</p>
        </div>`;
  }

  /**
   * Render summary section
   */
  private renderSummary(mealCount: number, minProtein: number, maxCalories: number, servings: number): string {
    return `<p style="text-align: center; font-size: 16px; margin-bottom: 30px; color: ${BRAND_COLORS.mediumGray};">
                <strong>${mealCount} delicious dinners</strong> • <strong>${minProtein}g+ protein per serving</strong> • <strong>Under ${maxCalories} calories</strong> • <strong>Serves ${servings}</strong>
            </p>`;
  }

  /**
   * Render a single meal card
   */
  private renderMealCard(meal: Meal, dayNumber: number, servings: number): string {
    return `<div class="meal-card">
                <div class="meal-header">
                    <div class="meal-title">Day ${dayNumber}: ${meal.name}</div>
                    <div class="meal-subtitle">Prep: ${meal.prepTime} • Cook: ${meal.cookTime} • Serves: ${servings}</div>
                </div>

                ${this.renderNutritionGrid(meal.nutrition)}

                <div class="ingredients">
                    <h4>Ingredients (for ${servings} ${servings === 1 ? 'serving' : 'servings'}):</h4>
                    <ul>
                        ${meal.ingredients.map(ing => `<li>${ing.item} - ${ing.amount}</li>`).join('\n                        ')}
                    </ul>
                </div>

                <div class="instructions">
                    <h4>Instructions:</h4>
                    <ol>
                        ${meal.instructions.map(step => `<li>${step}</li>`).join('\n                        ')}
                    </ol>
                </div>
            </div>`;
  }

  /**
   * Render nutrition grid
   */
  private renderNutritionGrid(nutrition: { calories: number; protein: number; carbs: number; fat: number; fiber: number }): string {
    return `<div class="nutrition-grid">
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.calories}</div>
                        <div class="nutrition-label">Calories</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.protein}g</div>
                        <div class="nutrition-label">Protein</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.carbs}g</div>
                        <div class="nutrition-label">Carbs</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.fat}g</div>
                        <div class="nutrition-label">Fat</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${nutrition.fiber}g</div>
                        <div class="nutrition-label">Fiber</div>
                    </div>
                </div>`;
  }

  /**
   * Render shopping list section
   */
  private renderShoppingSection(
    shoppingList: { [category: string]: { item: string; amount: string }[] },
    hebLinks: Map<string, string>,
    includeHEBLinks: boolean
  ): string {
    const categories = Object.keys(shoppingList);

    return `<div class="shopping-section">
            <h2 class="shopping-title">🛒 Complete Shopping List</h2>
            <p style="text-align: center; margin-bottom: 30px; opacity: 0.9;">
                Organized by category with combined quantities${includeHEBLinks ? '. Tap ingredients to add to your HEB cart!' : '.'}
            </p>

            ${categories.map(category => this.renderCategory(category, shoppingList[category], hebLinks, includeHEBLinks)).join('\n')}
        </div>`;
  }

  /**
   * Render a shopping list category
   */
  private renderCategory(
    categoryName: string,
    ingredients: { item: string; amount: string }[],
    hebLinks: Map<string, string>,
    includeHEBLinks: boolean
  ): string {
    // Add emoji to category name
    const categoryEmoji = this.getCategoryEmoji(categoryName);

    return `<div class="category">
                <h3 class="category-title">${categoryEmoji} ${categoryName}</h3>
                ${ingredients.map(ing => this.renderIngredientItem(ing, hebLinks, includeHEBLinks)).join('\n                ')}
            </div>`;
  }

  /**
   * Render a single ingredient item
   */
  private renderIngredientItem(
    ingredient: { item: string; amount: string },
    hebLinks: Map<string, string>,
    includeHEBLinks: boolean
  ): string {
    const link = hebLinks.get(ingredient.item);

    if (includeHEBLinks && link) {
      return `<div class="ingredient-item">
                    <a href="${link}">
                        <strong>${ingredient.item}</strong> - ${ingredient.amount}
                    </a>
                </div>`;
    } else {
      return `<div class="ingredient-item">
                    <span class="ingredient-text">
                        <strong>${ingredient.item}</strong> - ${ingredient.amount}
                    </span>
                </div>`;
    }
  }

  /**
   * Get emoji for category
   */
  private getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'Produce': '🥬',
      'Meat & Seafood': '🥩',
      'Dairy & Eggs': '🥛',
      'Pantry Staples': '🌾',
      'Spices & Seasonings': '🧂',
      'Other': '📦'
    };

    return emojiMap[category] || '📦';
  }

  /**
   * Render footer
   */
  private renderFooter(minProtein: number, maxCalories: number): string {
    return `<div class="footer">
            <p>🍽️ <strong>Easy Meal Planner</strong></p>
            <p>Happy cooking! Each meal provides ${minProtein}g+ protein and stays under ${maxCalories} calories per serving.</p>
            <p style="font-size: 12px; color: #999;">Nutritional information is approximate. Individual results may vary.</p>
        </div>`;
  }
}
