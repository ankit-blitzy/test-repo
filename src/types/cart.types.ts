/**
 * Cart Type Definitions
 * Defines interfaces for shopping cart functionality
 */

import type { MenuItem } from './menu.types';

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  addedAt: Date;
}

/**
 * Cart state interface for Zustand store
 */
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastUpdated: Date | null;
}

/**
 * Cart actions interface for Zustand store
 */
export interface CartActions {
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateSpecialInstructions: (cartItemId: string, instructions: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: (rate?: number) => number;
  getTotal: (taxRate?: number) => number;
}

/**
 * Combined Cart store type
 */
export type CartStore = CartState & CartActions;

/**
 * Props for cart drawer component
 */
export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Props for cart item component
 */
export interface CartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}
