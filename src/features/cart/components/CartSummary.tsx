/**
 * Cart summary component displaying subtotal, tax, and total.
 * Used in both the cart drawer and checkout page.
 */

import { useCart } from '../hooks/useCart';
import { formatPrice } from '@/utils/formatters';

/**
 * CartSummary displays the financial breakdown of the current cart:
 * subtotal, tax, and total amount.
 */
export function CartSummary() {
  const { subtotal, tax, total, itemCount } = useCart();

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-3 border-t border-gray-200">
      <div className="flex justify-between text-sm text-text-light">
        <span>Subtotal ({itemCount} items)</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm text-text-light">
        <span>Tax</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="flex justify-between text-base font-bold text-text pt-2 border-t border-gray-100">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
