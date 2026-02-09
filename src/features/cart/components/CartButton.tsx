/**
 * Cart button component with item count badge.
 * Displayed in the header navigation to toggle the cart drawer.
 */

import { useCart } from '../hooks/useCart';

/** Props for CartButton */
export interface CartButtonProps {
  /** Optional click handler override. Defaults to toggleCart from CartContext. */
  onClick?: () => void;
}

/**
 * CartButton displays a shopping cart icon with a badge showing the current item count.
 * Clicking it toggles the cart drawer open/closed (or calls the provided onClick handler).
 */
export function CartButton({ onClick }: CartButtonProps) {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      onClick={onClick ?? toggleCart}
      className="relative p-2 text-text hover:text-primary transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs font-bold text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
