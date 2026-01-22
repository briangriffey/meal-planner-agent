'use client';

import FavoriteButton from './FavoriteButton';

interface Ingredient {
  item: string;
  amount: string;
}

interface RecipeExplorerCardProps {
  name: string;
  description?: string;
  day?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
}

export default function RecipeExplorerCard({
  name,
  description,
  day = 'Standalone',
  calories,
  protein,
  carbs,
  fat,
  fiber,
  ingredients,
  instructions,
  prepTime,
  cookTime,
}: RecipeExplorerCardProps) {
  return (
    <div
      data-testid="recipe-card"
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
    >
      {/* Header with gradient background */}
      <div className="px-6 py-5 bg-gradient-to-r from-primary-light to-primary border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xl font-bold text-white">{name}</p>
            {description && (
              <p className="text-sm text-white/90 mt-2">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-4 ml-4">
            <div className="flex space-x-4 text-sm text-white/90">
              {prepTime && <span>Prep: {prepTime}</span>}
              {cookTime && <span>Cook: {cookTime}</span>}
            </div>
            <FavoriteButton
              mealData={{
                name,
                day,
                calories,
                protein,
                carbs,
                fat,
                fiber,
                ingredients,
                instructions,
                prepTime,
                cookTime,
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Nutrition badges */}
        {(calories || protein || carbs || fat || fiber) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {calories && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {calories} cal
              </span>
            )}
            {protein && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {protein}g protein
              </span>
            )}
            {carbs && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {carbs}g carbs
              </span>
            )}
            {fat && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {fat}g fat
              </span>
            )}
            {fiber && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {fiber}g fiber
              </span>
            )}
          </div>
        )}

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Ingredients</h4>
            <ul className="space-y-1">
              {ingredients.slice(0, 5).map((ingredient, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  <span className="font-medium">{ingredient.amount}</span> {ingredient.item}
                </li>
              ))}
              {ingredients.length > 5 && (
                <li className="text-sm text-gray-500 italic">
                  ... and {ingredients.length - 5} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Instructions preview */}
        {instructions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-1">
              {instructions.slice(0, 3).map((instruction, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  {instruction}
                </li>
              ))}
              {instructions.length > 3 && (
                <li className="text-sm text-gray-500 italic">
                  ... {instructions.length - 3} more steps
                </li>
              )}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
