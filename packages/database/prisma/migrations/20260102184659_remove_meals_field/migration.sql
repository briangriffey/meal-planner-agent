-- Remove the meals JSON field from meal_plans table
-- All meal data is now stored in the normalized meal_records table

ALTER TABLE "meal_plans" DROP COLUMN IF EXISTS "meals";
