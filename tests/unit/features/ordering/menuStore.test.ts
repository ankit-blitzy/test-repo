/**
 * Menu Store Unit Tests
 * 
 * Tests for the Zustand menu store that manages menu items with ingredients,
 * categories, and caching functionality.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useMenuStore } from '@/features/ordering/store/menuStore';
import { mockData } from '@/features/ordering/api/menuApi';

// Mock the API module
vi.mock('@/features/ordering/api/menuApi', async () => {
  const originalModule = await vi.importActual('@/features/ordering/api/menuApi');
  return {
    ...originalModule,
    fetchMenuItems: vi.fn(),
    fetchCategories: vi.fn(),
  };
});

import { fetchMenuItems, fetchCategories } from '@/features/ordering/api/menuApi';

describe('menuStore', () => {
  // Reset store before each test
  beforeEach(() => {
    // Reset the store to initial state
    useMenuStore.setState({
      items: [],
      categories: [],
      isLoading: false,
      isCategoriesLoading: false,
      error: null,
      lastFetched: null,
      categoriesLastFetched: null,
      selectedCategoryId: null,
    });
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('has empty items array initially', () => {
      const state = useMenuStore.getState();
      expect(state.items).toEqual([]);
    });

    it('has empty categories array initially', () => {
      const state = useMenuStore.getState();
      expect(state.categories).toEqual([]);
    });

    it('has isLoading false initially', () => {
      const state = useMenuStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it('has null error initially', () => {
      const state = useMenuStore.getState();
      expect(state.error).toBeNull();
    });

    it('has null lastFetched initially', () => {
      const state = useMenuStore.getState();
      expect(state.lastFetched).toBeNull();
    });

    it('has null selectedCategoryId initially', () => {
      const state = useMenuStore.getState();
      expect(state.selectedCategoryId).toBeNull();
    });
  });

  describe('fetchMenu', () => {
    it('sets isLoading to true while fetching', async () => {
      vi.mocked(fetchMenuItems).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true, data: [] }), 100))
      );

      const fetchPromise = useMenuStore.getState().fetchMenu();
      
      expect(useMenuStore.getState().isLoading).toBe(true);
      
      await fetchPromise;
    });

    it('stores fetched items in state', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: true,
        data: mockData.menuItems,
      });

      await useMenuStore.getState().fetchMenu();
      
      expect(useMenuStore.getState().items).toEqual(mockData.menuItems);
    });

    it('sets lastFetched timestamp after successful fetch', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: true,
        data: mockData.menuItems,
      });

      const beforeFetch = Date.now();
      await useMenuStore.getState().fetchMenu();
      const afterFetch = Date.now();
      
      const lastFetched = useMenuStore.getState().lastFetched;
      expect(lastFetched).not.toBeNull();
      expect(lastFetched).toBeGreaterThanOrEqual(beforeFetch);
      expect(lastFetched).toBeLessThanOrEqual(afterFetch);
    });

    it('sets isLoading to false after fetch completes', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: true,
        data: mockData.menuItems,
      });

      await useMenuStore.getState().fetchMenu();
      
      expect(useMenuStore.getState().isLoading).toBe(false);
    });

    it('sets error on failed response', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: false,
        data: [],
        error: 'Failed to fetch',
      });

      await useMenuStore.getState().fetchMenu();
      
      expect(useMenuStore.getState().error).toBe('Failed to fetch');
    });

    it('sets error on network failure', async () => {
      vi.mocked(fetchMenuItems).mockRejectedValue(new Error('Network error'));

      await useMenuStore.getState().fetchMenu();
      
      expect(useMenuStore.getState().error).toBe('Network error');
    });

    it('uses cached data if cache is valid', async () => {
      // First, populate the store
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: true,
        data: mockData.menuItems,
      });
      
      await useMenuStore.getState().fetchMenu();
      
      // Clear mock
      vi.mocked(fetchMenuItems).mockClear();
      
      // Fetch again - should use cache
      await useMenuStore.getState().fetchMenu();
      
      expect(fetchMenuItems).not.toHaveBeenCalled();
    });
  });

  describe('fetchAllCategories', () => {
    it('stores fetched categories in state', async () => {
      vi.mocked(fetchCategories).mockResolvedValue({
        success: true,
        data: mockData.categories,
      });

      await useMenuStore.getState().fetchAllCategories();
      
      expect(useMenuStore.getState().categories).toEqual(mockData.categories);
    });

    it('sets categoriesLastFetched timestamp', async () => {
      vi.mocked(fetchCategories).mockResolvedValue({
        success: true,
        data: mockData.categories,
      });

      await useMenuStore.getState().fetchAllCategories();
      
      expect(useMenuStore.getState().categoriesLastFetched).not.toBeNull();
    });
  });

  describe('getItemById', () => {
    beforeEach(() => {
      useMenuStore.setState({ items: mockData.menuItems });
    });

    it('returns the item with matching ID', () => {
      const item = useMenuStore.getState().getItemById('item_001');
      
      expect(item).toBeDefined();
      expect(item?._id).toBe('item_001');
      expect(item?.name).toBe('Classic Burger');
    });

    it('returns undefined for non-existent ID', () => {
      const item = useMenuStore.getState().getItemById('non_existent');
      
      expect(item).toBeUndefined();
    });
  });

  describe('getItemsByCategory', () => {
    beforeEach(() => {
      useMenuStore.setState({ items: mockData.menuItems });
    });

    it('returns only items matching the category', () => {
      const burgerItems = useMenuStore.getState().getItemsByCategory('cat_burgers');
      
      expect(burgerItems.length).toBeGreaterThan(0);
      burgerItems.forEach(item => {
        expect(item.category_id).toBe('cat_burgers');
      });
    });

    it('returns empty array for non-existent category', () => {
      const items = useMenuStore.getState().getItemsByCategory('non_existent');
      
      expect(items).toEqual([]);
    });
  });

  describe('getAvailableItems', () => {
    it('returns only available items', () => {
      const mixedItems = [
        { ...mockData.menuItems[0]!, is_available: true },
        { ...mockData.menuItems[1]!, is_available: false },
        { ...mockData.menuItems[2]!, is_available: true },
      ];
      useMenuStore.setState({ items: mixedItems });

      const availableItems = useMenuStore.getState().getAvailableItems();
      
      expect(availableItems).toHaveLength(2);
      availableItems.forEach(item => {
        expect(item.is_available).toBe(true);
      });
    });
  });

  describe('setSelectedCategory', () => {
    it('sets the selected category ID', () => {
      useMenuStore.getState().setSelectedCategory('cat_burgers');
      
      expect(useMenuStore.getState().selectedCategoryId).toBe('cat_burgers');
    });

    it('can set category to null (show all)', () => {
      useMenuStore.getState().setSelectedCategory('cat_burgers');
      useMenuStore.getState().setSelectedCategory(null);
      
      expect(useMenuStore.getState().selectedCategoryId).toBeNull();
    });
  });

  describe('invalidateCache', () => {
    it('clears lastFetched timestamp', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: true,
        data: mockData.menuItems,
      });
      
      await useMenuStore.getState().fetchMenu();
      expect(useMenuStore.getState().lastFetched).not.toBeNull();
      
      useMenuStore.getState().invalidateCache();
      
      expect(useMenuStore.getState().lastFetched).toBeNull();
    });

    it('clears categoriesLastFetched timestamp', async () => {
      vi.mocked(fetchCategories).mockResolvedValue({
        success: true,
        data: mockData.categories,
      });
      
      await useMenuStore.getState().fetchAllCategories();
      expect(useMenuStore.getState().categoriesLastFetched).not.toBeNull();
      
      useMenuStore.getState().invalidateCache();
      
      expect(useMenuStore.getState().categoriesLastFetched).toBeNull();
    });
  });

  describe('clearError', () => {
    it('clears the error state', () => {
      useMenuStore.setState({ error: 'Some error' });
      
      useMenuStore.getState().clearError();
      
      expect(useMenuStore.getState().error).toBeNull();
    });
  });

  describe('isCacheValid', () => {
    it('returns false when lastFetched is null', () => {
      expect(useMenuStore.getState().isCacheValid()).toBe(false);
    });

    it('returns true when cache is within TTL', () => {
      useMenuStore.setState({ lastFetched: Date.now() });
      
      expect(useMenuStore.getState().isCacheValid()).toBe(true);
    });

    it('returns false when cache has expired', () => {
      // Set lastFetched to 2 hours ago (TTL is 1 hour)
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      useMenuStore.setState({ lastFetched: twoHoursAgo });
      
      expect(useMenuStore.getState().isCacheValid()).toBe(false);
    });
  });

  describe('Ingredient Data', () => {
    beforeEach(() => {
      useMenuStore.setState({ items: mockData.menuItems });
    });

    it('stores items with ingredients array', () => {
      const items = useMenuStore.getState().items;
      
      items.forEach(item => {
        expect(Array.isArray(item.ingredients)).toBe(true);
      });
    });

    it('preserves ingredient data when fetching', async () => {
      vi.mocked(fetchMenuItems).mockResolvedValue({
        success: true,
        data: mockData.menuItems,
      });

      await useMenuStore.getState().fetchMenu();
      
      const classicBurger = useMenuStore.getState().getItemById('item_001');
      expect(classicBurger?.ingredients).toContain('Quality beef patty');
      expect(classicBurger?.ingredients).toContain('Fresh lettuce');
    });

    it('can filter items while preserving ingredient data', () => {
      const burgerItems = useMenuStore.getState().getItemsByCategory('cat_burgers');
      
      burgerItems.forEach(item => {
        expect(item.ingredients.length).toBeGreaterThan(0);
      });
    });
  });
});
