import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import {
  IHEBConnector,
  HEBExecuteParams,
  HEBResponse,
  HEBSearchResult,
  HEBProductInfo
} from './heb.interface';

// Add stealth plugin
puppeteer.use(StealthPlugin());

export interface HEBBrowsingConfig {
  timeout?: number; // Optional timeout in milliseconds (default: 120000 = 2 minutes)
}

interface PageCheck {
  hasError: boolean;
  hasIncidentId: boolean;
}

export class HEBBrowsingConnector implements IHEBConnector {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private searchBarSelector: string | null = null;
  private timeout: number;

  constructor(config: HEBBrowsingConfig = {}) {
    this.timeout = config.timeout || 120000; // 2 minutes default
  }

  async execute(params: HEBExecuteParams): Promise<HEBResponse> {
    const startTime: number = Date.now();

    try {
      // Check if we're approaching timeout
      const checkTimeout = (): void => {
        if (Date.now() - startTime > this.timeout) {
          throw new Error(`HEB scraping timeout exceeded (${this.timeout}ms)`);
        }
      };

      // Launch browser with stealth plugin
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled'
        ]
      });

      this.page = await this.browser.newPage();

      // Set realistic viewport
      await this.page.setViewport({ width: 1920, height: 1080 });

      checkTimeout();

      // Navigate to HEB home page ONCE (instead of going to search URLs)
      await this.page.goto('https://www.heb.com', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Check if we got blocked
      const homePageCheck: PageCheck = await this.page.evaluate(() => {
        const body = document.body.innerHTML;
        return {
          hasError: body.includes('errorCode'),
          hasIncidentId: body.includes('incidentId')
        };
      });

      if (homePageCheck.hasError || homePageCheck.hasIncidentId) {
        throw new Error('HEB blocked the request - got error page on home page');
      }

      // Wait for page to fully render
      await new Promise(resolve => setTimeout(resolve, 2000));

      checkTimeout();

      // Find the search bar
      this.searchBarSelector = await this.page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        for (const input of inputs) {
          const classList = Array.from(input.classList);
          for (const className of classList) {
            if (className.toLowerCase().includes('search')) {
              return `.${className}`;
            }
          }
          if (input.placeholder?.toLowerCase().includes('search')) {
            return `input[placeholder*="Search" i]`;
          }
        }
        return null;
      });

      if (!this.searchBarSelector) {
        throw new Error('Could not find search bar on HEB home page');
      }

      const results: HEBSearchResult[] = [];

      for (const ingredient of params.ingredients) {
        checkTimeout(); // Check before processing each ingredient

        try {
          // Add random delay between searches to simulate human behavior
          if (results.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
          }

          // Clear and use the search bar (instead of navigating to new URLs)
          await this.page.click(this.searchBarSelector);
          await this.page.evaluate((selector) => {
            const input = document.querySelector(selector) as HTMLInputElement;
            if (input) input.value = '';
          }, this.searchBarSelector);

          await this.page.type(this.searchBarSelector, ingredient, { delay: 100 });

          // Wait and press Enter
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.page.keyboard.press('Enter');

          // Wait for search results to load
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Check if we got blocked
          const pageCheck: PageCheck = await this.page.evaluate(() => {
            const body = document.body.innerHTML;
            return {
              hasError: body.includes('errorCode'),
              hasIncidentId: body.includes('incidentId')
            };
          });

          if (pageCheck.hasError || pageCheck.hasIncidentId) {
            throw new Error(`HEB blocked the request for "${ingredient}"`);
          }

          // Try to wait for product container
          await this.page.waitForSelector('[data-testid*="product"]', { timeout: 5000 }).catch(() => null);

          const productInfo: HEBProductInfo | null = await this.page.evaluate(() => {
            // Look inside the product container for product links
            const productContainer = document.querySelector('[data-testid*="product"]');
            if (!productContainer) return null;

            // Find links that look like product detail pages
            const links = Array.from(productContainer.querySelectorAll('a[href*="/product-detail/"]'));
            if (links.length === 0) return null;

            const firstLink = links[0] as HTMLAnchorElement;

            // Try to find price and name near this link
            const parentElement = firstLink.closest('div, article, li');
            if (!parentElement) return { link: firstLink.href, name: firstLink.textContent?.trim(), price: null };

            // Look for price in the parent element
            const priceElement = parentElement.querySelector('[class*="price" i], [data-testid*="price"]');
            const nameElement = parentElement.querySelector('[class*="title" i], [class*="name" i], h2, h3, h4');

            return {
              name: (nameElement?.textContent || firstLink.textContent)?.trim(),
              price: priceElement?.textContent?.trim() || null,
              link: firstLink.href
            };
          });

          results.push({
            searchedFor: ingredient,
            found: productInfo !== null,
            product: productInfo
          });
        } catch (error) {
          results.push({
            searchedFor: ingredient,
            found: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      await this.browser.close();
      this.browser = null;

      const foundCount: number = results.filter(r => r.found).length;
      const totalCount: number = params.ingredients.length;

      // Throw an error if we couldn't find any items
      if (foundCount === 0 && totalCount > 0) {
        throw new Error(`Failed to find any ingredients on HEB website. This likely means the scraper was blocked or the page structure changed. Found 0 out of ${totalCount} ingredients.`);
      }

      // Warn if we found very few items (less than 20% success rate)
      if (totalCount > 0 && (foundCount / totalCount) < 0.2) {
        console.warn(`WARNING: Low success rate finding HEB items: ${foundCount}/${totalCount} (${Math.round(foundCount/totalCount*100)}%). The scraper may be blocked.`);
      }

      return {
        success: true,
        results,
        summary: `Found ${foundCount} out of ${totalCount} ingredients on HEB`
      };
    } catch (error) {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
