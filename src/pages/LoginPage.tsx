/**
 * LoginPage – user login page.
 */

import { Link, Navigate } from 'react-router';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();

  /* Redirect already-authenticated users to account */
  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
          <p className="mt-2 text-text-light">Sign in to access your account, orders, and reservations.</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-text-light">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
