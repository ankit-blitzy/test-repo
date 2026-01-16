/**
 * @fileoverview User registration page component for the Burger House restaurant application.
 *
 * This component provides a complete user registration form with:
 * - Form validation using react-hook-form and Zod schema validation
 * - Name, email, phone (optional), password, and confirm password fields
 * - Password confirmation matching validation
 * - Integration with AuthContext for registration functionality
 * - Error message display for registration failures
 * - Loading state during registration process
 * - Auto-login after successful registration
 * - Navigation link to login page for existing users
 *
 * @module pages/RegisterPage
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // Used in React Router setup
 * <Route path="/register" element={<RegisterPage />} />
 * ```
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components';
import type { RegisterData } from '../types';

// =============================================================================
// VALIDATION SCHEMA
// =============================================================================

/**
 * Zod validation schema for the registration form.
 *
 * Validates:
 * - name: Required, minimum 2 characters
 * - email: Required, must be valid email format
 * - password: Required, minimum 6 characters
 * - confirmPassword: Required, must match password
 * - phone: Optional string for contact number
 */
const registerSchema = z
  .object({
    /** User's full name - minimum 2 characters required */
    name: z.string().min(2, 'Name must be at least 2 characters'),

    /** User's email address - must be valid email format */
    email: z.string().email('Invalid email address'),

    /** User's password - minimum 6 characters for security */
    password: z.string().min(6, 'Password must be at least 6 characters'),

    /** Password confirmation field - must match password */
    confirmPassword: z.string(),

    /** Optional phone number for contact purposes */
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * TypeScript type inferred from the Zod registration schema.
 * Used for form state typing with react-hook-form.
 */
type RegisterFormData = z.infer<typeof registerSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RegisterPage Component
 *
 * Renders a user registration form with comprehensive validation and error handling.
 * Uses react-hook-form for performant form state management and Zod for schema validation.
 * Integrates with AuthContext for registration functionality and automatic login.
 *
 * Features:
 * - Responsive centered layout with Card container
 * - Real-time form validation with helpful error messages
 * - Password confirmation matching validation
 * - Integration with authentication context
 * - Loading state feedback during registration
 * - Automatic redirect to home page on successful registration
 * - Navigation link to login page for existing users
 *
 * @returns React functional component rendering the registration page
 *
 * @example
 * ```tsx
 * // Basic usage in router
 * <Route path="/register" element={<RegisterPage />} />
 * ```
 */
function RegisterPage(): React.JSX.Element {
  // ===========================================================================
  // HOOKS & STATE
  // ===========================================================================

  /**
   * Authentication context providing register function, error state,
   * loading state, and error clearing functionality.
   */
  const { register: registerUser, error, isLoading, clearError } = useAuth();

  /**
   * React Router navigation hook for programmatic redirects
   * after successful registration.
   */
  const navigate = useNavigate();

  /**
   * react-hook-form hook for form state management.
   * Uses Zod resolver for schema-based validation.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles form submission for user registration.
   *
   * Process:
   * 1. Clears any existing authentication errors
   * 2. Extracts registration data (excluding confirmPassword)
   * 3. Calls registerUser from AuthContext
   * 4. On success: Redirects to home page with replace to prevent back navigation
   * 5. On failure: Error is automatically set in AuthContext and displayed
   *
   * @param data - Validated form data from react-hook-form
   */
  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    // Clear any previous errors before new registration attempt
    clearError();

    try {
      // Extract only the fields needed for registration (exclude confirmPassword)
      const registrationData: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      };

      // Attempt registration via AuthContext
      await registerUser(registrationData);

      // On success, redirect to home page
      // Using replace: true to prevent going back to registration after login
      navigate('/', { replace: true });
    } catch {
      // Error is handled by AuthContext and will be displayed via the error state
      // No additional error handling needed here
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Registration Card Container */}
        <Card className="w-full" hoverable={false}>
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Create Account</h1>
            <p className="mt-2 text-stone-600">
              Join Burger House and start ordering your favorite meals
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Authentication Error Display */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                role="alert"
                aria-live="polite"
              >
                <span className="font-medium">Registration failed:</span> {error}
              </div>
            )}

            {/* Name Input Field */}
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />

            {/* Email Input Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Phone Input Field (Optional) */}
            <Input
              label="Phone Number (optional)"
              type="tel"
              placeholder="(555) 123-4567"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Password Input Field */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Confirm Password Input Field */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link for Existing Users */}
          <div className="mt-6 text-center">
            <p className="text-stone-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default RegisterPage;
