/**
 * Order summary component for the checkout page.
 * Displays all cart items and totals in a read-only summary.
 */

import { useCart } from '@/features/cart/hooks/useCart';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { formatPrice } from '@/utils/formatters';
import { Card } from '@/components/ui';

/**
 * Renders a complete order summary for the checkout flow.
 * Lists all items with quantities and prices, followed by the cart summary totals.
 */
export function OrderSummary() {
  const { items } = useCart();

  return (
    <Card>
      <h3 className="text-lg font-bold text-text mb-4">Order Summary</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 rounded px-2 py-0.5 text-xs font-medium">
                {item.quantity}×
              </span>
              <span className="text-text">{item.name}</span>
            </div>
            <span className="font-medium text-text">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <CartSummary />
    </Card>
  );
}
