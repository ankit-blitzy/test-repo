/**
 * Login form component with email/password fields and validation.
 * Uses react-hook-form with zod schema validation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { Button, Input, Alert } from '@/components/ui';
import { Link } from 'react-router';
import { ROUTES } from '@/utils/constants';

/**
 * LoginForm handles user authentication with email and password.
 * Displays inline validation errors and server-side error messages.
 */
export function LoginForm() {
  const { login, loadingState, error, clearError } = useAuth();

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

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data.email, data.password);
    } catch {
      /* Error is handled by AuthContext and displayed via error state */
    }
  };

  const isLoading = loadingState === 'loading';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <h2 className="text-2xl font-bold text-text text-center">Sign In</h2>
      <p className="text-text-light text-center text-sm">
        Welcome back! Sign in to your account.
      </p>

      {error && (
        <Alert variant="error" dismissible onDismiss={clearError}>
          {error}
        </Alert>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-text-light">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary hover:text-primary-dark font-medium">
          Create one
        </Link>
      </p>

      <p className="text-center text-xs text-text-light mt-2">
        Demo: demo@burger.com / Password1
      </p>
    </form>
  );
}
