/**
 * Slide-out cart drawer component.
 * Displays cart items, summary, and checkout actions in a side panel overlay.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import { CartItemComponent } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import clsx from 'clsx';

/**
 * CartDrawer is a slide-out panel that shows the current cart contents.
 * Includes item list, price summary, and navigation to checkout or menu.
 */
export function CartDrawer() {
  const { items, isOpen, closeCart, clearCart, itemCount } = useCart();
  const navigate = useNavigate();

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate(ROUTES.CHECKOUT);
  };

  const handleViewMenu = () => {
    closeCart();
    navigate(ROUTES.MENU);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-md bg-surface z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal={isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-bold text-text">Your Cart ({itemCount})</h2>
          <button
            onClick={closeCart}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-text-light mb-4">Your cart is empty</p>
              <Button variant="primary" onClick={handleViewMenu}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="py-2">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 space-y-3">
            <CartSummary />
            <Button fullWidth onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
            <Button variant="outline" fullWidth onClick={clearCart} size="sm">
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
