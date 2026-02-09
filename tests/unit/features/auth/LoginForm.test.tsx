/**
 * Unit tests for the LoginForm component.
 * Verifies form rendering, validation, and submission behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { LoginForm } from '../../../../src/features/auth/components/LoginForm';
import { AuthContext } from '../../../../src/features/auth/context/AuthContext';
import type { AuthContextType } from '../../../../src/features/auth/types/auth.types';

/** Creates a mock AuthContext value with sensible defaults */
function createMockAuthContext(overrides: Partial<AuthContextType> = {}): AuthContextType {
  return {
    user: null,
    isAuthenticated: false,
    loadingState: 'idle',
    error: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    ...overrides,
  };
}

/** Wrapper providing AuthContext and MemoryRouter */
function renderLoginForm(contextOverrides: Partial<AuthContextType> = {}) {
  const mockAuth = createMockAuthContext(contextOverrides);

  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      AuthContext.Provider,
      { value: mockAuth },
      createElement(MemoryRouter, null, children)
    );
  }

  const utils = render(
    createElement(Wrapper, null, createElement(LoginForm))
  );

  return { ...utils, mockAuth };
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the sign-in heading', () => {
    renderLoginForm();
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders email and password input fields', () => {
    renderLoginForm();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    renderLoginForm();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders a link to the registration page', () => {
    renderLoginForm();
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });

  it('shows validation error when email is empty on submit', async () => {
    renderLoginForm();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows validation error when password is empty on submit', async () => {
    renderLoginForm();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('displays server error from auth context', () => {
    renderLoginForm({ error: 'Invalid email or password' });
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });

  it('shows loading state on the submit button', () => {
    renderLoginForm({ loadingState: 'loading' });
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('calls login with email and password on valid submit', async () => {
    const { mockAuth } = renderLoginForm();
    const loginFn = mockAuth.login as ReturnType<typeof vi.fn>;
    loginFn.mockResolvedValue(undefined);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await userEvent.type(emailInput, 'demo@burger.com');
    await userEvent.type(passwordInput, 'Password1');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith('demo@burger.com', 'Password1');
    });
  });

  it('calls clearError before submitting', async () => {
    const { mockAuth } = renderLoginForm();
    const loginFn = mockAuth.login as ReturnType<typeof vi.fn>;
    loginFn.mockResolvedValue(undefined);

    await userEvent.type(screen.getByLabelText('Email'), 'demo@burger.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password1');

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAuth.clearError).toHaveBeenCalled();
    });
  });
});
