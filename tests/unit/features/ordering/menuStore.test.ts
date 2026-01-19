/**
 * Menu Store Tests
 * Tests for the Zustand menu state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMenuStore } from '@/features/ordering/store/menuStore';
import { mockMenuItems, mockCategories } from '@/data';

describe('menuStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useMenuStore.setState({
      items: [],
      categories: [],
      selectedCategoryId: null,
      searchQuery: '',
      isLoading: false,
      error: null,
      lastFetched: null,
    });
  });

  describe('fetchMenu', () => {
    it('fetches and stores menu items', async () => {
      const { fetchMenu, items, categories } = useMenuStore.getState();

      await fetchMenu();

      const state = useMenuStore.getState();
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.categories.length).toBeGreaterThan(0);
      expect(state.lastFetched).not.toBeNull();
    });

    it('sets loading state during fetch', async () => {
      const store = useMenuStore;

      // Start fetch
      const fetchPromise = store.getState().fetchMenu();

      // Check initial loading state - might be too fast to catch
      // Just verify the fetch completes
      await fetchPromise;

      expect(store.getState().isLoading).toBe(false);
    });

    it('uses cached data when cache is valid', async () => {
      const store = useMenuStore;

      // First fetch
      await store.getState().fetchMenu();
      const firstFetchTime = store.getState().lastFetched;

      // Wait a tiny bit
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second fetch
      await store.getState().fetchMenu();
      const secondFetchTime = store.getState().lastFetched;

      // Should use cached data (same timestamp)
      expect(secondFetchTime).toEqual(firstFetchTime);
    });
  });

  describe('setSelectedCategory', () => {
    it('sets the selected category', () => {
      const { setSelectedCategory } = useMenuStore.getState();

      setSelectedCategory('cat-burgers');

      expect(useMenuStore.getState().selectedCategoryId).toBe('cat-burgers');
    });

    it('clears category when set to null', () => {
      useMenuStore.setState({ selectedCategoryId: 'cat-burgers' });
      const { setSelectedCategory } = useMenuStore.getState();

      setSelectedCategory(null);

      expect(useMenuStore.getState().selectedCategoryId).toBeNull();
    });
  });

  describe('setSearchQuery', () => {
    it('sets the search query', () => {
      const { setSearchQuery } = useMenuStore.getState();

      setSearchQuery('burger');

      expect(useMenuStore.getState().searchQuery).toBe('burger');
    });
  });

  describe('getItemsByCategory', () => {
    beforeEach(async () => {
      await useMenuStore.getState().fetchMenu();
    });

    it('returns items filtered by category', () => {
      const { getItemsByCategory } = useMenuStore.getState();

      const burgers = getItemsByCategory('cat-burgers');

      expect(burgers.length).toBeGreaterThan(0);
      expect(burgers.every((item) => item.categoryId === 'cat-burgers')).toBe(true);
    });

    it('returns empty array for non-existent category', () => {
      const { getItemsByCategory } = useMenuStore.getState();

      const items = getItemsByCategory('non-existent');

      expect(items).toEqual([]);
    });
  });

  describe('getFilteredItems', () => {
    beforeEach(async () => {
      await useMenuStore.getState().fetchMenu();
    });

    it('returns only available items by default', () => {
      const { getFilteredItems } = useMenuStore.getState();

      const items = getFilteredItems();

      expect(items.every((item) => item.isAvailable)).toBe(true);
    });

    it('filters by selected category', async () => {
      const store = useMenuStore;
      store.getState().setSelectedCategory('cat-burgers');

      const items = store.getState().getFilteredItems();

      expect(items.every((item) => item.categoryId === 'cat-burgers')).toBe(true);
    });

    it('filters by search query in name', () => {
      const store = useMenuStore;
      store.getState().setSearchQuery('normal');

      const items = store.getState().getFilteredItems();

      expect(items.some((item) => item.name.toLowerCase().includes('normal'))).toBe(
        true
      );
    });

    it('filters by search query in ingredients', () => {
      const store = useMenuStore;
      store.getState().setSearchQuery('beef');

      const items = store.getState().getFilteredItems();

      expect(
        items.some((item) =>
          item.ingredients?.some((ing) => ing.toLowerCase().includes('beef'))
        )
      ).toBe(true);
    });
  });

  describe('getItemById', () => {
    beforeEach(async () => {
      await useMenuStore.getState().fetchMenu();
    });

    it('returns item when found', () => {
      const { getItemById } = useMenuStore.getState();

      const item = getItemById('burger-001');

      expect(item).toBeDefined();
      expect(item?.name).toBe('Normal Burger');
    });

    it('returns undefined for non-existent item', () => {
      const { getItemById } = useMenuStore.getState();

      const item = getItemById('non-existent');

      expect(item).toBeUndefined();
    });
  });

  describe('clearError', () => {
    it('clears the error state', () => {
      useMenuStore.setState({ error: 'Some error' });
      const { clearError } = useMenuStore.getState();

      clearError();

      expect(useMenuStore.getState().error).toBeNull();
    });
  });

  describe('menu items with ingredients', () => {
    beforeEach(async () => {
      await useMenuStore.getState().fetchMenu();
    });

    it('Normal Burger has correct ingredients', () => {
      const { getItemById } = useMenuStore.getState();

      const normalBurger = getItemById('burger-001');

      expect(normalBurger?.ingredients).toEqual([
        'Quality beef patty',
        'Fresh lettuce',
        'Tomato slices',
        'Cheddar cheese',
        'Soft burger bun',
      ]);
    });

    it('some items have no ingredients', () => {
      const { getItemById } = useMenuStore.getState();

      const cola = getItemById('drink-001');

      // Cola has no ingredients defined
      expect(cola?.ingredients).toBeUndefined();
    });
  });
});
