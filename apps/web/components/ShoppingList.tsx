'use client';

import { useState, useEffect } from 'react';
import type { AggregatedIngredient, CategorizedShoppingList } from '@/lib/shopping-list-utils';
import { groupByCategory } from '@/lib/shopping-list-utils';

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface ShoppingListProps {
  ingredients: AggregatedIngredient[];
  mealPlanId: string;
  weekStartDate?: string;
}

export default function ShoppingList({
  ingredients,
  mealPlanId,
  weekStartDate
}: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<Message | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [canShare, setCanShare] = useState(false);

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const categorizedIngredients = showCategories
    ? groupByCategory(ingredients)
    : { 'All Items': ingredients };

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopy = async () => {
    try {
      // Format ingredients as plain text
      let text = 'Shopping List\n\n';

      Object.entries(categorizedIngredients).forEach(([category, items]) => {
        if (showCategories) {
          text += `${category}\n`;
          text += '-'.repeat(category.length) + '\n';
        }
        items.forEach((ingredient) => {
          text += `☐ ${ingredient.amount} ${ingredient.item}\n`;
        });
        text += '\n';
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(text.trim());
      showMessage('success', 'Shopping list copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      showMessage('error', 'Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    try {
      // Format ingredients as plain text
      let text = 'Shopping List\n\n';

      Object.entries(categorizedIngredients).forEach(([category, items]) => {
        if (showCategories) {
          text += `${category}\n`;
          text += '-'.repeat(category.length) + '\n';
        }
        items.forEach((ingredient) => {
          text += `☐ ${ingredient.amount} ${ingredient.item}\n`;
        });
        text += '\n';
      });

      // Prepare share data
      const title = weekStartDate
        ? `Shopping List - Week of ${weekStartDate}`
        : 'Shopping List';

      await navigator.share({
        title,
        text: text.trim()
      });

      showMessage('success', 'Shopping list shared successfully');
    } catch (error) {
      // User cancelled share or share failed
      // AbortError is thrown when user cancels, so we don't show error for that
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to share:', error);
        showMessage('error', 'Failed to share shopping list');
      }
    }
  };

  const handleDownload = async () => {
    try {
      // Call API to generate and download text file
      const response = await fetch(`/api/meal-plans/${mealPlanId}/shopping-list`);

      if (!response.ok) {
        throw new Error('Failed to download shopping list');
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'shopping-list.txt';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showMessage('success', 'Shopping list downloaded successfully');
    } catch (error) {
      console.error('Failed to download shopping list:', error);
      showMessage('error', 'Failed to download shopping list');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary-dark">Shopping List</h3>
          <p className="text-sm text-gray-600">
            {ingredients.length} item{ingredients.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {showCategories ? 'Hide Categories' : 'Show Categories'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg p-4 border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark shadow-lg hover:shadow-xl transition-all duration-150"
          aria-label="Copy to clipboard"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>

        {canShare && (
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent shadow-lg hover:shadow-xl transition-all duration-150"
            aria-label="Share shopping list"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        )}

        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
          aria-label="Download as text file"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>

        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
          aria-label="Print shopping list"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>

      {/* Ingredients List */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {Object.entries(categorizedIngredients).map(([category, items]) => (
          <div key={category} className="border-b border-gray-200 last:border-b-0">
            {showCategories && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <h4 className="text-lg font-semibold text-primary-dark">{category}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            <ul className="divide-y divide-gray-100">
              {items.map((ingredient) => {
                const itemKey = `${ingredient.item}-${ingredient.amount}`;
                const isChecked = checkedItems.has(itemKey);

                return (
                  <li
                    key={itemKey}
                    className="px-6 py-4 hover:bg-primary-light/5 transition-colors duration-150"
                  >
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(itemKey)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <div className="ml-4 flex-1">
                        <div className={`flex items-baseline ${isChecked ? 'opacity-50' : ''}`}>
                          <span className={`text-sm font-medium text-gray-900 ${isChecked ? 'line-through' : ''}`}>
                            {ingredient.amount}
                          </span>
                          <span className={`ml-2 text-base text-gray-800 ${isChecked ? 'line-through' : ''}`}>
                            {ingredient.item}
                          </span>
                        </div>
                        {ingredient.originalAmounts.length > 1 && (
                          <p className="mt-1 text-xs text-gray-500">
                            Combined from: {ingredient.originalAmounts.join(', ')}
                          </p>
                        )}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {ingredients.length === 0 && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">No ingredients found in this meal plan.</p>
        </div>
      )}
    </div>
  );
}
