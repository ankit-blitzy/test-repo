/**
 * MenuItemCard Component - Displays a menu item card with ingredient preview
 * 
 * A card component showing menu item details including name, description,
 * price, image, and an ingredient preview. Supports click to view details
 * and add to cart functionality.
 * 
 * Features:
 * - Responsive card layout
 * - Image with fallback placeholder
 * - Price formatting
 * - Ingredient preview (first 3 items)
 * - Add to cart button
 * - Click to view details
 * - Availability indicator
 */

import { useCallback, useState } from 'react';
import clsx from 'clsx';
import type { MenuItemCardProps } from '@/types';
import { IngredientList } from '../IngredientList';

/**
 * Default placeholder image for items without images.
 */
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f5f5dc" width="400" height="300"/%3E%3Ctext fill="%23d4a574" font-family="Arial" font-size="48" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🍔%3C/text%3E%3C/svg%3E';

/**
 * Formats a price number to currency display.
 * 
 * @param price - Price value to format
 * @returns Formatted price string (e.g., "$12.99")
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * MenuItemCard Component
 * 
 * Displays a menu item in a card format with image, name, description,
 * price, and ingredient preview.
 * 
 * @param props - Component props
 * @param props.item - The menu item to display
 * @param props.onItemClick - Callback when card is clicked for details
 * @param props.onAddToCart - Callback when add to cart is clicked
 * @param props.className - Additional CSS classes
 * 
 * @example
 * <MenuItemCard
 *   item={menuItem}
 *   onItemClick={(item) => openModal(item)}
 *   onAddToCart={(item, qty) => addToCart(item, qty)}
 * />
 */
export function MenuItemCard({
  item,
  onItemClick,
  onAddToCart,
  className,
}: MenuItemCardProps): JSX.Element {
  const [imageError, setImageError] = useState(false);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle card click for viewing details
  const handleCardClick = useCallback(() => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [item, onItemClick]);

  // Handle keyboard navigation for card click
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  // Handle add to cart click
  const handleAddToCart = useCallback((event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    if (onAddToCart) {
      onAddToCart(item, 1);
    }
  }, [item, onAddToCart]);

  // Determine the image source
  const imageSource = imageError || !item.image_url 
    ? PLACEHOLDER_IMAGE 
    : item.image_url;

  return (
    <article
      className={clsx(
        'group relative',
        'bg-white rounded-xl shadow-md',
        'overflow-hidden',
        'border border-gray-100',
        'transition-all duration-300',
        'hover:shadow-xl hover:border-amber-200',
        'focus-within:ring-2 focus-within:ring-amber-500',
        !item.is_available && 'opacity-60',
        className
      )}
      role="button"
      tabIndex={item.is_available ? 0 : -1}
      onClick={item.is_available ? handleCardClick : undefined}
      onKeyDown={item.is_available ? handleKeyDown : undefined}
      aria-label={`${item.name}, ${formatPrice(item.price)}${!item.is_available ? ', Currently unavailable' : ''}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-amber-50">
        <img
          src={imageSource}
          alt={item.name}
          className={clsx(
            'w-full h-full object-cover',
            'transition-transform duration-300',
            'group-hover:scale-105'
          )}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Unavailable Overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div 
          className={clsx(
            'absolute top-3 right-3',
            'bg-amber-500 text-white',
            'px-3 py-1 rounded-full',
            'text-sm font-bold',
            'shadow-md'
          )}
        >
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Ingredients Preview */}
        {item.ingredients.length > 0 && (
          <div className="mb-4">
            <IngredientList 
              ingredients={item.ingredients} 
              preview 
            />
          </div>
        )}

        {/* Add to Cart Button */}
        {item.is_available && (
          <button
            type="button"
            onClick={handleAddToCart}
            className={clsx(
              'w-full py-2.5 px-4',
              'bg-amber-500 hover:bg-amber-600',
              'text-white font-semibold',
              'rounded-lg',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
              'active:scale-[0.98]'
            )}
            aria-label={`Add ${item.name} to cart`}
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}

// Default export for convenient importing
export default MenuItemCard;
