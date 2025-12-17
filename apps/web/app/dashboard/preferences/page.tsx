import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import PreferencesForm from '@/components/PreferencesForm';

export default async function PreferencesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  if (!preferences) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">Failed to load preferences</p>
      </div>
    );
  }

  return (
    <PreferencesForm
      initialPreferences={preferences}
      userEmail={session.user.email || ''}
    />
  );
}
