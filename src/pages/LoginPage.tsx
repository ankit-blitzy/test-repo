/**
 * @fileoverview Login Page Component for the Burger House restaurant application.
 * Provides user authentication functionality with form validation using react-hook-form
 * and Zod schema validation. Integrates with AuthContext for centralized auth state management.
 *
 * Features:
 * - Email and password validation using Zod schema
 * - Loading states during authentication
 * - Error message display for invalid credentials
 * - Automatic redirect after successful login
 * - Link to registration page for new users
 *
 * @module pages/LoginPage
 * @version 1.0.0
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Internal imports from the application
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import type { LoginCredentials } from '../types';

// =============================================================================
// SCHEMA DEFINITION
// =============================================================================

/**
 * Zod validation schema for the login form.
 * Validates email format and password minimum length.
 */
const loginSchema = z.object({
  /**
   * User's email address.
   * Must be a valid email format.
   */
  email: z.string().email('Invalid email address'),
  /**
   * User's password.
   * Must be at least 6 characters long.
   */
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * TypeScript type inferred from the loginSchema.
 * Ensures type safety between form data and validation schema.
 */
type LoginFormData = z.infer<typeof loginSchema>;

// =============================================================================
// COMPONENT DEFINITION
// =============================================================================

/**
 * LoginPage Component
 *
 * A full-featured login page component that handles user authentication.
 * Uses react-hook-form for form state management and Zod for validation.
 * Integrates with AuthContext for login functionality and error handling.
 *
 * Features:
 * - Client-side form validation with real-time error feedback
 * - Integration with AuthContext for centralized auth management
 * - Loading state indication during authentication process
 * - Error display for authentication failures
 * - Redirect to original destination after successful login
 * - Accessible form inputs with proper labels and error messages
 *
 * @returns The login page JSX element
 *
 * @example
 * // Usage in router configuration
 * <Route path="/login" element={<LoginPage />} />
 */
function LoginPage(): React.JSX.Element {
  // ===========================================================================
  // HOOKS AND CONTEXT
  // ===========================================================================

  /**
   * Destructure authentication utilities from AuthContext.
   * - login: Function to authenticate user with credentials
   * - error: Current error message from last failed auth attempt (if any)
   * - isLoading: Boolean indicating if auth operation is in progress
   * - clearError: Function to clear any existing error state
   */
  const { login, error, isLoading, clearError } = useAuth();

  /**
   * React Router navigation hook for programmatic navigation.
   * Used to redirect user after successful login.
   */
  const navigate = useNavigate();

  /**
   * React Router location hook to access current location state.
   * Used to retrieve the original destination URL for post-login redirect.
   */
  const location = useLocation();

  /**
   * Determine the redirect destination after successful login.
   * If user was redirected from a protected route, return them there.
   * Otherwise, redirect to home page.
   */
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  // ===========================================================================
  // FORM SETUP
  // ===========================================================================

  /**
   * Initialize react-hook-form with Zod resolver for validation.
   * Provides form registration, submission handling, and error state.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles form submission when validation passes.
   * Attempts to login with provided credentials and navigates on success.
   *
   * @param data - Validated form data containing email and password
   */
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    // Clear any existing error before attempting new login
    clearError();

    try {
      // Construct credentials object matching LoginCredentials type
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };

      // Attempt login with AuthContext
      await login(credentials);

      // On successful login, navigate to original destination or home
      navigate(from, { replace: true });
    } catch {
      // Error handling is managed by AuthContext - error state is set there
      // No additional action needed here as the error will be displayed from context
    }
  };

  /**
   * Handles input focus to clear errors when user starts correcting.
   * Improves UX by clearing stale error messages.
   */
  const handleInputFocus = (): void => {
    if (error) {
      clearError();
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card container for the login form */}
        <Card className="p-8">
          {/* Header section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Welcome Back</h1>
            <p className="mt-2 text-stone-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Authentication error display */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email input field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              onFocus={handleInputFocus}
              {...register('email')}
            />

            {/* Password input field */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              onFocus={handleInputFocus}
              {...register('password')}
            />

            {/* Submit button with loading state */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-amber-600 hover:text-amber-700 transition-colors focus:outline-none focus:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Helpful hint section */}
        <p className="mt-4 text-center text-sm text-stone-500">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="text-amber-600 hover:text-amber-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-amber-600 hover:text-amber-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default LoginPage;
