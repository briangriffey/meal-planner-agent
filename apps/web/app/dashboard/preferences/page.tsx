'use client';

import { useState, useEffect } from 'react';

interface Preferences {
  emailRecipients: string[];
  scheduleDayOfWeek: number;
  scheduleHour: number;
  scheduleMinute: number;
  scheduleEnabled: boolean;
  numberOfMeals: number;
  servingsPerMeal: number;
  minProteinPerMeal: number;
  maxCaloriesPerMeal: number;
  dietaryRestrictions: string[];
  hebEnabled: boolean;
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [restrictionInput, setRestrictionInput] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/users/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load preferences' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preferences saved successfully' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save preferences' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const addEmail = () => {
    if (emailInput && preferences) {
      setPreferences({
        ...preferences,
        emailRecipients: [...preferences.emailRecipients, emailInput],
      });
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        emailRecipients: preferences.emailRecipients.filter((e) => e !== email),
      });
    }
  };

  const addRestriction = () => {
    if (restrictionInput && preferences) {
      setPreferences({
        ...preferences,
        dietaryRestrictions: [...preferences.dietaryRestrictions, restrictionInput],
      });
      setRestrictionInput('');
    }
  };

  const removeRestriction = (restriction: string) => {
    if (preferences) {
      setPreferences({
        ...preferences,
        dietaryRestrictions: preferences.dietaryRestrictions.filter((r) => r !== restriction),
      });
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return <div className="text-center py-12">Loading preferences...</div>;
  }

  if (!preferences) {
    return <div className="text-center py-12">Failed to load preferences</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Preferences
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your meal planning preferences and scheduling settings.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
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

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Meal Plan Settings
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="numberOfMeals" className="block text-sm font-medium text-gray-700">
                  Number of Meals per Week
                </label>
                <input
                  type="number"
                  id="numberOfMeals"
                  min="1"
                  max="21"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.numberOfMeals}
                  onChange={(e) =>
                    setPreferences({ ...preferences, numberOfMeals: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="servingsPerMeal" className="block text-sm font-medium text-gray-700">
                  Servings per Meal
                </label>
                <input
                  type="number"
                  id="servingsPerMeal"
                  min="1"
                  max="12"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.servingsPerMeal}
                  onChange={(e) =>
                    setPreferences({ ...preferences, servingsPerMeal: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="minProtein" className="block text-sm font-medium text-gray-700">
                  Minimum Protein (g)
                </label>
                <input
                  type="number"
                  id="minProtein"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.minProteinPerMeal}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minProteinPerMeal: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="maxCalories" className="block text-sm font-medium text-gray-700">
                  Maximum Calories
                </label>
                <input
                  type="number"
                  id="maxCalories"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.maxCaloriesPerMeal}
                  onChange={(e) =>
                    setPreferences({ ...preferences, maxCaloriesPerMeal: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="hebEnabled"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={preferences.hebEnabled}
                  onChange={(e) =>
                    setPreferences({ ...preferences, hebEnabled: e.target.checked })
                  }
                />
                <label htmlFor="hebEnabled" className="ml-2 block text-sm text-gray-900">
                  Enable HEB integration (for ingredient pricing)
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Dietary Restrictions
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="e.g., gluten-free, dairy-free"
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={restrictionInput}
                onChange={(e) => setRestrictionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRestriction()}
              />
              <button
                type="button"
                onClick={addRestriction}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.dietaryRestrictions.map((restriction) => (
                <span
                  key={restriction}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {restriction}
                  <button
                    type="button"
                    onClick={() => removeRestriction(restriction)}
                    className="ml-2 inline-flex items-center justify-center flex-shrink-0 h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove {restriction}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Email Recipients
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Email addresses to receive the meal plan
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.emailRecipients.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-2 inline-flex items-center justify-center flex-shrink-0 h-4 w-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove {email}</span>
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Schedule Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                  Day of Week
                </label>
                <select
                  id="dayOfWeek"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.scheduleDayOfWeek}
                  onChange={(e) =>
                    setPreferences({ ...preferences, scheduleDayOfWeek: parseInt(e.target.value) })
                  }
                >
                  {daysOfWeek.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="hour" className="block text-sm font-medium text-gray-700">
                  Hour
                </label>
                <input
                  type="number"
                  id="hour"
                  min="0"
                  max="23"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.scheduleHour}
                  onChange={(e) =>
                    setPreferences({ ...preferences, scheduleHour: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="minute" className="block text-sm font-medium text-gray-700">
                  Minute
                </label>
                <input
                  type="number"
                  id="minute"
                  min="0"
                  max="59"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={preferences.scheduleMinute}
                  onChange={(e) =>
                    setPreferences({ ...preferences, scheduleMinute: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center">
                <input
                  id="scheduleEnabled"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={preferences.scheduleEnabled}
                  onChange={(e) =>
                    setPreferences({ ...preferences, scheduleEnabled: e.target.checked })
                  }
                />
                <label htmlFor="scheduleEnabled" className="ml-2 block text-sm text-gray-900">
                  Enable automatic weekly meal plan generation
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
