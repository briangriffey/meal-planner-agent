'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
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
    // Prevent removing the user's own email address
    if (session?.user?.email && email === session.user.email) {
      setMessage({ type: 'error', text: 'You cannot remove your own email address' });
      return;
    }

    if (preferences) {
      setPreferences({
        ...preferences,
        emailRecipients: preferences.emailRecipients.filter((e) => e !== email),
      });
    }
  };

  const addRestriction = () => {
    if (restrictionInput && preferences && !preferences.dietaryRestrictions.includes(restrictionInput)) {
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
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-gray-700">Loading preferences...</span>
      </div>
    );
  }

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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-primary-dark">
          Preferences
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage your meal planning preferences and scheduling settings.
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
          <div className="flex">
            <svg className={`h-5 w-5 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
              {message.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <p className={`ml-3 text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl divide-y divide-gray-200">
        <div className="px-6 py-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-dark">
                Meal Plan Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="numberOfMeals" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Meals per Week
                </label>
                <input
                  type="number"
                  id="numberOfMeals"
                  min="1"
                  max="21"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={preferences.numberOfMeals}
                  onChange={(e) =>
                    setPreferences({ ...preferences, numberOfMeals: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="servingsPerMeal" className="block text-sm font-medium text-gray-700 mb-1">
                  Servings per Meal
                </label>
                <input
                  type="number"
                  id="servingsPerMeal"
                  min="1"
                  max="12"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={preferences.servingsPerMeal}
                  onChange={(e) =>
                    setPreferences({ ...preferences, servingsPerMeal: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="minProtein" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Protein (g)
                </label>
                <input
                  type="number"
                  id="minProtein"
                  min="0"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={preferences.minProteinPerMeal}
                  onChange={(e) =>
                    setPreferences({ ...preferences, minProteinPerMeal: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="maxCalories" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Calories
                </label>
                <input
                  type="number"
                  id="maxCalories"
                  min="0"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
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
                  className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
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
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-primary rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-dark">
                Dietary Restrictions
              </h3>
            </div>
            <div className="flex gap-2 mb-3">
              <select
                className="flex-1 border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                value={restrictionInput}
                onChange={(e) => setRestrictionInput(e.target.value)}
              >
                <option value="">Select a dietary restriction...</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
              </select>
              <button
                type="button"
                onClick={addRestriction}
                disabled={!restrictionInput || preferences?.dietaryRestrictions.includes(restrictionInput)}
                className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.dietaryRestrictions.map((restriction) => (
                <span
                  key={restriction}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-light/20 text-primary-dark border border-primary-light"
                >
                  {restriction}
                  <button
                    type="button"
                    onClick={() => removeRestriction(restriction)}
                    className="ml-2 inline-flex items-center justify-center flex-shrink-0 h-4 w-4 rounded-full text-primary hover:bg-primary-light hover:text-primary-dark focus:outline-none transition-colors duration-150"
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
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/90 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-dark">
                Email Recipients
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Email addresses to receive the meal plan
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addEmail()}
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-150"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.emailRecipients.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-accent/20 text-accent border border-accent/30"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="ml-2 inline-flex items-center justify-center flex-shrink-0 h-4 w-4 rounded-full text-accent hover:bg-accent/30 hover:text-accent focus:outline-none transition-colors duration-150"
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
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-primary rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-dark">
                Schedule Settings
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  id="dayOfWeek"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
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
                <label htmlFor="hour" className="block text-sm font-medium text-gray-700 mb-1">
                  Hour
                </label>
                <input
                  type="number"
                  id="hour"
                  min="0"
                  max="23"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={preferences.scheduleHour}
                  onChange={(e) =>
                    setPreferences({ ...preferences, scheduleHour: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label htmlFor="minute" className="block text-sm font-medium text-gray-700 mb-1">
                  Minute
                </label>
                <input
                  type="number"
                  id="minute"
                  min="0"
                  max="59"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                  value={preferences.scheduleMinute}
                  onChange={(e) =>
                    setPreferences({ ...preferences, scheduleMinute: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <input
                  id="scheduleEnabled"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
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

        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white text-right sm:px-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-lg text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
