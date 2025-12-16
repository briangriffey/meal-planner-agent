import { Meal, ShoppingItem } from '../types';

export interface AggregatedIngredient {
  item: string;
  amount: string;
  originalAmounts: string[]; // Keep track of all amounts for debugging
}

export interface CategorizedShoppingList {
  [category: string]: AggregatedIngredient[];
}

export interface ProcessedMealPlan {
  meals: Meal[];
  shoppingList: CategorizedShoppingList;
  hebLinks: Map<string, string>;
}

export class MealPlanPostProcessor {
  /**
   * Process meal plan data from Claude response
   * - Aggregates ingredients across all meals
   * - Categorizes ingredients
   * - Generates HEB links if enabled
   */
  async process(
    meals: Meal[],
    hebEnabled: boolean
  ): Promise<ProcessedMealPlan> {
    // Aggregate all ingredients from all meals
    const aggregatedIngredients = this.aggregateIngredients(meals);

    // Categorize ingredients
    const categorizedList = this.categorizeIngredients(aggregatedIngredients);

    // Generate HEB links if enabled
    const hebLinks = hebEnabled
      ? await this.generateHEBLinks(aggregatedIngredients)
      : new Map<string, string>();

    return {
      meals,
      shoppingList: categorizedList,
      hebLinks
    };
  }

  /**
   * Aggregate ingredients across all meals
   * Deduplicates and combines quantities when possible
   */
  private aggregateIngredients(meals: Meal[]): AggregatedIngredient[] {
    const ingredientMap = new Map<string, AggregatedIngredient>();

    for (const meal of meals) {
      for (const ingredient of meal.ingredients) {
        const normalizedItem = this.normalizeIngredientName(ingredient.item);

        if (ingredientMap.has(normalizedItem)) {
          const existing = ingredientMap.get(normalizedItem)!;
          existing.originalAmounts.push(ingredient.amount);
          // For now, just combine amounts as a list
          // TODO: Implement smart quantity addition (2 cups + 1 cup = 3 cups)
          existing.amount = this.combineAmounts(existing.originalAmounts);
        } else {
          ingredientMap.set(normalizedItem, {
            item: ingredient.item, // Keep original formatting
            amount: ingredient.amount,
            originalAmounts: [ingredient.amount]
          });
        }
      }
    }

    return Array.from(ingredientMap.values());
  }

  /**
   * Normalize ingredient name for deduplication
   * Removes variations like "fresh basil" vs "basil"
   */
  private normalizeIngredientName(item: string): string {
    return item
      .toLowerCase()
      .replace(/^(fresh|dried|chopped|minced|sliced|diced)\s+/g, '')
      .trim();
  }

  /**
   * Combine amounts from multiple occurrences
   * For now, just lists them out. Could be smarter about adding quantities.
   */
  private combineAmounts(amounts: string[]): string {
    if (amounts.length === 1) {
      return amounts[0];
    }

    // Simple strategy: if all amounts look similar, try to add them
    // Otherwise, just list them
    const numbers = amounts.map(a => this.extractNumber(a));
    const units = amounts.map(a => this.extractUnit(a));

    // If all have same unit, try to sum
    const allSameUnit = units.every(u => u === units[0]);
    if (allSameUnit && numbers.every(n => n !== null)) {
      const sum = numbers.reduce((acc, n) => acc! + n!, 0);
      return `${sum} ${units[0]}`;
    }

    // Otherwise, list them out
    return amounts.join(' + ');
  }

  /**
   * Extract number from amount string (e.g., "2 cups" → 2)
   */
  private extractNumber(amount: string): number | null {
    const match = amount.match(/^(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  /**
   * Extract unit from amount string (e.g., "2 cups" → "cups")
   */
  private extractUnit(amount: string): string {
    const match = amount.match(/\d+\.?\d*\s+(.+)/);
    return match ? match[1].trim() : '';
  }

  /**
   * Categorize ingredients by type
   */
  private categorizeIngredients(
    ingredients: AggregatedIngredient[]
  ): CategorizedShoppingList {
    const categories: CategorizedShoppingList = {
      'Produce': [],
      'Meat & Seafood': [],
      'Dairy & Eggs': [],
      'Pantry Staples': [],
      'Spices & Seasonings': [],
      'Other': []
    };

    for (const ingredient of ingredients) {
      const category = this.determineCategory(ingredient.item);
      categories[category].push(ingredient);
    }

    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  }

  /**
   * Determine ingredient category based on common patterns
   */
  private determineCategory(item: string): string {
    const lower = item.toLowerCase();

    // Produce
    const produce = [
      'lettuce', 'tomato', 'onion', 'garlic', 'pepper', 'carrot', 'celery',
      'spinach', 'kale', 'broccoli', 'cauliflower', 'zucchini', 'mushroom',
      'avocado', 'lemon', 'lime', 'potato', 'sweet potato', 'corn', 'peas',
      'bean sprouts', 'cabbage', 'cucumber', 'basil', 'cilantro', 'parsley',
      'ginger', 'scallion', 'shallot', 'bell pepper', 'jalapeno', 'chili'
    ];
    if (produce.some(p => lower.includes(p))) return 'Produce';

    // Meat & Seafood
    const meat = [
      'chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna',
      'shrimp', 'scallop', 'steak', 'ground beef', 'ground turkey', 'sausage',
      'bacon', 'tilapia', 'cod', 'mahi mahi'
    ];
    if (meat.some(m => lower.includes(m))) return 'Meat & Seafood';

    // Dairy & Eggs
    const dairy = [
      'milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'parmesan',
      'mozzarella', 'cheddar', 'feta', 'goat cheese', 'sour cream', 'half and half'
    ];
    if (dairy.some(d => lower.includes(d))) return 'Dairy & Eggs';

    // Spices & Seasonings
    const spices = [
      'salt', 'pepper', 'paprika', 'cumin', 'oregano', 'thyme', 'rosemary',
      'cinnamon', 'nutmeg', 'cayenne', 'chili powder', 'curry', 'turmeric',
      'coriander', 'bay leaf', 'vanilla', 'soy sauce', 'sesame oil',
      'olive oil', 'vegetable oil', 'vinegar', 'worcestershire'
    ];
    if (spices.some(s => lower.includes(s))) return 'Spices & Seasonings';

    // Pantry Staples
    const pantry = [
      'rice', 'pasta', 'flour', 'sugar', 'bread', 'tortilla', 'quinoa',
      'oats', 'beans', 'lentils', 'chickpeas', 'broth', 'stock', 'coconut milk',
      'tomato sauce', 'tomato paste', 'canned tomatoes', 'honey', 'maple syrup',
      'peanut butter', 'almond butter', 'tahini', 'noodles'
    ];
    if (pantry.some(p => lower.includes(p))) return 'Pantry Staples';

    return 'Other';
  }

  /**
   * Generate HEB search links for ingredients
   */
  private async generateHEBLinks(
    ingredients: AggregatedIngredient[]
  ): Promise<Map<string, string>> {
    const links = new Map<string, string>();

    for (const ingredient of ingredients) {
      const encodedQuery = encodeURIComponent(ingredient.item);
      const searchLink = `https://www.heb.com/search?esc=true&q=${encodedQuery}`;
      links.set(ingredient.item, searchLink);
    }

    return links;
  }
}
