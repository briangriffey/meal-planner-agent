-- Enable schedules for all existing users who have it disabled
-- This is a data migration to fix the issue where schedules were disabled by default

UPDATE "UserPreferences"
SET "scheduleEnabled" = true
WHERE "scheduleEnabled" = false;
