'use client';

import { useState, useEffect } from 'react';

interface Ingredient {
  item: string;
  amount: string;
}

interface MealData {
  day: string;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  ingredients?: Ingredient[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
}

interface FavoriteButtonProps {
  mealData: MealData;
}

export default function FavoriteButton({ mealData }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if meal is already favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `/api/favorites/check?name=${encodeURIComponent(mealData.name)}`
        );

        if (!response.ok) {
          throw new Error('Failed to check favorite status');
        }

        const data = await response.json();
        setIsFavorited(data.isFavorited);
        setFavoriteId(data.favoriteId);
      } catch (error) {
        console.error('Error checking favorite status:', error);
        // Silent fail - default to not favorited
      } finally {
        setCheckingStatus(false);
      }
    };

    checkFavoriteStatus();
  }, [mealData.name]);

  const handleToggleFavorite = async () => {
    setLoading(true);

    try {
      if (isFavorited && favoriteId) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${favoriteId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove favorite');
        }

        setIsFavorited(false);
        setFavoriteId(null);
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: mealData.name,
            day: mealData.day,
            calories: mealData.calories ?? null,
            protein: mealData.protein ?? null,
            carbs: mealData.carbs ?? null,
            fat: mealData.fat ?? null,
            fiber: mealData.fiber ?? null,
            ingredients: mealData.ingredients ?? [],
            instructions: mealData.instructions ?? [],
            prepTime: mealData.prepTime ?? null,
            cookTime: mealData.cookTime ?? null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add favorite');
        }

        const data = await response.json();
        setIsFavorited(true);
        setFavoriteId(data.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert state on error
      setIsFavorited(!isFavorited);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking initial status
  if (checkingStatus) {
    return (
      <button
        disabled
        className="p-2 text-gray-300"
        aria-label="Loading favorite status"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      data-testid="favorite-button"
      aria-pressed={isFavorited}
      className={`p-2 transition-colors duration-200 ${
        loading
          ? 'text-gray-300 cursor-wait'
          : isFavorited
          ? 'text-red-600 hover:text-red-800'
          : 'text-red-500 hover:text-red-700'
      }`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <svg
          className="w-6 h-6 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill={isFavorited ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
