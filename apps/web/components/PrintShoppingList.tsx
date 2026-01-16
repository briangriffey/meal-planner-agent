'use client';

interface AggregatedIngredient {
  item: string;
  amount: string;
  originalAmounts: string[];
}

interface PrintShoppingListProps {
  categorizedIngredients: Record<string, AggregatedIngredient[]>;
  aggregatedIngredients: AggregatedIngredient[];
  weekStart: string;
  generatedAt: string;
}

export default function PrintShoppingList({
  categorizedIngredients,
  aggregatedIngredients,
  weekStart,
  generatedAt,
}: PrintShoppingListProps) {
  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            max-width: 100%;
            margin: 0;
            padding: 20mm;
          }
          @page {
            margin: 15mm;
            size: letter;
          }
        }

        @media screen {
          .print-page {
            max-width: 8.5in;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            min-height: 11in;
          }
        }
      `}</style>

      <div className="print-page">
        {/* Header */}
        <div className="mb-8 pb-4 border-b-2 border-gray-900">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping List
          </h1>
          <p className="text-lg text-gray-700">
            Week of {weekStart}
          </p>
        </div>

        {/* Print Button (only visible on screen) */}
        <div className="no-print mb-6">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print This Page
          </button>
        </div>

        {/* Ingredients by Category */}
        {Object.entries(categorizedIngredients).map(([category, items]) => (
          <div key={category} className="mb-8 break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-400">
              {category}
            </h2>
            <ul className="space-y-2">
              {items.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 text-gray-900 select-none">☐</span>
                  <div className="flex-1">
                    <span className="text-gray-900">
                      <span className="font-medium">{ingredient.amount}</span>
                      {' '}
                      {ingredient.item}
                    </span>
                    {ingredient.originalAmounts.length > 1 && (
                      <span className="text-xs text-gray-600 ml-2">
                        (from: {ingredient.originalAmounts.join(', ')})
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-sm text-gray-600">
          <p>
            Generated on {generatedAt}
          </p>
          <p className="mt-1">
            Total items: {aggregatedIngredients.length}
          </p>
        </div>
      </div>
    </>
  );
}
