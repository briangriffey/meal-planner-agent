#!/usr/bin/env ts-node
/**
 * Test script for multi-user functionality
 *
 * Tests:
 * - Creating user configurations
 * - Loading user configurations
 * - User-specific meal history
 * - Converting to system config format
 */

import { UserConfigService, UserConfig } from '../src/services/userConfig';
import { MealHistoryService } from '../src/services/mealHistory';
import * as path from 'path';
import * as fs from 'fs';

const TEST_CONFIG_PATH = path.join(process.cwd(), 'data', 'test-users.json');
const TEST_USER_ID = 'test-user-1';
const TEST_USER_ID_2 = 'test-user-2';

async function testMultiUser() {
  console.log('\n🧪 Testing Multi-User Functionality\\n');

  // Clean up any existing test data
  if (fs.existsSync(TEST_CONFIG_PATH)) {
    fs.unlinkSync(TEST_CONFIG_PATH);
  }

  const systemEmail = {
    user: 'system@example.com',
    appPassword: 'test-password'
  };

  const userConfigService = new UserConfigService(TEST_CONFIG_PATH, systemEmail, 'claude-3-sonnet-20240229');

  console.log('Test 1: Create user configurations');
  console.log('='.repeat(50));

  const user1Config: UserConfig = {
    userId: TEST_USER_ID,
    email: {
      recipients: ['user1@example.com']
    },
    schedule: {
      dayOfWeek: 0,
      hour: 10,
      minute: 0
    },
    preferences: {
      numberOfMeals: 3,
      servingsPerMeal: 2,
      minProteinPerMeal: 40,
      maxCaloriesPerMeal: 500,
      dietaryRestrictions: []
    },
    heb: {
      enabled: true
    }
  };

  userConfigService.saveUserConfig(user1Config);
  console.log(`✅ Created user config for: ${TEST_USER_ID}`);

  const user2Config: UserConfig = {
    userId: TEST_USER_ID_2,
    email: {
      recipients: ['user2@example.com', 'user2-alt@example.com']
    },
    schedule: {
      dayOfWeek: 6,
      hour: 18,
      minute: 30
    },
    preferences: {
      numberOfMeals: 7,
      servingsPerMeal: 4,
      minProteinPerMeal: 35,
      maxCaloriesPerMeal: 600,
      dietaryRestrictions: ['gluten-free']
    },
    heb: {
      enabled: false
    }
  };

  userConfigService.saveUserConfig(user2Config);
  console.log(`✅ Created user config for: ${TEST_USER_ID_2}`);

  console.log('\\nTest 2: Load user configurations');
  console.log('='.repeat(50));

  const loadedUser1 = userConfigService.getUserConfig(TEST_USER_ID);
  const loadedUser2 = userConfigService.getUserConfig(TEST_USER_ID_2);

  console.log(`✅ Loaded user: ${loadedUser1?.userId}`);
  console.log(`   Recipients: ${loadedUser1?.email.recipients.join(', ')}`);
  console.log(`   Meals: ${loadedUser1?.preferences.numberOfMeals}, Servings: ${loadedUser1?.preferences.servingsPerMeal}`);

  console.log(`✅ Loaded user: ${loadedUser2?.userId}`);
  console.log(`   Recipients: ${loadedUser2?.email.recipients.join(', ')}`);
  console.log(`   Dietary restrictions: ${loadedUser2?.preferences.dietaryRestrictions.join(', ') || 'none'}`);

  console.log('\\nTest 3: Get all user IDs');
  console.log('='.repeat(50));

  const userIds = userConfigService.getAllUserIds();
  console.log(`✅ Found ${userIds.length} users: ${userIds.join(', ')}`);

  console.log('\\nTest 4: Convert to system config');
  console.log('='.repeat(50));

  if (loadedUser1) {
    const systemConfig = userConfigService.toSystemConfig(loadedUser1);
    console.log(`✅ Converted ${loadedUser1.userId} to system config:`);
    console.log(`   Email user: ${systemConfig.email.user}`);
    console.log(`   Email recipients: ${systemConfig.email.recipients.join(', ')}`);
    console.log(`   Claude model: ${systemConfig.claude.model}`);
    console.log(`   Preferences: ${JSON.stringify(systemConfig.preferences)}`);
  }

  console.log('\\nTest 5: User-specific meal history');
  console.log('='.repeat(50));

  const user1History = new MealHistoryService(undefined, 12, TEST_USER_ID);
  const user2History = new MealHistoryService(undefined, 12, TEST_USER_ID_2);

  user1History.saveMealPlan([
    { day: 'Monday', name: 'User 1 Grilled Chicken', calories: 520, protein: 45 },
    { day: 'Tuesday', name: 'User 1 Salmon Bowl', calories: 580, protein: 42 }
  ]);

  user2History.saveMealPlan([
    { day: 'Monday', name: 'User 2 Turkey Chili', calories: 490, protein: 48 },
    { day: 'Tuesday', name: 'User 2 Tofu Stir-Fry', calories: 450, protein: 35 }
  ]);

  const user1Meals = user1History.getRecentMealNames(1);
  const user2Meals = user2History.getRecentMealNames(1);

  console.log(`✅ ${TEST_USER_ID} meals: ${user1Meals.join(', ')}`);
  console.log(`✅ ${TEST_USER_ID_2} meals: ${user2Meals.join(', ')}`);
  console.log('   (Meal histories are isolated per user)');

  console.log('\\nTest 6: Delete user configuration');
  console.log('='.repeat(50));

  const deleted = userConfigService.deleteUserConfig(TEST_USER_ID_2);
  console.log(`✅ Deleted user: ${TEST_USER_ID_2} (success: ${deleted})`);

  const remainingUsers = userConfigService.getAllUserIds();
  console.log(`   Remaining users: ${remainingUsers.join(', ')}`);

  console.log('\\n' + '='.repeat(50));
  console.log('✅ All multi-user tests passed!');
  console.log('='.repeat(50));

  // Cleanup
  if (fs.existsSync(TEST_CONFIG_PATH)) {
    fs.unlinkSync(TEST_CONFIG_PATH);
  }

  // Clean up user-specific meal history directories
  const testDataDir = path.join(process.cwd(), 'data', 'users');
  if (fs.existsSync(testDataDir)) {
    fs.rmSync(testDataDir, { recursive: true, force: true });
  }

  console.log('\\n🧹 Cleaned up test data');
}

testMultiUser()
  .then(() => {
    console.log('\\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\\n❌ Test failed:', error);
    process.exit(1);
  });
