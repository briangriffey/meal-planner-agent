import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RecipeExplorerFilters from '@/components/RecipeExplorerFilters';
import RecipeExplorerCard from '@/components/RecipeExplorerCard';

interface Ingredient {
  item: string;
  amount: string;
}

interface Recipe {
  name: string;
  description?: string;
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

interface ExplorePageProps {
  searchParams: {
    search?: string;
    cuisine?: string;
    prepTime?: string;
    minCalories?: string;
    maxCalories?: string;
    minProtein?: string;
    maxProtein?: string;
    page?: string;
  };
}

async function fetchRecipes(
  searchParams: ExplorePageProps['searchParams'],
  userId: string
): Promise<{ recipes: Recipe[]; hasMore: boolean; total: number }> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.cuisine) params.set('cuisine', searchParams.cuisine);
    if (searchParams.prepTime) params.set('prepTime', searchParams.prepTime);
    if (searchParams.minCalories) params.set('minCalories', searchParams.minCalories);
    if (searchParams.maxCalories) params.set('maxCalories', searchParams.maxCalories);
    if (searchParams.minProtein) params.set('minProtein', searchParams.minProtein);
    if (searchParams.maxProtein) params.set('maxProtein', searchParams.maxProtein);
    if (searchParams.page) params.set('page', searchParams.page);

    // Set limit for recipes per page
    params.set('limit', '6');

    // Fetch from API endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/recipes/explore?${params.toString()}`, {
      cache: 'no-store', // Always get fresh recipes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch recipes:', response.statusText);
      return { recipes: [], hasMore: false, total: 0 };
    }

    const data = await response.json();
    return {
      recipes: data.recipes || [],
      hasMore: data.pagination?.hasMore || false,
      total: data.pagination?.total || 0,
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return { recipes: [], hasMore: false, total: 0 };
  }
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { recipes, hasMore, total } = await fetchRecipes(searchParams, session.user.id);

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Explore Recipes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Discover AI-generated recipe ideas tailored to your preferences
          </p>
        </div>
      </div>

      <RecipeExplorerFilters />

      {recipes.length === 0 ? (
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
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to discover more recipes.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeExplorerCard
                key={`${recipe.name}-${index}`}
                name={recipe.name}
                description={recipe.description}
                calories={recipe.calories}
                protein={recipe.protein}
                carbs={recipe.carbs}
                fat={recipe.fat}
                fiber={recipe.fiber}
                ingredients={recipe.ingredients}
                instructions={recipe.instructions}
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {(currentPage > 1 || hasMore) && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
              <div className="flex flex-1 justify-between sm:hidden">
                {currentPage > 1 && (
                  <a
                    href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) }).toString()}`}
                    data-testid="pagination-prev"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                )}
                {hasMore && (
                  <a
                    href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) }).toString()}`}
                    data-testid="pagination-next"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </a>
                )}
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span>
                    {total > 0 && (
                      <>
                        {' '}of approximately <span className="font-medium">{Math.ceil(total / 6)}</span> pages
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {currentPage > 1 && (
                      <a
                        href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) }).toString()}`}
                        data-testid="pagination-prev"
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      {currentPage}
                    </span>
                    {hasMore && (
                      <a
                        href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) }).toString()}`}
                        data-testid="pagination-next"
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
