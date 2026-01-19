/**
 * MenuList Component
 * Displays a grid of menu items with loading and empty states
 */

import type { MenuListProps } from '@/types/menu.types';
import { MenuItemCard } from '../MenuItemCard';

/**
 * MenuList component for displaying a grid of menu items
 */
export function MenuList({
  items,
  onAddToCart,
  isLoading = false,
}: MenuListProps): React.ReactElement {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-neutral-200" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-5 bg-neutral-200 rounded w-2/3" />
                <div className="h-5 bg-neutral-200 rounded w-1/5" />
              </div>
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-neutral-200 rounded-full w-16" />
                <div className="h-6 bg-neutral-200 rounded-full w-16" />
                <div className="h-6 bg-neutral-200 rounded-full w-16" />
              </div>
              <div className="h-10 bg-neutral-200 rounded-lg mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-900">
          No menu items found
        </h3>
        <p className="mt-1 text-neutral-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  // Menu grid
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="list"
      aria-label="Menu items"
    >
      {items.map((item) => (
        <div key={item.id} role="listitem">
          <MenuItemCard item={item} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}

export default MenuList;
