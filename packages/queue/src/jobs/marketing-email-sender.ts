import { Job } from 'bullmq';
import { PrismaClient } from '@meal-planner/database';
import { EmailConnector, MarketingEmailRenderer } from '@meal-planner/core';
import { MarketingEmailJobData } from '../client';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Process a marketing email job
 * This is the worker job that sends release announcements to all users
 */
export async function processMarketingEmail(job: Job<MarketingEmailJobData>): Promise<any> {
  const { releaseVersion, releaseNotes, changelogContent } = job.data;

  console.log(`🚀 Starting marketing email job for release ${releaseVersion}`);
  console.log(`Payload: ${JSON.stringify(job.data)}`);

  const prisma = new PrismaClient();

  try {
    // Progress reporting
    await job.updateProgress(10);

    // Query all users from database
    console.log('📧 Fetching all users from database...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (users.length === 0) {
      console.log('⚠️  No users found in database');
      return {
        success: true,
        message: 'No users to send emails to',
        userCount: 0,
      };
    }

    console.log(`📊 Found ${users.length} users to send emails to`);
    await job.updateProgress(20);

    // Use Claude to generate user-friendly marketing copy from changelog
    console.log('🤖 Generating marketing copy with Claude...');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a marketing copywriter for a meal planning application. Parse the following GitHub release notes and extract the key information into categorized lists.

Release Version: ${releaseVersion}
Release Notes:
${releaseNotes}

Changelog Content:
${changelogContent}

Please analyze these release notes and respond with a JSON object containing:
{
  "features": ["list of new features in user-friendly language"],
  "improvements": ["list of improvements in user-friendly language"],
  "fixes": ["list of bug fixes in user-friendly language"]
}

Make each item:
- Concise (1-2 sentences max)
- User-focused (not technical jargon)
- Exciting and positive
- Clear about the benefit to the user

Example good item: "Save time with automatic grocery list generation from your meal plans"
Example bad item: "Implemented algorithm for parsing ingredients into shopping list data structure"

Return ONLY the JSON object, no other text.`,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}';
    let parsedContent;
    try {
      parsedContent = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Claude response as JSON:', parseError);
      console.log('Raw response:', responseText);
      // Fallback to empty arrays
      parsedContent = { features: [], improvements: [], fixes: [] };
    }

    console.log('✅ Marketing copy generated');
    await job.updateProgress(40);

    // Generate HTML email using MarketingEmailRenderer
    console.log('📝 Generating HTML email...');
    const renderer = new MarketingEmailRenderer();
    const emailHtml = renderer.render({
      version: releaseVersion,
      features: parsedContent.features || [],
      improvements: parsedContent.improvements || [],
      fixes: parsedContent.fixes || [],
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      rawNotes: parsedContent.features?.length === 0 && parsedContent.improvements?.length === 0 && parsedContent.fixes?.length === 0 ? releaseNotes : undefined,
    });

    console.log('✅ Email HTML generated');
    await job.updateProgress(50);

    // Send emails to all users
    // We'll send in batches to avoid overwhelming the email service
    const BATCH_SIZE = 50;
    const batches = [];
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      batches.push(users.slice(i, i + BATCH_SIZE));
    }

    console.log(`📨 Sending emails in ${batches.length} batches of up to ${BATCH_SIZE} users each...`);

    let successCount = 0;
    let failureCount = 0;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchEmails = batch.map(u => u.email).filter((email): email is string => email !== null);

      if (batchEmails.length === 0) {
        console.log(`⏭️  Batch ${batchIndex + 1}/${batches.length}: No valid emails, skipping`);
        continue;
      }

      console.log(`📤 Sending batch ${batchIndex + 1}/${batches.length} (${batchEmails.length} recipients)...`);

      // Create email connector for this batch
      const testMode = process.env.EMAIL_TEST_MODE === 'true' || process.env.NODE_ENV === 'test';
      const emailConnector = new EmailConnector(
        {
          user: process.env.GMAIL_USER || 'test@example.com',
          appPassword: process.env.GMAIL_APP_PASSWORD || 'test-password',
          recipients: batchEmails,
        },
        testMode
      );

      // Send email
      const result = await emailConnector.execute({
        subject: `🎉 New Release: ${releaseVersion}`,
        body: emailHtml,
      });

      if (result.success) {
        successCount += batchEmails.length;
        console.log(`✅ Batch ${batchIndex + 1}/${batches.length} sent successfully`);
      } else {
        failureCount += batchEmails.length;
        console.error(`❌ Batch ${batchIndex + 1}/${batches.length} failed:`, result.error);
      }

      // Update progress (50% to 90% for email sending)
      const progressPercent = 50 + ((batchIndex + 1) / batches.length) * 40;
      await job.updateProgress(Math.round(progressPercent));

      // Add delay between batches to avoid rate limiting
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    await job.updateProgress(100);

    console.log(`✅ Marketing email job completed`);
    console.log(`📊 Success: ${successCount}, Failures: ${failureCount}, Total: ${users.length}`);

    return {
      success: true,
      releaseVersion,
      userCount: users.length,
      emailsSent: successCount,
      emailsFailed: failureCount,
    };
  } catch (error) {
    console.error(`❌ Error sending marketing emails:`, error);
    throw error; // BullMQ will handle retries
  } finally {
    await prisma.$disconnect();
  }
}
