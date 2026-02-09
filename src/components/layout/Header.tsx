/**
 * Header component – top navigation bar with logo, nav links, auth actions, and cart badge.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartButton } from '@/features/cart/components/CartButton';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { Button } from '@/components/ui';
import { APP_NAME } from '@/utils/constants';
import clsx from 'clsx';

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/booking', label: 'Book a Table' },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { openCart } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              🍔 {APP_NAME}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(
                    'text-sm font-medium transition-colors hover:text-primary',
                    location.pathname === item.to ? 'text-primary' : 'text-text',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <CartButton onClick={openCart} />

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/account">
                    <Button variant="ghost" size="sm">
                      {user ? `${user.firstName}` : 'Account'}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-text hover:text-primary"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle navigation"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-2 text-sm font-medium text-text hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-200" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="block py-2 text-sm font-medium text-text hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-sm font-medium text-text hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-sm font-medium text-primary hover:text-primary-dark"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Cart drawer – managed by CartContext state */}
      <CartDrawer />
    </>
  );
}
