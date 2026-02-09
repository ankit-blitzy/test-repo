/**
 * Protected route wrapper component.
 * Redirects unauthenticated users to the login page.
 * Supports both:
 *   - Layout route usage (renders <Outlet /> when no children)
 *   - Direct wrapper usage (renders children when provided)
 */

import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '@/components/ui';
import { ROUTES } from '@/utils/constants';

/** Props for the ProtectedRoute component */
export interface ProtectedRouteProps {
  /** Optional child content to render when authenticated.
   *  When omitted, renders React Router <Outlet /> for nested routes. */
  children?: React.ReactNode;
}

/**
 * ProtectedRoute checks authentication state and either:
 * - Renders children / Outlet if the user is authenticated
 * - Redirects to login page with return URL if not authenticated
 * - Shows a loader while authentication state is being determined
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loadingState } = useAuth();
  const location = useLocation();

  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size="lg" label="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
