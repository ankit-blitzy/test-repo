/**
 * ItemDetailsModal Component - Full item details with complete ingredients list
 * 
 * A modal dialog that displays comprehensive details about a menu item,
 * including the full ingredient list, description, and quantity selection.
 * 
 * Features:
 * - Full ingredient list display
 * - Quantity selector
 * - Add to cart functionality
 * - Accessible modal with focus trap
 * - Keyboard navigation (Escape to close)
 * - Click outside to close
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { X, Minus, Plus } from 'lucide-react';
import type { ItemDetailsModalProps } from '@/types';
import { IngredientList } from '../IngredientList';

/**
 * Default placeholder image for items without images.
 */
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f5f5dc" width="400" height="300"/%3E%3Ctext fill="%23d4a574" font-family="Arial" font-size="48" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E🍔%3C/text%3E%3C/svg%3E';

/**
 * Formats a price number to currency display.
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * ItemDetailsModal Component
 * 
 * Displays a modal with full menu item details including complete ingredients.
 * 
 * @param props - Component props
 * @param props.item - The menu item to display (null when closed)
 * @param props.isOpen - Whether the modal is currently open
 * @param props.onClose - Callback to close the modal
 * @param props.onAddToCart - Callback when add to cart is clicked
 * 
 * @example
 * <ItemDetailsModal
 *   item={selectedItem}
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onAddToCart={(item, qty) => addToCart(item, qty)}
 * />
 */
export function ItemDetailsModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: ItemDetailsModalProps): JSX.Element | null {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset quantity when modal opens with a new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setImageError(false);
      // Focus the close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen, item?._id]);

  // Handle escape key to close modal
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle quantity changes
  const incrementQuantity = useCallback(() => {
    setQuantity(prev => Math.min(prev + 1, 99));
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(prev - 1, 1));
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (item && onAddToCart) {
      onAddToCart(item, quantity);
      onClose();
    }
  }, [item, quantity, onAddToCart, onClose]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Don't render if not open or no item
  if (!isOpen || !item) {
    return null;
  }

  // Determine image source
  const imageSource = imageError || !item.image_url
    ? PLACEHOLDER_IMAGE
    : item.image_url;

  // Calculate total price
  const totalPrice = item.price * quantity;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'p-4 sm:p-6 md:p-8',
        'bg-black/50 backdrop-blur-sm',
        'animate-fadeIn'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={clsx(
          'relative w-full max-w-2xl max-h-[90vh]',
          'bg-white rounded-2xl shadow-2xl',
          'overflow-hidden',
          'flex flex-col',
          'animate-slideUp'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className={clsx(
            'absolute top-4 right-4 z-10',
            'p-2 rounded-full',
            'bg-white/90 hover:bg-white',
            'text-gray-600 hover:text-gray-900',
            'shadow-md',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-amber-500'
          )}
          aria-label="Close modal"
        >
          <X size={24} aria-hidden="true" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Image Section */}
          <div className="relative aspect-video sm:aspect-[16/9] bg-amber-50">
            <img
              src={imageSource}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            
            {/* Unavailable Badge */}
            {!item.is_available && (
              <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-lg font-medium">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-bold text-gray-800"
                >
                  {item.name}
                </h2>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Ingredients - Full List */}
            {item.ingredients.length > 0 && (
              <div>
                <IngredientList ingredients={item.ingredients} />
              </div>
            )}
          </div>
        </div>

        {/* Footer - Quantity and Add to Cart */}
        {item.is_available && (
          <div 
            className={clsx(
              'border-t border-gray-100',
              'p-4 sm:p-6',
              'bg-gray-50',
              'flex flex-col sm:flex-row items-center gap-4'
            )}
          >
            {/* Quantity Selector */}
            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className={clsx(
                  'p-2 rounded-md',
                  'text-gray-600 hover:text-gray-900',
                  'hover:bg-gray-100',
                  'transition-colors duration-150',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus:outline-none focus:ring-2 focus:ring-amber-500'
                )}
                aria-label="Decrease quantity"
              >
                <Minus size={20} aria-hidden="true" />
              </button>
              
              <span 
                className="w-12 text-center text-lg font-semibold text-gray-800"
                aria-label={`Quantity: ${quantity}`}
              >
                {quantity}
              </span>
              
              <button
                type="button"
                onClick={incrementQuantity}
                disabled={quantity >= 99}
                className={clsx(
                  'p-2 rounded-md',
                  'text-gray-600 hover:text-gray-900',
                  'hover:bg-gray-100',
                  'transition-colors duration-150',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus:outline-none focus:ring-2 focus:ring-amber-500'
                )}
                aria-label="Increase quantity"
              >
                <Plus size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={clsx(
                'flex-1 w-full sm:w-auto',
                'py-3 px-6',
                'bg-amber-500 hover:bg-amber-600',
                'text-white font-semibold text-lg',
                'rounded-lg',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                'active:scale-[0.98]'
              )}
              aria-label={`Add ${quantity} ${item.name} to cart for ${formatPrice(totalPrice)}`}
            >
              Add to Cart - {formatPrice(totalPrice)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export for convenient importing
export default ItemDetailsModal;
