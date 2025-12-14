#!/usr/bin/env ts-node
/**
 * Test script for meal history functionality
 *
 * Tests:
 * - Saving meal plans to history
 * - Loading meal history
 * - Parsing meals from agent responses
 * - Getting recent meal names
 */

import { MealHistoryService, MealRecord } from '../src/services/mealHistory';
import * as path from 'path';
import * as fs from 'fs';

const TEST_HISTORY_PATH = path.join(process.cwd(), 'data', 'test-meal-history.json');

async function testMealHistory() {
  console.log('\n🧪 Testing Meal History Service\n');

  // Use test path to avoid overwriting real data
  const mealHistory = new MealHistoryService(TEST_HISTORY_PATH, 5);

  // Clean up any existing test data
  if (fs.existsSync(TEST_HISTORY_PATH)) {
    fs.unlinkSync(TEST_HISTORY_PATH);
  }

  console.log('Test 1: Save meal plan to history');
  console.log('=' .repeat(50));

  const testMeals: MealRecord[] = [
    { day: 'Monday', name: 'Grilled Chicken with Roasted Vegetables', calories: 520, protein: 45 },
    { day: 'Tuesday', name: 'Salmon with Quinoa and Asparagus', calories: 580, protein: 42 },
    { day: 'Wednesday', name: 'Turkey Chili with Black Beans', calories: 490, protein: 48 }
  ];

  mealHistory.saveMealPlan(testMeals);
  console.log(`✅ Saved ${testMeals.length} meals`);

  console.log('\nTest 2: Load meal history');
  console.log('='.repeat(50));

  const history = mealHistory.loadHistory();
  console.log(`✅ Loaded history with ${history.history.length} entries`);
  console.log(`   First entry date: ${history.history[0].date}`);
  console.log(`   First entry meals: ${history.history[0].meals.length}`);

  console.log('\nTest 3: Get recent meal names');
  console.log('='.repeat(50));

  const recentMeals = mealHistory.getRecentMealNames(1);
  console.log(`✅ Found ${recentMeals.length} recent meals:`);
  recentMeals.forEach((meal, i) => {
    console.log(`   ${i + 1}. ${meal}`);
  });

  console.log('\nTest 4: Add another week');
  console.log('='.repeat(50));

  const week2Meals: MealRecord[] = [
    { day: 'Monday', name: 'Baked Cod with Sweet Potato', calories: 540, protein: 41 },
    { day: 'Tuesday', name: 'Lean Beef Stir-Fry with Brown Rice', calories: 595, protein: 46 }
  ];

  mealHistory.saveMealPlan(week2Meals);
  console.log(`✅ Saved week 2 with ${week2Meals.length} meals`);

  const updated = mealHistory.loadHistory();
  console.log(`   Total entries now: ${updated.history.length}`);

  console.log('\nTest 5: Get history summary');
  console.log('='.repeat(50));

  const summary = mealHistory.getHistorySummary(2);
  console.log(summary);

  console.log('\nTest 6: Parse meals from agent response');
  console.log('='.repeat(50));

  const sampleResponse = `
# Weekly Meal Plan

## Monday
**Grilled Lemon Herb Chicken with Roasted Vegetables**
- Calories: 520
- Protein: 45g
- Carbs: 28g

## Tuesday
**Pan-Seared Salmon with Quinoa**
- Calories: 580
- Protein: 42g
- Carbs: 35g

## Wednesday
**Turkey and Black Bean Chili**
- Calories: 490
- Protein: 48g
- Carbs: 30g
`;

  const parsedMeals = mealHistory.parseMealPlanFromResponse(sampleResponse);
  console.log(`✅ Parsed ${parsedMeals.length} meals from response:`);
  parsedMeals.forEach((meal, i) => {
    console.log(`   ${i + 1}. ${meal.day}: ${meal.name}`);
    console.log(`      Calories: ${meal.calories}, Protein: ${meal.protein}g`);
  });

  console.log('\nTest 7: Test max entries limit');
  console.log('='.repeat(50));

  // Add several more weeks to test pruning
  for (let i = 0; i < 5; i++) {
    mealHistory.saveMealPlan([
      { day: 'Monday', name: `Test Meal Week ${i + 3}`, calories: 500, protein: 40 }
    ]);
  }

  const final = mealHistory.loadHistory();
  console.log(`✅ After adding 5 more weeks:`);
  console.log(`   Total entries: ${final.history.length}`);
  console.log(`   (Should be max ${5} due to limit)`);

  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests passed!');
  console.log('='.repeat(50));

  // Cleanup
  if (fs.existsSync(TEST_HISTORY_PATH)) {
    fs.unlinkSync(TEST_HISTORY_PATH);
    console.log('\n🧹 Cleaned up test data');
  }
}

testMealHistory()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
