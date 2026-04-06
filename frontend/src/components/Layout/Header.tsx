import { useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/**
 * Application Header Component — CALC Scientific Calculator
 *
 * Renders the top-level header bar with:
 *   - "CALC" branding text and "Scientific" subtitle
 *   - Settings gear icon button
 *   - Auth0-powered user avatar (authenticated) or "Log In" button (unauthenticated)
 *
 * Auth0 Integration:
 *   - Consumes `useAuth0()` hook from the Auth0Provider established in main.tsx
 *   - Displays user.picture as avatar when authenticated; falls back to initial circle
 *   - Clicking avatar triggers Auth0 logout with redirect to origin
 *   - Clicking "Log In" triggers Auth0 loginWithRedirect
 *
 * @see AAP Section 0.5.1 Group 6 — "Application header with 'CALC' branding, user avatar (from Auth0), and settings icon"
 * @see AAP Section 0.7.1 — Authentication-First Pattern
 * @see AAP Section 0.7.4 — TailwindCSS-only styling, React hooks for state
 */
export default function Header() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()

  /**
   * Triggers Auth0 loginWithRedirect flow.
   * Memoized via useCallback to prevent unnecessary re-renders in child trees.
   */
  const handleLogin = useCallback(() => {
    loginWithRedirect()
  }, [loginWithRedirect])

  /**
   * Triggers Auth0 logout with redirect back to the application origin.
   * Memoized via useCallback to prevent unnecessary re-renders in child trees.
   */
  const handleLogout = useCallback(() => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }, [logout])

  return (
    <header className="w-full bg-calculator-display border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      {/* Left section: CALC branding */}
      <div className="flex items-center gap-2">
        <h1 className="text-calculator-text text-xl font-bold font-display tracking-wider">
          CALC
        </h1>
        <span className="text-calculator-text-dim text-xs font-calculator">
          Scientific
        </span>
      </div>

      {/* Right section: User controls */}
      <div className="flex items-center gap-3">
        {/* Settings gear icon button */}
        <button
          type="button"
          className="text-calculator-text-dim hover:text-calculator-text transition-colors p-1 rounded"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* User avatar / Auth section */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label={`Logged in as ${user.name || 'User'}. Click to logout.`}
            >
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User avatar'}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-gray-600"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-calculator-accent flex items-center justify-center text-white text-sm font-bold"
                  aria-hidden="true"
                >
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            className="text-calculator-text-dim hover:text-calculator-text text-sm font-medium transition-colors px-3 py-1 rounded border border-gray-600 hover:border-gray-400"
            aria-label="Log in"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  )
}
