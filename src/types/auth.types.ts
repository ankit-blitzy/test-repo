/**
 * Authentication Type Definitions
 * Defines interfaces for user authentication and session management
 */

/**
 * User role enum
 */
export type UserRole = 'customer' | 'staff' | 'admin';

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User session information
 */
export interface Session {
  userId: string;
  token: string;
  expiresAt: Date;
}

/**
 * Auth state interface for Zustand store
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth actions interface for Zustand store
 */
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkSession: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

/**
 * Combined Auth store type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/**
 * Update profile request payload
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/**
 * Auth API response
 */
export interface AuthAPIResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresAt: string;
  };
  message?: string;
}
