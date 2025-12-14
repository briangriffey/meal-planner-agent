import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getJobStatus } from '@/lib/queue';
import { prisma } from '@/lib/db';

/**
 * Get job status for a meal plan generation
 * GET /api/meal-plans/status/[jobId]
 */
export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get job status from queue
    const jobStatus = await getJobStatus(params.jobId);

    if (!jobStatus) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Verify the job belongs to the current user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        jobId: params.jobId,
        userId: session.user.id,
      },
    });

    if (!mealPlan) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Calculate estimated time remaining
    let estimatedTimeRemaining: number | undefined;
    if (jobStatus.status === 'active' && typeof jobStatus.progress === 'number') {
      const progress = jobStatus.progress;
      const estimatedTotal = 120; // 2 minutes total
      const elapsed = (progress / 100) * estimatedTotal;
      estimatedTimeRemaining = Math.max(0, estimatedTotal - elapsed);
    }

    return NextResponse.json({
      jobId: jobStatus.jobId,
      status: jobStatus.status,
      progress: jobStatus.progress || 0,
      estimatedTimeRemaining,
      mealPlanId: mealPlan.id,
      failedReason: jobStatus.failedReason,
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
