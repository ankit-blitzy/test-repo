/**
 * Category navigation component for filtering menu items.
 * Displays horizontal scrollable category pills with active state.
 */

import type { MenuCategoryResponse } from '@/types/api.types';
import clsx from 'clsx';

/** Props for CategoryNav component */
export interface CategoryNavProps {
  categories: MenuCategoryResponse[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

/**
 * Renders a horizontal navigation bar of category filter buttons.
 * Includes an "All" option to clear the filter.
 */
export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" aria-label="Menu categories">
      <button
        onClick={() => onSelectCategory(null)}
        className={clsx(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
          selectedCategory === null
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-text hover:bg-gray-200'
        )}
        aria-pressed={selectedCategory === null}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={clsx(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category.id
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-text hover:bg-gray-200'
          )}
          aria-pressed={selectedCategory === category.id}
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}
