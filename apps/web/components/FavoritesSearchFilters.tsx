'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FavoritesSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minCalories, setMinCalories] = useState(searchParams.get('minCalories') || '');
  const [maxCalories, setMaxCalories] = useState(searchParams.get('maxCalories') || '');
  const [minProtein, setMinProtein] = useState(searchParams.get('minProtein') || '');

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (minCalories) params.set('minCalories', minCalories);
    if (maxCalories) params.set('maxCalories', maxCalories);
    if (minProtein) params.set('minProtein', minProtein);

    router.push(`/dashboard/favorites?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setMinCalories('');
    setMaxCalories('');
    setMinProtein('');
    router.push('/dashboard/favorites');
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
            placeholder="e.g., Chicken"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            data-testid="search-input"
          />
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
