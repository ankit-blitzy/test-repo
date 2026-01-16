import { describe, it, expect } from 'vitest';
import { getMenuItems, getMenuItem, getCategories } from '../services/menu';

describe('Menu Service', () => {
  describe('getMenuItems', () => {
    it('should return all menu items', async () => {
      const items = await getMenuItems();
      
      expect(items).toBeDefined();
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]).toHaveProperty('id');
      expect(items[0]).toHaveProperty('name');
      expect(items[0]).toHaveProperty('price');
    });

    it('should filter items by category', async () => {
      const burgers = await getMenuItems('burgers');
      
      expect(burgers).toBeDefined();
      expect(burgers.length).toBeGreaterThan(0);
      burgers.forEach(item => {
        expect(item.category).toBe('burgers');
      });
    });
  });

  describe('getMenuItem', () => {
    it('should return a specific menu item by id', async () => {
      const item = await getMenuItem('1');
      
      expect(item).toBeDefined();
      expect(item?.id).toBe('1');
      expect(item?.name).toBe('Classic Burger');
    });

    it('should return null for non-existent item', async () => {
      const item = await getMenuItem('non-existent-id');
      
      expect(item).toBeNull();
    });
  });

  describe('getCategories', () => {
    it('should return all categories with counts', async () => {
      const categories = await getCategories();
      
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories[0]).toHaveProperty('id');
      expect(categories[0]).toHaveProperty('name');
      expect(categories[0]).toHaveProperty('count');
    });
  });
});
