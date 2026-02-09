/**
 * Custom hook for menu data fetching and category filtering.
 * Loads categories and menu items from the API service on mount.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MenuCategoryResponse, MenuItemResponse } from '@/types/api.types';
import type { LoadingState } from '@/types/common.types';
import type { UseMenuReturn } from '../types/menu.types';
import { getCategories, getMenuItems } from '@/services/api/menu.api';

/**
 * Hook that fetches menu categories and items, and provides category filtering.
 * @returns UseMenuReturn with menu data, loading state, and filter methods
 */
export function useMenu(): UseMenuReturn {
  const [categories, setCategories] = useState<MenuCategoryResponse[]>([]);
  const [items, setItems] = useState<MenuItemResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  /** Fetches all categories and items from the API */
  const refreshMenu = useCallback(async () => {
    setLoadingState('loading');
    setError(null);
    try {
      const [catResponse, itemResponse] = await Promise.all([getCategories(), getMenuItems()]);
      setCategories(catResponse.data);
      setItems(itemResponse.data);
      setLoadingState('success');
    } catch {
      setError('Failed to load menu. Please try again.');
      setLoadingState('error');
    }
  }, []);

  /** Load menu data on mount */
  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  /** Selects or deselects a category for filtering */
  const selectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  /** Filters items by the selected category */
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((item) => item.categoryId === selectedCategory);
  }, [items, selectedCategory]);

  return {
    categories,
    items,
    selectedCategory,
    loadingState,
    error,
    selectCategory,
    refreshMenu,
    filteredItems,
  };
}
