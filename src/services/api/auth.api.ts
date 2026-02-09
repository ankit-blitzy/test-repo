/**
 * Authentication API service module.
 * Handles login, registration, logout, and token refresh operations.
 * Currently uses mock implementations for frontend development.
 */

import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types/api.types';
import { delay, generateId } from '@/utils/helpers';

/**
 * Mock user database for development.
 * In production, this will be replaced with actual API calls.
 */
const mockUsers: Array<{
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}> = [
  {
    id: '1',
    email: 'demo@burger.com',
    password: 'Password1',
    firstName: 'Demo',
    lastName: 'User',
    phone: '555-0100',
  },
];

/**
 * Authenticates a user with email and password.
 * @param credentials - Login credentials
 * @returns Promise resolving to auth response with tokens
 */
export async function loginUser(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  await delay(800);

  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
      statusCode: 401,
    };
  }

  return {
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
      accessToken: `mock-access-token-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
      expiresIn: 3600,
    },
    success: true,
    message: 'Login successful',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Registers a new user account.
 * @param data - Registration data
 * @returns Promise resolving to auth response with tokens
 */
export async function registerUser(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  await delay(1000);

  const exists = mockUsers.find((u) => u.email === data.email);
  if (exists) {
    throw {
      code: 'EMAIL_EXISTS',
      message: 'An account with this email already exists',
      statusCode: 409,
    };
  }

  const newUser = {
    id: generateId(),
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  };

  mockUsers.push(newUser);

  return {
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
      },
      accessToken: `mock-access-token-${newUser.id}-${Date.now()}`,
      refreshToken: `mock-refresh-token-${newUser.id}-${Date.now()}`,
      expiresIn: 3600,
    },
    success: true,
    message: 'Registration successful',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Logs the current user out by invalidating the session.
 * @returns Promise resolving when logout is complete
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  await delay(300);

  return {
    data: null,
    success: true,
    message: 'Logout successful',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Refreshes the access token using the refresh token.
 * @param refreshToken - Current refresh token
 * @returns Promise resolving to new auth tokens
 */
export async function refreshAuthToken(
  refreshToken: string
): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>> {
  await delay(300);

  if (!refreshToken.startsWith('mock-refresh-token-')) {
    throw {
      code: 'INVALID_TOKEN',
      message: 'Invalid refresh token',
      statusCode: 401,
    };
  }

  return {
    data: {
      accessToken: `mock-access-token-refreshed-${Date.now()}`,
      refreshToken: `mock-refresh-token-refreshed-${Date.now()}`,
      expiresIn: 3600,
    },
    success: true,
    timestamp: new Date().toISOString(),
  };
}
