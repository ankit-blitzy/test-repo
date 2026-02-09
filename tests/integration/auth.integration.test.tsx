/**
 * Integration tests for the Authentication feature flow.
 * Verifies the full AuthProvider → useAuth → login/logout cycle.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import { AuthProvider } from '../../src/features/auth/context/AuthContext';

/** Wrapper providing AuthProvider context */
function wrapper({ children }: { children: ReactNode }) {
  return createElement(AuthProvider, null, children);
}

describe('Auth Integration', () => {
  beforeEach(() => {
    /* Clear session storage between tests */
    sessionStorage.clear();
  });

  it('starts with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loadingState).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('successfully logs in with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('demo@burger.com', 'Password1');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('demo@burger.com');
    expect(result.current.user?.firstName).toBe('Demo');
    expect(result.current.loadingState).toBe('success');
  });

  it('stores tokens in session storage after login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('demo@burger.com', 'Password1');
    });

    const token = sessionStorage.getItem('auth_token');
    expect(token).not.toBeNull();
  });

  it('fails login with invalid credentials and sets error', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('wrong@example.com', 'WrongPass1');
      } catch {
        /* Expected to throw */
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loadingState).toBe('error');
    expect(result.current.error).toBeTruthy();
  });

  it('clears error state with clearError', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    /* Trigger a failed login */
    await act(async () => {
      try {
        await result.current.login('wrong@example.com', 'WrongPass1');
      } catch {
        /* Expected */
      }
    });

    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('logs out and clears user state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    /* Log in first */
    await act(async () => {
      await result.current.login('demo@burger.com', 'Password1');
    });

    expect(result.current.isAuthenticated).toBe(true);

    /* Then log out */
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loadingState).toBe('idle');
  });

  it('clears session storage on logout', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('demo@burger.com', 'Password1');
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(sessionStorage.getItem('refresh_token')).toBeNull();
  });

  it('registers a new user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register('Jane', 'Doe', 'jane@example.com', 'Password1', '555-0199');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('jane@example.com');
    expect(result.current.user?.firstName).toBe('Jane');
    expect(result.current.loadingState).toBe('success');
  });
});
