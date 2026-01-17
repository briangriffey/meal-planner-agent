import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

interface Ingredient {
  item: string;
  amount: string;
}

interface Meal {
  day: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  ingredients?: Ingredient[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
}

export default async function MealPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const mealPlan = await prisma.mealPlan.findUnique({
    where: {
      id: params.id,
    },
    include: {
      mealRecords: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      household: {
        include: {
          members: {
            include: {
              user: true,
              preferences: true,
            },
          },
        },
      },
    },
  });

  if (!mealPlan || mealPlan.userId !== session.user.id) {
    notFound();
  }

  if (mealPlan.status !== 'COMPLETED' || mealPlan.mealRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Meal Plan Not Ready</h2>
        <p className="mt-2 text-gray-500">This meal plan is still being generated.</p>
        <Link
          href="/dashboard/meal-plans"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
        >
          Back to Meal Plans
        </Link>
      </div>
    );
  }

  const meals: Meal[] = mealPlan.mealRecords.map((record) => ({
    day: record.day,
    name: record.name,
    calories: record.calories ?? undefined,
    protein: record.protein ?? undefined,
    carbs: record.carbs ?? undefined,
    fat: record.fat ?? undefined,
    fiber: record.fiber ?? undefined,
    ingredients: (record.ingredients as unknown as Ingredient[]) ?? undefined,
    instructions: (record.instructions as unknown as string[]) ?? undefined,
    prepTime: record.prepTime ?? undefined,
    cookTime: record.cookTime ?? undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/dashboard/meal-plans" className="text-sm text-gray-500 hover:text-gray-700">
                  Meal Plans
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-sm text-gray-700">
                  Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}
                </span>
              </li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Meal Plan for Week of {new Date(mealPlan.weekStartDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href={`/dashboard/meal-plans/${params.id}/shopping-list`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-150"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Shopping List
          </Link>
        </div>
      </div>

      {mealPlan.emailSent && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">
                Email sent on {new Date(mealPlan.emailSentAt!).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {mealPlan.household && mealPlan.household.members && mealPlan.household.members.length > 0 && (
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-blue-900">
                Household Plan: {mealPlan.household.name}
              </h3>
              <p className="mt-1 text-sm text-blue-800">
                Planning for: {mealPlan.household.members.map(member => member.user.name || member.user.email).join(', ')}
              </p>
              {mealPlan.household.members.length > 1 && (
                <p className="mt-1 text-xs text-blue-700">
                  {mealPlan.household.members.length} household members • Respecting individual dietary needs
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {meals.map((meal, index) => (
          <div key={index} data-testid="meal-card" className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 bg-gradient-to-r from-primary-light to-primary border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {meal.day}
                  </h3>
                  <p className="text-lg text-white/90 mt-1">{meal.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-4 text-sm text-white/90">
                    {meal.prepTime && <span>Prep: {meal.prepTime}</span>}
                    {meal.cookTime && <span>Cook: {meal.cookTime}</span>}
                  </div>
                  <FavoriteButton mealData={meal} />
                </div>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {meal.calories !== undefined && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{meal.calories}</p>
                    <p className="text-xs text-gray-600">Calories</p>
                  </div>
                )}
                {meal.protein !== undefined && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{meal.protein}g</p>
                    <p className="text-xs text-gray-600">Protein</p>
                  </div>
                )}
                {meal.carbs !== undefined && (
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{meal.carbs}g</p>
                    <p className="text-xs text-gray-600">Carbs</p>
                  </div>
                )}
                {meal.fat !== undefined && (
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{meal.fat}g</p>
                    <p className="text-xs text-gray-600">Fat</p>
                  </div>
                )}
                {meal.fiber !== undefined && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{meal.fiber}g</p>
                    <p className="text-xs text-gray-600">Fiber</p>
                  </div>
                )}
              </div>

              {meal.ingredients && meal.ingredients.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Ingredients
                  </h4>
                  <ul className="space-y-2 bg-gray-50 rounded-lg p-4">
                    {meal.ingredients.map((ingredient, i) => (
                      <li key={i} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-primary mr-3 mt-0.5">•</span>
                        <span className="text-sm text-gray-700">
                          {ingredient.amount} {ingredient.item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {meal.instructions && meal.instructions.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Cooking Instructions
                  </h4>
                  <ol className="space-y-3 bg-gray-50 rounded-lg p-4">
                    {meal.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700 pt-0.5">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {mealPlan.iterationCount && (
        <div className="text-center text-sm text-gray-500">
          Generated in {mealPlan.iterationCount} iteration{mealPlan.iterationCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
