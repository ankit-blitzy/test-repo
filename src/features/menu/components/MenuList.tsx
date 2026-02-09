/**
 * Menu list component that displays a grid of menu items.
 * Includes category navigation and item detail modal.
 */

import { useState } from 'react';
import type { MenuItemResponse } from '@/types/api.types';
import { useMenu } from '../hooks/useMenu';
import { CategoryNav } from './CategoryNav';
import { MenuItem } from './MenuItem';
import { MenuItemDetail } from './MenuItemDetail';
import { Loader, Alert } from '@/components/ui';

/**
 * Renders the complete menu display with category filtering,
 * item grid, and item detail modal.
 */
export function MenuList() {
  const { categories, filteredItems, selectedCategory, selectCategory, loadingState, error, refreshMenu } = useMenu();
  const [detailItem, setDetailItem] = useState<MenuItemResponse | null>(null);

  if (loadingState === 'loading') {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Loading menu..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading menu">
        {error}
        <button onClick={refreshMenu} className="ml-2 underline font-medium">
          Try again
        </button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={selectCategory}
      />

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-light text-lg">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} onViewDetail={setDetailItem} />
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      <MenuItemDetail
        item={detailItem}
        isOpen={detailItem !== null}
        onClose={() => setDetailItem(null)}
      />
    </div>
  );
}
