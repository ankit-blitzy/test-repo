/**
 * Cart Store
 * Zustand store for managing shopping cart state with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '@/types/menu.types';
import type { CartItem, CartState, CartActions } from '@/types/cart.types';

/**
 * Default tax rate (8%)
 */
const DEFAULT_TAX_RATE = 0.08;

/**
 * Generate unique ID for cart items
 */
function generateId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Cart store with persistence
 */
export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      lastUpdated: null,

      // Add item to cart
      addItem: (menuItem: MenuItem, quantity = 1, specialInstructions?: string) => {
        const { items } = get();
        
        // Check if item already exists (without special instructions)
        const existingIndex = items.findIndex(
          (item) =>
            item.menuItemId === menuItem.id &&
            item.specialInstructions === specialInstructions
        );

        if (existingIndex >= 0) {
          // Update quantity of existing item
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
          };
          set({ items: updatedItems, lastUpdated: new Date() });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: generateId(),
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
            specialInstructions,
            addedAt: new Date(),
          };
          set({ items: [...items, newItem], lastUpdated: new Date() });
        }
      },

      // Remove item from cart
      removeItem: (cartItemId: string) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== cartItemId),
          lastUpdated: new Date(),
        });
      },

      // Update item quantity
      updateQuantity: (cartItemId: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          set({
            items: items.filter((item) => item.id !== cartItemId),
            lastUpdated: new Date(),
          });
        } else {
          // Update quantity
          set({
            items: items.map((item) =>
              item.id === cartItemId ? { ...item, quantity } : item
            ),
            lastUpdated: new Date(),
          });
        }
      },

      // Update special instructions
      updateSpecialInstructions: (cartItemId: string, instructions: string) => {
        const { items } = get();
        set({
          items: items.map((item) =>
            item.id === cartItemId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
          lastUpdated: new Date(),
        });
      },

      // Clear all items from cart
      clearCart: () => {
        set({ items: [], lastUpdated: new Date() });
      },

      // Toggle cart drawer
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Open cart drawer
      openCart: () => {
        set({ isOpen: true });
      },

      // Close cart drawer
      closeCart: () => {
        set({ isOpen: false });
      },

      // Get total item count
      getItemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      // Get subtotal (before tax)
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Get tax amount
      getTax: (rate = DEFAULT_TAX_RATE) => {
        const subtotal = get().getSubtotal();
        return subtotal * rate;
      },

      // Get total (including tax)
      getTotal: (taxRate = DEFAULT_TAX_RATE) => {
        const subtotal = get().getSubtotal();
        const tax = subtotal * taxRate;
        return subtotal + tax;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
