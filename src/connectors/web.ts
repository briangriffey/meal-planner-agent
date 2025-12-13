import puppeteer, { Browser, Page } from 'puppeteer';
import { BaseConnector } from './base';

export class HEBBrowsingConnector extends BaseConnector {
  name = 'browse_heb';
  private browser: Browser | null = null;

  async execute(params: { ingredients: string[] }): Promise<any> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await this.browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      const results: any[] = [];

      for (const ingredient of params.ingredients) {
        try {
          await page.goto(`https://www.heb.com/search/?q=${encodeURIComponent(ingredient)}`, {
            waitUntil: 'networkidle2',
            timeout: 10000
          });

          await page.waitForSelector('.product-tile', { timeout: 5000 }).catch(() => null);

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

      return {
        success: true,
        results,
        summary: `Found ${results.filter(r => r.found).length} out of ${params.ingredients.length} ingredients on HEB`
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
