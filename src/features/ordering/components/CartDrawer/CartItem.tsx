/**
 * CartItem Component
 * Displays a single item in the shopping cart
 */

import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItemProps } from '@/types/cart.types';
import { formatPrice } from '@/utils/formatters';

/**
 * CartItem component for displaying cart items
 */
export function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps): React.ReactElement {
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (item.quantity < 99) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 last:border-b-0">
      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-neutral-900 truncate">{item.name}</h4>
        <p className="text-sm text-neutral-600">
          {formatPrice(item.price)} each
        </p>
        {item.specialInstructions && (
          <p className="text-xs text-neutral-500 mt-1 italic">
            "{item.specialInstructions}"
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-neutral-200 rounded-lg">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            className="px-3 py-1 text-sm font-medium text-neutral-900 min-w-[2rem] text-center"
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={item.quantity >= 99}
            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Item Total */}
      <div className="text-right min-w-[4rem]">
        <span className="font-medium text-neutral-900">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}

export default CartItem;
