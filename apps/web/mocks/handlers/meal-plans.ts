/**
 * Mock meal plan API handlers for MSW (Mock Service Worker)
 *
 * These handlers provide mock responses for meal plan endpoints
 * for testing and development without a real backend.
 */

import { http, HttpResponse, delay } from "msw";
import {
  mockMealPlans,
  getMockMealPlansByUserId,
  getMockMealPlanById,
  getMockMealRecordsByPlanId,
  type MockMealPlan,
  type MockMealRecord,
} from "../data/meal-plans";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * In-memory storage for meal plans (for testing)
 */
const mealPlansStore = new Map<string, MockMealPlan>(
  mockMealPlans.map((plan) => [plan.id, { ...plan }])
);

/**
 * Job status tracking for generation
 */
const jobStatusStore = new Map<
  string,
  {
    status: string;
    mealPlanId?: string;
    error?: string;
  }
>();

/**
 * Generate a unique ID
 */
function generateId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}`;
}

export const mealPlanHandlers = [
  /**
   * POST /api/meal-plans/generate
   * Generate a new meal plan (creates job)
   */
  http.post(`${BASE_URL}/api/meal-plans/generate`, async ({ request }) => {
    try {
      // Extract user ID from auth header
      const authHeader = request.headers.get("authorization");
      const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

      const body = (await request.json()) as {
        weekStartDate?: string;
      };

      const weekStartDate = body.weekStartDate
        ? new Date(body.weekStartDate)
        : new Date();

      // Create job ID
      const jobId = generateId("job");

      // Simulate job creation
      jobStatusStore.set(jobId, {
        status: "pending",
      });

      // Simulate async processing (in real app, BullMQ would handle this)
      setTimeout(() => {
        const mealPlanId = generateId("plan");

        // Create new meal plan with PROCESSING status
        const newMealPlan: MockMealPlan = {
          id: mealPlanId,
          userId,
          status: "PROCESSING",
          weekStartDate,
          generatedAt: null,
          claudeModel: null,
          iterationCount: null,
          emailSent: false,
          error: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mealPlansStore.set(mealPlanId, newMealPlan);

        // Update job status
        jobStatusStore.set(jobId, {
          status: "processing",
          mealPlanId,
        });

        // Simulate completion after 3 seconds
        setTimeout(() => {
          const plan = mealPlansStore.get(mealPlanId);
          if (plan) {
            plan.status = "COMPLETED";
            plan.generatedAt = new Date();
            plan.claudeModel = "claude-3-5-sonnet-20241022";
            plan.iterationCount = 1;
            plan.updatedAt = new Date();
            mealPlansStore.set(mealPlanId, plan);

            jobStatusStore.set(jobId, {
              status: "completed",
              mealPlanId,
            });
          }
        }, 3000);
      }, 500);

      return HttpResponse.json(
        {
          message: "Meal plan generation started",
          jobId,
        },
        { status: 202 }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),

  /**
   * GET /api/meal-plans/status/:jobId
   * Get status of a meal plan generation job
   */
  http.get(`${BASE_URL}/api/meal-plans/status/:jobId`, ({ params }) => {
    const { jobId } = params;

    const jobStatus = jobStatusStore.get(jobId as string);

    if (!jobStatus) {
      return HttpResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return HttpResponse.json(jobStatus, { status: 200 });
  }),

  /**
   * GET /api/meal-plans
   * Get all meal plans for current user
   */
  http.get(`${BASE_URL}/api/meal-plans`, ({ request }) => {
    // Extract user ID from auth header
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const status = url.searchParams.get("status");

    // Get user's meal plans
    let userPlans = Array.from(mealPlansStore.values()).filter(
      (plan) => plan.userId === userId
    );

    // Filter by status if provided
    if (status) {
      userPlans = userPlans.filter((plan) => plan.status === status);
    }

    // Sort by created date (newest first)
    userPlans.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply limit
    userPlans = userPlans.slice(0, limit);

    return HttpResponse.json(
      {
        mealPlans: userPlans,
        total: userPlans.length,
      },
      { status: 200 }
    );
  }),

  /**
   * GET /api/meal-plans/:id
   * Get a specific meal plan by ID
   */
  http.get(`${BASE_URL}/api/meal-plans/:id`, ({ params, request }) => {
    const { id } = params;

    // Extract user ID from auth header
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

    const mealPlan = mealPlansStore.get(id as string);

    if (!mealPlan) {
      return HttpResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Check if user owns this meal plan
    if (mealPlan.userId !== userId) {
      return HttpResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Include meal records if plan is completed
    const response = {
      ...mealPlan,
      mealRecords:
        mealPlan.status === "COMPLETED" ? mealPlan.mealRecords || [] : [],
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  /**
   * DELETE /api/meal-plans/:id
   * Delete a meal plan
   */
  http.delete(`${BASE_URL}/api/meal-plans/:id`, ({ params, request }) => {
    const { id } = params;

    // Extract user ID from auth header
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

    const mealPlan = mealPlansStore.get(id as string);

    if (!mealPlan) {
      return HttpResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Check if user owns this meal plan
    if (mealPlan.userId !== userId) {
      return HttpResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete from store
    mealPlansStore.delete(id as string);

    return HttpResponse.json(
      { message: "Meal plan deleted successfully" },
      { status: 200 }
    );
  }),

  /**
   * GET /api/meal-plans/:id/meals
   * Get meal records for a specific meal plan
   */
  http.get(`${BASE_URL}/api/meal-plans/:id/meals`, ({ params, request }) => {
    const { id } = params;

    // Extract user ID from auth header
    const authHeader = request.headers.get("authorization");
    const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

    const mealPlan = mealPlansStore.get(id as string);

    if (!mealPlan) {
      return HttpResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Check if user owns this meal plan
    if (mealPlan.userId !== userId) {
      return HttpResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Return meal records
    const mealRecords = mealPlan.mealRecords || [];

    return HttpResponse.json(
      {
        mealRecords,
        total: mealRecords.length,
      },
      { status: 200 }
    );
  }),

  /**
   * GET /api/meal-plans/:planId/meals/:mealId
   * Get a specific meal record
   */
  http.get(
    `${BASE_URL}/api/meal-plans/:planId/meals/:mealId`,
    ({ params, request }) => {
      const { planId, mealId } = params;

      // Extract user ID from auth header
      const authHeader = request.headers.get("authorization");
      const userId = authHeader?.replace("Bearer user-", "") || "user-brian-001";

      const mealPlan = mealPlansStore.get(planId as string);

      if (!mealPlan) {
        return HttpResponse.json(
          { error: "Meal plan not found" },
          { status: 404 }
        );
      }

      // Check if user owns this meal plan
      if (mealPlan.userId !== userId) {
        return HttpResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Find meal record
      const mealRecord = mealPlan.mealRecords?.find(
        (meal) => meal.id === mealId
      );

      if (!mealRecord) {
        return HttpResponse.json(
          { error: "Meal record not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(mealRecord, { status: 200 });
    }
  ),
];

/**
 * Helper function to get meal plan from store (for testing)
 */
export function getMockMealPlanFromStore(id: string): MockMealPlan | undefined {
  return mealPlansStore.get(id);
}

/**
 * Helper function to add meal plan to store (for testing)
 */
export function addMockMealPlanToStore(plan: MockMealPlan): void {
  mealPlansStore.set(plan.id, plan);
}

/**
 * Helper function to reset meal plans store (for testing)
 */
export function resetMealPlansStore(): void {
  mealPlansStore.clear();
  jobStatusStore.clear();
  mockMealPlans.forEach((plan) => {
    mealPlansStore.set(plan.id, { ...plan });
  });
}

export default mealPlanHandlers;
