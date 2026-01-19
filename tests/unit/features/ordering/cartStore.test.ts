/**
 * Cart Store Tests
 * Tests for the Zustand cart state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/features/ordering/store/cartStore';
import type { MenuItem } from '@/types/menu.types';

// Mock menu item for testing
const mockMenuItem: MenuItem = {
  id: 'burger-001',
  categoryId: 'cat-burgers',
  name: 'Normal Burger',
  description: 'Our classic burger',
  price: 8.99,
  isAvailable: true,
  ingredients: ['Beef patty', 'Lettuce', 'Tomato'],
  updatedAt: new Date(),
};

const mockMenuItem2: MenuItem = {
  id: 'side-001',
  categoryId: 'cat-sides',
  name: 'Fries',
  description: 'Crispy fries',
  price: 3.99,
  isAvailable: true,
  updatedAt: new Date(),
};

describe('cartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({
      items: [],
      isOpen: false,
      lastUpdated: null,
    });
  });

  describe('addItem', () => {
    it('adds a new item to the cart', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockMenuItem);

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].menuItemId).toBe('burger-001');
      expect(state.items[0].name).toBe('Normal Burger');
      expect(state.items[0].price).toBe(8.99);
      expect(state.items[0].quantity).toBe(1);
    });

    it('adds item with specified quantity', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockMenuItem, 3);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3);
    });

    it('adds item with special instructions', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockMenuItem, 1, 'No onions please');

      const state = useCartStore.getState();
      expect(state.items[0].specialInstructions).toBe('No onions please');
    });

    it('increases quantity when adding same item without special instructions', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockMenuItem, 1);
      addItem(mockMenuItem, 2);

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('adds separate entry when adding same item with different special instructions', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockMenuItem, 1, 'No onions');
      addItem(mockMenuItem, 1, 'Extra cheese');

      const state = useCartStore.getState();
      expect(state.items.length).toBe(2);
    });

    it('updates lastUpdated when adding item', () => {
      const { addItem } = useCartStore.getState();

      addItem(mockMenuItem);

      const state = useCartStore.getState();
      expect(state.lastUpdated).not.toBeNull();
    });
  });

  describe('removeItem', () => {
    it('removes item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState();

      addItem(mockMenuItem);
      const itemId = useCartStore.getState().items[0].id;
      removeItem(itemId);

      expect(useCartStore.getState().items.length).toBe(0);
    });

    it('does not affect other items when removing one', () => {
      const { addItem, removeItem } = useCartStore.getState();

      addItem(mockMenuItem);
      addItem(mockMenuItem2);
      const firstItemId = useCartStore.getState().items[0].id;
      removeItem(firstItemId);

      const state = useCartStore.getState();
      expect(state.items.length).toBe(1);
      expect(state.items[0].name).toBe('Fries');
    });
  });

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      addItem(mockMenuItem);
      const itemId = useCartStore.getState().items[0].id;
      updateQuantity(itemId, 5);

      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('removes item when quantity is set to 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      addItem(mockMenuItem);
      const itemId = useCartStore.getState().items[0].id;
      updateQuantity(itemId, 0);

      expect(useCartStore.getState().items.length).toBe(0);
    });

    it('removes item when quantity is negative', () => {
      const { addItem, updateQuantity } = useCartStore.getState();

      addItem(mockMenuItem);
      const itemId = useCartStore.getState().items[0].id;
      updateQuantity(itemId, -1);

      expect(useCartStore.getState().items.length).toBe(0);
    });
  });

  describe('updateSpecialInstructions', () => {
    it('updates special instructions for an item', () => {
      const { addItem, updateSpecialInstructions } = useCartStore.getState();

      addItem(mockMenuItem);
      const itemId = useCartStore.getState().items[0].id;
      updateSpecialInstructions(itemId, 'Extra mayo');

      expect(useCartStore.getState().items[0].specialInstructions).toBe('Extra mayo');
    });
  });

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { addItem, clearCart } = useCartStore.getState();

      addItem(mockMenuItem);
      addItem(mockMenuItem2);
      clearCart();

      expect(useCartStore.getState().items.length).toBe(0);
    });
  });

  describe('cart drawer state', () => {
    it('toggles cart open/closed', () => {
      const { toggleCart } = useCartStore.getState();

      expect(useCartStore.getState().isOpen).toBe(false);

      toggleCart();
      expect(useCartStore.getState().isOpen).toBe(true);

      toggleCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    it('opens cart', () => {
      const { openCart } = useCartStore.getState();

      openCart();

      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('closes cart', () => {
      useCartStore.setState({ isOpen: true });
      const { closeCart } = useCartStore.getState();

      closeCart();

      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });

  describe('getItemCount', () => {
    it('returns total quantity of all items', () => {
      const { addItem, getItemCount } = useCartStore.getState();

      addItem(mockMenuItem, 2);
      addItem(mockMenuItem2, 3);

      expect(getItemCount()).toBe(5);
    });

    it('returns 0 for empty cart', () => {
      const { getItemCount } = useCartStore.getState();

      expect(getItemCount()).toBe(0);
    });
  });

  describe('getSubtotal', () => {
    it('calculates subtotal correctly', () => {
      const { addItem, getSubtotal } = useCartStore.getState();

      addItem(mockMenuItem, 2); // 8.99 * 2 = 17.98
      addItem(mockMenuItem2, 1); // 3.99 * 1 = 3.99

      expect(getSubtotal()).toBeCloseTo(21.97, 2);
    });

    it('returns 0 for empty cart', () => {
      const { getSubtotal } = useCartStore.getState();

      expect(getSubtotal()).toBe(0);
    });
  });

  describe('getTax', () => {
    it('calculates tax with default rate (8%)', () => {
      const { addItem, getTax } = useCartStore.getState();

      addItem(mockMenuItem, 1); // 8.99

      expect(getTax()).toBeCloseTo(0.7192, 4); // 8.99 * 0.08
    });

    it('calculates tax with custom rate', () => {
      const { addItem, getTax } = useCartStore.getState();

      addItem(mockMenuItem, 1); // 8.99

      expect(getTax(0.1)).toBeCloseTo(0.899, 3); // 8.99 * 0.10
    });
  });

  describe('getTotal', () => {
    it('calculates total including tax', () => {
      const { addItem, getTotal } = useCartStore.getState();

      addItem(mockMenuItem, 1); // 8.99

      const expectedTotal = 8.99 * 1.08; // subtotal + 8% tax
      expect(getTotal()).toBeCloseTo(expectedTotal, 2);
    });

    it('calculates total with custom tax rate', () => {
      const { addItem, getTotal } = useCartStore.getState();

      addItem(mockMenuItem, 1); // 8.99

      const expectedTotal = 8.99 * 1.1; // subtotal + 10% tax
      expect(getTotal(0.1)).toBeCloseTo(expectedTotal, 2);
    });
  });
});
