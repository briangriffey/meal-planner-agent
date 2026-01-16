'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface MemberPreferences {
  id: string;
  dietaryRestrictions: string[];
  minProteinPerMeal: number | null;
  maxCaloriesPerMeal: number | null;
}

interface HouseholdMember {
  id: string;
  userId: string;
  role: 'OWNER' | 'MEMBER';
  user: User;
  preferences: MemberPreferences | null;
}

interface HouseholdInvitation {
  id: string;
  email: string;
  inviterUser: {
    name: string | null;
    email: string;
  };
  createdAt: string;
  expiresAt: string;
}

interface Household {
  id: string;
  name: string;
  ownerId: string;
  owner: User;
  members: HouseholdMember[];
  invitations: HouseholdInvitation[];
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface HouseholdManagementProps {
  households: Household[];
  userId: string;
  userEmail: string;
}

export default function HouseholdManagement({ households, userId, userEmail }: HouseholdManagementProps) {
  const router = useRouter();
  const [householdName, setHouseholdName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // For simplicity, we'll work with the first household
  // In a more complex app, you might allow multiple households
  const household = households[0];
  const isOwner = household?.ownerId === userId;

  const createHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage(null);

    try {
      const response = await fetch('/api/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: householdName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create household');
      }

      setMessage({
        type: 'success',
        text: 'Household created successfully',
      });

      setHouseholdName('');
      router.refresh();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!household) return;

    setIsInviting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/households/${household.id}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      setMessage({
        type: 'success',
        text: 'Invitation sent successfully',
      });

      setInviteEmail('');
      setShowInviteModal(false);
      router.refresh();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsInviting(false);
    }
  };


  // No household exists - show create form
  if (!household) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-primary-dark">
            Household
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a household to manage meal planning for your family.
          </p>
        </div>

        {message && (
          <div
            className={`rounded-lg p-4 border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`text-sm ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Create Your Household
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Give your household a name to get started. You can invite family members after creating it.
          </p>

          <form onSubmit={createHousehold} className="space-y-4">
            <div>
              <label htmlFor="householdName" className="block text-sm font-medium text-gray-700 mb-2">
                Household Name
              </label>
              <input
                id="householdName"
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="e.g., Smith Family, Our Home"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                required
                minLength={1}
                maxLength={100}
              />
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Household'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Household exists - show management UI
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary-dark">
            {household.name}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage your household members and their preferences.
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Invite Member
          </button>
        )}
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-sm ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Members Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Household Members
        </h3>

        <div className="space-y-4">
          {household.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-light transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.user.name || member.user.email}
                      {member.userId === userId && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      member.role === 'OWNER'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                {member.preferences && (
                  <div className="mt-2 text-sm text-gray-600">
                    {member.preferences.dietaryRestrictions.length > 0 && (
                      <p>
                        Dietary restrictions:{' '}
                        {member.preferences.dietaryRestrictions.join(', ')}
                      </p>
                    )}
                    {member.preferences.minProteinPerMeal && (
                      <p>Min protein: {member.preferences.minProteinPerMeal}g</p>
                    )}
                    {member.preferences.maxCaloriesPerMeal && (
                      <p>Max calories: {member.preferences.maxCaloriesPerMeal}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations Section */}
      {isOwner && household.invitations.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Pending Invitations
          </h3>

          <div className="space-y-3">
            {household.invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <p className="font-medium text-gray-900">{invitation.email}</p>
                <p className="text-sm text-gray-600">
                  Sent {new Date(invitation.createdAt).toLocaleDateString()} ·
                  Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Invite Household Member
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Enter the email address of the person you want to invite to your household.
            </p>

            <form onSubmit={sendInvitation} className="space-y-4">
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
