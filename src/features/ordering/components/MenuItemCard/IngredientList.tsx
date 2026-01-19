/**
 * IngredientList Component
 * Displays a list of ingredients for a menu item
 * Supports maximum display with overflow indicator
 */

import type { IngredientListProps } from '@/types/menu.types';

/**
 * Default maximum ingredients to display
 */
const DEFAULT_MAX_DISPLAY = 5;

/**
 * IngredientList component for displaying menu item ingredients
 * Accessible design with semantic HTML
 */
export function IngredientList({
  ingredients,
  maxDisplay = DEFAULT_MAX_DISPLAY,
}: IngredientListProps): React.ReactElement | null {
  // Don't render if no ingredients
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  // Split ingredients into displayed and overflow
  const displayedIngredients = ingredients.slice(0, maxDisplay);
  const remainingCount = ingredients.length - maxDisplay;

  return (
    <div
      className="mt-3"
      role="region"
      aria-labelledby="ingredients-label"
    >
      <span
        id="ingredients-label"
        className="text-sm text-neutral-500 font-medium"
      >
        Ingredients:
      </span>
      <ul
        className="flex flex-wrap gap-1.5 mt-1.5"
        aria-label="List of ingredients"
      >
        {displayedIngredients.map((ingredient) => (
          <li
            key={ingredient}
            className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full"
          >
            {ingredient}
          </li>
        ))}
        {remainingCount > 0 && (
          <li
            className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded-full"
            aria-label={`and ${remainingCount} more ingredients`}
          >
            +{remainingCount} more
          </li>
        )}
      </ul>
    </div>
  );
}

export default IngredientList;
