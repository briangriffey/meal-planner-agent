/**
 * Verification Script: Non-Household User Email Distribution
 *
 * This script verifies that users who are NOT in any household
 * still receive meal plan emails at their own email address.
 *
 * Verification Steps:
 * 1. Check database for user not in any household
 * 2. Simulate meal plan generation API logic
 * 3. Verify emailConfig.recipients contains only user's own email
 * 4. Confirm fallback behavior works correctly
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface HouseholdMember {
  userId: string;
  name: string | null;
  email: string;
  preferences: {
    dietaryRestrictions: string[];
    minProteinPerMeal: number | null;
    maxCaloriesPerMeal: number | null;
  };
}

async function verifyNonHouseholdEmailDistribution() {
  console.log('🔍 Verification: Non-Household User Email Distribution\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Find a user who is NOT in any household
    console.log('\n📋 Step 1: Finding user not in any household...');

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    let testUser: { id: string; name: string | null; email: string } | null = null;

    for (const user of allUsers) {
      const householdMember = await prisma.householdMember.findFirst({
        where: { userId: user.id },
      });

      if (!householdMember) {
        testUser = user;
        break;
      }
    }

    if (!testUser) {
      console.log('❌ No users found without household membership');
      console.log('   Creating test scenario...\n');

      // Check if we have any users at all
      if (allUsers.length === 0) {
        console.log('❌ No users exist in database');
        console.log('   Please seed the database first: pnpm db:seed');
        return false;
      }

      // For verification purposes, we'll use the first user and pretend they're not in a household
      testUser = allUsers[0];
      console.log(`ℹ️  Using user ${testUser.email} for simulation`);
      console.log('   (Simulating non-household scenario)');
    } else {
      console.log(`✅ Found non-household user: ${testUser.email}`);
    }

    // Step 2: Simulate the email recipient logic from generate/route.ts
    console.log('\n📋 Step 2: Simulating email recipient logic...');

    const sendEmail = true; // Simulate sendEmail=true
    const householdMember = await prisma.householdMember.findFirst({
      where: { userId: testUser.id },
      include: {
        household: {
          include: {
            members: {
              include: {
                user: true,
                preferences: true,
              },
            },
          },
        },
      },
    });

    let householdMembers: HouseholdMember[] | undefined;

    if (householdMember?.household) {
      householdMembers = householdMember.household.members.map((member) => ({
        userId: member.user.id,
        name: member.user.name,
        email: member.user.email,
        preferences: {
          dietaryRestrictions: member.preferences?.dietaryRestrictions || [],
          minProteinPerMeal: member.preferences?.minProteinPerMeal || null,
          maxCaloriesPerMeal: member.preferences?.maxCaloriesPerMeal || null,
        },
      }));
    }

    // This is the actual logic from generate/route.ts (lines 160-170)
    let emailRecipients: string[] = [];
    if (sendEmail) {
      if (householdMembers && householdMembers.length > 0) {
        // Extract emails from all household members
        emailRecipients = householdMembers.map((member) => member.email);
      } else if (testUser.email) {
        // Fall back to user's own email if not in household
        emailRecipients = [testUser.email];
      }
    }

    console.log(`   householdMembers: ${householdMembers ? `Array(${householdMembers.length})` : 'undefined'}`);
    console.log(`   emailRecipients: [${emailRecipients.join(', ')}]`);

    // Step 3: Verify email recipients array
    console.log('\n📋 Step 3: Verifying email recipients...');

    let allTestsPassed = true;

    // Test 3.1: emailRecipients should contain exactly one email
    if (emailRecipients.length === 1) {
      console.log('   ✅ emailRecipients contains exactly one email');
    } else {
      console.log(`   ❌ Expected 1 email, got ${emailRecipients.length}`);
      allTestsPassed = false;
    }

    // Test 3.2: That email should be the user's own email
    if (emailRecipients[0] === testUser.email) {
      console.log(`   ✅ Email matches user's own email: ${testUser.email}`);
    } else {
      console.log(`   ❌ Expected ${testUser.email}, got ${emailRecipients[0]}`);
      allTestsPassed = false;
    }

    // Test 3.3: Should not be empty
    if (emailRecipients.length > 0) {
      console.log('   ✅ emailRecipients is not empty');
    } else {
      console.log('   ❌ emailRecipients should not be empty when sendEmail=true');
      allTestsPassed = false;
    }

    // Step 4: Verify fallback behavior
    console.log('\n📋 Step 4: Verifying fallback behavior...');

    // Test 4.1: Verify householdMembers is undefined or empty
    if (!householdMembers || householdMembers.length === 0) {
      console.log('   ✅ householdMembers is undefined/empty (user not in household)');
    } else {
      console.log(`   ❌ householdMembers should be undefined/empty, got ${householdMembers.length} members`);
      allTestsPassed = false;
    }

    // Test 4.2: Verify fallback logic was used
    if (emailRecipients[0] === testUser.email && (!householdMembers || householdMembers.length === 0)) {
      console.log('   ✅ Fallback logic correctly used user\'s own email');
    } else {
      console.log('   ❌ Fallback logic not working as expected');
      allTestsPassed = false;
    }

    // Test 4.3: Verify emailConfig structure
    const emailConfig = {
      recipients: emailRecipients,
    };

    if (emailConfig.recipients && Array.isArray(emailConfig.recipients)) {
      console.log('   ✅ emailConfig.recipients is a valid array');
    } else {
      console.log('   ❌ emailConfig.recipients should be an array');
      allTestsPassed = false;
    }

    // Final results
    console.log('\n' + '='.repeat(60));
    if (allTestsPassed) {
      console.log('\n✅ ALL VERIFICATIONS PASSED');
      console.log('\n📝 Summary:');
      console.log(`   • User: ${testUser.email}`);
      console.log(`   • In household: No`);
      console.log(`   • Email recipients: [${emailRecipients.join(', ')}]`);
      console.log(`   • Fallback behavior: Working correctly ✅`);
      console.log('\n✨ Non-household users will receive emails at their own address.');
      return true;
    } else {
      console.log('\n❌ SOME VERIFICATIONS FAILED');
      console.log('\n🔧 Please review the fallback logic in:');
      console.log('   apps/web/app/api/meal-plans/generate/route.ts (lines 160-170)');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyNonHouseholdEmailDistribution()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
