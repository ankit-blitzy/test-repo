/**
 * Unit tests for the useCart hook.
 * Verifies the hook enforces CartProvider requirement and returns the correct context shape.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { useCart } from '../../../../src/features/cart/hooks/useCart';
import { CartProvider } from '../../../../src/features/cart/context/CartContext';

/**
 * Helper wrapper that supplies CartProvider context to hooks.
 */
function wrapper({ children }: { children: ReactNode }) {
  return createElement(CartProvider, null, children);
}

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('throws an error when used outside of CartProvider', () => {
    const originalError = console.error;
    console.error = () => {};

    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider'
    );

    console.error = originalError;
  });

  it('returns the cart context when used inside CartProvider', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current).toBeDefined();
    expect(result.current.items).toEqual([]);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('provides addItem function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.addItem).toBe('function');
  });

  it('provides removeItem function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.removeItem).toBe('function');
  });

  it('provides updateQuantity function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.updateQuantity).toBe('function');
  });

  it('provides clearCart function', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.clearCart).toBe('function');
  });

  it('provides cart drawer toggle functions', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(typeof result.current.toggleCart).toBe('function');
    expect(typeof result.current.openCart).toBe('function');
    expect(typeof result.current.closeCart).toBe('function');
  });

  it('adds an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Classic Burger',
        price: 12.99,
        imageUrl: '/images/classic-burger.jpg',
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Classic Burger');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.itemCount).toBe(1);
  });

  it('increments quantity when adding duplicate item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const itemData = {
      menuItemId: 'item-1',
      name: 'Classic Burger',
      price: 12.99,
      imageUrl: '/images/classic-burger.jpg',
    };

    act(() => {
      result.current.addItem(itemData);
    });

    act(() => {
      result.current.addItem(itemData);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it('removes an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Classic Burger',
        price: 12.99,
        imageUrl: '/images/classic-burger.jpg',
      });
    });

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.removeItem(itemId);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('updates the quantity of an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Classic Burger',
        price: 12.99,
        imageUrl: '/images/classic-burger.jpg',
      });
    });

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.itemCount).toBe(5);
  });

  it('clears all items from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Classic Burger',
        price: 12.99,
        imageUrl: '/images/classic-burger.jpg',
      });
      result.current.addItem({
        menuItemId: 'item-2',
        name: 'Fries',
        price: 4.99,
        imageUrl: '/images/fries.jpg',
      });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('calculates subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Classic Burger',
        price: 10.0,
        imageUrl: '/images/classic-burger.jpg',
      });
      result.current.addItem({
        menuItemId: 'item-2',
        name: 'Fries',
        price: 5.0,
        imageUrl: '/images/fries.jpg',
      });
    });

    expect(result.current.subtotal).toBe(15.0);
  });

  it('calculates tax correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Burger',
        price: 100.0,
        imageUrl: '/images/burger.jpg',
      });
    });

    /* Tax rate is 0.08 => $100 * 0.08 = $8.00 */
    expect(result.current.tax).toBe(8.0);
  });

  it('calculates total as subtotal plus tax', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        menuItemId: 'item-1',
        name: 'Burger',
        price: 100.0,
        imageUrl: '/images/burger.jpg',
      });
    });

    /* Total = $100 + $8 = $108 */
    expect(result.current.total).toBe(108.0);
  });

  it('toggles the cart drawer open and closed', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleCart();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('opens the cart drawer', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.openCart();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('closes the cart drawer', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.openCart();
    });

    act(() => {
      result.current.closeCart();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
