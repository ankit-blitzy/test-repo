/**
 * Menu feature type definitions.
 */

import type { LoadingState } from '@/types/common.types';
import type { MenuCategoryResponse, MenuItemResponse } from '@/types/api.types';

/** Menu display state */
export interface MenuState {
  categories: MenuCategoryResponse[];
  items: MenuItemResponse[];
  selectedCategory: string | null;
  loadingState: LoadingState;
  error: string | null;
}

/** Menu hook return type */
export interface UseMenuReturn extends MenuState {
  selectCategory: (categoryId: string | null) => void;
  refreshMenu: () => Promise<void>;
  filteredItems: MenuItemResponse[];
}
