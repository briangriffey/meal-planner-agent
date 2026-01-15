/**
 * Shopping List Utilities
 * Functions for aggregating and processing meal ingredients into shopping lists
 */

export interface Ingredient {
  item: string;
  amount: string;
}

export interface AggregatedIngredient {
  item: string;
  amount: string;
  originalAmounts: string[];
}

export interface CategorizedShoppingList {
  [category: string]: AggregatedIngredient[];
}

export interface MealRecord {
  ingredients: unknown; // JSON field from Prisma
  day: string;
  name: string;
}

/**
 * Aggregate ingredients from meal records
 * Deduplicates and combines quantities when possible
 */
export function aggregateIngredients(
  mealRecords: MealRecord[]
): AggregatedIngredient[] {
  const ingredientMap = new Map<string, AggregatedIngredient>();

  for (const record of mealRecords) {
    const ingredients = (record.ingredients as Ingredient[]) || [];

    for (const ingredient of ingredients) {
      if (!ingredient?.item || !ingredient?.amount) continue;

      const normalizedItem = normalizeIngredientName(ingredient.item);

      if (ingredientMap.has(normalizedItem)) {
        const existing = ingredientMap.get(normalizedItem)!;
        existing.originalAmounts.push(ingredient.amount);
        existing.amount = combineAmounts(existing.originalAmounts);
      } else {
        ingredientMap.set(normalizedItem, {
          item: ingredient.item,
          amount: ingredient.amount,
          originalAmounts: [ingredient.amount],
        });
      }
    }
  }

  return Array.from(ingredientMap.values()).sort((a, b) =>
    a.item.localeCompare(b.item)
  );
}

/**
 * Group aggregated ingredients by category
 */
export function groupByCategory(
  ingredients: AggregatedIngredient[]
): CategorizedShoppingList {
  const categories: CategorizedShoppingList = {
    Produce: [],
    'Meat & Seafood': [],
    'Dairy & Eggs': [],
    'Pantry Staples': [],
    'Spices & Seasonings': [],
    Other: [],
  };

  for (const ingredient of ingredients) {
    const category = determineCategory(ingredient.item);
    categories[category].push(ingredient);
  }

  // Remove empty categories
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
}

/**
 * Format shopping list as plain text
 */
export function formatShoppingListText(
  ingredients: AggregatedIngredient[],
  options: {
    includeCategories?: boolean;
    title?: string;
  } = {}
): string {
  const lines: string[] = [];

  if (options.title) {
    lines.push(options.title);
    lines.push('='.repeat(options.title.length));
    lines.push('');
  }

  if (options.includeCategories) {
    const categorized = groupByCategory(ingredients);

    for (const [category, items] of Object.entries(categorized)) {
      lines.push(category);
      lines.push('-'.repeat(category.length));
      for (const item of items) {
        lines.push(`☐ ${item.amount} ${item.item}`);
      }
      lines.push('');
    }
  } else {
    for (const ingredient of ingredients) {
      lines.push(`☐ ${ingredient.amount} ${ingredient.item}`);
    }
  }

  return lines.join('\n');
}

/**
 * Normalize ingredient name for deduplication
 * Removes variations like "fresh basil" vs "basil"
 */
function normalizeIngredientName(item: string): string {
  return item
    .toLowerCase()
    .replace(/^(fresh|dried|chopped|minced|sliced|diced)\s+/g, '')
    .trim();
}

/**
 * Combine amounts from multiple occurrences
 * Attempts to add quantities with same units, otherwise lists them
 */
function combineAmounts(amounts: string[]): string {
  if (amounts.length === 1) {
    return amounts[0];
  }

  const numbers = amounts.map((a) => extractNumber(a));
  const units = amounts.map((a) => extractUnit(a));

  // If all have same unit, try to sum
  const allSameUnit = units.every((u) => u === units[0]);
  if (allSameUnit && numbers.every((n) => n !== null)) {
    const sum = numbers.reduce((acc, n) => acc! + n!, 0);
    return `${sum} ${units[0]}`;
  }

  // Otherwise, list them out
  return amounts.join(' + ');
}

/**
 * Extract number from amount string (e.g., "2 cups" → 2)
 */
function extractNumber(amount: string): number | null {
  const match = amount.match(/^(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Extract unit from amount string (e.g., "2 cups" → "cups")
 */
function extractUnit(amount: string): string {
  const match = amount.match(/\d+\.?\d*\s+(.+)/);
  return match ? match[1].trim() : '';
}

/**
 * Determine ingredient category based on common patterns
 */
function determineCategory(item: string): string {
  const lower = item.toLowerCase();

  // Produce
  const produce = [
    'lettuce',
    'tomato',
    'onion',
    'garlic',
    'pepper',
    'carrot',
    'celery',
    'spinach',
    'kale',
    'broccoli',
    'cauliflower',
    'zucchini',
    'mushroom',
    'avocado',
    'lemon',
    'lime',
    'potato',
    'sweet potato',
    'corn',
    'peas',
    'bean sprouts',
    'cabbage',
    'cucumber',
    'basil',
    'cilantro',
    'parsley',
    'ginger',
    'scallion',
    'shallot',
    'bell pepper',
    'jalapeno',
    'chili',
  ];
  if (produce.some((p) => lower.includes(p))) return 'Produce';

  // Meat & Seafood
  const meat = [
    'chicken',
    'beef',
    'pork',
    'turkey',
    'lamb',
    'fish',
    'salmon',
    'tuna',
    'shrimp',
    'scallop',
    'steak',
    'ground beef',
    'ground turkey',
    'sausage',
    'bacon',
    'tilapia',
    'cod',
    'mahi mahi',
  ];
  if (meat.some((m) => lower.includes(m))) return 'Meat & Seafood';

  // Dairy & Eggs
  const dairy = [
    'milk',
    'cheese',
    'yogurt',
    'butter',
    'cream',
    'egg',
    'parmesan',
    'mozzarella',
    'cheddar',
    'feta',
    'goat cheese',
    'sour cream',
    'half and half',
  ];
  if (dairy.some((d) => lower.includes(d))) return 'Dairy & Eggs';

  // Spices & Seasonings
  const spices = [
    'salt',
    'pepper',
    'paprika',
    'cumin',
    'oregano',
    'thyme',
    'rosemary',
    'cinnamon',
    'nutmeg',
    'cayenne',
    'chili powder',
    'curry',
    'turmeric',
    'coriander',
    'bay leaf',
    'vanilla',
    'soy sauce',
    'sesame oil',
    'olive oil',
    'vegetable oil',
    'vinegar',
    'worcestershire',
  ];
  if (spices.some((s) => lower.includes(s))) return 'Spices & Seasonings';

  // Pantry Staples
  const pantry = [
    'rice',
    'pasta',
    'flour',
    'sugar',
    'bread',
    'tortilla',
    'quinoa',
    'oats',
    'beans',
    'lentils',
    'chickpeas',
    'broth',
    'stock',
    'coconut milk',
    'tomato sauce',
    'tomato paste',
    'canned tomatoes',
    'honey',
    'maple syrup',
    'peanut butter',
    'almond butter',
    'tahini',
    'noodles',
  ];
  if (pantry.some((p) => lower.includes(p))) return 'Pantry Staples';

  return 'Other';
}
