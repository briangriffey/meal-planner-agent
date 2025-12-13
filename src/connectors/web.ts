import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { BaseConnector } from './base';

// Add stealth plugin
puppeteer.use(StealthPlugin());

export class HEBBrowsingConnector extends BaseConnector {
  name = 'browse_heb';
  private browser: Browser | null = null;
  private page: Page | null = null;
  private searchBarSelector: string | null = null;

  async execute(params: { ingredients: string[] }): Promise<any> {
    try {
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

      // Navigate to HEB home page ONCE (instead of going to search URLs)
      await this.page.goto('https://www.heb.com', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Check if we got blocked
      const homePageCheck = await this.page.evaluate(() => {
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

      const results: any[] = [];

      for (const ingredient of params.ingredients) {
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
          const pageCheck = await this.page.evaluate(() => {
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

          const productInfo = await this.page.evaluate(() => {
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

      const foundCount = results.filter(r => r.found).length;
      const totalCount = params.ingredients.length;

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

export class WebSearchConnector extends BaseConnector {
  name = 'web_search';

  async execute(params: { query: string }): Promise<any> {
    return {
      success: true,
      message: 'Web search connector placeholder - integrate with your preferred search API',
      query: params.query
    };
  }
}
