/**
 * useMenu Hook
 * Custom hook for menu data fetching and filtering
 */

import { useEffect, useCallback } from 'react';
import type { MenuItem, Category, MenuFilterOptions } from '@/types/menu.types';
import { useMenuStore } from '../store/menuStore';

/**
 * Hook return type
 */
export interface UseMenuReturn {
  items: MenuItem[];
  categories: Category[];
  filteredItems: MenuItem[];
  selectedCategoryId: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
  getItemsByCategory: (categoryId: string) => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  clearError: () => void;
  applyFilters: (filters: MenuFilterOptions) => MenuItem[];
}

/**
 * Custom hook for menu operations
 * Handles data fetching, caching, and filtering
 */
export function useMenu(): UseMenuReturn {
  const {
    items,
    categories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,
    fetchMenu,
    setSelectedCategory,
    setSearchQuery,
    getItemsByCategory,
    getFilteredItems,
    getItemById,
    clearError,
  } = useMenuStore();

  // Fetch menu on mount
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Apply filters with custom filter options
  const applyFilters = useCallback(
    (filters: MenuFilterOptions): MenuItem[] => {
      let result = items.filter((item) => {
        // Available only filter
        if (filters.availableOnly && !item.isAvailable) {
          return false;
        }

        // Category filter
        if (filters.categoryId && item.categoryId !== filters.categoryId) {
          return false;
        }

        // Price range filter
        if (filters.priceRange) {
          if (
            item.price < filters.priceRange.min ||
            item.price > filters.priceRange.max
          ) {
            return false;
          }
        }

        // Search query filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(query);
          const matchesDescription = item.description
            .toLowerCase()
            .includes(query);
          const matchesIngredient = item.ingredients?.some((ingredient) =>
            ingredient.toLowerCase().includes(query)
          );

          if (!matchesName && !matchesDescription && !matchesIngredient) {
            return false;
          }
        }

        return true;
      });

      return result;
    },
    [items]
  );

  return {
    items,
    categories,
    filteredItems: getFilteredItems(),
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,
    fetchMenu,
    setSelectedCategory,
    setSearchQuery,
    getItemsByCategory,
    getItemById,
    clearError,
    applyFilters,
  };
}
