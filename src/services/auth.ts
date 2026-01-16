/**
 * @fileoverview Authentication service module for the Burger House restaurant application.
 * Handles user login, registration, and session management with mock API functions
 * using localStorage simulation for demo purposes.
 *
 * @module services/auth
 * @version 1.0.0
 */

import type { User, LoginCredentials, RegisterData } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * LocalStorage key for storing the authentication token.
 * Used for session persistence across browser sessions.
 */
const AUTH_TOKEN_KEY = 'burger_house_auth_token';

/**
 * LocalStorage key for storing the current user data.
 * Stores serialized User object for quick access without token validation.
 */
const USER_STORAGE_KEY = 'burger_house_user';

/**
 * Minimum delay for simulated network requests (in milliseconds).
 * Provides realistic async behavior for demo purposes.
 */
const MIN_NETWORK_DELAY = 500;

/**
 * Maximum delay for simulated network requests (in milliseconds).
 * Combined with MIN_NETWORK_DELAY to create variable latency.
 */
const MAX_NETWORK_DELAY = 1500;

// =============================================================================
// MOCK DATA STORAGE
// =============================================================================

/**
 * Interface for internal mock user storage including password.
 * Used only within this module for authentication validation.
 */
interface MockUserData {
  user: User;
  password: string;
}

/**
 * In-memory storage for mock users.
 * Simulates a database for demo authentication purposes.
 * Keyed by email address for quick lookup during login.
 */
const mockUsers: Map<string, MockUserData> = new Map();

/**
 * Initialize mock users with demo account.
 * Provides a pre-configured user for testing and demonstration.
 */
const initializeMockUsers = (): void => {
  const demoUser: User = {
    id: '1',
    email: 'demo@burgerhouse.com',
    name: 'Demo User',
    phone: '555-123-4567',
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  mockUsers.set(demoUser.email, {
    user: demoUser,
    password: 'demo123',
  });
};

// Initialize demo user on module load
initializeMockUsers();

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generates a simulated network delay.
 * Returns a random value between MIN_NETWORK_DELAY and MAX_NETWORK_DELAY.
 *
 * @returns Random delay in milliseconds
 */
const getNetworkDelay = (): number => {
  return Math.floor(Math.random() * (MAX_NETWORK_DELAY - MIN_NETWORK_DELAY + 1)) + MIN_NETWORK_DELAY;
};

/**
 * Simulates network latency by returning a Promise that resolves after a random delay.
 * Used to provide realistic async behavior for mock API calls.
 *
 * @returns Promise that resolves after the simulated delay
 */
const simulateNetworkDelay = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, getNetworkDelay());
  });
};

/**
 * Generates a mock JWT-like authentication token.
 * Creates a base64-encoded string containing user ID and timestamp.
 * Note: This is NOT a real JWT - for demo purposes only.
 *
 * @param userId - The user's unique identifier
 * @returns Base64-encoded mock token string
 */
const generateToken = (userId: string): string => {
  const payload = {
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  };
  // Simulate JWT structure with base64 encoding
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(`mock_signature_${userId}_${Date.now()}`);
  return `${header}.${body}.${signature}`;
};

/**
 * Validates email format using a basic regex pattern.
 * Checks for standard email structure: local@domain.tld
 *
 * @param email - The email address to validate
 * @returns True if email format is valid, false otherwise
 */
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength requirements.
 * Currently requires minimum 6 characters.
 *
 * @param password - The password to validate
 * @returns True if password meets requirements, false otherwise
 */
const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Safely checks if localStorage is available.
 * Handles cases where localStorage might be disabled or unavailable.
 *
 * @returns True if localStorage is available, false otherwise
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Stores authentication data in localStorage.
 * Saves both the auth token and user data for session persistence.
 *
 * @param token - The authentication token to store
 * @param user - The user object to store
 */
const storeAuthData = (token: string, user: User): void => {
  if (isLocalStorageAvailable()) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
};

/**
 * Clears all authentication data from localStorage.
 * Used during logout to remove session information.
 */
const clearAuthData = (): void => {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

/**
 * Generates a unique user ID.
 * Creates a string combining timestamp and random number for uniqueness.
 *
 * @returns Unique user ID string
 */
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// =============================================================================
// EXPORTED SERVICE FUNCTIONS
// =============================================================================

/**
 * Authenticates a user with email and password credentials.
 * Validates credentials against mock user storage and generates a session token.
 *
 * @param credentials - The login credentials (email and password)
 * @returns Promise resolving to user object and authentication token
 * @throws Error if email format is invalid
 * @throws Error if credentials don't match any registered user
 *
 * @example
 * ```typescript
 * const { user, token } = await login({
 *   email: 'demo@burgerhouse.com',
 *   password: 'demo123'
 * });
 * ```
 */
export async function login(
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> {
  // Simulate network delay for realistic async behavior
  await simulateNetworkDelay();

  // Validate email format
  if (!validateEmail(credentials.email)) {
    throw new Error('Invalid email format');
  }

  // Validate password is provided
  if (!credentials.password || credentials.password.trim().length === 0) {
    throw new Error('Password is required');
  }

  // Look up user by email
  const userData = mockUsers.get(credentials.email.toLowerCase().trim());

  // Validate credentials
  if (!userData || userData.password !== credentials.password) {
    throw new Error('Invalid email or password');
  }

  // Generate authentication token
  const token = generateToken(userData.user.id);

  // Store authentication data for session persistence
  storeAuthData(token, userData.user);

  // Return user object (without password) and token
  return {
    user: userData.user,
    token,
  };
}

/**
 * Registers a new user with the provided information.
 * Creates a new account, validates input, and automatically logs in the user.
 *
 * @param data - The registration data (email, password, name, optional phone)
 * @returns Promise resolving to new user object and authentication token
 * @throws Error if email format is invalid
 * @throws Error if password doesn't meet strength requirements
 * @throws Error if email is already registered
 *
 * @example
 * ```typescript
 * const { user, token } = await register({
 *   email: 'newuser@example.com',
 *   password: 'securepass123',
 *   name: 'New User',
 *   phone: '555-987-6543'
 * });
 * ```
 */
export async function register(
  data: RegisterData
): Promise<{ user: User; token: string }> {
  // Simulate network delay for realistic async behavior
  await simulateNetworkDelay();

  // Validate email format
  if (!validateEmail(data.email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  if (!validatePassword(data.password)) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Validate name is provided
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Name is required');
  }

  // Normalize email for storage
  const normalizedEmail = data.email.toLowerCase().trim();

  // Check for duplicate email
  if (mockUsers.has(normalizedEmail)) {
    throw new Error('Email already registered');
  }

  // Create new user object
  const newUser: User = {
    id: generateUserId(),
    email: normalizedEmail,
    name: data.name.trim(),
    phone: data.phone?.trim() || undefined,
    createdAt: new Date(),
  };

  // Store user in mock database
  mockUsers.set(normalizedEmail, {
    user: newUser,
    password: data.password,
  });

  // Generate authentication token
  const token = generateToken(newUser.id);

  // Store authentication data for session persistence (auto-login)
  storeAuthData(token, newUser);

  // Return new user object and token
  return {
    user: newUser,
    token,
  };
}

/**
 * Logs out the current user by clearing all authentication data.
 * Removes token and user data from localStorage.
 *
 * @returns Promise that resolves when logout is complete
 *
 * @example
 * ```typescript
 * await logout();
 * // User is now logged out, token removed
 * ```
 */
export async function logout(): Promise<void> {
  // Simulate brief network delay
  await simulateNetworkDelay();

  // Clear all authentication data
  clearAuthData();
}

/**
 * Retrieves the currently authenticated user from session storage.
 * Returns null if no valid session exists.
 *
 * @returns Promise resolving to the current User object or null if not authenticated
 *
 * @example
 * ```typescript
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log(`Logged in as ${user.name}`);
 * } else {
 *   console.log('Not logged in');
 * }
 * ```
 */
export async function getCurrentUser(): Promise<User | null> {
  // Simulate brief network delay for consistency
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    return null;
  }

  // Check for valid auth token
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }

  // Retrieve stored user data
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) {
    return null;
  }

  try {
    // Parse and return user object
    const user: User = JSON.parse(storedUser);

    // Convert createdAt string back to Date if needed
    if (typeof user.createdAt === 'string') {
      user.createdAt = new Date(user.createdAt);
    }

    return user;
  } catch {
    // Clear corrupted data
    clearAuthData();
    return null;
  }
}

/**
 * Synchronously checks if a user is currently authenticated.
 * Verifies the presence of a valid auth token in localStorage.
 * Use this for quick authentication checks without async overhead.
 *
 * @returns True if a valid auth token exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isAuthenticated()) {
 *   // Show user dashboard
 * } else {
 *   // Redirect to login
 * }
 * ```
 */
export function isAuthenticated(): boolean {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    return false;
  }

  // Check for presence of auth token
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return false;
  }

  // Basic token validation (check if it looks like our mock JWT format)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Decode and check expiration
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now()) {
      // Token expired, clear auth data
      clearAuthData();
      return false;
    }

    return true;
  } catch {
    // Invalid token format
    return false;
  }
}

/**
 * Retrieves the current authentication token from localStorage.
 * Returns null if no token exists or if localStorage is unavailable.
 *
 * @returns The current auth token string or null if not authenticated
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * if (token) {
 *   // Include token in API request headers
 *   headers.Authorization = `Bearer ${token}`;
 * }
 * ```
 */
export function getAuthToken(): string | null {
  // Check if localStorage is available
  if (!isLocalStorageAvailable()) {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
}
