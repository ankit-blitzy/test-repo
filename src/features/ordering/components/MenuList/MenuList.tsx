/**
 * MenuList Component - Grid layout for displaying menu items
 * 
 * Renders a responsive grid of MenuItemCard components with support for
 * loading states, empty states, and error handling.
 * 
 * Features:
 * - Responsive grid layout (1-4 columns based on viewport)
 * - Loading skeleton display
 * - Empty state messaging
 * - Smooth animations
 */

import { useMemo } from 'react';
import clsx from 'clsx';
import type { MenuListProps, MenuItem } from '@/types';
import { MenuItemCard } from '../MenuItemCard';

/**
 * Loading skeleton for a single menu item card.
 */
function MenuItemSkeleton(): JSX.Element {
  return (
    <div 
      className={clsx(
        'bg-white rounded-xl shadow-md',
        'overflow-hidden border border-gray-100',
        'animate-pulse'
      )}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gray-200" />
      
      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Ingredients */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
}

/**
 * Empty state component when no items are available.
 */
function EmptyState(): JSX.Element {
  return (
    <div 
      className={clsx(
        'col-span-full',
        'flex flex-col items-center justify-center',
        'py-16 px-4',
        'text-center'
      )}
      role="status"
      aria-label="No menu items available"
    >
      <span className="text-6xl mb-4" aria-hidden="true">🍔</span>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Menu Items Found
      </h3>
      <p className="text-gray-500 max-w-md">
        We couldn&apos;t find any menu items in this category. 
        Please try selecting a different category or check back later.
      </p>
    </div>
  );
}

/**
 * MenuList Component
 * 
 * Displays a grid of menu items with loading and empty states.
 * 
 * @param props - Component props
 * @param props.items - Array of menu items to display
 * @param props.isLoading - Whether data is currently loading
 * @param props.onItemClick - Callback when an item is clicked for details
 * @param props.onAddToCart - Callback when add to cart is clicked
 * @param props.className - Additional CSS classes
 * 
 * @example
 * <MenuList
 *   items={menuItems}
 *   isLoading={isLoading}
 *   onItemClick={(item) => openModal(item)}
 *   onAddToCart={(item, qty) => addToCart(item, qty)}
 * />
 */
export function MenuList({
  items,
  isLoading = false,
  onItemClick,
  onAddToCart,
  className,
}: MenuListProps): JSX.Element {
  // Memoize the grid classes for performance
  const gridClasses = useMemo(() => clsx(
    'grid gap-6',
    'grid-cols-1',
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'xl:grid-cols-4',
    className
  ), [className]);

  // Loading state: Show skeleton cards
  if (isLoading) {
    return (
      <div 
        className={gridClasses}
        aria-label="Loading menu items"
        aria-busy="true"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <MenuItemSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Empty state: No items available
  if (items.length === 0) {
    return (
      <div className={gridClasses}>
        <EmptyState />
      </div>
    );
  }

  // Normal state: Render menu items
  return (
    <div 
      className={gridClasses}
      role="list"
      aria-label="Menu items"
    >
      {items.map((item: MenuItem) => (
        <div key={item._id} role="listitem">
          <MenuItemCard
            item={item}
            onItemClick={onItemClick}
            onAddToCart={onAddToCart}
          />
        </div>
      ))}
    </div>
  );
}

// Default export for convenient importing
export default MenuList;
