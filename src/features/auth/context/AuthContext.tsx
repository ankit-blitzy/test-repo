/**
 * Authentication Context Provider.
 * Manages global authentication state including user session,
 * token persistence in SessionStorage, and auth operations.
 */

import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { AuthContextType, AuthUser } from '../types/auth.types';
import type { LoadingState } from '@/types/common.types';
import { loginUser, registerUser, logoutUser } from '@/services/api/auth.api';
import { STORAGE_KEYS } from '@/utils/constants';
import {
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
} from '@/services/storage/sessionStorage';

/** React context for authentication state */
export const AuthContext = createContext<AuthContextType | null>(null);

/** Props for the AuthProvider component */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Restores user session from SessionStorage on initial load.
 * Returns the user object if a valid token exists.
 */
function restoreSession(): AuthUser | null {
  const token = getSessionStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return null;

  /* Attempt to parse cached user data from session storage */
  const userData = getSessionStorageItem<AuthUser>('auth_user');
  return userData;
}

/**
 * AuthProvider wraps the application to supply authentication state
 * and auth action methods (login, register, logout) via React Context.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => restoreSession());
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  /**
   * Authenticates user with email and password.
   * Stores tokens in SessionStorage and user data in state.
   */
  const login = useCallback(async (email: string, password: string) => {
    setLoadingState('loading');
    setError(null);
    try {
      const response = await loginUser({ email, password });
      const { user: authUser, accessToken, refreshToken } = response.data;
      setSessionStorageItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      setSessionStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setSessionStorageItem('auth_user', authUser);
      setUser(authUser);
      setLoadingState('success');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Login failed. Please try again.';
      setError(message);
      setLoadingState('error');
      throw err;
    }
  }, []);

  /**
   * Registers a new user account and auto-logs them in.
   */
  const register = useCallback(
    async (firstName: string, lastName: string, email: string, password: string, phone?: string) => {
      setLoadingState('loading');
      setError(null);
      try {
        const response = await registerUser({ firstName, lastName, email, password, phone });
        const { user: authUser, accessToken, refreshToken } = response.data;
        setSessionStorageItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        setSessionStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        setSessionStorageItem('auth_user', authUser);
        setUser(authUser);
        setLoadingState('success');
      } catch (err: unknown) {
        const message = err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Registration failed. Please try again.';
        setError(message);
        setLoadingState('error');
        throw err;
      }
    },
    []
  );

  /**
   * Logs the current user out and clears all session data.
   */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      removeSessionStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      removeSessionStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
      removeSessionStorageItem('auth_user');
      setUser(null);
      setLoadingState('idle');
      setError(null);
    }
  }, []);

  /** Clears the current error state */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      loadingState,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, isAuthenticated, loadingState, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
