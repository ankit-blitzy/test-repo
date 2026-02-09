/**
 * Individual cart line item component.
 * Displays item details with quantity controls and remove button.
 */

import type { CartItem as CartItemType } from '../types/cart.types';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '@/utils/formatters';

/** Props for the CartItem component */
export interface CartItemProps {
  item: CartItemType;
}

/**
 * Renders a single cart item with image, name, price, quantity controls,
 * and a remove button. Quantity can be adjusted with +/- buttons.
 */
export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
      {/* Item Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><rect width="24" height="24"/><text x="12" y="16" text-anchor="middle" font-size="8" fill="%23999">🍔</text></svg>';
          }}
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-text truncate">{item.name}</h4>
        <p className="text-sm text-primary font-semibold">{formatPrice(item.price)}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal and Remove */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-semibold text-text">{formatPrice(item.price * item.quantity)}</span>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
