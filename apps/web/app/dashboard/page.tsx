import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const [recentMealPlans, preferences] = await Promise.all([
    prisma.mealPlan.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  // Redirect new users to preferences page if they haven't filled them out yet
  // Check if this is a new user (no meal plans and default email recipients only)
  if (recentMealPlans.length === 0 && preferences &&
      preferences.emailRecipients.length === 1 &&
      preferences.emailRecipients[0] === session.user.email) {
    redirect('/dashboard/preferences');
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    PROCESSING: 'bg-primary-light/20 text-primary-dark border border-primary-light',
    COMPLETED: 'bg-green-100 text-green-800 border border-green-200',
    FAILED: 'bg-red-100 text-red-800 border border-red-200',
    CANCELLED: 'bg-gray-100 text-gray-800 border border-gray-200',
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold text-primary-dark">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Here&apos;s an overview of your meal planning activity.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent shadow-lg hover:shadow-xl transition-all duration-150"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Generate New Meal Plan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-150">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-white/80 truncate">Total Meal Plans</dt>
                  <dd className="text-2xl font-bold text-white">{recentMealPlans.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-light to-primary rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-150">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-white/80 truncate">Meals Per Week</dt>
                  <dd className="text-2xl font-bold text-white">{preferences?.numberOfMeals || 7}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent to-accent/90 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-150">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-white/80 truncate">Servings Per Meal</dt>
                  <dd className="text-2xl font-bold text-white">{preferences?.servingsPerMeal || 2}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-bold text-primary-dark">Recent Meal Plans</h3>
          <p className="mt-1 text-sm text-gray-600">Your latest meal planning history</p>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentMealPlans.length === 0 ? (
            <li className="px-6 py-12">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No meal plans yet. Generate your first one!</p>
                <Link
                  href="/dashboard/generate"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark shadow-lg hover:shadow-xl transition-all duration-150"
                >
                  Get Started
                </Link>
              </div>
            </li>
          ) : (
            recentMealPlans.map((plan: any) => (
              <li key={plan.id} className="px-6 py-4 hover:bg-primary-light/5 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-primary rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        Week of {new Date(plan.weekStartDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Generated {new Date(plan.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[plan.status as keyof typeof statusColors]}`}>
                      {plan.status}
                    </span>
                    {plan.status === 'COMPLETED' && (
                      <Link
                        href={`/dashboard/meal-plans/${plan.id}`}
                        className="inline-flex items-center px-3 py-1 border border-primary text-sm font-medium rounded-lg text-primary hover:bg-primary hover:text-white transition-all duration-150"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
