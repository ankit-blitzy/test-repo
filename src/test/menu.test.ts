/**
 * @fileoverview Menu Service Unit Tests
 *
 * This file contains comprehensive unit tests for the menu service module.
 * Tests cover all 5 core menu service functions:
 * 1. getAllMenuItems - Fetching all 17 menu items
 * 2. getMenuItemsByCategory - Filtering items by category
 * 3. getMenuItemById - Individual item lookup
 * 4. getCategories - Category listing with item counts
 * 5. searchMenuItems - Search functionality across name and description
 *
 * The tests validate that the menu service correctly returns and manages
 * the 17 menu items distributed across 5 categories:
 * - Burgers: 5 items
 * - Sides: 4 items
 * - Drinks: 4 items
 * - Desserts: 2 items
 * - Specials: 2 items
 *
 * @module test/menu.test
 * @version 1.0.0
 */

import { describe, it, expect } from 'vitest';
import {
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  getCategories,
  searchMenuItems,
} from '../services/menu';
import { MenuCategory } from '../types';

// =============================================================================
// MENU SERVICE TEST SUITE
// =============================================================================

describe('Menu Service', () => {
  // ===========================================================================
  // TEST 1: Fetch All Menu Items
  // ===========================================================================

  describe('getAllMenuItems', () => {
    it('should return all 17 menu items', async () => {
      // Execute the service function
      const items = await getAllMenuItems();

      // Verify the response is defined and is an array
      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);

      // Verify the exact count of 17 items
      expect(items.length).toBe(17);

      // Verify each item has the required structure matching MenuItem interface
      items.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('price');
        expect(item).toHaveProperty('image');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('isAvailable');

        // Verify property types
        expect(typeof item.id).toBe('string');
        expect(typeof item.name).toBe('string');
        expect(typeof item.description).toBe('string');
        expect(typeof item.price).toBe('number');
        expect(typeof item.image).toBe('string');
        expect(typeof item.category).toBe('string');
        expect(typeof item.isAvailable).toBe('boolean');

        // Verify price is a positive number
        expect(item.price).toBeGreaterThan(0);
      });
    });

    it('should return items with unique IDs', async () => {
      const items = await getAllMenuItems();

      // Collect all IDs and verify uniqueness
      const ids = items.map((item) => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(items.length);
    });
  });

  // ===========================================================================
  // TEST 2: Filter Items by Category
  // ===========================================================================

  describe('getMenuItemsByCategory', () => {
    it('should filter items by category correctly', async () => {
      // Test burgers category - expecting 5 items
      const burgers = await getMenuItemsByCategory(MenuCategory.Burgers);

      expect(burgers).toBeDefined();
      expect(Array.isArray(burgers)).toBe(true);
      expect(burgers.length).toBe(5);

      // Verify all returned items belong to the burgers category
      burgers.forEach((item) => {
        expect(item.category).toBe(MenuCategory.Burgers);
      });

      // Test sides category - expecting 4 items
      const sides = await getMenuItemsByCategory(MenuCategory.Sides);
      expect(sides.length).toBe(4);
      sides.forEach((item) => {
        expect(item.category).toBe(MenuCategory.Sides);
      });

      // Test drinks category - expecting 4 items
      const drinks = await getMenuItemsByCategory(MenuCategory.Drinks);
      expect(drinks.length).toBe(4);
      drinks.forEach((item) => {
        expect(item.category).toBe(MenuCategory.Drinks);
      });

      // Test desserts category - expecting 2 items
      const desserts = await getMenuItemsByCategory(MenuCategory.Desserts);
      expect(desserts.length).toBe(2);
      desserts.forEach((item) => {
        expect(item.category).toBe(MenuCategory.Desserts);
      });

      // Test specials category - expecting 2 items
      const specials = await getMenuItemsByCategory(MenuCategory.Specials);
      expect(specials.length).toBe(2);
      specials.forEach((item) => {
        expect(item.category).toBe(MenuCategory.Specials);
      });
    });

    it('should return items that sum up to total menu items', async () => {
      // Fetch items from all categories
      const burgers = await getMenuItemsByCategory(MenuCategory.Burgers);
      const sides = await getMenuItemsByCategory(MenuCategory.Sides);
      const drinks = await getMenuItemsByCategory(MenuCategory.Drinks);
      const desserts = await getMenuItemsByCategory(MenuCategory.Desserts);
      const specials = await getMenuItemsByCategory(MenuCategory.Specials);

      // Total items across all categories should equal 17
      const totalItems =
        burgers.length +
        sides.length +
        drinks.length +
        desserts.length +
        specials.length;

      expect(totalItems).toBe(17);
    });
  });

  // ===========================================================================
  // TEST 3: Get Individual Item by ID
  // ===========================================================================

  describe('getMenuItemById', () => {
    it('should return correct item when ID exists', async () => {
      // First, get all items to pick a real item
      const items = await getAllMenuItems();
      const firstItem = items[0];

      // Fetch the item by its ID
      const foundItem = await getMenuItemById(firstItem.id);

      // Verify the found item matches the original
      expect(foundItem).toBeDefined();
      expect(foundItem?.id).toBe(firstItem.id);
      expect(foundItem?.name).toBe(firstItem.name);
      expect(foundItem?.description).toBe(firstItem.description);
      expect(foundItem?.price).toBe(firstItem.price);
      expect(foundItem?.category).toBe(firstItem.category);
    });

    it('should return null for non-existent ID', async () => {
      // Try to fetch an item with an ID that doesn't exist
      const foundItem = await getMenuItemById('non-existent-id');

      // Verify null is returned for non-existent items
      expect(foundItem).toBeNull();
    });

    it('should return null for empty string ID', async () => {
      // Try to fetch with empty string
      const foundItem = await getMenuItemById('');

      expect(foundItem).toBeNull();
    });

    it('should return correct item for known burger ID', async () => {
      // Test with a known ID from the mock data
      const classicBurger = await getMenuItemById('burger-1');

      expect(classicBurger).toBeDefined();
      expect(classicBurger?.id).toBe('burger-1');
      expect(classicBurger?.name).toBe('Classic Burger');
      expect(classicBurger?.category).toBe(MenuCategory.Burgers);
      expect(classicBurger?.price).toBe(8.99);
    });
  });

  // ===========================================================================
  // TEST 4: Get Categories with Counts
  // ===========================================================================

  describe('getCategories', () => {
    it('should return all categories with correct item counts', async () => {
      // Fetch all categories
      const categories = await getCategories();

      // Verify the response is defined and is an array
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);

      // Verify exactly 5 categories are returned
      expect(categories.length).toBe(5);

      // Extract category IDs for verification
      const categoryIds = categories.map((c) => c.id);

      // Verify all expected categories exist
      expect(categoryIds).toContain(MenuCategory.Burgers);
      expect(categoryIds).toContain(MenuCategory.Sides);
      expect(categoryIds).toContain(MenuCategory.Drinks);
      expect(categoryIds).toContain(MenuCategory.Desserts);
      expect(categoryIds).toContain(MenuCategory.Specials);

      // Verify each category has the required structure
      categories.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('count');
        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.count).toBe('number');
        expect(category.count).toBeGreaterThan(0);
      });

      // Verify specific category counts
      const burgersCategory = categories.find(
        (c) => c.id === MenuCategory.Burgers
      );
      expect(burgersCategory?.count).toBe(5);

      const sidesCategory = categories.find((c) => c.id === MenuCategory.Sides);
      expect(sidesCategory?.count).toBe(4);

      const drinksCategory = categories.find(
        (c) => c.id === MenuCategory.Drinks
      );
      expect(drinksCategory?.count).toBe(4);

      const dessertsCategory = categories.find(
        (c) => c.id === MenuCategory.Desserts
      );
      expect(dessertsCategory?.count).toBe(2);

      const specialsCategory = categories.find(
        (c) => c.id === MenuCategory.Specials
      );
      expect(specialsCategory?.count).toBe(2);
    });

    it('should have category counts that sum to total menu items', async () => {
      const categories = await getCategories();

      // Sum all category counts
      const totalCount = categories.reduce(
        (sum, category) => sum + category.count,
        0
      );

      // Total should equal 17
      expect(totalCount).toBe(17);
    });

    it('should return categories with display names', async () => {
      const categories = await getCategories();

      // Verify display names are properly capitalized
      const burgersCategory = categories.find(
        (c) => c.id === MenuCategory.Burgers
      );
      expect(burgersCategory?.name).toBe('Burgers');

      const sidesCategory = categories.find((c) => c.id === MenuCategory.Sides);
      expect(sidesCategory?.name).toBe('Sides');

      const drinksCategory = categories.find(
        (c) => c.id === MenuCategory.Drinks
      );
      expect(drinksCategory?.name).toBe('Drinks');

      const dessertsCategory = categories.find(
        (c) => c.id === MenuCategory.Desserts
      );
      expect(dessertsCategory?.name).toBe('Desserts');

      const specialsCategory = categories.find(
        (c) => c.id === MenuCategory.Specials
      );
      expect(specialsCategory?.name).toBe('Specials');
    });
  });

  // ===========================================================================
  // TEST 5: Search Menu Items
  // ===========================================================================

  describe('searchMenuItems', () => {
    it('should find items matching search query in name', async () => {
      // Search for "burger" - should find items with burger in name
      const results = await searchMenuItems('burger');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      // Verify results contain 'burger' in name or description
      results.forEach((item) => {
        const nameMatch = item.name.toLowerCase().includes('burger');
        const descMatch = item.description.toLowerCase().includes('burger');
        expect(nameMatch || descMatch).toBe(true);
      });
    });

    it('should find items matching search query in description', async () => {
      // Search for "beef" - appears in descriptions
      const results = await searchMenuItems('beef');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      // Verify all results have "beef" in either name or description
      results.forEach((item) => {
        const nameMatch = item.name.toLowerCase().includes('beef');
        const descMatch = item.description.toLowerCase().includes('beef');
        expect(nameMatch || descMatch).toBe(true);
      });
    });

    it('should be case-insensitive', async () => {
      // Search with different cases should return same results
      const resultsLower = await searchMenuItems('burger');
      const resultsUpper = await searchMenuItems('BURGER');
      const resultsMixed = await searchMenuItems('BuRgEr');

      // All searches should return the same number of results
      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBe(resultsMixed.length);
    });

    it('should return empty array for no matches', async () => {
      // Search for something that doesn't exist
      const results = await searchMenuItems('sushi');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should return empty array for empty query', async () => {
      // Search with empty string
      const results = await searchMenuItems('');

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should find items with partial matches', async () => {
      // Search for partial word "chee" should find "Cheese"
      const results = await searchMenuItems('chee');

      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);

      // Should include Cheese Burger
      const hasCheeseBurger = results.some(
        (item) =>
          item.name.toLowerCase().includes('cheese') ||
          item.description.toLowerCase().includes('cheese')
      );
      expect(hasCheeseBurger).toBe(true);
    });

    it('should find multiple items across categories', async () => {
      // Search for "fries" - should find items in sides
      const results = await searchMenuItems('fries');

      expect(results).toBeDefined();
      expect(results.length).toBeGreaterThan(0);

      // Verify results are from the sides category primarily
      const friesItems = results.filter(
        (item) =>
          item.name.toLowerCase().includes('fries') ||
          item.description.toLowerCase().includes('fries')
      );
      expect(friesItems.length).toBeGreaterThan(0);
    });
  });
});
