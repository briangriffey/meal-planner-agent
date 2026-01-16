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

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface MemberPreferencesFormProps {
  member: HouseholdMember;
  householdId: string;
  onClose: () => void;
}

export default function MemberPreferencesForm({
  member,
  householdId,
  onClose,
}: MemberPreferencesFormProps) {
  const router = useRouter();

  // Initialize preferences with defaults if null
  const initialPreferences = member.preferences || {
    id: '',
    dietaryRestrictions: [],
    minProteinPerMeal: null,
    maxCaloriesPerMeal: null,
  };

  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    initialPreferences.dietaryRestrictions
  );
  const [minProteinPerMeal, setMinProteinPerMeal] = useState<number | null>(
    initialPreferences.minProteinPerMeal
  );
  const [maxCaloriesPerMeal, setMaxCaloriesPerMeal] = useState<number | null>(
    initialPreferences.maxCaloriesPerMeal
  );
  const [restrictionInput, setRestrictionInput] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [saving, setSaving] = useState(false);

  const addRestriction = () => {
    const restriction = restrictionInput.trim();
    if (restriction && !dietaryRestrictions.includes(restriction)) {
      setDietaryRestrictions([...dietaryRestrictions, restriction]);
      setRestrictionInput('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setDietaryRestrictions(dietaryRestrictions.filter((r) => r !== restriction));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/households/${householdId}/members/${member.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dietaryRestrictions,
            minProteinPerMeal,
            maxCaloriesPerMeal,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save preferences');
      }

      setMessage({
        type: 'success',
        text: 'Preferences saved successfully',
      });

      // Refresh the page to update server-side data
      router.refresh();

      // Close modal after brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred while saving',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary-dark">
                Member Preferences
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {member.user.name || member.user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {message && (
            <div
              className={`rounded-lg p-4 border mb-6 ${
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

          <form onSubmit={handleSave} className="space-y-6">
            {/* Dietary Restrictions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Add any dietary restrictions or preferences (e.g., vegetarian, gluten-free, no nuts)
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={restrictionInput}
                  onChange={(e) => setRestrictionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRestriction();
                    }
                  }}
                  placeholder="e.g., vegetarian, no dairy"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={addRestriction}
                  className="px-4 py-2 bg-gradient-to-r from-primary-light to-primary-dark text-white text-sm font-medium rounded-lg hover:shadow-md transition-shadow"
                >
                  Add
                </button>
              </div>

              {dietaryRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dietaryRestrictions.map((restriction) => (
                    <div
                      key={restriction}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-light to-primary-dark text-white rounded-full text-sm"
                    >
                      <span>{restriction}</span>
                      <button
                        type="button"
                        onClick={() => removeRestriction(restriction)}
                        className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                        aria-label={`Remove ${restriction}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nutrition Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Min Protein */}
              <div>
                <label
                  htmlFor="minProtein"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Minimum Protein Per Meal (g)
                </label>
                <input
                  id="minProtein"
                  type="number"
                  value={minProteinPerMeal ?? ''}
                  onChange={(e) =>
                    setMinProteinPerMeal(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  min={0}
                  max={200}
                  placeholder="e.g., 40"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for no minimum
                </p>
              </div>

              {/* Max Calories */}
              <div>
                <label
                  htmlFor="maxCalories"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Maximum Calories Per Meal
                </label>
                <input
                  id="maxCalories"
                  type="number"
                  value={maxCaloriesPerMeal ?? ''}
                  onChange={(e) =>
                    setMaxCaloriesPerMeal(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                  min={0}
                  max={2000}
                  placeholder="e.g., 600"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty for no maximum
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-primary-light to-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
