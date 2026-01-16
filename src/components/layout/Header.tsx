/**
 * @fileoverview Navigation header component for Burger House restaurant website.
 * Provides responsive navigation with auth-aware menu display, shopping cart badge,
 * and mobile hamburger menu functionality.
 * 
 * @module components/layout/Header
 * @version 1.0.0
 * 
 * Features:
 * - Auth-aware navigation (shows different options based on authentication state)
 * - Responsive design with desktop and mobile views
 * - Mobile hamburger menu with slide-down animation
 * - Shopping cart icon with item count badge
 * - Active link highlighting based on current route
 * - Sticky positioning for persistent navigation access
 * 
 * @example
 * ```tsx
 * import { Header } from './components/layout/Header';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <Header />
 *       <main>{children}</main>
 *     </div>
 *   );
 * }
 * ```
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Navigation link configuration interface.
 * Defines the structure for each navigation item.
 */
interface NavLink {
  /** Display name shown to users */
  name: string;
  /** Route path for navigation */
  path: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Main navigation links configuration.
 * These links are displayed in both desktop and mobile navigation.
 */
const NAV_LINKS: readonly NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Book a Table', path: '/booking' },
] as const;

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * Header navigation component with responsive design and auth-awareness.
 * 
 * Displays the main navigation bar with:
 * - Brand logo linking to home page
 * - Navigation links to main pages (Home, Menu, Booking)
 * - Shopping cart icon with item count badge
 * - Authentication section (Login/Register or User menu with Logout)
 * - Mobile hamburger menu for small screens
 * 
 * The component automatically adapts its display based on:
 * - Screen size (desktop vs mobile breakpoints)
 * - User authentication state
 * - Current route for active link highlighting
 * 
 * @returns {React.JSX.Element} The rendered header component
 * 
 * @example
 * ```tsx
 * // In your layout component
 * import { Header } from './components/layout/Header';
 * 
 * function Layout({ children }) {
 *   return (
 *     <>
 *       <Header />
 *       <main>{children}</main>
 *       <Footer />
 *     </>
 *   );
 * }
 * ```
 */
export function Header(): React.JSX.Element {
  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================

  /**
   * Controls mobile menu visibility.
   * True when the hamburger menu is expanded on mobile devices.
   */
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // ===========================================================================
  // CONTEXT HOOKS
  // ===========================================================================

  /**
   * Authentication context providing user state and auth methods.
   * - user: Current authenticated user object or null
   * - isAuthenticated: Boolean indicating if user is logged in
   * - logout: Function to log out the current user
   */
  const { user, isAuthenticated, logout } = useAuth();

  /**
   * Cart context providing shopping cart state.
   * - itemCount: Total number of items in the cart
   */
  const { itemCount } = useCart();

  /**
   * React Router location hook for current route information.
   * Used to highlight active navigation links.
   */
  const location = useLocation();

  // ===========================================================================
  // HELPER FUNCTIONS
  // ===========================================================================

  /**
   * Checks if a given path matches the current route.
   * Used for active link highlighting.
   * 
   * @param {string} path - The path to check against current location
   * @returns {boolean} True if the path matches the current route
   */
  const isActivePath = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Handles user logout action.
   * Calls the logout function from auth context and closes mobile menu.
   * This function is async to properly await the logout operation.
   */
  const handleLogout = async (): Promise<void> => {
    await logout();
    setMobileMenuOpen(false);
  };

  /**
   * Closes the mobile menu.
   * Called when navigating to a new page from mobile menu.
   */
  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  /**
   * Toggles mobile menu visibility.
   * Called when hamburger button is clicked.
   */
  const toggleMobileMenu = (): void => {
    setMobileMenuOpen((prev) => !prev);
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <header className="bg-amber-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* =================================================================
              BRAND LOGO
              Links to home page with burger emoji and brand name
          ================================================================= */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            aria-label="Burger House - Go to homepage"
          >
            <span className="text-2xl" role="img" aria-label="Burger">
              🍔
            </span>
            <span className="text-xl font-bold">Burger House</span>
          </Link>

          {/* =================================================================
              DESKTOP NAVIGATION
              Hidden on mobile (md breakpoint and above)
          ================================================================= */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  isActivePath(link.path)
                    ? 'text-white border-b-2 border-white pb-1'
                    : 'text-amber-100 hover:text-white'
                }`}
                aria-current={isActivePath(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* =================================================================
              DESKTOP AUTH & CART SECTION
              Cart icon with badge and authentication buttons/user menu
          ================================================================= */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Shopping Cart Icon with Item Count Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-amber-100 hover:text-white transition-colors duration-200"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Item Count Badge - Only shown when cart has items */}
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-white text-amber-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                  aria-hidden="true"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Authentication Section - Conditional based on auth state */}
            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="flex items-center space-x-4">
                <Link
                  to="/account"
                  className="text-amber-100 hover:text-white transition-colors duration-200 font-medium"
                  aria-label="Go to your account"
                >
                  {user?.name || 'Account'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* Unauthenticated User - Login/Register Links */
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-amber-100 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-amber-600 hover:bg-amber-50 px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* =================================================================
              MOBILE HAMBURGER MENU BUTTON
              Visible only on small screens (below md breakpoint)
          ================================================================= */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                /* X icon when menu is open */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                /* Hamburger icon when menu is closed */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* ===================================================================
            MOBILE NAVIGATION MENU
            Collapsible menu shown only on small screens when hamburger is clicked
        =================================================================== */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden py-4 border-t border-amber-500 animate-slide-down"
          >
            <nav className="flex flex-col space-y-4" aria-label="Mobile navigation">
              {/* Main Navigation Links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`font-medium px-2 py-1 rounded transition-colors duration-200 ${
                    isActivePath(link.path)
                      ? 'text-white bg-amber-700'
                      : 'text-amber-100 hover:text-white hover:bg-amber-700'
                  }`}
                  aria-current={isActivePath(link.path) ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              ))}

              {/* Cart Link with Item Count */}
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="font-medium px-2 py-1 rounded text-amber-100 hover:text-white hover:bg-amber-700 transition-colors duration-200 flex items-center justify-between"
              >
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="bg-white text-amber-600 text-xs font-bold rounded-full px-2 py-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="border-t border-amber-500 my-2" aria-hidden="true" />

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                /* Authenticated User Options */}
                <>
                  <Link
                    to="/account"
                    onClick={closeMobileMenu}
                    className="font-medium px-2 py-1 rounded text-amber-100 hover:text-white hover:bg-amber-700 transition-colors duration-200"
                  >
                    My Account {user?.name && `(${user.name})`}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-medium px-2 py-1 rounded text-left text-amber-100 hover:text-white hover:bg-amber-700 transition-colors duration-200"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                /* Unauthenticated User Options */
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="font-medium px-2 py-1 rounded text-amber-100 hover:text-white hover:bg-amber-700 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="font-medium px-2 py-1 rounded bg-white text-amber-600 hover:bg-amber-50 transition-colors duration-200 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
