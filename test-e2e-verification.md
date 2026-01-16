# End-to-End Verification for Shopping List Export Flow

## Test Setup
- Server running at: http://localhost:3002
- Database: PostgreSQL (local)

## Verification Steps

### 1. Navigate to Completed Meal Plan Detail Page
- [ ] Login to application
- [ ] Navigate to /dashboard/meal-plans
- [ ] Find a completed meal plan
- [ ] Click to view meal plan details at /dashboard/meal-plans/[id]

### 2. Click 'Shopping List' Button
- [ ] Verify Shopping List button is visible in meal plan header
- [ ] Button has shopping cart/list icon
- [ ] Button has gradient styling consistent with other buttons
- [ ] Click button to navigate to shopping list page

### 3. Verify Shopping List Page Loads with Aggregated Ingredients
- [ ] Page loads at /dashboard/meal-plans/[id]/shopping-list
- [ ] Breadcrumb navigation shows: Meal Plans > Week > Shopping List
- [ ] Header displays week start date
- [ ] Ingredients are displayed grouped by category
- [ ] Each ingredient shows amount and item name
- [ ] Checkboxes are present for each ingredient
- [ ] All ingredients from all meals are included

### 4. Click 'Copy to Clipboard' - Verify Success Message
- [ ] Copy to Clipboard button is visible
- [ ] Click button
- [ ] Success message appears confirming copy
- [ ] No console errors
- [ ] (Optional) Paste into text editor to verify clipboard contents

### 5. Click 'Download' - Verify .txt File Downloads
- [ ] Download button is visible
- [ ] Click button
- [ ] File download is triggered
- [ ] File name format: shopping-list-[date].txt
- [ ] File contains formatted shopping list with categories
- [ ] Success message appears
- [ ] No console errors

### 6. Click 'Print' - Verify Print Page Opens
- [ ] Print button is visible
- [ ] Click button
- [ ] New window/tab opens with print-friendly page
- [ ] Print page URL: /dashboard/meal-plans/[id]/shopping-list/print
- [ ] Print page has minimal styling suitable for printing
- [ ] Ingredients clearly displayed with categories
- [ ] Print This Page button visible on screen (hidden when printing)
- [ ] No console errors

### 7. Verify All Ingredients from All Meals Are Aggregated Correctly
- [ ] Count meals in original meal plan
- [ ] Verify all unique ingredients appear in shopping list
- [ ] Verify no ingredients are missing
- [ ] Categories are appropriate (Produce, Proteins, Dairy, etc.)

### 8. Verify Quantities Are Combined (if Duplicate Items)
- [ ] If same ingredient appears in multiple meals:
  - [ ] Ingredient appears only once in shopping list
  - [ ] Quantity is properly aggregated (e.g., "2 cups + 1 cup" or "3 cups")
  - [ ] Original amounts shown if multiple entries

## Build Verification
```bash
mise exec -- pnpm build
```
Expected: All packages build successfully with no errors

## Console Errors Check
- [ ] No errors in browser console on any page
- [ ] No React warnings
- [ ] No network errors

## Test Results
- Date tested: [To be filled]
- Tested by: Claude Code
- Result: [PASS/FAIL]
- Notes: [Any issues or observations]
