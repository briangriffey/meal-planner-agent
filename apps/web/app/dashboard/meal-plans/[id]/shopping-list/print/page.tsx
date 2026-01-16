import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { aggregateIngredients, groupByCategory } from '@/lib/shopping-list-utils';
import PrintShoppingList from '@/components/PrintShoppingList';

interface Ingredient {
  item: string;
  amount: string;
}

export default async function PrintShoppingListPage({
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
      <div className="p-8">
        <h2 className="text-xl font-bold">Shopping List Not Available</h2>
        <p className="mt-2 text-gray-600">
          This meal plan is still being generated. Please check back later.
        </p>
      </div>
    );
  }

  // Aggregate ingredients from all meal records
  const mealRecordsWithIngredients = mealPlan.mealRecords.map((record) => ({
    ingredients: record.ingredients as unknown as Ingredient[],
    day: record.day,
    name: record.name,
  }));

  const aggregatedIngredients = aggregateIngredients(mealRecordsWithIngredients);
  const categorizedIngredients = groupByCategory(aggregatedIngredients);

  const weekStart = new Date(mealPlan.weekStartDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const generatedAt = new Date(mealPlan.generatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <PrintShoppingList
      categorizedIngredients={categorizedIngredients}
      aggregatedIngredients={aggregatedIngredients}
      weekStart={weekStart}
      generatedAt={generatedAt}
    />
  );
}
