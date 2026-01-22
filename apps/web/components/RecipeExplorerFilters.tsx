'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RecipeExplorerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [prepTime, setPrepTime] = useState(searchParams.get('prepTime') || '');
  const [minCalories, setMinCalories] = useState(searchParams.get('minCalories') || '');
  const [maxCalories, setMaxCalories] = useState(searchParams.get('maxCalories') || '');
  const [minProtein, setMinProtein] = useState(searchParams.get('minProtein') || '');
  const [maxProtein, setMaxProtein] = useState(searchParams.get('maxProtein') || '');

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (cuisine) params.set('cuisine', cuisine);
    if (prepTime) params.set('prepTime', prepTime);
    if (minCalories) params.set('minCalories', minCalories);
    if (maxCalories) params.set('maxCalories', maxCalories);
    if (minProtein) params.set('minProtein', minProtein);
    if (maxProtein) params.set('maxProtein', maxProtein);

    router.push(`/dashboard/explore?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCuisine('');
    setPrepTime('');
    setMinCalories('');
    setMaxCalories('');
    setMinProtein('');
    setMaxProtein('');
    router.push('/dashboard/explore');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by name
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., Chicken Parmesan"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="search-input"
          />
        </div>

        {/* Cuisine filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuisine Type
          </label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="cuisine-select"
          >
            <option value="">All Cuisines</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="asian">Asian</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="american">American</option>
            <option value="indian">Indian</option>
            <option value="french">French</option>
            <option value="greek">Greek</option>
            <option value="thai">Thai</option>
            <option value="chinese">Chinese</option>
            <option value="japanese">Japanese</option>
          </select>
        </div>

        {/* Prep time filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prep Time
          </label>
          <select
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="prep-time-select"
          >
            <option value="">Any Duration</option>
            <option value="15">15 minutes or less</option>
            <option value="30">30 minutes or less</option>
            <option value="45">45 minutes or less</option>
            <option value="60">60 minutes or less</option>
          </select>
        </div>

        {/* Calories filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Calories
          </label>
          <input
            type="number"
            value={minCalories}
            onChange={(e) => setMinCalories(e.target.value)}
            placeholder="e.g., 300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="min-calories-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Calories
          </label>
          <input
            type="number"
            value={maxCalories}
            onChange={(e) => setMaxCalories(e.target.value)}
            placeholder="e.g., 600"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="max-calories-input"
          />
        </div>

        {/* Protein filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Protein (g)
          </label>
          <input
            type="number"
            value={minProtein}
            onChange={(e) => setMinProtein(e.target.value)}
            placeholder="e.g., 20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="min-protein-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Protein (g)
          </label>
          <input
            type="number"
            value={maxProtein}
            onChange={(e) => setMaxProtein(e.target.value)}
            placeholder="e.g., 50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="max-protein-input"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          data-testid="apply-filters-button"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          data-testid="clear-filters-button"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
