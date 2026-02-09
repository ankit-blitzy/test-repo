/**
 * Integration tests for the Online Ordering (Cart) feature flow.
 * Verifies the full cart lifecycle: add → update → calculate → clear.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { useCart } from '../../src/features/cart/hooks/useCart';
import { CartProvider } from '../../src/features/cart/context/CartContext';

/** Wrapper providing CartProvider context */
function wrapper({ children }: { children: ReactNode }) {
  return createElement(CartProvider, null, children);
}

/** Sample menu items used in tests */
const classicBurger = {
  menuItemId: 'menu-1',
  name: 'Classic Burger',
  price: 12.99,
  imageUrl: '/images/classic-burger.jpg',
};

const cheeseFries = {
  menuItemId: 'menu-2',
  name: 'Cheese Fries',
  price: 6.49,
  imageUrl: '/images/cheese-fries.jpg',
};

const milkshake = {
  menuItemId: 'menu-3',
  name: 'Vanilla Milkshake',
  price: 5.99,
  imageUrl: '/images/milkshake.jpg',
};

describe('Ordering Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.tax).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('completes a full order lifecycle: add → update → remove → clear', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    /* Step 1: Add multiple items */
    act(() => {
      result.current.addItem(classicBurger);
      result.current.addItem(cheeseFries);
      result.current.addItem(milkshake);
    });

    expect(result.current.items).toHaveLength(3);
    expect(result.current.itemCount).toBe(3);

    /* Step 2: Update quantity */
    const burgerId = result.current.items.find(
      (i) => i.menuItemId === 'menu-1'
    )!.id;

    act(() => {
      result.current.updateQuantity(burgerId, 3);
    });

    expect(result.current.items.find((i) => i.id === burgerId)!.quantity).toBe(3);
    expect(result.current.itemCount).toBe(5); /* 3 + 1 + 1 */

    /* Step 3: Remove one item */
    const milkshakeId = result.current.items.find(
      (i) => i.menuItemId === 'menu-3'
    )!.id;

    act(() => {
      result.current.removeItem(milkshakeId);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.itemCount).toBe(4); /* 3 + 1 */

    /* Step 4: Clear cart */
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('calculates subtotal, tax, and total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    /* Add $12.99 burger x2 and $6.49 fries x1 */
    act(() => {
      result.current.addItem(classicBurger);
      result.current.addItem(classicBurger); /* duplicates increment quantity */
      result.current.addItem(cheeseFries);
    });

    /* Subtotal: (12.99 * 2) + (6.49 * 1) = 25.98 + 6.49 = 32.47 */
    expect(result.current.subtotal).toBeCloseTo(32.47, 2);

    /* Tax: 32.47 * 0.08 = 2.5976 ≈ 2.60 */
    expect(result.current.tax).toBeCloseTo(2.6, 2);

    /* Total: 32.47 + 2.60 = 35.07 */
    expect(result.current.total).toBeCloseTo(35.07, 2);
  });

  it('increments quantity when adding the same item twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(classicBurger);
    });

    act(() => {
      result.current.addItem(classicBurger);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('manages the cart drawer open/close state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openCart();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeCart();
    });
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

  it('clamps quantity to max allowed value', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(classicBurger);
    });

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 999);
    });

    /* Max is 99 per constants */
    expect(result.current.items[0].quantity).toBe(99);
  });

  it('clamps quantity to min allowed value', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(classicBurger);
    });

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 0);
    });

    /* Min is 1 per constants */
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('persists cart data to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(classicBurger);
    });

    const stored = localStorage.getItem('cart_items');
    expect(stored).not.toBeNull();
    const parsedItems = JSON.parse(stored!);
    expect(parsedItems).toHaveLength(1);
    expect(parsedItems[0].name).toBe('Classic Burger');
  });
});
