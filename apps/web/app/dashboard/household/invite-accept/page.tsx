import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import InviteAcceptClient from './InviteAcceptClient';

interface PageProps {
  searchParams: {
    token?: string;
  };
}

export default async function InviteAcceptPage({ searchParams }: PageProps) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect(`/login?returnUrl=/dashboard/household/invite-accept?token=${searchParams.token || ''}`);
  }

  const token = searchParams.token;

  // Missing token
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent-light flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-6">
              The invitation link is invalid or missing. Please check your email for the correct link.
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fetch invitation details
  const invitation = await prisma.householdInvitation.findUnique({
    where: { token },
    include: {
      household: {
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      inviterUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Invalid token
  if (!invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent-light flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Invitation
            </h2>
            <p className="text-gray-600 mb-6">
              This invitation link is invalid or has already been used.
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if invitation is expired
  const now = new Date();
  if (invitation.expiresAt < now) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent-light flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invitation Expired
            </h2>
            <p className="text-gray-600 mb-6">
              This invitation has expired. Please request a new invitation from the household owner.
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if already accepted
  if (invitation.acceptedAt) {
    redirect('/dashboard/household?success=already_accepted');
  }

  // Get current user info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });

  // Verify email matches
  if (user?.email !== invitation.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent-light flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Mismatch
            </h2>
            <p className="text-gray-600 mb-6">
              This invitation was sent to <strong>{invitation.email}</strong>, but you are logged in as{' '}
              <strong>{user?.email}</strong>. Please log in with the correct account or request a new invitation.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/logout"
                className="inline-block bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Switch Account
              </a>
              <a
                href="/dashboard"
                className="inline-block text-gray-600 hover:text-gray-800 transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is already a member
  const existingMember = await prisma.householdMember.findUnique({
    where: {
      householdId_userId: {
        householdId: invitation.householdId,
        userId: session.user.id,
      },
    },
  });

  if (existingMember) {
    redirect('/dashboard/household?success=already_member');
  }

  // All checks passed - show acceptance UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent-light flex items-center justify-center p-4">
      <InviteAcceptClient
        householdName={invitation.household.name}
        inviterName={invitation.inviterUser.name || invitation.inviterUser.email}
        ownerName={invitation.household.owner.name || invitation.household.owner.email}
        token={token}
      />
    </div>
  );
}
