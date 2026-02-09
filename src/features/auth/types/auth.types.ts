/**
 * Authentication feature type definitions.
 * Defines types for user state, auth context, and auth operations.
 */

import type { LoadingState } from '@/types/common.types';

/** Authenticated user data */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

/** Authentication state managed by AuthContext */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loadingState: LoadingState;
  error: string | null;
}

/** Authentication context value exposed to consumers */
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
