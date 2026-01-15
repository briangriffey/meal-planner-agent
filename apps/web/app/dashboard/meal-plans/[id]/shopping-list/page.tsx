import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import ShoppingList from '@/components/ShoppingList';
import { aggregateIngredients } from '@/lib/shopping-list-utils';

export default async function ShoppingListPage({
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

  // Aggregate ingredients from all meal records
  const aggregatedIngredients = aggregateIngredients(mealPlan.mealRecords);

  const weekStartDate = new Date(mealPlan.weekStartDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
                <Link
                  href={`/dashboard/meal-plans/${params.id}`}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Week of {new Date(mealPlan.weekStartDate).toLocaleDateString()}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-sm text-gray-700">Shopping List</span>
              </li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Shopping List
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Week of {weekStartDate}
          </p>
        </div>
      </div>

      <ShoppingList
        ingredients={aggregatedIngredients}
        mealPlanId={params.id}
        weekStartDate={weekStartDate}
      />
    </div>
  );
}
