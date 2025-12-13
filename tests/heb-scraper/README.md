# HEB Scraper Tests

This directory contains test scripts for validating the HEB web scraping functionality.

## Background

The HEB connector uses Puppeteer to scrape product information from HEB.com. These tests were created to debug and verify bot detection evasion techniques.

### Problem Solved
HEB's firewall was blocking automated requests with error code 15. The solution involved:
- Using `puppeteer-extra-plugin-stealth` to bypass bot detection
- Navigating to HEB home page first, then using the search bar (instead of direct search URLs)
- Maintaining a single browser session for all searches

## Test Scripts

### 1. `test-heb-scraper.ts` - Standalone HEB Test
**Purpose:** Tests HEB scraping in isolation without running the full agent.

**What it tests:**
- Launches browser with stealth plugin
- Navigates to HEB.com home page
- Finds and uses the search bar
- Searches for 3 test ingredients: "chicken breast", "broccoli", "rice"
- Verifies products are found and links are extracted

**How to run:**
```bash
# Using pnpm script (recommended)
pnpm test:heb-scraper

# Or directly
npx ts-node tests/heb-scraper/test-heb-scraper.ts
```

**Expected output:**
```
🎉 ALL TESTS PASSED! Stealth configuration is working!
Total Tests: 3
Successful: 3 (100%)
```

**What to check:**
- Browser window opens (headless: false)
- HEB home page loads without error
- Each ingredient search returns product links
- No "errorCode" or "incidentId" blocking messages

---

### 2. `test-connector-only.ts` - Connector Integration Test
**Purpose:** Tests the HEB connector class directly without the full agent.

**What it tests:**
- `HEBBrowsingConnector` class execution
- Same stealth + search bar strategy
- Tests with 2 ingredients: "chicken breast", "broccoli"

**How to run:**
```bash
# Using pnpm script (recommended)
pnpm test:heb-connector

# Or directly
npx ts-node tests/heb-scraper/test-connector-only.ts
```

**Expected output:**
```
✅ Connector succeeded!
Found 2/2 ingredients
```

**What to check:**
- Connector returns `success: true`
- Both ingredients marked as `found: true`
- Product links are valid HEB.com URLs

---

## Troubleshooting

### If tests fail with "errorCode 15" blocking:

**Problem:** HEB's firewall is blocking the requests.

**Possible causes:**
1. Stealth plugin not properly loaded
2. Too many rapid requests from your IP
3. HEB updated their bot detection

**Solutions to try:**
1. Wait 5-10 minutes and try again (IP cooldown)
2. Verify `puppeteer-extra` and `puppeteer-extra-plugin-stealth` are installed:
   ```bash
   pnpm list puppeteer-extra puppeteer-extra-plugin-stealth
   ```
3. Check if HEB website structure changed (search bar selector may need updating)
4. Try running with visible browser (`headless: false`) to observe behavior

### If search bar not found:

**Problem:** "Could not find search bar on HEB home page"

**Solution:**
The search bar selector looks for input elements with class containing "search". If HEB redesigns their site, update the selector logic in the test script around line 70-86.

Current logic:
```typescript
const inputs = Array.from(document.querySelectorAll('input'));
for (const input of inputs) {
  const classList = Array.from(input.classList);
  for (const className of classList) {
    if (className.toLowerCase().includes('search')) {
      return `.${className}`;
    }
  }
}
```

### If products not found:

**Problem:** Browser loads but no products are returned.

**Possible causes:**
1. Selector `[data-testid*="product"]` is outdated
2. Page didn't fully load (increase wait time)
3. HEB changed their product listing HTML structure

**Debug steps:**
1. Run test with browser visible
2. Manually search for an ingredient
3. Inspect the product elements
4. Update selectors if needed

---

## Dependencies

These tests require:
- `puppeteer` ^23.11.1
- `puppeteer-extra` ^3.3.6
- `puppeteer-extra-plugin-stealth` ^2.11.2
- `ts-node` ^10.9.2
- `typescript` ^5.7.2

All dependencies are listed in `package.json`.

---

## Test History

### Initial Approach (Failed)
- Direct navigation to `https://www.heb.com/search/?q={ingredient}`
- Custom user agent spoofing
- Manual webdriver flag removal
- **Result:** Blocked with error code 15

### Final Working Approach
- Use `puppeteer-extra-plugin-stealth`
- Navigate to home page once: `https://www.heb.com`
- Find search bar dynamically
- Use same session/page for all searches
- Type into search bar + press Enter
- **Result:** 100% success rate ✅

---

## Maintenance Notes

**When to run these tests:**
- After updating `puppeteer` or related dependencies
- If HEB scraping starts failing in production
- Before deploying changes to the HEB connector
- If HEB updates their website design

**Keep these tests up to date:**
- If HEB changes their search bar HTML structure
- If product container selectors change
- If HEB adds new bot detection measures

---

## Related Files

- Main connector: `src/connectors/web.ts`
- Agent implementation: `src/services/agent.ts`
- Package dependencies: `package.json`
