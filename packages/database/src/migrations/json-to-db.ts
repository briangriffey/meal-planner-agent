#!/usr/bin/env ts-node
/**
 * Database seed script
 *
 * Loads fixture data from JSON files and populates the database.
 * This script is safe to run in test/development environments and includes
 * safeguards to prevent accidental use in production.
 *
 * Usage:
 *   pnpm db:seed              # Seed database with fixtures
 *   pnpm db:seed --force      # Override production warning
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// ============================================================================
// Configuration
// ============================================================================

const FIXTURES_DIR = path.join(__dirname, "../../fixtures");

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ============================================================================
// Type Definitions
// ============================================================================

interface FixtureUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: string | null;
  image: string | null;
  hashedPassword: string;
  createdAt: string;
  updatedAt: string;
}

interface FixtureUserPreferences {
  id: string;
  userId: string;
  mealCount: number;
  servingSize: number;
  preferredProteins: string[];
  dietaryRestrictions: string[];
  targetCaloriesPerMeal: number | null;
  targetProteinGramsPerMeal: number | null;
  enableHEB: boolean;
  scheduleEnabled: boolean;
  scheduleDay: number;
  scheduleTime: string;
  createdAt: string;
  updatedAt: string;
}

interface FixtureMealPlan {
  id: string;
  userId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  weekStartDate: string;
  generatedAt: string | null;
  claudeModel: string | null;
  iterationCount: number | null;
  emailSent: boolean;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FixtureMealRecord {
  id: string;
  mealPlanId: string;
  dayNumber: number;
  data: {
    name: string;
    ingredients: Array<{ item: string; amount: string }>;
    instructions: string[];
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber?: number;
    };
    prepTime: number;
    cookTime: number;
    hebAvailable?: boolean;
  };
  createdAt: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Load JSON fixture file
 */
function loadFixture<T>(filename: string): T[] {
  const filePath = path.join(FIXTURES_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Convert day number (1-7) to day name
 */
function dayNumberToDayName(dayNumber: number): string {
  // dayNumber is 1-based (1 = Monday, 7 = Sunday in typical week view)
  // But we'll map 1-7 to Monday-Sunday
  const dayIndex = dayNumber % 7;
  return DAY_NAMES[dayIndex];
}

/**
 * Parse schedule time (HH:MM) into hour and minute
 */
function parseScheduleTime(time: string): { hour: number; minute: number } {
  const [hour, minute] = time.split(":").map((n) => parseInt(n, 10));
  return { hour, minute };
}

/**
 * Validate DATABASE_URL
 */
function validateDatabaseUrl(): void {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please configure your database connection."
    );
  }

  // Check for production indicators
  const productionIndicators = [
    "prod",
    "production",
    "aws.com",
    "azure.com",
    "cloud.google.com",
    "railway.app",
    "render.com",
  ];

  const isProduction = productionIndicators.some((indicator) =>
    databaseUrl.toLowerCase().includes(indicator)
  );

  if (isProduction) {
    const forceFlag = process.argv.includes("--force");

    if (!forceFlag) {
      throw new Error(
        "ERROR: This appears to be a PRODUCTION database!\n\n" +
          "Database URL: " +
          databaseUrl.replace(/:[^:@]+@/, ":***@") +
          "\n\n" +
          "Seeding will DELETE all existing data. This is destructive!\n" +
          "If you're absolutely sure you want to proceed, use:\n" +
          "  pnpm db:seed --force\n\n" +
          "For production databases, consider using migrations instead."
      );
    }

    console.warn(
      "⚠️  WARNING: Seeding PRODUCTION database (--force flag detected)"
    );
  }

  console.log(
    `✓ Database URL validated: ${databaseUrl.replace(/:[^:@]+@/, ":***@")}`
  );
}

/**
 * Clear existing data (in correct order to respect foreign keys)
 */
async function clearDatabase(): Promise<void> {
  console.log("\n🗑️  Clearing existing data...");

  // Delete in order that respects foreign key constraints
  await prisma.mealRecord.deleteMany({});
  console.log("  - Deleted meal records");

  await prisma.mealPlan.deleteMany({});
  console.log("  - Deleted meal plans");

  await prisma.userPreferences.deleteMany({});
  console.log("  - Deleted user preferences");

  await prisma.apiKey.deleteMany({});
  console.log("  - Deleted API keys");

  await prisma.session.deleteMany({});
  console.log("  - Deleted sessions");

  await prisma.account.deleteMany({});
  console.log("  - Deleted accounts");

  await prisma.user.deleteMany({});
  console.log("  - Deleted users");

  console.log("✓ Database cleared");
}

/**
 * Seed users
 */
async function seedUsers(users: FixtureUser[]): Promise<void> {
  console.log(`\n👥 Seeding ${users.length} users...`);

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.hashedPassword,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      },
    });
    console.log(`  ✓ Created user: ${user.email}`);
  }
}

/**
 * Seed user preferences
 */
async function seedPreferences(
  preferences: FixtureUserPreferences[]
): Promise<void> {
  console.log(`\n⚙️  Seeding ${preferences.length} user preferences...`);

  for (const pref of preferences) {
    const { hour, minute } = parseScheduleTime(pref.scheduleTime);

    await prisma.userPreferences.create({
      data: {
        id: pref.id,
        userId: pref.userId,
        numberOfMeals: pref.mealCount,
        servingsPerMeal: pref.servingSize,
        minProteinPerMeal: pref.targetProteinGramsPerMeal || 40,
        maxCaloriesPerMeal: pref.targetCaloriesPerMeal || 600,
        dietaryRestrictions: pref.dietaryRestrictions,
        hebEnabled: pref.enableHEB,
        scheduleEnabled: pref.scheduleEnabled,
        scheduleDayOfWeek: pref.scheduleDay,
        scheduleHour: hour,
        scheduleMinute: minute,
        createdAt: new Date(pref.createdAt),
        updatedAt: new Date(pref.updatedAt),
      },
    });
    console.log(`  ✓ Created preferences for user: ${pref.userId}`);
  }
}

/**
 * Seed meal plans
 */
async function seedMealPlans(mealPlans: FixtureMealPlan[]): Promise<void> {
  console.log(`\n📋 Seeding ${mealPlans.length} meal plans...`);

  for (const plan of mealPlans) {
    await prisma.mealPlan.create({
      data: {
        id: plan.id,
        userId: plan.userId,
        status: plan.status,
        weekStartDate: new Date(plan.weekStartDate),
        generatedAt: plan.generatedAt ? new Date(plan.generatedAt) : new Date(),
        claudeModel: plan.claudeModel,
        iterationCount: plan.iterationCount,
        emailSent: plan.emailSent,
        jobError: plan.error,
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
      },
    });
    console.log(`  ✓ Created meal plan: ${plan.id} (${plan.status})`);
  }
}

/**
 * Seed meal records
 */
async function seedMealRecords(
  mealRecords: FixtureMealRecord[]
): Promise<void> {
  console.log(`\n🍽️  Seeding ${mealRecords.length} meal records...`);

  let count = 0;
  for (const record of mealRecords) {
    const dayName = dayNumberToDayName(record.dayNumber);

    // Get userId from the meal plan
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: record.mealPlanId },
      select: { userId: true },
    });

    if (!mealPlan) {
      console.warn(`  ⚠️  Skipping meal record ${record.id}: Meal plan ${record.mealPlanId} not found`);
      continue;
    }

    await prisma.mealRecord.create({
      data: {
        id: record.id,
        userId: mealPlan.userId,
        mealPlanId: record.mealPlanId,
        day: dayName,
        name: record.data.name,
        calories: record.data.nutrition.calories,
        protein: record.data.nutrition.protein,
        carbs: record.data.nutrition.carbs,
        fat: record.data.nutrition.fat,
        fiber: record.data.nutrition.fiber,
        ingredients: record.data.ingredients,
        instructions: record.data.instructions,
        prepTime: `${record.data.prepTime} minutes`,
        cookTime: `${record.data.cookTime} minutes`,
        createdAt: new Date(record.createdAt),
      },
    });

    count++;
    if (count % 10 === 0) {
      console.log(`  ✓ Created ${count} meal records...`);
    }
  }

  console.log(`  ✓ Created ${count} total meal records`);
}

/**
 * Print summary statistics
 */
async function printSummary(): Promise<void> {
  console.log("\n📊 Database Summary:");
  console.log("  ==================");

  const userCount = await prisma.user.count();
  const prefCount = await prisma.userPreferences.count();
  const planCount = await prisma.mealPlan.count();
  const mealCount = await prisma.mealRecord.count();

  console.log(`  Users:          ${userCount}`);
  console.log(`  Preferences:    ${prefCount}`);
  console.log(`  Meal Plans:     ${planCount}`);
  console.log(`  Meal Records:   ${mealCount}`);

  const planStatusCounts = await prisma.mealPlan.groupBy({
    by: ["status"],
    _count: true,
  });

  console.log("\n  Meal Plan Status:");
  for (const { status, _count } of planStatusCounts) {
    console.log(`    ${status}: ${_count}`);
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log("🌱 Database Seed Script");
  console.log("======================\n");

  try {
    // Validate environment
    validateDatabaseUrl();

    // Load fixtures
    console.log("\n📦 Loading fixture data...");
    const users = loadFixture<FixtureUser>("users.json");
    const preferences = loadFixture<FixtureUserPreferences>("preferences.json");
    const mealPlans = loadFixture<FixtureMealPlan>("meal-plans.json");
    const mealRecords = loadFixture<FixtureMealRecord>("meal-records.json");
    console.log("✓ Fixtures loaded successfully");

    // Clear existing data
    await clearDatabase();

    // Seed data in correct order (respects foreign keys)
    await seedUsers(users);
    await seedPreferences(preferences);
    await seedMealPlans(mealPlans);
    await seedMealRecords(mealRecords);

    // Print summary
    await printSummary();

    console.log("\n✅ Database seeding completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run main function
main();
