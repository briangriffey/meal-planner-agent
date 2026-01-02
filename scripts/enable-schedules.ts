#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { PrismaClient } from '@meal-planner/database';
import { updateUserScheduledJob } from '@meal-planner/queue';

// Load environment variables
config();

/**
 * Script to enable schedules for all users who have it disabled
 */
async function enableSchedules() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Updating schedules for all users...');

    // Find all users with schedules disabled
    const usersToUpdate = await prisma.userPreferences.findMany({
      where: {
        scheduleEnabled: false,
      },
      select: {
        userId: true,
        scheduleDayOfWeek: true,
        scheduleHour: true,
        scheduleMinute: true,
      },
    });

    console.log(`📊 Found ${usersToUpdate.length} users with schedules disabled`);

    if (usersToUpdate.length === 0) {
      console.log('✅ All users already have schedules enabled');
      return;
    }

    // Update all users to enable schedules
    const result = await prisma.userPreferences.updateMany({
      where: {
        scheduleEnabled: false,
      },
      data: {
        scheduleEnabled: true,
      },
    });

    console.log(`✅ Updated ${result.count} users to enable schedules`);

    // Add scheduled jobs to the queue for each user
    console.log('🔄 Adding scheduled jobs to queue...');
    for (const user of usersToUpdate) {
      try {
        await updateUserScheduledJob({
          userId: user.userId,
          scheduleDayOfWeek: user.scheduleDayOfWeek,
          scheduleHour: user.scheduleHour,
          scheduleMinute: user.scheduleMinute,
          scheduleEnabled: true,
        });
        console.log(`  ✅ Added scheduled job for user ${user.userId}`);
      } catch (error) {
        console.error(`  ❌ Failed to add scheduled job for user ${user.userId}:`, error);
      }
    }

    console.log('✅ All done!');
  } catch (error) {
    console.error('❌ Error enabling schedules:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
enableSchedules()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
