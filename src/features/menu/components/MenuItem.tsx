/**
 * Single menu item card component.
 * Displays item image, name, description, price, and add-to-cart button.
 */

import type { MenuItemResponse } from '@/types/api.types';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/utils/formatters';
import { Card, Button, Badge } from '@/components/ui';

/** Props for MenuItem component */
export interface MenuItemProps {
  item: MenuItemResponse;
  onViewDetail?: (item: MenuItemResponse) => void;
}

/**
 * Renders a menu item card with image, details, and add-to-cart functionality.
 */
export function MenuItem({ item, onViewDetail }: MenuItemProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
  };

  return (
    <Card padding="none" hoverable className="overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="100" y="110" text-anchor="middle" font-size="48">🍔</text></svg>';
          }}
        />
        {item.isPopular && (
          <Badge variant="warning" className="absolute top-2 left-2">
            Popular
          </Badge>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Sold Out</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-text mb-1">{item.name}</h3>
        <p className="text-sm text-text-light flex-1 mb-3 line-clamp-2">{item.description}</p>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.allergens.map((allergen) => (
              <Badge key={allergen} size="sm" variant="default">
                {allergen}
              </Badge>
            ))}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary">{formatPrice(item.price)}</span>
          <div className="flex gap-2">
            {onViewDetail && (
              <Button variant="ghost" size="sm" onClick={() => onViewDetail(item)}>
                Details
              </Button>
            )}
            <Button size="sm" onClick={handleAddToCart} disabled={!item.isAvailable}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
