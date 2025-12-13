import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

// Add stealth plugin
puppeteer.use(StealthPlugin());

// Test ingredients - using simple, common items
const TEST_INGREDIENTS = ['chicken breast', 'broccoli', 'rice'];

async function testHEBScraper() {
  console.log('🧪 Starting HEB Scraper Test with Stealth Plugin');
  console.log(`Testing with ${TEST_INGREDIENTS.length} ingredients: ${TEST_INGREDIENTS.join(', ')}\n`);

  let browser: Browser | null = null;

  try {
    // Launch browser with stealth plugin enabled
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const page = await browser.newPage();

    // Set realistic viewport
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('✅ Browser launched with stealth plugin\n');

    // Navigate to HEB home page ONCE
    console.log('🏠 Navigating to HEB home page...');
    const startTime = Date.now();
    await page.goto('https://www.heb.com', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    const loadTime = Date.now() - startTime;
    console.log(`  ⏱️  Home page loaded in ${loadTime}ms\n`);

    // Check if we got blocked on the home page
    const homePageCheck = await page.evaluate(() => {
      const body = document.body.innerHTML;
      return {
        hasError: body.includes('errorCode'),
        hasIncidentId: body.includes('incidentId'),
        title: document.title,
        bodyLength: body.length
      };
    });

    if (homePageCheck.hasError || homePageCheck.hasIncidentId) {
      console.log('❌ BLOCKED on home page!');
      console.log('   Error page detected - cannot proceed');
      return;
    }

    console.log(`✅ Successfully loaded home page: "${homePageCheck.title}"`);
    console.log(`   Page size: ${homePageCheck.bodyLength} chars\n`);

    // Wait a bit for page to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Find the search bar
    console.log('🔍 Looking for search bar...');
    const searchBarSelector = await page.evaluate(() => {
      // Look for input with class starting with "search"
      const inputs = Array.from(document.querySelectorAll('input'));
      for (const input of inputs) {
        const classList = Array.from(input.classList);
        for (const className of classList) {
          if (className.toLowerCase().includes('search')) {
            return `.${className}`;
          }
        }
        // Also check placeholder
        if (input.placeholder?.toLowerCase().includes('search')) {
          return `input[placeholder*="Search" i]`;
        }
      }
      return null;
    });

    if (!searchBarSelector) {
      console.log('❌ Could not find search bar!');
      return;
    }

    console.log(`✅ Found search bar: ${searchBarSelector}\n`);

    // Test each ingredient using the same page/session
    let successCount = 0;
    for (let i = 0; i < TEST_INGREDIENTS.length; i++) {
      const ingredient = TEST_INGREDIENTS[i];
      console.log(`[${i + 1}/${TEST_INGREDIENTS.length}] Testing: "${ingredient}"`);

      try {
        // Clear the search box and type the ingredient
        await page.click(searchBarSelector);
        await page.evaluate((selector) => {
          const input = document.querySelector(selector) as HTMLInputElement;
          if (input) input.value = '';
        }, searchBarSelector);

        await page.type(searchBarSelector, ingredient, { delay: 100 });

        // Wait a moment and then press Enter
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.keyboard.press('Enter');

        // Wait for navigation/results to load
        console.log('  ⏱️  Waiting for search results...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check page state
        const pageInfo = await page.evaluate(() => {
          const body = document.body.innerHTML;
          const productContainer = document.querySelector('[data-testid*="product"]');

          return {
            hasError: body.includes('errorCode'),
            title: document.title,
            bodyLength: body.length,
            hasProductContainer: !!productContainer,
            productLinks: productContainer?.querySelectorAll('a[href*="/product-detail/"]').length || 0
          };
        });

        if (pageInfo.hasError) {
          console.log('  ❌ Got blocked! Error page returned');
          continue;
        }

        console.log(`  📄 Page: "${pageInfo.title}" (${pageInfo.bodyLength} chars)`);
        console.log(`  🎯 Product container: ${pageInfo.hasProductContainer ? 'Yes' : 'No'}`);
        console.log(`  🔗 Product links found: ${pageInfo.productLinks}`);

        if (pageInfo.productLinks > 0) {
          // Extract first product
          const productInfo = await page.evaluate(() => {
            const productContainer = document.querySelector('[data-testid*="product"]');
            if (!productContainer) return null;

            const links = Array.from(productContainer.querySelectorAll('a[href*="/product-detail/"]'));
            if (links.length === 0) return null;

            const firstLink = links[0] as HTMLAnchorElement;
            const parentElement = firstLink.closest('div, article, li');

            const priceElement = parentElement?.querySelector('[class*="price" i], [data-testid*="price"]');
            const nameElement = parentElement?.querySelector('[class*="title" i], [class*="name" i], h2, h3, h4');

            return {
              name: (nameElement?.textContent || firstLink.textContent)?.trim(),
              price: priceElement?.textContent?.trim() || null,
              link: firstLink.href
            };
          });

          if (productInfo) {
            console.log(`  ✅ SUCCESS! Found product:`);
            console.log(`     Name: ${productInfo.name || '(not extracted)'}`);
            console.log(`     Price: ${productInfo.price || '(not extracted)'}`);
            console.log(`     Link: ${productInfo.link}`);
            successCount++;
          }
        } else {
          console.log('  ❌ No products found');
        }

      } catch (error) {
        console.log(`  ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      }

      console.log('');

      // Wait between searches (except after last one)
      if (i < TEST_INGREDIENTS.length - 1) {
        const delay = 2000 + Math.random() * 2000;
        console.log(`  ⏱️  Waiting ${Math.round(delay)}ms before next search...\n`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Print summary
    console.log('============================================================');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('============================================================');
    console.log(`Total Tests: ${TEST_INGREDIENTS.length}`);
    console.log(`Successful: ${successCount} (${Math.round(successCount / TEST_INGREDIENTS.length * 100)}%)`);
    console.log(`Failed: ${TEST_INGREDIENTS.length - successCount}`);
    console.log('============================================================\n');

    if (successCount === TEST_INGREDIENTS.length) {
      console.log('🎉 ALL TESTS PASSED! Stealth configuration is working!');
    } else if (successCount > 0) {
      console.log('⚠️  PARTIAL SUCCESS - Some searches worked, some failed');
    } else {
      console.log('❌ ALL TESTS FAILED - Still being blocked');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testHEBScraper()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
