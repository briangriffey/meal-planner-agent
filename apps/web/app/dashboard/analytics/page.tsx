import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const [mealRecords, totalPlans] = await Promise.all([
    prisma.mealRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.mealPlan.count({
      where: {
        userId: session.user.id,
        status: 'COMPLETED',
      },
    }),
  ]);

  const totalMeals = mealRecords.length;

  const avgNutrition = mealRecords.reduce(
    (acc: { calories: number; protein: number; carbs: number; fat: number; fiber: number; count: number }, meal: any) => {
      if (meal.calories) acc.calories += meal.calories;
      if (meal.protein) acc.protein += meal.protein;
      if (meal.carbs) acc.carbs += meal.carbs;
      if (meal.fat) acc.fat += meal.fat;
      if (meal.fiber) acc.fiber += meal.fiber;
      acc.count += 1;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, count: 0 }
  );

  const averages = {
    calories: avgNutrition.count > 0 ? Math.round(avgNutrition.calories / avgNutrition.count) : 0,
    protein: avgNutrition.count > 0 ? Math.round(avgNutrition.protein / avgNutrition.count) : 0,
    carbs: avgNutrition.count > 0 ? Math.round(avgNutrition.carbs / avgNutrition.count) : 0,
    fat: avgNutrition.count > 0 ? Math.round(avgNutrition.fat / avgNutrition.count) : 0,
    fiber: avgNutrition.count > 0 ? Math.round(avgNutrition.fiber / avgNutrition.count) : 0,
  };

  const mealFrequency = mealRecords.reduce((acc, meal) => {
    const name = meal.name;
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMeals = Object.entries(mealFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          History & Analytics
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Track your meal planning history and nutritional insights
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Meal Plans</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalPlans}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Meals</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalMeals}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Calories</dt>
                  <dd className="text-lg font-medium text-gray-900">{averages.calories}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Protein</dt>
                  <dd className="text-lg font-medium text-gray-900">{averages.protein}g</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Average Nutrition</h3>
            <p className="mt-1 text-sm text-gray-500">Per meal across all your meal plans</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Calories</dt>
                <dd className="text-sm font-semibold text-gray-900">{averages.calories}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Protein</dt>
                <dd className="text-sm font-semibold text-gray-900">{averages.protein}g</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Carbohydrates</dt>
                <dd className="text-sm font-semibold text-gray-900">{averages.carbs}g</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Fat</dt>
                <dd className="text-sm font-semibold text-gray-900">{averages.fat}g</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-gray-500">Fiber</dt>
                <dd className="text-sm font-semibold text-gray-900">{averages.fiber}g</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Most Frequent Meals</h3>
            <p className="mt-1 text-sm text-gray-500">Your top 10 most generated meals</p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {topMeals.length === 0 ? (
              <p className="text-sm text-gray-500">No meal history yet</p>
            ) : (
              <ul className="space-y-3">
                {topMeals.map(([name, count], index) => (
                  <li key={name} className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="flex-shrink-0 w-6 text-sm font-medium text-gray-500">
                        {index + 1}.
                      </span>
                      <span className="ml-2 text-sm text-gray-900 truncate">{name}</span>
                    </div>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {count}x
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Meals</h3>
          <p className="mt-1 text-sm text-gray-500">Your last 20 generated meals</p>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meal Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calories
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protein
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mealRecords.slice(0, 20).map((meal) => (
                <tr key={meal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {meal.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meal.day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meal.calories || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {meal.protein ? `${meal.protein}g` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(meal.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
