/**
 * Mock user data for testing
 *
 * Passwords for all users: "Password123!"
 * Hashed using bcrypt with 10 rounds
 */

export interface MockUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

// bcrypt hash of "Password123!" with 10 rounds
const COMMON_PASSWORD_HASH = "$2a$10$XqKVvYhVjZlXvZ8YqKVvYOXqKVvYhVjZlXvZ8YqKVvYOXqKVvYhVj";

export const mockUsers: MockUser[] = [
  {
    id: "user-brian-001",
    email: "brian@test.com",
    name: "Brian Test",
    emailVerified: new Date("2024-01-15T10:00:00Z"),
    image: null,
    hashedPassword: COMMON_PASSWORD_HASH,
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: "user-allison-002",
    email: "allison@test.com",
    name: "Allison Test",
    emailVerified: new Date("2024-06-20T14:30:00Z"),
    image: null,
    hashedPassword: COMMON_PASSWORD_HASH,
    createdAt: new Date("2024-06-20T14:30:00Z"),
    updatedAt: new Date("2024-06-20T14:30:00Z"),
  },
  {
    id: "user-newuser-003",
    email: "newuser@test.com",
    name: "New User",
    emailVerified: new Date("2025-12-01T09:00:00Z"),
    image: null,
    hashedPassword: COMMON_PASSWORD_HASH,
    createdAt: new Date("2025-12-01T09:00:00Z"),
    updatedAt: new Date("2025-12-01T09:00:00Z"),
  },
];

/**
 * Get user by email
 */
export function getMockUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((user) => user.email === email);
}

/**
 * Get user by ID
 */
export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Check if user exists
 */
export function mockUserExists(email: string): boolean {
  return mockUsers.some((user) => user.email === email);
}
