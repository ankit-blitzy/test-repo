/**
 * MenuItemCard Component
 * Displays a single menu item with its details, including ingredients
 */

import { ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';
import type { MenuItemCardProps } from '@/types/menu.types';
import { formatPrice } from '@/utils/formatters';
import { IngredientList } from './IngredientList';

/**
 * MenuItemCard component for displaying menu items
 * Features ingredient display and add to cart functionality
 */
export function MenuItemCard({
  item,
  onAddToCart,
}: MenuItemCardProps): React.ReactElement {
  const handleAddToCart = () => {
    if (item.isAvailable) {
      onAddToCart(item);
    }
  };

  return (
    <article
      className={clsx(
        'bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg',
        !item.isAvailable && 'opacity-60'
      )}
    >
      {/* Item Image */}
      {item.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-neutral-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Item Content */}
      <div className="p-4">
        {/* Header with name and price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold text-neutral-900">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-primary-600 whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
          {item.description}
        </p>

        {/* Ingredients List */}
        {item.ingredients && item.ingredients.length > 0 && (
          <IngredientList ingredients={item.ingredients} />
        )}

        {/* Add to Cart Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={clsx(
              'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
              item.isAvailable
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            )}
            aria-label={
              item.isAvailable
                ? `Add ${item.name} to cart`
                : `${item.name} is unavailable`
            }
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default MenuItemCard;
