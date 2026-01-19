import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { enqueueMarketingEmail } from '@meal-planner/queue';

const webhookPayloadSchema = z.object({
  action: z.string(),
  release: z.object({
    tag_name: z.string(),
    body: z.string(),
    name: z.string().optional(),
    html_url: z.string().optional(),
    published_at: z.string().optional(),
  }),
});

/**
 * Verify GitHub webhook signature
 * @param payload - Raw request body
 * @param signature - X-Hub-Signature-256 header value
 * @param secret - GitHub webhook secret
 * @returns true if signature is valid
 */
function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  // GitHub sends signature in format: sha256=<hash>
  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')}`;

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    // Length mismatch will throw error
    return false;
  }
}

/**
 * GitHub webhook handler for release events
 * POST /api/webhooks/github
 */
export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    // Verify webhook signature (skip in test mode)
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (webhookSecret && !verifySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse and validate payload
    const payload = JSON.parse(rawBody);
    const validatedData = webhookPayloadSchema.parse(payload);

    // Only process 'published' release actions
    if (validatedData.action !== 'published') {
      return NextResponse.json(
        {
          message: 'Webhook received but action is not "published"',
          action: validatedData.action,
        },
        { status: 200 }
      );
    }

    const { release } = validatedData;

    // Enqueue marketing email job
    await enqueueMarketingEmail({
      releaseVersion: release.tag_name,
      releaseNotes: release.body,
      changelogContent: release.body, // Use release notes as changelog content
    });

    console.log(`✅ Marketing email job enqueued for release ${release.tag_name}`);

    // Return 202 Accepted - webhook received and will be processed
    return NextResponse.json(
      {
        message: 'Webhook received and queued for processing',
        releaseVersion: release.tag_name,
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid webhook payload',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
