/**
 * Mock authentication handlers for MSW (Mock Service Worker)
 *
 * These handlers bypass NextAuth and return mock session data
 * for testing and development without a real authentication backend.
 */

import { http, HttpResponse } from "msw";
import {
  mockUsers,
  getMockUserByEmail,
  mockUserExists,
  type MockUser,
} from "../data/users";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Mock session data structure
 */
interface MockSession {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
  expires: string;
}

/**
 * Generate mock session from user
 */
function generateMockSession(user: MockUser): MockSession {
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 30); // 30 days from now

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
    expires: expiresDate.toISOString(),
  };
}

/**
 * Store for active sessions (in-memory for mock purposes)
 */
const activeSessions = new Map<string, MockSession>();

export const authHandlers = [
  /**
   * POST /api/auth/register
   * Handle user registration
   */
  http.post(`${BASE_URL}/api/auth/register`, async ({ request }) => {
    try {
      const body = (await request.json()) as {
        email: string;
        password: string;
        name?: string;
      };

      // Validate request body
      if (!body.email || !body.password) {
        return HttpResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      // Check if user already exists
      if (mockUserExists(body.email)) {
        return HttpResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      // In a real scenario, we'd create a new user
      // For mocking, we'll just return success
      return HttpResponse.json(
        {
          message: "User registered successfully",
          user: {
            email: body.email,
            name: body.name || null,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),

  /**
   * POST /api/auth/callback/credentials
   * Handle credential-based login (email/password)
   */
  http.post(`${BASE_URL}/api/auth/callback/credentials`, async ({ request }) => {
    try {
      const body = (await request.json()) as {
        email: string;
        password: string;
      };

      // Validate request body
      if (!body.email || !body.password) {
        return HttpResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      // Find user by email
      const user = getMockUserByEmail(body.email);

      if (!user) {
        return HttpResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // In mock mode, accept "Password123!" for all users
      if (body.password !== "Password123!") {
        return HttpResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Generate session
      const session = generateMockSession(user);
      activeSessions.set(user.email, session);

      return HttpResponse.json(
        {
          url: `${BASE_URL}/dashboard`,
          session,
        },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }),

  /**
   * GET /api/auth/session
   * Get current session
   */
  http.get(`${BASE_URL}/api/auth/session`, ({ request }) => {
    // Check for session in cookies or headers
    const authHeader = request.headers.get("authorization");
    const sessionEmail = authHeader?.replace("Bearer ", "") || "brian@test.com";

    const session = activeSessions.get(sessionEmail);

    if (session) {
      return HttpResponse.json(session, { status: 200 });
    }

    // Default to brian@test.com for development convenience
    const defaultUser = getMockUserByEmail("brian@test.com");
    if (defaultUser) {
      const defaultSession = generateMockSession(defaultUser);
      activeSessions.set(defaultUser.email, defaultSession);
      return HttpResponse.json(defaultSession, { status: 200 });
    }

    return HttpResponse.json({ user: null, expires: null }, { status: 200 });
  }),

  /**
   * POST /api/auth/signout
   * Sign out current user
   */
  http.post(`${BASE_URL}/api/auth/signout`, ({ request }) => {
    const authHeader = request.headers.get("authorization");
    const sessionEmail = authHeader?.replace("Bearer ", "");

    if (sessionEmail) {
      activeSessions.delete(sessionEmail);
    }

    return HttpResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    );
  }),

  /**
   * GET /api/auth/csrf
   * Get CSRF token (required by NextAuth)
   */
  http.get(`${BASE_URL}/api/auth/csrf`, () => {
    return HttpResponse.json(
      { csrfToken: "mock-csrf-token-" + Date.now() },
      { status: 200 }
    );
  }),

  /**
   * GET /api/auth/providers
   * Get available auth providers
   */
  http.get(`${BASE_URL}/api/auth/providers`, () => {
    return HttpResponse.json(
      {
        credentials: {
          id: "credentials",
          name: "Credentials",
          type: "credentials",
          signinUrl: `${BASE_URL}/api/auth/callback/credentials`,
          callbackUrl: `${BASE_URL}/api/auth/callback/credentials`,
        },
      },
      { status: 200 }
    );
  }),
];

/**
 * Helper function to get current mock session (for testing)
 */
export function getCurrentMockSession(email: string): MockSession | undefined {
  return activeSessions.get(email);
}

/**
 * Helper function to clear all sessions (for testing)
 */
export function clearMockSessions(): void {
  activeSessions.clear();
}

export default authHandlers;
