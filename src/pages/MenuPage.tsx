/**
 * MenuPage Component
 * Menu browsing page with category filtering and search
 * Features ingredient display for menu items
 */

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useMenu, useCart, MenuList } from '@/features/ordering';
import { Input } from '@/components/ui/Input';

/**
 * MenuPage component
 */
export function MenuPage(): React.ReactElement {
  const {
    categories,
    filteredItems,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,
    setSelectedCategory,
    setSearchQuery,
  } = useMenu();

  const { addItem, openCart } = useCart();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Handle add to cart
  const handleAddToCart = (item: Parameters<typeof addItem>[0]) => {
    addItem(item);
    openCart();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-neutral-900">Our Menu</h1>
          <p className="mt-2 text-neutral-600">
            Browse our selection of delicious burgers, sides, and drinks.
            Each item shows its fresh ingredients.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm mb-4"
            >
              <span className="flex items-center gap-2 font-medium">
                <Filter className="w-5 h-5" />
                Filters
              </span>
              <span className="text-sm text-neutral-500">
                {selectedCategoryId ? '1 active' : 'All categories'}
              </span>
            </button>

            {/* Filter panel */}
            <div
              className={clsx(
                'bg-white rounded-lg shadow-sm p-4',
                'lg:block',
                showMobileFilters ? 'block' : 'hidden'
              )}
            >
              {/* Search */}
              <div className="mb-6">
                <Input
                  type="search"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  size="sm"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Categories
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className={clsx(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        !selectedCategoryId
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      )}
                    >
                      All Items
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          selectedCategoryId === category.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        )}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main content - Menu items */}
          <main className="flex-1">
            {/* Error state */}
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Results count */}
            {!isLoading && !error && (
              <p className="text-sm text-neutral-500 mb-4">
                Showing {filteredItems.length}{' '}
                {filteredItems.length === 1 ? 'item' : 'items'}
                {selectedCategoryId && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 text-primary-600 hover:text-primary-700"
                  >
                    Clear filter
                  </button>
                )}
              </p>
            )}

            {/* Menu list */}
            <MenuList
              items={filteredItems}
              onAddToCart={handleAddToCart}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
