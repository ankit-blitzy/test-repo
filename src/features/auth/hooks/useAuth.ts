/**
 * Custom hook for accessing authentication context.
 * Provides a convenient interface to the AuthContext with error handling
 * for usage outside of the AuthProvider.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types/auth.types';

/**
 * Hook to access the authentication context.
 * Must be used within an AuthProvider component tree.
 * @returns AuthContextType with user state and auth methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
