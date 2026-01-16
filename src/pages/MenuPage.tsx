/**
 * @fileoverview Menu display page component for the Burger House restaurant application.
 * 
 * This page displays all available menu items organized by category with filtering
 * capabilities. Users can browse the full menu, filter by category, select quantities,
 * and add items to their shopping cart.
 * 
 * Features:
 * - Category filtering with active state highlighting
 * - Responsive grid layout adapting to all screen sizes
 * - Loading state during data fetching
 * - Error handling with user-friendly messages
 * - Quantity selector for adding items to cart
 * - Availability indicators for out-of-stock items
 * - Price display in currency format
 * 
 * @module pages/MenuPage
 * @version 1.0.0
 * 
 * @example
 * // Used in React Router configuration
 * import MenuPage from './pages/MenuPage';
 * 
 * <Route path="/menu" element={<MenuPage />} />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { Button, Card, LoadingSpinner } from '../components';
import { MenuItem, MenuCategory } from '../types';
import type { CategoryInfo } from '../types';
import { getAllMenuItems, getMenuItemsByCategory, getCategories } from '../services/menu';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Type representing the selected category state.
 * Can be 'all' to show all items or a specific MenuCategory value.
 */
type SelectedCategoryType = MenuCategory | 'all';

/**
 * Interface for tracking item quantities before adding to cart.
 * Maps item IDs to their selected quantity.
 */
interface ItemQuantities {
  [itemId: string]: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Formats a price number as a currency string.
 * 
 * @param price - The price value to format
 * @returns Formatted price string with dollar sign and two decimal places
 * 
 * @example
 * formatPrice(9.99) // Returns "$9.99"
 * formatPrice(10) // Returns "$10.00"
 */
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Maps MenuCategory enum values to their display names.
 * Provides user-friendly labels for category buttons.
 */
const categoryDisplayNames: Record<MenuCategory, string> = {
  [MenuCategory.Burgers]: 'Burgers',
  [MenuCategory.Sides]: 'Sides',
  [MenuCategory.Drinks]: 'Drinks',
  [MenuCategory.Desserts]: 'Desserts',
  [MenuCategory.Specials]: 'Specials',
};

/**
 * Maps MenuCategory enum values to their emoji representations.
 * Used as visual placeholders when item images are not available.
 */
const categoryEmojis: Record<MenuCategory, string> = {
  [MenuCategory.Burgers]: '🍔',
  [MenuCategory.Sides]: '🍟',
  [MenuCategory.Drinks]: '🥤',
  [MenuCategory.Desserts]: '🍰',
  [MenuCategory.Specials]: '⭐',
};

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

/**
 * Props interface for CategoryButton component.
 */
interface CategoryButtonProps {
  /** Label text to display on the button */
  label: string;
  /** Number of items in this category (optional) */
  count?: number;
  /** Whether this category is currently selected */
  isActive: boolean;
  /** Click handler for category selection */
  onClick: () => void;
}

/**
 * CategoryButton Component
 * 
 * A styled button for category filtering with active state indication.
 * Shows category name and optional item count.
 * 
 * @param props - Component props
 * @returns Category filter button element
 */
function CategoryButton({ label, count, isActive, onClick }: CategoryButtonProps): React.ReactElement {
  const baseClasses = 'px-4 py-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2';
  
  const activeClasses = 'bg-amber-500 text-white shadow-md hover:bg-amber-600';
  const inactiveClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900';
  
  const className = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-pressed={isActive}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 text-sm ${isActive ? 'text-amber-100' : 'text-gray-500'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}

/**
 * Props interface for QuantitySelector component.
 */
interface QuantitySelectorProps {
  /** Current quantity value */
  quantity: number;
  /** Handler for quantity changes */
  onChange: (newQuantity: number) => void;
  /** Minimum allowed quantity (default: 1) */
  min?: number;
  /** Maximum allowed quantity (default: 10) */
  max?: number;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * QuantitySelector Component
 * 
 * A compact quantity selector with increment/decrement buttons.
 * Enforces min/max bounds and provides accessible controls.
 * 
 * @param props - Component props
 * @returns Quantity selector element
 */
function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 10,
  disabled = false,
}: QuantitySelectorProps): React.ReactElement {
  const handleDecrement = (): void => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (): void => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <span className="text-lg font-medium">−</span>
      </button>
      <span className="w-8 text-center font-medium text-gray-900" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <span className="text-lg font-medium">+</span>
      </button>
    </div>
  );
}

/**
 * Props interface for MenuItemCard component.
 */
interface MenuItemCardProps {
  /** The menu item to display */
  item: MenuItem;
  /** Current selected quantity for this item */
  quantity: number;
  /** Handler for quantity changes */
  onQuantityChange: (quantity: number) => void;
  /** Handler for adding item to cart */
  onAddToCart: () => void;
}

/**
 * MenuItemCard Component
 * 
 * Displays a single menu item with image, details, price, quantity selector,
 * and add-to-cart functionality. Shows availability status and handles
 * disabled states for unavailable items.
 * 
 * @param props - Component props
 * @returns Menu item card element
 */
function MenuItemCard({
  item,
  quantity,
  onQuantityChange,
  onAddToCart,
}: MenuItemCardProps): React.ReactElement {
  const isAvailable = item.isAvailable;
  
  return (
    <Card 
      className={`flex flex-col h-full overflow-hidden ${!isAvailable ? 'opacity-60' : ''}`}
      noPadding
      hoverable={isAvailable}
    >
      {/* Item Image or Placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to emoji on image load error
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement?.querySelector('.emoji-fallback')?.classList.remove('hidden');
            }}
          />
        ) : null}
        <span 
          className={`emoji-fallback text-6xl select-none ${item.image ? 'hidden' : ''}`}
          role="img"
          aria-label={`${categoryDisplayNames[item.category]} icon`}
        >
          {categoryEmojis[item.category]}
        </span>
        
        {/* Unavailable Badge */}
        {!isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Unavailable
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded shadow-sm">
          {categoryDisplayNames[item.category]}
        </div>
      </div>
      
      {/* Item Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Item Name */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
          {item.name}
        </h3>
        
        {/* Item Description - Truncated to 2 lines */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {item.description}
        </p>
        
        {/* Price */}
        <div className="mb-3">
          <span className="text-xl font-bold text-amber-600">
            {formatPrice(item.price)}
          </span>
        </div>
        
        {/* Quantity Selector and Add to Cart */}
        <div className="flex items-center justify-between gap-3">
          <QuantitySelector
            quantity={quantity}
            onChange={onQuantityChange}
            disabled={!isAvailable}
            min={1}
            max={10}
          />
          
          <Button
            variant="primary"
            size="sm"
            onClick={onAddToCart}
            disabled={!isAvailable}
            className="flex-shrink-0"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * MenuPage Component
 * 
 * The main menu display page showing all food items with category filtering.
 * Fetches menu data from the menu service, displays items in a responsive grid,
 * and integrates with CartContext for shopping cart functionality.
 * 
 * State Management:
 * - menuItems: Array of MenuItem objects currently displayed
 * - categories: Array of CategoryInfo for filter buttons
 * - selectedCategory: Currently selected category filter
 * - isLoading: Loading state during data fetch
 * - error: Error message if fetch fails
 * - itemQuantities: Map of item IDs to selected quantities
 * 
 * @returns The rendered MenuPage component
 * 
 * @example
 * // Basic usage in a route
 * <Route path="/menu" element={<MenuPage />} />
 */
function MenuPage(): React.ReactElement {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  
  /** Array of menu items currently displayed (all or filtered by category) */
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  /** Array of category info for filter buttons with item counts */
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  
  /** Currently selected category filter ('all' shows all items) */
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType>('all');
  
  /** Loading state while fetching menu data */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /** Error message if data fetching fails */
  const [error, setError] = useState<string | null>(null);
  
  /** Map of item IDs to selected quantities for add-to-cart */
  const [itemQuantities, setItemQuantities] = useState<ItemQuantities>({});

  // ---------------------------------------------------------------------------
  // CONTEXT
  // ---------------------------------------------------------------------------
  
  /** Cart context providing addToCart function */
  const { addToCart } = useCart();

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  
  /**
   * Fetches category data on component mount.
   * Called once to populate category filter buttons.
   */
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (err) {
        console.error('MenuPage: Error fetching categories:', err);
        // Don't set error state for categories - menu items can still be displayed
      }
    };

    fetchCategories();
  }, []);

  /**
   * Fetches menu items based on selected category.
   * Triggered on mount and whenever selectedCategory changes.
   */
  useEffect(() => {
    const fetchMenuItems = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        let items: MenuItem[];
        
        if (selectedCategory === 'all') {
          // Fetch all menu items
          items = await getAllMenuItems();
        } else {
          // Fetch items for specific category
          items = await getMenuItemsByCategory(selectedCategory);
        }
        
        setMenuItems(items);
        
        // Initialize quantities for new items (default to 1)
        const newQuantities: ItemQuantities = {};
        items.forEach((item) => {
          // Preserve existing quantity if already set, otherwise default to 1
          newQuantities[item.id] = itemQuantities[item.id] ?? 1;
        });
        setItemQuantities(newQuantities);
        
      } catch (err) {
        console.error('MenuPage: Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  
  /**
   * Handles category filter selection.
   * Updates selectedCategory state to trigger menu item fetch.
   * 
   * @param category - The category to filter by, or 'all' for all items
   */
  const handleCategorySelect = useCallback((category: SelectedCategoryType): void => {
    setSelectedCategory(category);
  }, []);

  /**
   * Handles quantity change for a specific item.
   * Updates the itemQuantities map with the new value.
   * 
   * @param itemId - The ID of the item to update
   * @param newQuantity - The new quantity value
   */
  const handleQuantityChange = useCallback((itemId: string, newQuantity: number): void => {
    setItemQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  }, []);

  /**
   * Handles adding an item to the cart.
   * Uses the quantity from itemQuantities state and resets to 1 after adding.
   * 
   * @param item - The menu item to add to cart
   */
  const handleAddToCart = useCallback((item: MenuItem): void => {
    const quantity = itemQuantities[item.id] ?? 1;
    addToCart(item, quantity);
    
    // Reset quantity to 1 after adding to cart
    setItemQuantities((prev) => ({
      ...prev,
      [item.id]: 1,
    }));
  }, [addToCart, itemQuantities]);

  /**
   * Calculates total item count across all categories.
   * Used for the "All" button count display.
   */
  const totalItemCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Menu
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our delicious selection of burgers, sides, drinks, and more.
            Made fresh to order with quality ingredients.
          </p>
        </header>

        {/* Category Filter Section */}
        <nav 
          className="mb-8 md:mb-10"
          aria-label="Menu categories"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {/* All Items Button */}
            <CategoryButton
              label="All"
              count={totalItemCount}
              isActive={selectedCategory === 'all'}
              onClick={() => handleCategorySelect('all')}
            />
            
            {/* Category Buttons */}
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                label={category.name}
                count={category.count}
                isActive={selectedCategory === category.id}
                onClick={() => handleCategorySelect(category.id as MenuCategory)}
              />
            ))}
          </div>
        </nav>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" text="Loading menu..." />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
              <svg
                className="w-12 h-12 text-red-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(selectedCategory)}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        {!isLoading && !error && menuItems.length > 0 && (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            role="list"
            aria-label="Menu items"
          >
            {menuItems.map((item) => (
              <div key={item.id} role="listitem">
                <MenuItemCard
                  item={item}
                  quantity={itemQuantities[item.id] ?? 1}
                  onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                  onAddToCart={() => handleAddToCart(item)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && menuItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No items found
            </h2>
            <p className="text-gray-500 text-center max-w-sm">
              {selectedCategory === 'all'
                ? 'Our menu is currently empty. Please check back later!'
                : `No items available in the ${categoryDisplayNames[selectedCategory]} category.`}
            </p>
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleCategorySelect('all')}
              >
                View All Items
              </Button>
            )}
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && !error && menuItems.length > 0 && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            Showing {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
            {selectedCategory !== 'all' && ` in ${categoryDisplayNames[selectedCategory]}`}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default MenuPage;
