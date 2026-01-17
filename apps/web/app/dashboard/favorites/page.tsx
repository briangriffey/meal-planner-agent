import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import FavoritesSearchFilters from '@/components/FavoritesSearchFilters';

interface Ingredient {
  item: string;
  amount: string;
}

interface FavoritesPageProps {
  searchParams: {
    search?: string;
    minCalories?: string;
    maxCalories?: string;
    minProtein?: string;
    maxProtein?: string;
  };
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Build where clause with filters
  const whereClause = {
    userId: session.user.id,
    ...(searchParams.search && {
      name: {
        contains: searchParams.search,
        mode: 'insensitive' as const,
      },
    }),
    ...(searchParams.minCalories && {
      calories: { gte: parseInt(searchParams.minCalories) }
    }),
    ...(searchParams.maxCalories && {
      calories: { lte: parseInt(searchParams.maxCalories) }
    }),
    ...(searchParams.minProtein && {
      protein: { gte: parseInt(searchParams.minProtein) }
    }),
    ...(searchParams.maxProtein && {
      protein: { lte: parseInt(searchParams.maxProtein) }
    }),
  };

  const favorites = await prisma.favoriteRecipe.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Favorite Recipes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your collection of favorite meals
          </p>
        </div>
      </div>

      <FavoritesSearchFilters />

      {favorites.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div data-testid="empty-state" className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start favoriting meals from your meal plans to save them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {favorites.map((favorite) => {
            const ingredients = (favorite.ingredients as unknown as Ingredient[]) ?? [];
            const instructions = (favorite.instructions as unknown as string[]) ?? [];

            return (
              <div
                key={favorite.id}
                data-testid="meal-card"
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="px-6 py-5 bg-gradient-to-r from-primary-light to-primary border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      {favorite.day && (
                        <h3 className="text-sm font-medium text-white/80">
                          {favorite.day}
                        </h3>
                      )}
                      <p className="text-xl font-bold text-white mt-1">{favorite.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-4 text-sm text-white/90">
                        {favorite.prepTime && <span>Prep: {favorite.prepTime}</span>}
                        {favorite.cookTime && <span>Cook: {favorite.cookTime}</span>}
                      </div>
                      <FavoriteButton
                        mealData={{
                          name: favorite.name,
                          day: favorite.day ?? 'Anytime',
                          calories: favorite.calories ?? undefined,
                          protein: favorite.protein ?? undefined,
                          carbs: favorite.carbs ?? undefined,
                          fat: favorite.fat ?? undefined,
                          fiber: favorite.fiber ?? undefined,
                          ingredients: ingredients,
                          instructions: instructions,
                          prepTime: favorite.prepTime ?? undefined,
                          cookTime: favorite.cookTime ?? undefined,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  {/* Nutrition badges */}
                  {(favorite.calories || favorite.protein || favorite.carbs || favorite.fat || favorite.fiber) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {favorite.calories && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {favorite.calories} cal
                        </span>
                      )}
                      {favorite.protein && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {favorite.protein}g protein
                        </span>
                      )}
                      {favorite.carbs && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          {favorite.carbs}g carbs
                        </span>
                      )}
                      {favorite.fat && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {favorite.fat}g fat
                        </span>
                      )}
                      {favorite.fiber && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          {favorite.fiber}g fiber
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
          })}
        </div>
      )}
    </div>
  );
}
