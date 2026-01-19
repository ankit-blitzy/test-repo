/**
 * MenuPage Component - Menu page displaying items with ingredients
 * 
 * The main page component for the menu section, orchestrating the display
 * of menu items, category filtering, and item detail modal.
 * 
 * Features:
 * - Category filter tabs
 * - Responsive menu grid
 * - Item detail modal
 * - Loading and error states
 * - Cart integration ready
 */

import { useState, useCallback } from 'react';
import clsx from 'clsx';
import type { MenuItem } from '@/types';
import { useMenu } from '@/features/ordering/hooks/useMenu';
import { MenuList } from '@/features/ordering/components/MenuList';
import { ItemDetailsModal } from '@/features/ordering/components/ItemDetailsModal';

/**
 * MenuPage Component
 * 
 * Displays the restaurant menu with category filtering and item details.
 * 
 * @example
 * // In App router
 * <Route path="/menu" element={<MenuPage />} />
 */
export function MenuPage(): JSX.Element {
  // Local state for modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get menu data from hook
  const {
    filteredItems,
    categories,
    isLoading,
    isCategoriesLoading,
    error,
    selectedCategoryId,
    setSelectedCategory,
    clearError,
  } = useMenu();

  // Handle item click to open modal
  const handleItemClick = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing selectedItem for smooth animation
    setTimeout(() => setSelectedItem(null), 200);
  }, []);

  // Handle add to cart (placeholder for cart integration)
  const handleAddToCart = useCallback((item: MenuItem, quantity: number) => {
    // TODO: Integrate with cart store when implemented
    console.log(`Added ${quantity}x ${item.name} to cart`);
    // For now, show a simple notification
    alert(`Added ${quantity}x ${item.name} to cart!`);
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, [setSelectedCategory]);

  // Handle error dismissal
  const handleDismissError = useCallback(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">
            Our Menu
          </h1>
          <p className="text-amber-100 text-center mt-2">
            Discover our delicious handcrafted burgers and sides
          </p>
        </div>
      </header>

      {/* Category Filter */}
      <nav className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div 
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
            role="tablist"
            aria-label="Menu categories"
          >
            {/* All Items Tab */}
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategoryId === null}
              onClick={() => handleCategorySelect(null)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                selectedCategoryId === null
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              All Items
            </button>

            {/* Category Tabs */}
            {isCategoriesLoading ? (
              // Loading skeleton for categories
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={`cat-skeleton-${i}`}
                    className="w-24 h-9 bg-gray-200 rounded-full animate-pulse"
                  />
                ))}
              </>
            ) : (
              categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategoryId === category._id}
                  onClick={() => handleCategorySelect(category._id)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                    selectedCategoryId === category._id
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div 
            className={clsx(
              'mb-6 p-4 rounded-lg',
              'bg-red-50 border border-red-200',
              'flex items-center justify-between'
            )}
            role="alert"
          >
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Menu List */}
        <MenuList
          items={filteredItems}
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

// Default export for convenient importing
export default MenuPage;
