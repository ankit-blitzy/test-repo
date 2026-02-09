/**
 * Menu item detail modal component.
 * Shows full item information including nutrition and allergen data.
 */

import type { MenuItemResponse } from '@/types/api.types';
import { useCart } from '@/features/cart/hooks/useCart';
import { formatPrice } from '@/utils/formatters';
import { Modal, Button, Badge } from '@/components/ui';

/** Props for MenuItemDetail component */
export interface MenuItemDetailProps {
  item: MenuItemResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Renders a detailed view of a menu item inside a modal dialog.
 * Includes nutrition information, allergens, and add-to-cart action.
 */
export function MenuItemDetail({ item, isOpen, onClose }: MenuItemDetailProps) {
  const { addItem } = useCart();

  if (!item) return null;

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item.name} size="lg">
      <div className="space-y-4">
        {/* Image */}
        <div className="h-64 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 256"><rect width="400" height="256" fill="%23f3f4f6"/><text x="200" y="140" text-anchor="middle" font-size="64">🍔</text></svg>';
            }}
          />
        </div>

        {/* Description */}
        <p className="text-text-light">{item.description}</p>

        {/* Price */}
        <div className="text-2xl font-bold text-primary">{formatPrice(item.price)}</div>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text mb-2">Allergens</h4>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen) => (
                <Badge key={allergen} variant="warning">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Info */}
        {item.nutritionInfo && (
          <div>
            <h4 className="text-sm font-semibold text-text mb-2">Nutrition Information</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-text">{item.nutritionInfo.calories}</div>
                <div className="text-xs text-text-light">Calories</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-text">{item.nutritionInfo.protein}g</div>
                <div className="text-xs text-text-light">Protein</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-text">{item.nutritionInfo.carbs}g</div>
                <div className="text-xs text-text-light">Carbs</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-text">{item.nutritionInfo.fat}g</div>
                <div className="text-xs text-text-light">Fat</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button fullWidth onClick={handleAddToCart} disabled={!item.isAvailable}>
            {item.isAvailable ? 'Add to Cart' : 'Sold Out'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
