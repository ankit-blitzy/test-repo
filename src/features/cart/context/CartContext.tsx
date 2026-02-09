/**
 * Cart Context Provider.
 * Manages shopping cart state with localStorage persistence.
 * Provides add, remove, update, and clear operations.
 */

import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { CartContextType, CartItem } from '../types/cart.types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, MAX_CART_ITEM_QUANTITY, MIN_CART_ITEM_QUANTITY } from '@/utils/constants';
import { generateId, calculateTax, calculateTotal, clamp } from '@/utils/helpers';

/** React context for cart state */
export const CartContext = createContext<CartContextType | null>(null);

/** Props for the CartProvider component */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider wraps the application to supply shopping cart state
 * and cart management methods via React Context.
 * Cart items are persisted to localStorage for cross-session retention.
 */
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS, []);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Adds an item to the cart. If the item (by menuItemId) already exists,
   * its quantity is incremented by 1.
   */
  const addItem = useCallback(
    (item: Omit<CartItem, 'id' | 'quantity'>) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.menuItemId === item.menuItemId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: clamp(updated[existingIndex].quantity + 1, MIN_CART_ITEM_QUANTITY, MAX_CART_ITEM_QUANTITY),
          };
          return updated;
        }
        return [...prev, { ...item, id: generateId(), quantity: 1 }];
      });
    },
    [setItems]
  );

  /** Removes an item from the cart by its cart item ID */
  const removeItem = useCallback(
    (itemId: string) => {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    },
    [setItems]
  );

  /** Updates the quantity of a specific cart item */
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      const clampedQty = clamp(quantity, MIN_CART_ITEM_QUANTITY, MAX_CART_ITEM_QUANTITY);
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: clampedQty } : item))
      );
    },
    [setItems]
  );

  /** Clears all items from the cart */
  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  /** Toggles the cart drawer open/closed */
  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /** Opens the cart drawer */
  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  /** Closes the cart drawer */
  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  /** Computed values */
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100,
    [items]
  );
  const tax = useMemo(() => calculateTax(subtotal), [subtotal]);
  const total = useMemo(() => calculateTotal(subtotal), [subtotal]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleCart,
      openCart,
      closeCart,
      itemCount,
      subtotal,
      tax,
      total,
    }),
    [items, isOpen, addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, itemCount, subtotal, tax, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
