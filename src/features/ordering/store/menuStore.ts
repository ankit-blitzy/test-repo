/**
 * Menu Store - Zustand state management for menu data with ingredients
 * 
 * Provides centralized state management for menu items, categories,
 * and related UI state. Includes caching with configurable TTL.
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { MenuItem, Category } from '@/types';
import { fetchMenuItems, fetchCategories } from '../api/menuApi';

/**
 * Cache configuration constants.
 */
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const STORAGE_KEY = 'menu-store';

/**
 * State interface for the menu store.
 */
export interface MenuState {
  /** Array of all menu items including ingredients */
  items: MenuItem[];
  
  /** Array of all menu categories */
  categories: Category[];
  
  /** Whether menu data is currently being fetched */
  isLoading: boolean;
  
  /** Whether categories are currently being fetched */
  isCategoriesLoading: boolean;
  
  /** Error message if the last fetch failed */
  error: string | null;
  
  /** Timestamp of the last successful menu fetch */
  lastFetched: number | null;
  
  /** Timestamp of the last successful categories fetch */
  categoriesLastFetched: number | null;
  
  /** Currently selected category filter (null = show all) */
  selectedCategoryId: string | null;
}

/**
 * Actions interface for the menu store.
 */
export interface MenuActions {
  /** Fetches all menu items from the API */
  fetchMenu: () => Promise<void>;
  
  /** Fetches all categories from the API */
  fetchAllCategories: () => Promise<void>;
  
  /** Gets a single menu item by ID */
  getItemById: (id: string) => MenuItem | undefined;
  
  /** Gets all items in a specific category */
  getItemsByCategory: (categoryId: string) => MenuItem[];
  
  /** Gets all available items (is_available = true) */
  getAvailableItems: () => MenuItem[];
  
  /** Sets the selected category filter */
  setSelectedCategory: (categoryId: string | null) => void;
  
  /** Clears the cache and resets state */
  invalidateCache: () => void;
  
  /** Clears any error state */
  clearError: () => void;
  
  /** Checks if the cache is still valid */
  isCacheValid: () => boolean;
}

/**
 * Combined type for the complete store.
 */
export type MenuStore = MenuState & MenuActions;

/**
 * Initial state values.
 */
const initialState: MenuState = {
  items: [],
  categories: [],
  isLoading: false,
  isCategoriesLoading: false,
  error: null,
  lastFetched: null,
  categoriesLastFetched: null,
  selectedCategoryId: null,
};

/**
 * Creates the menu store with persistence and devtools support.
 * 
 * @example
 * // In a component
 * const { items, isLoading, fetchMenu } = useMenuStore();
 * 
 * useEffect(() => {
 *   fetchMenu();
 * }, [fetchMenu]);
 */
export const useMenuStore = create<MenuStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Fetches all menu items from the API.
         * Uses cached data if available and within TTL.
         */
        fetchMenu: async () => {
          const state = get();
          
          // Use cached data if valid
          if (state.isCacheValid() && state.items.length > 0) {
            return;
          }

          set({ isLoading: true, error: null });

          try {
            const response = await fetchMenuItems();
            
            if (response.success) {
              set({
                items: response.data,
                isLoading: false,
                lastFetched: Date.now(),
                error: null,
              });
            } else {
              set({
                isLoading: false,
                error: response.error || 'Failed to fetch menu items',
              });
            }
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'An unexpected error occurred while fetching the menu';
            
            set({
              isLoading: false,
              error: errorMessage,
            });
          }
        },

        /**
         * Fetches all categories from the API.
         * Uses cached data if available and within TTL.
         */
        fetchAllCategories: async () => {
          const state = get();
          
          // Use cached data if valid
          if (
            state.categoriesLastFetched && 
            Date.now() - state.categoriesLastFetched < CACHE_TTL &&
            state.categories.length > 0
          ) {
            return;
          }

          set({ isCategoriesLoading: true });

          try {
            const response = await fetchCategories();
            
            if (response.success) {
              set({
                categories: response.data,
                isCategoriesLoading: false,
                categoriesLastFetched: Date.now(),
              });
            } else {
              set({
                isCategoriesLoading: false,
                error: response.error || 'Failed to fetch categories',
              });
            }
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'An unexpected error occurred while fetching categories';
            
            set({
              isCategoriesLoading: false,
              error: errorMessage,
            });
          }
        },

        /**
         * Gets a single menu item by ID.
         * 
         * @param id - The unique identifier of the menu item
         * @returns The menu item or undefined if not found
         */
        getItemById: (id: string) => {
          return get().items.find(item => item._id === id);
        },

        /**
         * Gets all menu items in a specific category.
         * 
         * @param categoryId - The category ID to filter by
         * @returns Array of menu items in the category
         */
        getItemsByCategory: (categoryId: string) => {
          return get().items.filter(item => item.category_id === categoryId);
        },

        /**
         * Gets all available menu items (is_available = true).
         * 
         * @returns Array of available menu items
         */
        getAvailableItems: () => {
          return get().items.filter(item => item.is_available);
        },

        /**
         * Sets the selected category filter.
         * 
         * @param categoryId - Category ID to filter by, or null for all items
         */
        setSelectedCategory: (categoryId: string | null) => {
          set({ selectedCategoryId: categoryId });
        },

        /**
         * Invalidates the cache and resets state.
         * Forces a fresh fetch on next access.
         */
        invalidateCache: () => {
          set({
            lastFetched: null,
            categoriesLastFetched: null,
          });
        },

        /**
         * Clears any error state.
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Checks if the menu cache is still valid.
         * 
         * @returns true if cache is valid, false otherwise
         */
        isCacheValid: () => {
          const { lastFetched } = get();
          if (!lastFetched) return false;
          return Date.now() - lastFetched < CACHE_TTL;
        },
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          items: state.items,
          categories: state.categories,
          lastFetched: state.lastFetched,
          categoriesLastFetched: state.categoriesLastFetched,
        }),
      }
    ),
    { name: 'MenuStore' }
  )
);

/**
 * Selector hooks for common state selections.
 * These provide memoized access to specific pieces of state.
 */

/**
 * Selects menu items from the store.
 */
export const selectMenuItems = (state: MenuStore): MenuItem[] => state.items;

/**
 * Selects categories from the store.
 */
export const selectCategories = (state: MenuStore): Category[] => state.categories;

/**
 * Selects loading state from the store.
 */
export const selectIsLoading = (state: MenuStore): boolean => state.isLoading;

/**
 * Selects error state from the store.
 */
export const selectError = (state: MenuStore): string | null => state.error;

/**
 * Selects the selected category ID from the store.
 */
export const selectSelectedCategoryId = (state: MenuStore): string | null => 
  state.selectedCategoryId;
