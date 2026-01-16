'use client';

import { useState } from 'react';

interface InviteAcceptClientProps {
  householdName: string;
  inviterName: string;
  ownerName: string;
  token: string;
}

export default function InviteAcceptClient({
  householdName,
  inviterName,
  ownerName,
  token,
}: InviteAcceptClientProps) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    // Redirect to API endpoint which handles the acceptance and redirects to household page
    window.location.href = `/api/households/invitations/accept?token=${token}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Household Invitation
        </h2>

        <div className="my-6 p-4 bg-gradient-to-r from-primary-light/10 to-accent-light/10 rounded-lg border border-primary-light/20">
          <p className="text-sm text-gray-600 mb-1">You've been invited to join</p>
          <p className="text-xl font-bold text-primary-dark mb-3">{householdName}</p>
          <p className="text-sm text-gray-600">
            by <strong>{inviterName}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Household owner: {ownerName}
          </p>
        </div>

        <div className="text-left space-y-3 mb-6 text-sm text-gray-600">
          <p className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            View shared meal plans for your household
          </p>
          <p className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Set your individual dietary preferences
          </p>
          <p className="flex items-start">
            <svg
              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Receive meal plan notifications
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAccepting ? 'Accepting...' : 'Accept Invitation'}
          </button>
          <a
            href="/dashboard"
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            Maybe Later
          </a>
        </div>
      </div>
    </div>
  );
}
