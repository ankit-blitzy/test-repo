/**
 * IngredientList Component - Displays ingredient information for menu items
 * 
 * A reusable component that renders a list of ingredients with support for
 * preview mode (showing limited items) and full display mode.
 * 
 * Features:
 * - Preview mode: Shows first 3 ingredients with "..." if more exist
 * - Full mode: Shows all ingredients
 * - Accessible with proper ARIA labels
 * - Responsive styling with Tailwind CSS
 */

import { useMemo } from 'react';
import clsx from 'clsx';
import type { IngredientListProps } from '@/types';

/** Maximum number of ingredients to show in preview mode */
const PREVIEW_LIMIT = 3;

/**
 * IngredientList Component
 * 
 * Displays a list of ingredients for a menu item. Supports preview mode
 * for compact display in cards and full mode for detailed views.
 * 
 * @param props - Component props
 * @param props.ingredients - Array of ingredient names to display
 * @param props.preview - When true, shows max 3 items with ellipsis
 * @param props.className - Additional CSS classes
 * 
 * @example
 * // Preview mode (compact)
 * <IngredientList 
 *   ingredients={['Beef patty', 'Lettuce', 'Tomato', 'Cheese']} 
 *   preview 
 * />
 * 
 * @example
 * // Full mode (all ingredients)
 * <IngredientList 
 *   ingredients={['Beef patty', 'Lettuce', 'Tomato', 'Cheese']}
 * />
 */
export function IngredientList({
  ingredients,
  preview = false,
  className,
}: IngredientListProps): JSX.Element {
  // Memoize the ingredients to display based on preview mode
  const displayIngredients = useMemo(() => {
    if (!preview || ingredients.length <= PREVIEW_LIMIT) {
      return ingredients;
    }
    return ingredients.slice(0, PREVIEW_LIMIT);
  }, [ingredients, preview]);

  // Calculate if there are more ingredients than shown
  const hasMore = preview && ingredients.length > PREVIEW_LIMIT;
  const remainingCount = ingredients.length - PREVIEW_LIMIT;

  // Handle empty ingredients array
  if (ingredients.length === 0) {
    return (
      <p 
        className={clsx('text-gray-400 text-sm italic', className)}
        aria-label="No ingredients listed"
      >
        No ingredients listed
      </p>
    );
  }

  // Preview mode: Compact inline display
  if (preview) {
    return (
      <div 
        className={clsx('flex items-center flex-wrap gap-1', className)}
        aria-label={`Ingredients: ${ingredients.join(', ')}`}
      >
        <span className="text-amber-600 text-sm mr-1" aria-hidden="true">
          🥬
        </span>
        <p className="text-gray-600 text-sm truncate">
          {displayIngredients.join(', ')}
          {hasMore && (
            <span 
              className="text-gray-400 ml-1"
              aria-label={`and ${remainingCount} more ingredient${remainingCount > 1 ? 's' : ''}`}
            >
              +{remainingCount} more
            </span>
          )}
        </p>
      </div>
    );
  }

  // Full mode: List display with ingredient tags/badges
  return (
    <div className={clsx('', className)}>
      <h4 
        className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2"
        id="ingredients-heading"
      >
        Ingredients
      </h4>
      <ul 
        className="flex flex-wrap gap-2"
        aria-labelledby="ingredients-heading"
        role="list"
      >
        {displayIngredients.map((ingredient, index) => (
          <li
            key={`${ingredient}-${index}`}
            className={clsx(
              'inline-flex items-center',
              'px-3 py-1.5',
              'text-sm font-medium',
              'bg-amber-100 text-amber-800',
              'rounded-full',
              'border border-amber-200',
              'transition-colors duration-150',
              'hover:bg-amber-200'
            )}
          >
            {ingredient}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * IngredientTag Component - Individual ingredient badge
 * 
 * A smaller sub-component for displaying a single ingredient as a styled tag.
 * Useful for custom layouts or when you need individual ingredient display.
 * 
 * @param props - Component props
 * @param props.ingredient - The ingredient name to display
 * @param props.className - Additional CSS classes
 * 
 * @example
 * <IngredientTag ingredient="Fresh lettuce" />
 */
export function IngredientTag({
  ingredient,
  className,
}: {
  ingredient: string;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={clsx(
        'inline-flex items-center',
        'px-2 py-1',
        'text-xs font-medium',
        'bg-amber-100 text-amber-800',
        'rounded-full',
        'border border-amber-200',
        className
      )}
    >
      {ingredient}
    </span>
  );
}

/**
 * IngredientsCount Component - Shows ingredient count badge
 * 
 * Displays the total number of ingredients as a small badge.
 * Useful for compact card displays where you just want to show the count.
 * 
 * @param props - Component props
 * @param props.count - Number of ingredients
 * @param props.className - Additional CSS classes
 * 
 * @example
 * <IngredientsCount count={5} />
 */
export function IngredientsCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1',
        'text-xs text-gray-500',
        className
      )}
      aria-label={`${count} ingredient${count !== 1 ? 's' : ''}`}
    >
      <span aria-hidden="true">🥬</span>
      {count} ingredient{count !== 1 ? 's' : ''}
    </span>
  );
}

// Default export for convenient importing
export default IngredientList;
