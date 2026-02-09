/**
 * Unit tests for the useAuth hook.
 * Verifies the hook enforces the AuthProvider requirement and returns the correct context shape.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { useAuth } from '../../../../src/features/auth/hooks/useAuth';
import { AuthProvider } from '../../../../src/features/auth/context/AuthContext';

/**
 * Helper wrapper that supplies AuthProvider context to hooks.
 */
function wrapper({ children }: { children: ReactNode }) {
  return createElement(AuthProvider, null, children);
}

describe('useAuth', () => {
  it('throws an error when used outside of AuthProvider', () => {
    /* Suppress React error boundary console noise */
    const originalError = console.error;
    console.error = () => {};

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    console.error = originalError;
  });

  it('returns the auth context when used inside AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loadingState).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('provides a login function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.login).toBe('function');
  });

  it('provides a register function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.register).toBe('function');
  });

  it('provides a logout function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.logout).toBe('function');
  });

  it('provides a clearError function', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.clearError).toBe('function');
  });
});
