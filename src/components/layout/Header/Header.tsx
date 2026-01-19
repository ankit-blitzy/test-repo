/**
 * Header Component
 * Site header with navigation and cart
 */

import { useState } from 'react';
import { Link } from 'react-router';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useCartStore } from '@/features/ordering/store/cartStore';
import { Navigation } from '../Navigation/Navigation';

/**
 * Header component
 */
export function Header(): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-600"
          >
            <span className="text-2xl" role="img" aria-label="Burger">
              🍔
            </span>
            <span className="hidden sm:inline">Burger Restaurant</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Navigation />
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary-500 text-white text-xs font-bold rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <Link
              to="/login"
              className="p-2 text-neutral-600 hover:text-primary-600 transition-colors"
              aria-label="User account"
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-2">
            <Navigation
              className="flex-col"
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
