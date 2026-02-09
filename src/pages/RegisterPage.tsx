/**
 * RegisterPage – user registration page.
 */

import { Link, Navigate } from 'react-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">Create an Account</h1>
          <p className="mt-2 text-text-light">Join us and start ordering your favourite burgers.</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-text-light">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
