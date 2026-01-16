/**
 * @fileoverview Authentication service unit tests for the Burger House restaurant application.
 * Contains 4 Vitest tests covering user registration validation, login credential verification,
 * invalid credential rejection, and session/token management.
 *
 * @module test/auth
 * @version 1.0.0
 *
 * Test Coverage:
 * - Test 1: User registration with password validation
 * - Test 2: User login with credential verification
 * - Test 3: Invalid credential rejection
 * - Test 4: Session management (authentication state tracking)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
} from '../services/auth';
import type { User, RegisterData, LoginCredentials } from '../types';

// =============================================================================
// AUTH SERVICE TEST SUITE
// =============================================================================

describe('Auth Service', () => {
  /**
   * Setup hook that runs before each test.
   * Clears localStorage and resets mocks to ensure test isolation.
   * Note: localStorage.clear() is also handled in setup.ts afterEach,
   * but we clear here as well for explicit test isolation.
   */
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();
    // Reset any mocks to ensure test isolation
    vi.clearAllMocks();
  });

  // ===========================================================================
  // TEST 1: User Registration with Password Validation
  // ===========================================================================

  describe('register', () => {
    it('should register a new user with valid data', async () => {
      // Arrange: Prepare valid registration data
      const userData: RegisterData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Act: Attempt to register the user
      const result = await register(userData);

      // Assert: Verify the registration was successful
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email.toLowerCase());
      expect(result.user.name).toBe(userData.name);
      expect(result.user.id).toBeDefined();
      expect(typeof result.user.id).toBe('string');
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      // Verify token has JWT-like structure (3 parts separated by dots)
      expect(result.token.split('.').length).toBe(3);
    });

    it('should throw error for invalid email format', async () => {
      // Arrange: Prepare registration data with invalid email
      const userData: RegisterData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      // Act & Assert: Verify registration fails with appropriate error
      await expect(register(userData)).rejects.toThrow('Invalid email format');
    });

    it('should throw error for password less than 6 characters', async () => {
      // Arrange: Prepare registration data with weak password
      const userData: RegisterData = {
        email: 'test@example.com',
        password: '12345', // Only 5 characters
        name: 'Test User',
      };

      // Act & Assert: Verify registration fails with password validation error
      await expect(register(userData)).rejects.toThrow(
        'Password must be at least 6 characters long'
      );
    });

    it('should throw error when name is empty', async () => {
      // Arrange: Prepare registration data with empty name
      const userData: RegisterData = {
        email: 'test@example.com',
        password: 'password123',
        name: '',
      };

      // Act & Assert: Verify registration fails when name is missing
      await expect(register(userData)).rejects.toThrow('Name is required');
    });

    it('should throw error if email is already registered', async () => {
      // Arrange: Register a user first
      const userData: RegisterData = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'First User',
      };

      await register(userData);

      // Act & Assert: Verify second registration with same email fails
      const duplicateUser: RegisterData = {
        email: 'duplicate@example.com',
        password: 'differentpassword',
        name: 'Second User',
      };

      await expect(register(duplicateUser)).rejects.toThrow(
        'Email already registered'
      );
    });

    it('should store user data in localStorage after registration', async () => {
      // Arrange: Prepare registration data
      const userData: RegisterData = {
        email: 'storage@example.com',
        password: 'password123',
        name: 'Storage Test User',
      };

      // Act: Register the user
      await register(userData);

      // Assert: Verify data is stored in localStorage
      const storedToken = localStorage.getItem('burger_house_auth_token');
      const storedUser = localStorage.getItem('burger_house_user');

      expect(storedToken).toBeDefined();
      expect(storedToken).not.toBeNull();
      expect(storedUser).toBeDefined();
      expect(storedUser).not.toBeNull();

      // Verify stored user data is correct
      const parsedUser: User = JSON.parse(storedUser as string);
      expect(parsedUser.email).toBe(userData.email.toLowerCase());
      expect(parsedUser.name).toBe(userData.name);
    });
  });

  // ===========================================================================
  // TEST 2: User Login with Credential Verification
  // ===========================================================================

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange: First register a user
      const registerData: RegisterData = {
        email: 'login@example.com',
        password: 'password123',
        name: 'Login User',
      };
      await register(registerData);

      // Clear localStorage to simulate a fresh session
      localStorage.clear();

      // Act: Attempt login with valid credentials
      const credentials: LoginCredentials = {
        email: 'login@example.com',
        password: 'password123',
      };
      const result = await login(credentials);

      // Assert: Verify login was successful
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(credentials.email.toLowerCase());
      expect(result.user.name).toBe(registerData.name);
      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
    });

    it('should login successfully with demo account', async () => {
      // Arrange: Use demo credentials that are pre-configured
      const credentials: LoginCredentials = {
        email: 'demo@burgerhouse.com',
        password: 'demo123',
      };

      // Act: Attempt login
      const result = await login(credentials);

      // Assert: Verify login was successful with demo user
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('demo@burgerhouse.com');
      expect(result.user.name).toBe('Demo User');
      expect(result.token).toBeDefined();
    });

    it('should normalize email to lowercase during login', async () => {
      // Arrange: Register a user with lowercase email
      const registerData: RegisterData = {
        email: 'casesensitive@example.com',
        password: 'password123',
        name: 'Case Test User',
      };
      await register(registerData);
      localStorage.clear();

      // Act: Login with uppercase email variation
      const credentials: LoginCredentials = {
        email: 'CASESENSITIVE@EXAMPLE.COM',
        password: 'password123',
      };

      // Assert: Login should fail because email is case-sensitive in storage lookup
      // (The service normalizes email, but lookup is exact match)
      // Actually, looking at auth.ts, email is lowercased and trimmed during lookup
      // So this should work
      const result = await login(credentials);
      expect(result.user.email).toBe('casesensitive@example.com');
    });

    it('should store auth data in localStorage after login', async () => {
      // Arrange: Register a user first
      const registerData: RegisterData = {
        email: 'loginstore@example.com',
        password: 'password123',
        name: 'Login Store User',
      };
      await register(registerData);
      localStorage.clear();

      // Act: Login
      const credentials: LoginCredentials = {
        email: 'loginstore@example.com',
        password: 'password123',
      };
      await login(credentials);

      // Assert: Verify localStorage contains auth data
      const storedToken = localStorage.getItem('burger_house_auth_token');
      const storedUser = localStorage.getItem('burger_house_user');

      expect(storedToken).not.toBeNull();
      expect(storedUser).not.toBeNull();
    });
  });

  // ===========================================================================
  // TEST 3: Invalid Credential Rejection
  // ===========================================================================

  describe('login with invalid credentials', () => {
    it('should reject invalid credentials with error', async () => {
      // Arrange: Prepare invalid credentials (no user registered)
      const credentials: LoginCredentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      // Act & Assert: Verify login is rejected
      await expect(login(credentials)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should reject login with wrong password for existing user', async () => {
      // Arrange: Register a user first
      const registerData: RegisterData = {
        email: 'wrongpass@example.com',
        password: 'correctpassword',
        name: 'Wrong Pass User',
      };
      await register(registerData);
      localStorage.clear();

      // Act & Assert: Try to login with wrong password
      const credentials: LoginCredentials = {
        email: 'wrongpass@example.com',
        password: 'incorrectpassword',
      };

      await expect(login(credentials)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should reject login with invalid email format', async () => {
      // Arrange: Prepare credentials with invalid email format
      const credentials: LoginCredentials = {
        email: 'not-an-email',
        password: 'password123',
      };

      // Act & Assert: Verify login is rejected due to email format
      await expect(login(credentials)).rejects.toThrow('Invalid email format');
    });

    it('should reject login with empty password', async () => {
      // Arrange: Prepare credentials with empty password
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: '',
      };

      // Act & Assert: Verify login is rejected
      await expect(login(credentials)).rejects.toThrow('Password is required');
    });

    it('should reject login with whitespace-only password', async () => {
      // Arrange: Prepare credentials with whitespace password
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: '   ',
      };

      // Act & Assert: Verify login is rejected
      await expect(login(credentials)).rejects.toThrow('Password is required');
    });
  });

  // ===========================================================================
  // TEST 4: Session/Token Management
  // ===========================================================================

  describe('session management', () => {
    it('should track authentication state correctly', async () => {
      // Initially not authenticated
      expect(isAuthenticated()).toBe(false);

      // Arrange: Register a user (which also logs them in)
      const registerData: RegisterData = {
        email: 'session@example.com',
        password: 'password123',
        name: 'Session User',
      };
      await register(registerData);

      // Assert: After registration, should be authenticated
      expect(isAuthenticated()).toBe(true);

      // Act: Logout
      await logout();

      // Assert: After logout, should not be authenticated
      expect(isAuthenticated()).toBe(false);
    });

    it('should return current user after login', async () => {
      // Arrange: Register and login
      const registerData: RegisterData = {
        email: 'currentuser@example.com',
        password: 'password123',
        name: 'Current User',
      };
      await register(registerData);

      // Act: Get current user
      const currentUser = await getCurrentUser();

      // Assert: Verify current user matches registration data
      expect(currentUser).not.toBeNull();
      expect(currentUser?.email).toBe(registerData.email.toLowerCase());
      expect(currentUser?.name).toBe(registerData.name);
      expect(currentUser?.id).toBeDefined();
    });

    it('should return null for getCurrentUser when not authenticated', async () => {
      // Ensure localStorage is clear (no authentication)
      localStorage.clear();

      // Act: Get current user
      const currentUser = await getCurrentUser();

      // Assert: Should return null
      expect(currentUser).toBeNull();
    });

    it('should clear authentication data on logout', async () => {
      // Arrange: Register a user
      const registerData: RegisterData = {
        email: 'logout@example.com',
        password: 'password123',
        name: 'Logout User',
      };
      await register(registerData);

      // Verify auth data exists before logout
      expect(localStorage.getItem('burger_house_auth_token')).not.toBeNull();
      expect(localStorage.getItem('burger_house_user')).not.toBeNull();

      // Act: Logout
      await logout();

      // Assert: Verify auth data is cleared
      expect(localStorage.getItem('burger_house_auth_token')).toBeNull();
      expect(localStorage.getItem('burger_house_user')).toBeNull();
    });

    it('should return false for isAuthenticated when token is invalid', async () => {
      // Arrange: Set an invalid token in localStorage
      localStorage.setItem('burger_house_auth_token', 'invalid-token-format');

      // Act & Assert: Should not be authenticated with invalid token
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false for isAuthenticated when token is expired', async () => {
      // Arrange: Create an expired token (manually craft a token with past expiration)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const expiredPayload = btoa(
        JSON.stringify({
          sub: 'user_123',
          iat: Date.now() - 10000, // Issued 10 seconds ago
          exp: Date.now() - 5000, // Expired 5 seconds ago
        })
      );
      const signature = btoa('mock_signature');
      const expiredToken = `${header}.${expiredPayload}.${signature}`;

      localStorage.setItem('burger_house_auth_token', expiredToken);

      // Act & Assert: Should not be authenticated with expired token
      expect(isAuthenticated()).toBe(false);
    });

    it('should maintain session across login-logout-login cycle', async () => {
      // Arrange: Register first user
      const user1Data: RegisterData = {
        email: 'user1@example.com',
        password: 'password123',
        name: 'User One',
      };
      await register(user1Data);

      // Verify first user is authenticated
      expect(isAuthenticated()).toBe(true);
      let currentUser = await getCurrentUser();
      expect(currentUser?.email).toBe('user1@example.com');

      // Act: Logout
      await logout();

      // Verify logged out
      expect(isAuthenticated()).toBe(false);
      currentUser = await getCurrentUser();
      expect(currentUser).toBeNull();

      // Act: Login as demo user
      await login({
        email: 'demo@burgerhouse.com',
        password: 'demo123',
      });

      // Assert: Demo user is now authenticated
      expect(isAuthenticated()).toBe(true);
      currentUser = await getCurrentUser();
      expect(currentUser?.email).toBe('demo@burgerhouse.com');
      expect(currentUser?.name).toBe('Demo User');
    });
  });
});
