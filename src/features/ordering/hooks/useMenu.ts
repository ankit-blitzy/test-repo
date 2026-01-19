/**
 * useMenu Hook - Custom hook for menu data access including ingredients
 * 
 * Provides a simplified interface for components to access menu data,
 * handle loading states, and trigger data fetching.
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useMenuStore } from '../store/menuStore';
import type { MenuItem, Category } from '@/types';

/**
 * Return type for the useMenu hook.
 */
export interface UseMenuReturn {
  /** Array of all menu items with ingredients */
  items: MenuItem[];
  
  /** Array of menu items filtered by selected category */
  filteredItems: MenuItem[];
  
  /** Array of all menu categories */
  categories: Category[];
  
  /** Whether menu data is currently loading */
  isLoading: boolean;
  
  /** Whether categories are currently loading */
  isCategoriesLoading: boolean;
  
  /** Error message if fetch failed */
  error: string | null;
  
  /** Currently selected category ID (null = show all) */
  selectedCategoryId: string | null;
  
  /** Manually trigger menu fetch */
  refetch: () => Promise<void>;
  
  /** Manually trigger categories fetch */
  refetchCategories: () => Promise<void>;
  
  /** Set selected category filter */
  setSelectedCategory: (categoryId: string | null) => void;
  
  /** Get a single item by ID */
  getItemById: (id: string) => MenuItem | undefined;
  
  /** Clear any error state */
  clearError: () => void;
  
  /** Check if cache is valid */
  isCacheValid: boolean;
}

/**
 * Options for the useMenu hook.
 */
export interface UseMenuOptions {
  /** Whether to automatically fetch on mount (default: true) */
  autoFetch?: boolean;
  
  /** Whether to fetch categories on mount (default: true) */
  fetchCategories?: boolean;
  
  /** Category ID to filter by (can also be set via setSelectedCategory) */
  categoryId?: string | null;
}

/**
 * Custom hook for accessing menu data with ingredients.
 * 
 * Automatically fetches menu data on mount and provides methods
 * for filtering by category and accessing individual items.
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing menu data, state, and action methods
 * 
 * @example
 * // Basic usage - fetches menu automatically
 * const { items, isLoading, error } = useMenu();
 * 
 * @example
 * // With category filter
 * const { filteredItems, setSelectedCategory } = useMenu({
 *   categoryId: 'cat_burgers'
 * });
 * 
 * @example
 * // Without auto-fetch
 * const { items, refetch } = useMenu({ autoFetch: false });
 * // Later: refetch();
 */
export function useMenu(options: UseMenuOptions = {}): UseMenuReturn {
  const {
    autoFetch = true,
    fetchCategories: shouldFetchCategories = true,
    categoryId = null,
  } = options;

  // Get state and actions from the store
  const items = useMenuStore(state => state.items);
  const categories = useMenuStore(state => state.categories);
  const isLoading = useMenuStore(state => state.isLoading);
  const isCategoriesLoading = useMenuStore(state => state.isCategoriesLoading);
  const error = useMenuStore(state => state.error);
  const selectedCategoryId = useMenuStore(state => state.selectedCategoryId);
  const fetchMenu = useMenuStore(state => state.fetchMenu);
  const fetchAllCategories = useMenuStore(state => state.fetchAllCategories);
  const setSelectedCategoryAction = useMenuStore(state => state.setSelectedCategory);
  const getItemByIdAction = useMenuStore(state => state.getItemById);
  const clearErrorAction = useMenuStore(state => state.clearError);
  const isCacheValidFn = useMenuStore(state => state.isCacheValid);

  // Set initial category if provided via options
  useEffect(() => {
    if (categoryId !== null) {
      setSelectedCategoryAction(categoryId);
    }
  }, [categoryId, setSelectedCategoryAction]);

  // Auto-fetch menu on mount
  useEffect(() => {
    if (autoFetch) {
      fetchMenu();
    }
  }, [autoFetch, fetchMenu]);

  // Auto-fetch categories on mount
  useEffect(() => {
    if (shouldFetchCategories) {
      fetchAllCategories();
    }
  }, [shouldFetchCategories, fetchAllCategories]);

  // Memoized filtered items based on selected category
  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) {
      return items;
    }
    return items.filter(item => item.category_id === selectedCategoryId);
  }, [items, selectedCategoryId]);

  // Memoized refetch callback
  const refetch = useCallback(async () => {
    // Invalidate cache first
    useMenuStore.getState().invalidateCache();
    await fetchMenu();
  }, [fetchMenu]);

  // Memoized categories refetch callback
  const refetchCategories = useCallback(async () => {
    useMenuStore.getState().invalidateCache();
    await fetchAllCategories();
  }, [fetchAllCategories]);

  // Memoized setSelectedCategory callback
  const setSelectedCategory = useCallback((catId: string | null) => {
    setSelectedCategoryAction(catId);
  }, [setSelectedCategoryAction]);

  // Memoized getItemById callback
  const getItemById = useCallback((id: string) => {
    return getItemByIdAction(id);
  }, [getItemByIdAction]);

  // Memoized clearError callback
  const clearError = useCallback(() => {
    clearErrorAction();
  }, [clearErrorAction]);

  // Memoized cache valid status
  const isCacheValid = useMemo(() => {
    return isCacheValidFn();
  }, [isCacheValidFn]);

  return {
    items,
    filteredItems,
    categories,
    isLoading,
    isCategoriesLoading,
    error,
    selectedCategoryId,
    refetch,
    refetchCategories,
    setSelectedCategory,
    getItemById,
    clearError,
    isCacheValid,
  };
}

/**
 * Hook for accessing a single menu item by ID.
 * 
 * @param id - The unique identifier of the menu item
 * @returns The menu item or undefined if not found
 * 
 * @example
 * const item = useMenuItem('item_001');
 * if (item) {
 *   console.log(item.ingredients);
 * }
 */
export function useMenuItem(id: string): MenuItem | undefined {
  const getItemById = useMenuStore(state => state.getItemById);
  return getItemById(id);
}

/**
 * Hook for accessing menu items by category.
 * 
 * @param categoryId - The category ID to filter by
 * @returns Array of menu items in the category
 * 
 * @example
 * const burgers = useMenuItemsByCategory('cat_burgers');
 */
export function useMenuItemsByCategory(categoryId: string): MenuItem[] {
  const items = useMenuStore(state => state.items);
  
  return useMemo(() => {
    return items.filter(item => item.category_id === categoryId);
  }, [items, categoryId]);
}

/**
 * Hook for accessing available menu items only.
 * 
 * @returns Array of available menu items (is_available = true)
 * 
 * @example
 * const availableItems = useAvailableMenuItems();
 */
export function useAvailableMenuItems(): MenuItem[] {
  const getAvailableItems = useMenuStore(state => state.getAvailableItems);
  return getAvailableItems();
}
