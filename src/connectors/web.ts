import puppeteer, { Browser, Page } from 'puppeteer';
import { BaseConnector } from './base';

export class HEBBrowsingConnector extends BaseConnector {
  name = 'browse_heb';
  private browser: Browser | null = null;

  async execute(params: { ingredients: string[] }): Promise<any> {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ]
      });

      const page = await this.browser.newPage();

      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Set realistic viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Remove automation flags
      await page.evaluateOnNewDocument(() => {
        // Overwrite the navigator.webdriver property
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        });

        // Overwrite the plugins property to avoid headless detection
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });

        // Overwrite the languages property
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
      });

      // Set extra headers to look more like a real browser
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      });

      const results: any[] = [];

      for (const ingredient of params.ingredients) {
        try {
          // Add random delay between 1-3 seconds to simulate human behavior
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

          await page.goto(`https://www.heb.com/search/?q=${encodeURIComponent(ingredient)}`, {
            waitUntil: 'networkidle2',
            timeout: 15000
          });

          // Add a small random delay after page load
          await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

          await page.waitForSelector('.product-tile', { timeout: 8000 }).catch(() => null);

          const productInfo = await page.evaluate(() => {
            const firstProduct = document.querySelector('.product-tile');
            if (!firstProduct) return null;

            const name = firstProduct.querySelector('.product-item-name')?.textContent?.trim();
            const price = firstProduct.querySelector('.product-price')?.textContent?.trim();
            const link = firstProduct.querySelector('a')?.href;

            return { name, price, link };
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
