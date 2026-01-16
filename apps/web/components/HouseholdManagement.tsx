'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HouseholdMemberCard from './HouseholdMemberCard';
import MemberPreferencesForm from './MemberPreferencesForm';
import InviteMemberModal from './InviteMemberModal';

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
  createdAt: Date;
  expiresAt: Date;
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
  const [message, setMessage] = useState<Message | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<HouseholdMember | null>(null);

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

  const removeMember = async (memberId: string) => {
    if (!household) return;
    if (!confirm('Are you sure you want to remove this member from the household?')) {
      return;
    }

    setMessage(null);

    try {
      const response = await fetch(
        `/api/households/${household.id}/members/${memberId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove member');
      }

      setMessage({
        type: 'success',
        text: 'Member removed successfully',
      });

      router.refresh();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred',
      });
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
            className={`rounded-lg p-4 border ${message.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
              }`}
          >
            <p
              className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'
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
          className={`rounded-lg p-4 border ${message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
            }`}
        >
          <p
            className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'
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
            <HouseholdMemberCard
              key={member.id}
              member={member}
              householdId={household.id}
              currentUserId={userId}
              isOwner={isOwner}
              onEditPreferences={setEditingMember}
              onRemoveMember={removeMember}
            />
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        householdId={household.id}
        pendingInvitations={household.invitations}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={() => {
          setMessage({
            type: 'success',
            text: 'Invitation sent successfully',
          });
          setTimeout(() => setMessage(null), 3000);
        }}
      />

      {/* Member Preferences Modal */}
      {editingMember && (
        <MemberPreferencesForm
          member={editingMember}
          householdId={household.id}
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  );
}
