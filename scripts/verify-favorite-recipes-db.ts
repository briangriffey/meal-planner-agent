#!/usr/bin/env tsx

/**
 * Database Verification Script for FavoriteRecipe Model
 *
 * This script verifies:
 * 1. favorite_recipes table exists with correct schema
 * 2. Foreign key constraints are working (userId, mealRecordId)
 * 3. JSON fields (ingredients, instructions) store data correctly
 * 4. Cascade delete works (deleting user deletes favorites)
 * 5. Set null works (deleting meal record sets mealRecordId to null)
 * 6. Indexes are created correctly
 */

import { PrismaClient } from '@meal-planner/database';

const prisma = new PrismaClient();

interface VerificationResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

const results: VerificationResult[] = [];

function logResult(test: string, status: 'PASS' | 'FAIL', message: string) {
  results.push({ test, status, message });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${test}: ${message}`);
}

async function verifyTableExists() {
  try {
    // Try to query the favorite_recipes table
    await prisma.$queryRaw`SELECT COUNT(*) FROM favorite_recipes`;
    logResult('Table Exists', 'PASS', 'favorite_recipes table exists');
    return true;
  } catch (error) {
    logResult('Table Exists', 'FAIL', `favorite_recipes table not found: ${error}`);
    return false;
  }
}

async function verifySchema() {
  try {
    // Query table schema from PostgreSQL information_schema
    const columns: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'favorite_recipes'
      ORDER BY ordinal_position
    `;

    const expectedColumns = [
      { name: 'id', type: 'text', nullable: 'NO' },
      { name: 'userId', type: 'text', nullable: 'NO' },
      { name: 'mealRecordId', type: 'text', nullable: 'YES' },
      { name: 'name', type: 'text', nullable: 'NO' },
      { name: 'day', type: 'text', nullable: 'YES' },
      { name: 'calories', type: 'integer', nullable: 'YES' },
      { name: 'protein', type: 'integer', nullable: 'YES' },
      { name: 'carbs', type: 'integer', nullable: 'YES' },
      { name: 'fat', type: 'integer', nullable: 'YES' },
      { name: 'fiber', type: 'integer', nullable: 'YES' },
      { name: 'ingredients', type: 'jsonb', nullable: 'YES' },
      { name: 'instructions', type: 'jsonb', nullable: 'YES' },
      { name: 'prepTime', type: 'text', nullable: 'YES' },
      { name: 'cookTime', type: 'text', nullable: 'YES' },
      { name: 'createdAt', type: 'timestamp without time zone', nullable: 'NO' },
    ];

    let allColumnsCorrect = true;
    for (const expected of expectedColumns) {
      const column = columns.find((col) => col.column_name === expected.name);
      if (!column) {
        logResult(`Column ${expected.name}`, 'FAIL', `Column not found`);
        allColumnsCorrect = false;
      } else if (column.data_type !== expected.type) {
        logResult(`Column ${expected.name}`, 'FAIL', `Type mismatch: expected ${expected.type}, got ${column.data_type}`);
        allColumnsCorrect = false;
      } else if (column.is_nullable !== expected.nullable) {
        logResult(`Column ${expected.name}`, 'FAIL', `Nullable mismatch: expected ${expected.nullable}, got ${column.is_nullable}`);
        allColumnsCorrect = false;
      }
    }

    if (allColumnsCorrect) {
      logResult('Schema Columns', 'PASS', `All ${expectedColumns.length} columns have correct types and nullability`);
    }

    return allColumnsCorrect;
  } catch (error) {
    logResult('Schema Columns', 'FAIL', `Error verifying schema: ${error}`);
    return false;
  }
}

async function verifyIndexes() {
  try {
    // Query indexes from PostgreSQL
    const indexes: any[] = await prisma.$queryRaw`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'favorite_recipes'
      AND schemaname = 'public'
    `;

    const expectedIndexes = [
      'favorite_recipes_pkey',
      'favorite_recipes_userId_createdAt_idx',
      'favorite_recipes_userId_name_idx',
    ];

    let allIndexesExist = true;
    for (const expectedIndex of expectedIndexes) {
      const found = indexes.some((idx) => idx.indexname === expectedIndex);
      if (!found) {
        logResult(`Index ${expectedIndex}`, 'FAIL', 'Index not found');
        allIndexesExist = false;
      }
    }

    if (allIndexesExist) {
      logResult('Indexes', 'PASS', `All ${expectedIndexes.length} indexes exist`);
    }

    return allIndexesExist;
  } catch (error) {
    logResult('Indexes', 'FAIL', `Error verifying indexes: ${error}`);
    return false;
  }
}

async function verifyForeignKeyConstraints() {
  try {
    // Query foreign key constraints from PostgreSQL
    const constraints: any[] = await prisma.$queryRaw`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      JOIN information_schema.referential_constraints AS rc
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'favorite_recipes'
    `;

    let allConstraintsCorrect = true;

    // Check userId foreign key with CASCADE
    const userIdConstraint = constraints.find((c) => c.column_name === 'userId');
    if (!userIdConstraint) {
      logResult('Foreign Key userId', 'FAIL', 'userId foreign key not found');
      allConstraintsCorrect = false;
    } else if (userIdConstraint.foreign_table_name !== 'users') {
      logResult('Foreign Key userId', 'FAIL', `References wrong table: ${userIdConstraint.foreign_table_name}`);
      allConstraintsCorrect = false;
    } else if (userIdConstraint.delete_rule !== 'CASCADE') {
      logResult('Foreign Key userId', 'FAIL', `Delete rule should be CASCADE, got ${userIdConstraint.delete_rule}`);
      allConstraintsCorrect = false;
    } else {
      logResult('Foreign Key userId', 'PASS', 'userId -> users.id with ON DELETE CASCADE');
    }

    // Check mealRecordId foreign key with SET NULL
    const mealRecordIdConstraint = constraints.find((c) => c.column_name === 'mealRecordId');
    if (!mealRecordIdConstraint) {
      logResult('Foreign Key mealRecordId', 'FAIL', 'mealRecordId foreign key not found');
      allConstraintsCorrect = false;
    } else if (mealRecordIdConstraint.foreign_table_name !== 'meal_records') {
      logResult('Foreign Key mealRecordId', 'FAIL', `References wrong table: ${mealRecordIdConstraint.foreign_table_name}`);
      allConstraintsCorrect = false;
    } else if (mealRecordIdConstraint.delete_rule !== 'SET NULL') {
      logResult('Foreign Key mealRecordId', 'FAIL', `Delete rule should be SET NULL, got ${mealRecordIdConstraint.delete_rule}`);
      allConstraintsCorrect = false;
    } else {
      logResult('Foreign Key mealRecordId', 'PASS', 'mealRecordId -> meal_records.id with ON DELETE SET NULL');
    }

    return allConstraintsCorrect;
  } catch (error) {
    logResult('Foreign Key Constraints', 'FAIL', `Error verifying constraints: ${error}`);
    return false;
  }
}

async function verifyJsonFields() {
  try {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
      },
    });

    // Create a favorite recipe with JSON data
    const testIngredients = [
      { item: 'Chicken breast', amount: '500g' },
      { item: 'Olive oil', amount: '2 tbsp' },
      { item: 'Salt', amount: '1 tsp' },
    ];

    const testInstructions = [
      'Preheat oven to 375°F',
      'Season chicken with salt',
      'Drizzle with olive oil',
      'Bake for 25 minutes',
    ];

    const favorite = await prisma.favoriteRecipe.create({
      data: {
        userId: testUser.id,
        name: 'Test Grilled Chicken',
        day: 'Monday',
        calories: 500,
        protein: 45,
        carbs: 10,
        fat: 20,
        fiber: 2,
        ingredients: testIngredients as any,
        instructions: testInstructions as any,
        prepTime: '10 minutes',
        cookTime: '25 minutes',
      },
    });

    // Retrieve and verify JSON data
    const retrieved = await prisma.favoriteRecipe.findUnique({
      where: { id: favorite.id },
    });

    if (!retrieved) {
      logResult('JSON Fields', 'FAIL', 'Failed to retrieve created favorite');
      await prisma.user.delete({ where: { id: testUser.id } });
      return false;
    }

    const ingredientsMatch = JSON.stringify(retrieved.ingredients) === JSON.stringify(testIngredients);
    const instructionsMatch = JSON.stringify(retrieved.instructions) === JSON.stringify(testInstructions);

    // Clean up test data
    await prisma.favoriteRecipe.delete({ where: { id: favorite.id } });
    await prisma.user.delete({ where: { id: testUser.id } });

    if (ingredientsMatch && instructionsMatch) {
      logResult('JSON Fields', 'PASS', 'ingredients and instructions JSON data stored and retrieved correctly');
      return true;
    } else {
      logResult('JSON Fields', 'FAIL', 'JSON data mismatch after retrieval');
      return false;
    }
  } catch (error) {
    logResult('JSON Fields', 'FAIL', `Error testing JSON fields: ${error}`);
    return false;
  }
}

async function verifyCascadeDelete() {
  try {
    // Create a test user with a favorite recipe
    const testUser = await prisma.user.create({
      data: {
        email: `cascade-test-${Date.now()}@example.com`,
        name: 'Cascade Test User',
        favoriteRecipes: {
          create: {
            name: 'Test Recipe for Cascade',
            day: 'Tuesday',
            calories: 400,
          },
        },
      },
      include: {
        favoriteRecipes: true,
      },
    });

    const favoriteId = testUser.favoriteRecipes[0].id;

    // Delete the user
    await prisma.user.delete({
      where: { id: testUser.id },
    });

    // Check if favorite recipe was also deleted
    const deletedFavorite = await prisma.favoriteRecipe.findUnique({
      where: { id: favoriteId },
    });

    if (deletedFavorite === null) {
      logResult('Cascade Delete', 'PASS', 'Deleting user cascades to delete favorite recipes');
      return true;
    } else {
      logResult('Cascade Delete', 'FAIL', 'Favorite recipe still exists after user deletion');
      // Clean up
      await prisma.favoriteRecipe.delete({ where: { id: favoriteId } });
      return false;
    }
  } catch (error) {
    logResult('Cascade Delete', 'FAIL', `Error testing cascade delete: ${error}`);
    return false;
  }
}

async function verifySetNull() {
  try {
    // Create a test user, meal plan, meal record, and favorite recipe
    const testUser = await prisma.user.create({
      data: {
        email: `setnull-test-${Date.now()}@example.com`,
        name: 'Set Null Test User',
      },
    });

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: testUser.id,
        weekStartDate: new Date(),
        status: 'COMPLETED',
      },
    });

    const mealRecord = await prisma.mealRecord.create({
      data: {
        userId: testUser.id,
        mealPlanId: mealPlan.id,
        name: 'Test Meal for Set Null',
        day: 'Wednesday',
        calories: 350,
      },
    });

    const favorite = await prisma.favoriteRecipe.create({
      data: {
        userId: testUser.id,
        mealRecordId: mealRecord.id,
        name: 'Test Favorite for Set Null',
        day: 'Wednesday',
        calories: 350,
      },
    });

    // Delete the meal record
    await prisma.mealRecord.delete({
      where: { id: mealRecord.id },
    });

    // Check if favorite's mealRecordId was set to null
    const updatedFavorite = await prisma.favoriteRecipe.findUnique({
      where: { id: favorite.id },
    });

    // Clean up
    await prisma.favoriteRecipe.delete({ where: { id: favorite.id } });
    await prisma.mealPlan.delete({ where: { id: mealPlan.id } });
    await prisma.user.delete({ where: { id: testUser.id } });

    if (updatedFavorite && updatedFavorite.mealRecordId === null) {
      logResult('Set Null on Delete', 'PASS', 'Deleting meal record sets mealRecordId to NULL');
      return true;
    } else {
      logResult('Set Null on Delete', 'FAIL', 'mealRecordId was not set to NULL after meal record deletion');
      return false;
    }
  } catch (error) {
    logResult('Set Null on Delete', 'FAIL', `Error testing set null: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Verifying FavoriteRecipe Database Constraints\n');
  console.log('=' .repeat(60));
  console.log();

  try {
    // Run all verification tests
    const tableExists = await verifyTableExists();
    if (!tableExists) {
      console.log('\n❌ Table does not exist. Cannot proceed with further tests.');
      process.exit(1);
    }

    console.log();
    await verifySchema();
    console.log();
    await verifyIndexes();
    console.log();
    await verifyForeignKeyConstraints();
    console.log();
    await verifyJsonFields();
    console.log();
    await verifyCascadeDelete();
    console.log();
    await verifySetNull();

    console.log();
    console.log('=' .repeat(60));
    console.log('\n📊 Summary:');
    console.log(`Total tests: ${results.length}`);
    console.log(`Passed: ${results.filter((r) => r.status === 'PASS').length}`);
    console.log(`Failed: ${results.filter((r) => r.status === 'FAIL').length}`);

    const allPassed = results.every((r) => r.status === 'PASS');
    if (allPassed) {
      console.log('\n✅ All database constraint verifications passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some verifications failed. Please review the results above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Fatal error during verification:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
