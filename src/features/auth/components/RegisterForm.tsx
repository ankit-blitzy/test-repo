/**
 * Registration form component with validation for new user accounts.
 * Uses react-hook-form with zod schema validation including password confirmation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/utils/validation';
import { Button, Input, Alert } from '@/components/ui';
import { Link } from 'react-router';
import { ROUTES } from '@/utils/constants';

/**
 * RegisterForm handles new user account creation with full validation.
 * Includes name, email, password with confirmation, and optional phone.
 */
export function RegisterForm() {
  const { register: registerUser, loadingState, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    try {
      await registerUser(data.firstName, data.lastName, data.email, data.password, data.phone);
    } catch {
      /* Error is handled by AuthContext and displayed via error state */
    }
  };

  const isLoading = loadingState === 'loading';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h2 className="text-2xl font-bold text-text text-center">Create Account</h2>
      <p className="text-text-light text-center text-sm">
        Join us and start ordering!
      </p>

      {error && (
        <Alert variant="error" dismissible onDismiss={clearError}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          autoComplete="given-name"
          error={errors.firstName?.message}
          required
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          autoComplete="family-name"
          error={errors.lastName?.message}
          required
          {...register('lastName')}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <Input
        label="Phone (optional)"
        type="tel"
        placeholder="(555) 000-0000"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        required
        {...register('confirmPassword')}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-text-light">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary hover:text-primary-dark font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
