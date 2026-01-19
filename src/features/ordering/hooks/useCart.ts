/**
 * useCart Hook
 * Custom hook for cart operations with convenient interface
 */

import { useCallback } from 'react';
import type { MenuItem } from '@/types/menu.types';
import type { CartItem } from '@/types/cart.types';
import { useCartStore } from '../store/cartStore';

/**
 * Hook return type
 */
export interface UseCartReturn {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSpecialInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isItemInCart: (menuItemId: string) => boolean;
  getItemQuantity: (menuItemId: string) => number;
}

/**
 * Custom hook for cart operations
 */
export function useCart(): UseCartReturn {
  const {
    items,
    isOpen,
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    updateQuantity: storeUpdateQuantity,
    updateSpecialInstructions: storeUpdateSpecialInstructions,
    clearCart: storeClearCart,
    openCart: storeOpenCart,
    closeCart: storeCloseCart,
    toggleCart: storeToggleCart,
    getItemCount,
    getSubtotal,
    getTax,
    getTotal,
  } = useCartStore();

  const addItem = useCallback(
    (item: MenuItem, quantity = 1, specialInstructions?: string) => {
      storeAddItem(item, quantity, specialInstructions);
    },
    [storeAddItem]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      storeRemoveItem(itemId);
    },
    [storeRemoveItem]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      storeUpdateQuantity(itemId, quantity);
    },
    [storeUpdateQuantity]
  );

  const updateSpecialInstructions = useCallback(
    (itemId: string, instructions: string) => {
      storeUpdateSpecialInstructions(itemId, instructions);
    },
    [storeUpdateSpecialInstructions]
  );

  const clearCart = useCallback(() => {
    storeClearCart();
  }, [storeClearCart]);

  const openCart = useCallback(() => {
    storeOpenCart();
  }, [storeOpenCart]);

  const closeCart = useCallback(() => {
    storeCloseCart();
  }, [storeCloseCart]);

  const toggleCart = useCallback(() => {
    storeToggleCart();
  }, [storeToggleCart]);

  const isItemInCart = useCallback(
    (menuItemId: string): boolean => {
      return items.some((item) => item.menuItemId === menuItemId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (menuItemId: string): number => {
      return items
        .filter((item) => item.menuItemId === menuItemId)
        .reduce((total, item) => total + item.quantity, 0);
    },
    [items]
  );

  return {
    items,
    isOpen,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    tax: getTax(),
    total: getTotal(),
    addItem,
    removeItem,
    updateQuantity,
    updateSpecialInstructions,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    isItemInCart,
    getItemQuantity,
  };
}
