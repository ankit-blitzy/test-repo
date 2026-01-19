/**
 * CartDrawer Component
 * Slide-out drawer for shopping cart
 */

import { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router';
import type { CartDrawerProps } from '@/types/cart.types';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '@/utils/formatters';
import { CartItem } from './CartItem';

/**
 * CartDrawer component for displaying shopping cart
 */
export function CartDrawer({
  isOpen,
  onClose,
}: CartDrawerProps): React.ReactElement {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
  } = useCartStore();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white z-50',
          'flex flex-col shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2
            id="cart-title"
            className="text-lg font-semibold text-neutral-900 flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Your Cart
            {items.length > 0 && (
              <span className="text-sm text-neutral-500">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900">
                Your cart is empty
              </h3>
              <p className="mt-2 text-neutral-500">
                Add some delicious items to get started!
              </p>
              <Link
                to="/menu"
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="py-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-6 py-4 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax (8%)</span>
                <span className="text-neutral-900">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-neutral-100">
                <span className="text-neutral-900">Total</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full text-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="w-full px-6 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
