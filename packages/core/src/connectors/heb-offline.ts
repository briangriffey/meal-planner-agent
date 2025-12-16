import {
  IHEBConnector,
  HEBExecuteParams,
  HEBResponse,
  HEBSearchResult
} from './heb.interface';

/**
 * Offline HEB connector that generates search URLs without web scraping.
 * This is useful when you want to provide HEB search links without the overhead
 * of browser automation or when the scraping connector is blocked.
 */
export class HEBOfflineConnector implements IHEBConnector {
  async execute(params: HEBExecuteParams): Promise<HEBResponse> {
    try {
      const results: HEBSearchResult[] = params.ingredients.map(ingredient => {
        // URL encode the ingredient for the search query
        const encodedQuery = encodeURIComponent(ingredient);
        const searchLink = `https://www.heb.com/search?esc=true&q=${encodedQuery}`;

        return {
          searchedFor: ingredient,
          found: true, // Always "found" since we're just generating links
          product: {
            name: ingredient, // Use the ingredient name as the product name
            price: null, // No price available in offline mode
            link: searchLink
          }
        };
      });

      return {
        success: true,
        results,
        summary: `Generated ${results.length} HEB search links for ${results.length} ingredients`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
