'use client';

import { useState } from 'react';

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

interface HouseholdMemberCardProps {
  member: HouseholdMember;
  householdId: string;
  currentUserId: string;
  isOwner: boolean;
  onEditPreferences: (member: HouseholdMember) => void;
  onRemoveMember?: (memberId: string) => void;
}

export default function HouseholdMemberCard({
  member,
  householdId,
  currentUserId,
  isOwner,
  onEditPreferences,
  onRemoveMember,
}: HouseholdMemberCardProps) {
  const isCurrentUser = member.userId === currentUserId;
  const canEdit = isOwner || isCurrentUser;
  const canRemove = isOwner && member.role !== 'OWNER' && !isCurrentUser;

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-primary-light transition-colors p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Member Info */}
          <div className="flex items-center gap-3 mb-3">
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                {member.user.name || member.user.email}
                {isCurrentUser && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">(You)</span>
                )}
              </p>
              {member.user.name && (
                <p className="text-sm text-gray-600">{member.user.email}</p>
              )}
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                member.role === 'OWNER'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {member.role}
            </span>
          </div>

          {/* Preferences Display */}
          {member.preferences ? (
            <div className="space-y-2 text-sm">
              {member.preferences.dietaryRestrictions.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Dietary Restrictions: </span>
                  <span className="text-gray-600">
                    {member.preferences.dietaryRestrictions.join(', ')}
                  </span>
                </div>
              )}
              {member.preferences.minProteinPerMeal !== null && (
                <div>
                  <span className="font-medium text-gray-700">Min Protein: </span>
                  <span className="text-gray-600">
                    {member.preferences.minProteinPerMeal}g per meal
                  </span>
                </div>
              )}
              {member.preferences.maxCaloriesPerMeal !== null && (
                <div>
                  <span className="font-medium text-gray-700">Max Calories: </span>
                  <span className="text-gray-600">
                    {member.preferences.maxCaloriesPerMeal} per meal
                  </span>
                </div>
              )}
              {member.preferences.dietaryRestrictions.length === 0 &&
                member.preferences.minProteinPerMeal === null &&
                member.preferences.maxCaloriesPerMeal === null && (
                  <p className="text-gray-500 italic">No preferences set</p>
                )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No preferences set</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 ml-4">
          {canEdit && (
            <button
              onClick={() => onEditPreferences(member)}
              className="px-4 py-2 text-sm font-medium text-primary-dark border border-primary-light rounded-lg hover:bg-primary-light hover:text-white transition-colors"
            >
              Edit Preferences
            </button>
          )}
          {canRemove && onRemoveMember && (
            <button
              onClick={() => onRemoveMember(member.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
