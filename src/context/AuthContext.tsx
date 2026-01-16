/**
 * @fileoverview React Context provider for authentication state management.
 * Manages user session state, provides login, logout, and register functions.
 * Integrates with auth service for API calls and persists authentication state
 * using localStorage.
 *
 * @module context/AuthContext
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Wrap your app with AuthProvider
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * // Use the useAuth hook in components
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

import type { User, LoginCredentials, RegisterData } from '../types';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
} from '../services/auth';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Shape of the authentication context value.
 * Provides all authentication state and methods to consuming components.
 */
export interface AuthContextType {
  /**
   * The currently authenticated user, or null if not logged in.
   */
  user: User | null;

  /**
   * Indicates whether the user is currently authenticated.
   * Computed from user state (user !== null).
   */
  isAuthenticated: boolean;

  /**
   * Indicates whether an authentication operation is in progress.
   * True during initial auth check on mount and during login/register/logout.
   */
  isLoading: boolean;

  /**
   * Error message from the last failed authentication operation.
   * Null when there are no errors.
   */
  error: string | null;

  /**
   * Authenticates a user with the provided credentials.
   * On success, updates user state and persists session.
   * On failure, sets error state with the failure message.
   *
   * @param credentials - The login credentials (email and password)
   * @returns Promise that resolves when login completes
   */
  login: (credentials: LoginCredentials) => Promise<void>;

  /**
   * Logs out the current user.
   * Clears user state and removes persisted session data.
   *
   * @returns Promise that resolves when logout completes
   */
  logout: () => Promise<void>;

  /**
   * Registers a new user with the provided data.
   * On success, automatically logs in the user and updates state.
   * On failure, sets error state with the failure message.
   *
   * @param data - The registration data (email, password, name, optional phone)
   * @returns Promise that resolves when registration completes
   */
  register: (data: RegisterData) => Promise<void>;

  /**
   * Clears any existing error state.
   * Should be called before starting a new authentication operation
   * or when the user dismisses an error message.
   */
  clearError: () => void;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

/**
 * React context for authentication state.
 * Undefined by default to detect when used outside of AuthProvider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set display name for React DevTools debugging
AuthContext.displayName = 'AuthContext';

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

/**
 * Props for the AuthProvider component.
 */
interface AuthProviderProps {
  /**
   * Child components that will have access to auth context.
   */
  children: ReactNode;
}

/**
 * Authentication context provider component.
 * Manages authentication state and provides auth methods to all descendant components.
 *
 * Features:
 * - Automatic session restoration on mount
 * - Login/logout/register operations with error handling
 * - Loading states for async operations
 * - Memoized context value for performance optimization
 *
 * @param props - Component props containing children
 * @returns Provider component wrapping children with auth context
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <Router>
 *         <Routes>
 *           <Route path="/" element={<HomePage />} />
 *           <Route path="/login" element={<LoginPage />} />
 *         </Routes>
 *       </Router>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  /**
   * Current authenticated user state.
   * Null when not logged in.
   */
  const [user, setUser] = useState<User | null>(null);

  /**
   * Loading state for async operations.
   * Initialized to true for initial auth check on mount.
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Error message from the last failed operation.
   * Null when there are no errors.
   */
  const [error, setError] = useState<string | null>(null);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  /**
   * Computed authentication status.
   * True when a user is logged in.
   */
  const isAuthenticated = user !== null;

  // ==========================================================================
  // INITIAL AUTH CHECK
  // ==========================================================================

  /**
   * Effect to check for existing session on component mount.
   * Restores user state if a valid session exists in localStorage.
   */
  useEffect(() => {
    /**
     * Async function to load the current user from storage.
     * Called once on mount to restore existing sessions.
     */
    const initializeAuth = async (): Promise<void> => {
      try {
        // Attempt to retrieve existing user session
        const currentUser = await getCurrentUser();

        if (currentUser) {
          // Restore user state if session is valid
          setUser(currentUser);
        }
      } catch (err) {
        // Log error but don't show to user - just means no existing session
        console.warn('Failed to restore auth session:', err);
        // Clear any potentially corrupted state
        setUser(null);
      } finally {
        // Mark initial loading as complete regardless of outcome
        setIsLoading(false);
      }
    };

    // Execute initial auth check
    initializeAuth();
  }, []);

  // ==========================================================================
  // AUTHENTICATION FUNCTIONS
  // ==========================================================================

  /**
   * Handles user login with provided credentials.
   * Updates user state on success, sets error on failure.
   *
   * @param credentials - The login credentials (email and password)
   * @throws Never throws - errors are captured in state
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    // Clear any existing errors before new operation
    setError(null);
    // Set loading state
    setIsLoading(true);

    try {
      // Call auth service to perform login
      const result = await loginService(credentials);

      // Update user state with authenticated user
      setUser(result.user);
    } catch (err) {
      // Extract error message from caught error
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during login';

      // Set error state for UI feedback
      setError(errorMessage);

      // Re-throw to allow component-level handling if needed
      throw err;
    } finally {
      // Clear loading state regardless of outcome
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles user logout.
   * Clears user state and removes persisted session.
   *
   * @throws Never throws - errors are captured in state
   */
  const logout = useCallback(async (): Promise<void> => {
    // Clear any existing errors
    setError(null);
    // Set loading state
    setIsLoading(true);

    try {
      // Call auth service to perform logout
      await logoutService();

      // Clear user state
      setUser(null);
    } catch (err) {
      // Extract error message from caught error
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during logout';

      // Set error state for UI feedback
      setError(errorMessage);

      // Still clear user state even if API call fails
      // This ensures local state is cleared even if backend had issues
      setUser(null);
    } finally {
      // Clear loading state
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles new user registration.
   * Automatically logs in the user on successful registration.
   *
   * @param data - The registration data (email, password, name, optional phone)
   * @throws Never throws - errors are captured in state
   */
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    // Clear any existing errors before new operation
    setError(null);
    // Set loading state
    setIsLoading(true);

    try {
      // Call auth service to perform registration
      const result = await registerService(data);

      // Update user state with newly registered user (auto-login)
      setUser(result.user);
    } catch (err) {
      // Extract error message from caught error
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during registration';

      // Set error state for UI feedback
      setError(errorMessage);

      // Re-throw to allow component-level handling if needed
      throw err;
    } finally {
      // Clear loading state regardless of outcome
      setIsLoading(false);
    }
  }, []);

  /**
   * Clears the current error state.
   * Useful for dismissing error messages or resetting before new operations.
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // ==========================================================================
  // CONTEXT VALUE MEMOIZATION
  // ==========================================================================

  /**
   * Memoized context value to prevent unnecessary re-renders.
   * Only updates when relevant state or callbacks change.
   */
  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      register,
      clearError,
    }),
    [user, isAuthenticated, isLoading, error, login, logout, register, clearError]
  );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// CUSTOM HOOK
// =============================================================================

/**
 * Custom hook to access the authentication context.
 * Must be used within an AuthProvider component tree.
 *
 * @returns The authentication context value with user state and auth methods
 * @throws Error if used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout, error, clearError } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <LoginForm onSubmit={login} error={error} />;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.name}!</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  // Retrieve context value
  const context = useContext(AuthContext);

  // Validate that hook is used within provider
  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
        'Make sure to wrap your component tree with <AuthProvider>.'
    );
  }

  return context;
}

// =============================================================================
// EXPORTS
// =============================================================================

// Default export for convenient imports
export default AuthProvider;
