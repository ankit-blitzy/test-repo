/**
 * @fileoverview Protected Route component for authentication-based route guarding.
 * 
 * This component serves as a wrapper for routes that require user authentication.
 * It integrates with the AuthContext to check authentication status and redirects
 * unauthenticated users to the login page while preserving the original destination
 * URL for post-login redirect.
 * 
 * @module components/auth/ProtectedRoute
 * @version 1.0.0
 * 
 * @example
 * // Basic usage in App.tsx routing configuration
 * ```tsx
 * import { Route, Routes } from 'react-router-dom';
 * import { ProtectedRoute } from './components/auth/ProtectedRoute';
 * 
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/" element={<HomePage />} />
 *       <Route path="/login" element={<LoginPage />} />
 *       <Route element={<ProtectedRoute />}>
 *         <Route path="/cart" element={<CartPage />} />
 *         <Route path="/checkout" element={<CheckoutPage />} />
 *         <Route path="/booking" element={<BookingPage />} />
 *         <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
 *         <Route path="/account" element={<AccountPage />} />
 *       </Route>
 *     </Routes>
 *   );
 * }
 * ```
 * 
 * @example
 * // Usage with custom redirect path
 * ```tsx
 * <Route element={<ProtectedRoute redirectTo="/signin" />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 * ```
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';

// Internal imports from depends_on_files
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props interface for the ProtectedRoute component.
 * 
 * Allows customization of the redirect behavior when authentication fails.
 * All props are optional with sensible defaults.
 */
export interface ProtectedRouteProps {
  /**
   * Custom path to redirect unauthenticated users.
   * The current location will be passed in state for post-login redirect.
   * @default '/login'
   */
  redirectTo?: string;
}

/**
 * Type definition for the location state passed to the login page.
 * Contains the original URL the user was trying to access.
 */
interface LocationState {
  /**
   * The location the user was attempting to access before being redirected.
   * Used by the login page to redirect back after successful authentication.
   */
  from: Location;
}

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * ProtectedRoute Component
 * 
 * A route guard component that protects child routes from unauthenticated access.
 * Uses the authentication context to determine user authentication status and
 * handles three states:
 * 
 * 1. **Loading State**: When auth status is being determined (e.g., on app mount),
 *    displays a centered loading spinner to prevent flash of unauthorized content.
 * 
 * 2. **Unauthenticated State**: When user is not logged in, redirects to the
 *    login page (or custom redirectTo path) with the current location stored
 *    in state for post-login redirect.
 * 
 * 3. **Authenticated State**: When user is logged in, renders the child routes
 *    via React Router's Outlet component.
 * 
 * @param props - Component props
 * @param props.redirectTo - Optional custom redirect path (default: '/login')
 * @returns JSX element - LoadingSpinner, Navigate redirect, or Outlet for child routes
 * 
 * @example
 * // Protects multiple routes
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/cart" element={<CartPage />} />
 *   <Route path="/checkout" element={<CheckoutPage />} />
 * </Route>
 * 
 * @see {@link useAuth} for authentication context
 * @see {@link https://reactrouter.com/en/main/components/outlet|React Router Outlet}
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/login',
}): React.JSX.Element => {
  // ===========================================================================
  // HOOKS
  // ===========================================================================

  /**
   * Extract authentication state from AuthContext.
   * - isAuthenticated: boolean indicating if user is logged in
   * - isLoading: boolean indicating if auth check is in progress
   */
  const { isAuthenticated, isLoading } = useAuth();

  /**
   * Get current location for redirect state.
   * This allows the login page to redirect back to the original
   * destination after successful authentication.
   */
  const location = useLocation();

  // ===========================================================================
  // LOADING STATE HANDLING
  // ===========================================================================

  /**
   * Display loading spinner during initial authentication check.
   * 
   * This prevents a flash of the login page when the app first loads
   * and the auth context is checking for an existing session (e.g.,
   * from localStorage or a refresh token).
   * 
   * The spinner is centered both vertically and horizontally using
   * flexbox with min-h-screen to cover the full viewport height.
   */
  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen bg-gray-50"
        role="status"
        aria-label="Checking authentication status"
      >
        <LoadingSpinner 
          size="lg" 
          text="Verifying authentication..."
        />
      </div>
    );
  }

  // ===========================================================================
  // AUTHENTICATION CHECK
  // ===========================================================================

  /**
   * Redirect unauthenticated users to the login page.
   * 
   * Key features of this redirect:
   * 1. Uses Navigate component for declarative redirection
   * 2. Passes current location in state for post-login redirect
   * 3. Uses 'replace' prop to avoid login page in browser history
   *    (prevents "back" button from returning to protected page)
   * 
   * The location state follows the LocationState interface and is
   * used by the LoginPage component to redirect back to the original
   * destination after successful authentication.
   */
  if (!isAuthenticated) {
    // Create location state with the original destination
    const state: LocationState = { from: location };

    return (
      <Navigate 
        to={redirectTo} 
        state={state} 
        replace 
      />
    );
  }

  // ===========================================================================
  // AUTHENTICATED RENDER
  // ===========================================================================

  /**
   * Render protected child routes via Outlet.
   * 
   * The Outlet component acts as a placeholder that renders
   * the matching child route element. This allows ProtectedRoute
   * to wrap multiple protected routes while only requiring the
   * authentication check once at the parent level.
   * 
   * Child routes are defined in the routing configuration:
   * - /cart -> CartPage
   * - /checkout -> CheckoutPage
   * - /booking -> BookingPage
   * - /order-confirmation -> OrderConfirmationPage
   * - /account -> AccountPage
   */
  return <Outlet />;
};

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Named export for explicit imports.
 * Preferred for tree-shaking and explicit import statements.
 * 
 * @example
 * import { ProtectedRoute } from './components/auth/ProtectedRoute';
 */
export { ProtectedRoute };

/**
 * Default export for convenient imports.
 * Maintains compatibility with existing import patterns.
 * 
 * @example
 * import ProtectedRoute from './components/auth/ProtectedRoute';
 */
export default ProtectedRoute;
