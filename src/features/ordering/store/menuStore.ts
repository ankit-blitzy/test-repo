/**
 * Menu Store
 * Zustand store for managing menu state with ingredient support
 */

import { create } from 'zustand';
import type { MenuItem, Category } from '@/types/menu.types';
import { mockMenuItems, mockCategories } from '@/data';

/**
 * Menu state interface
 */
interface MenuState {
  items: MenuItem[];
  categories: Category[];
  selectedCategoryId: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

/**
 * Menu actions interface
 */
interface MenuActions {
  fetchMenu: () => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  getItemsByCategory: (categoryId: string) => MenuItem[];
  getFilteredItems: () => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  clearError: () => void;
}

/**
 * Combined Menu store type
 */
type MenuStore = MenuState & MenuActions;

/**
 * Cache duration in milliseconds (1 hour)
 */
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Check if cache is valid
 */
function isCacheValid(lastFetched: Date | null): boolean {
  if (!lastFetched) return false;
  return Date.now() - lastFetched.getTime() < CACHE_DURATION;
}

/**
 * Menu store
 */
export const useMenuStore = create<MenuStore>((set, get) => ({
  // Initial state
  items: [],
  categories: [],
  selectedCategoryId: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  lastFetched: null,

  // Fetch menu data
  fetchMenu: async () => {
    const state = get();
    
    // Return cached data if still valid
    if (isCacheValid(state.lastFetched) && state.items.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Simulate API call - in production, this would be a real API request
      // Using mock data for development
      await new Promise((resolve) => setTimeout(resolve, 300));

      set({
        items: mockMenuItems,
        categories: mockCategories,
        isLoading: false,
        lastFetched: new Date(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch menu',
      });
    }
  },

  // Set selected category
  setSelectedCategory: (categoryId) => {
    set({ selectedCategoryId: categoryId });
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Get items by category
  getItemsByCategory: (categoryId) => {
    const { items } = get();
    return items.filter((item) => item.categoryId === categoryId);
  },

  // Get filtered items based on category and search
  getFilteredItems: () => {
    const { items, selectedCategoryId, searchQuery } = get();
    
    let filtered = items.filter((item) => item.isAvailable);

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter((item) => item.categoryId === selectedCategoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.ingredients?.some((ingredient) =>
            ingredient.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  },

  // Get item by ID
  getItemById: (id) => {
    const { items } = get();
    return items.find((item) => item.id === id);
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
