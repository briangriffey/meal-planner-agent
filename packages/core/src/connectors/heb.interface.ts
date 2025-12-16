/**
 * HEB Connector Interface
 *
 * Common interface for HEB connectors that can search for ingredients
 * and return product information and links.
 */

export interface HEBProductInfo {
  name: string | null;
  price: string | null;
  link: string;
}

export interface HEBSearchResult {
  searchedFor: string;
  found: boolean;
  product?: HEBProductInfo | null;
  error?: string;
}

export interface HEBExecuteParams {
  ingredients: string[];
}

export interface HEBSuccessResponse {
  success: true;
  results: HEBSearchResult[];
  summary: string;
}

export interface HEBErrorResponse {
  success: false;
  error: string;
}

export type HEBResponse = HEBSuccessResponse | HEBErrorResponse;

/**
 * Interface that all HEB connectors must implement
 */
export interface IHEBConnector {
  execute(params: HEBExecuteParams): Promise<HEBResponse>;
}
