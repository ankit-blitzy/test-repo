/**
 * @fileoverview React Context provider for shopping cart state management.
 * This module provides centralized cart state management using React Context API.
 * It manages cart items, provides add/remove/update functionality, calculates totals,
 * and persists cart data to localStorage for session continuity.
 *
 * @module context/CartContext
 * @version 1.0.0
 *
 * @example
 * // Wrap your app with CartProvider
 * import { CartProvider } from './context/CartContext';
 *
 * function App() {
 *   return (
 *     <CartProvider>
 *       <YourComponents />
 *     </CartProvider>
 *   );
 * }
 *
 * @example
 * // Use the cart in components
 * import { useCart } from './context/CartContext';
 *
 * function MenuItemCard({ item }) {
 *   const { addToCart } = useCart();
 *   return (
 *     <button onClick={() => addToCart(item)}>Add to Cart</button>
 *   );
 * }
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { CartItem, MenuItem } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Tax rate applied to cart subtotal (8%)
 */
const TAX_RATE = 0.08;

/**
 * localStorage key for persisting cart data
 */
const CART_STORAGE_KEY = 'burger-house-cart';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Interface defining the shape of the Cart Context.
 * Provides state and methods for cart management throughout the application.
 */
export interface CartContextType {
  /** Array of items currently in the cart */
  items: CartItem[];

  /** Total price including tax */
  total: number;

  /** Total count of all items (sum of quantities) */
  itemCount: number;

  /** Cart subtotal (before tax) */
  subtotal: number;

  /** Tax amount */
  tax: number;

  /**
   * Adds an item to the cart or increases quantity if already present.
   * @param item - The menu item to add
   * @param quantity - Number of items to add (default: 1)
   */
  addToCart: (item: MenuItem, quantity?: number) => void;

  /**
   * Removes an item completely from the cart.
   * @param itemId - The unique ID of the item to remove
   */
  removeFromCart: (itemId: string) => void;

  /**
   * Updates the quantity of an existing cart item.
   * If quantity is 0 or negative, the item is removed.
   * @param itemId - The unique ID of the item to update
   * @param quantity - The new quantity value
   */
  updateQuantity: (itemId: string, quantity: number) => void;

  /**
   * Removes all items from the cart.
   * Typically called after successful checkout.
   */
  clearCart: () => void;

  /**
   * Calculates and returns the cart subtotal (before tax).
   * @returns The sum of (price * quantity) for all items
   */
  getSubtotal: () => number;

  /**
   * Calculates and returns the tax amount.
   * @returns Tax calculated as subtotal * TAX_RATE (8%)
   */
  getTax: () => number;

  /**
   * Calculates and returns the total price including tax.
   * @returns The sum of subtotal and tax
   */
  getTotal: () => number;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

/**
 * React Context for cart state.
 * Initialized as undefined to detect usage outside provider.
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Safely retrieves cart items from localStorage.
 * Handles parsing errors gracefully by returning an empty array.
 *
 * @returns {CartItem[]} Stored cart items or empty array if none found/error
 */
function getStoredCartItems(): CartItem[] {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const storedData = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedData) {
      return [];
    }
    const parsedItems = JSON.parse(storedData);
    // Validate that parsed data is an array
    if (!Array.isArray(parsedItems)) {
      console.warn('CartContext: Invalid cart data in localStorage, resetting cart');
      return [];
    }
    return parsedItems;
  } catch (error) {
    console.error('CartContext: Error parsing cart from localStorage:', error);
    return [];
  }
}

/**
 * Saves cart items to localStorage.
 * Handles storage errors gracefully with console warnings.
 *
 * @param {CartItem[]} items - Cart items to persist
 */
function saveCartToStorage(items: CartItem[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch (error) {
    console.error('CartContext: Error saving cart to localStorage:', error);
  }
}

/**
 * Calculates the subtotal for a given array of cart items.
 *
 * @param {CartItem[]} items - Array of cart items
 * @returns {number} The sum of (price * quantity) for all items, rounded to 2 decimal places
 */
function calculateSubtotal(items: CartItem[]): number {
  const subtotal = items.reduce((accumulator, cartItem) => {
    return accumulator + cartItem.item.price * cartItem.quantity;
  }, 0);
  // Round to 2 decimal places to avoid floating point issues
  return Math.round(subtotal * 100) / 100;
}

/**
 * Calculates the tax amount based on a subtotal.
 *
 * @param {number} subtotal - The cart subtotal
 * @returns {number} Tax amount (subtotal * TAX_RATE), rounded to 2 decimal places
 */
function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

/**
 * Calculates the total item count in the cart.
 *
 * @param {CartItem[]} items - Array of cart items
 * @returns {number} Total count of all items (sum of quantities)
 */
function calculateItemCount(items: CartItem[]): number {
  return items.reduce((accumulator, cartItem) => accumulator + cartItem.quantity, 0);
}

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

/**
 * Props interface for CartProvider component.
 */
interface CartProviderProps {
  /** Child components that will have access to cart context */
  children: ReactNode;
}

/**
 * CartProvider Component
 *
 * Provides shopping cart state and management functions to all child components.
 * Initializes cart state from localStorage and persists changes automatically.
 *
 * Features:
 * - Add items to cart with optional quantity
 * - Remove items from cart
 * - Update item quantities
 * - Clear entire cart
 * - Calculate subtotal, tax, and total
 * - Automatic localStorage persistence
 *
 * @param {CartProviderProps} props - Component props
 * @returns {React.ReactElement} Provider component wrapping children
 *
 * @example
 * <CartProvider>
 *   <App />
 * </CartProvider>
 */
export function CartProvider({ children }: CartProviderProps): React.ReactElement {
  // Initialize state from localStorage
  const [items, setItems] = useState<CartItem[]>(() => getStoredCartItems());

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Calculate derived values
  const itemCount = calculateItemCount(items);
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = Math.round((subtotal + tax) * 100) / 100;

  /**
   * Adds an item to the cart.
   * If the item already exists, increases its quantity.
   * If the item is new, adds it to the cart.
   *
   * @param {MenuItem} menuItem - The menu item to add
   * @param {number} quantity - Number of items to add (default: 1)
   */
  const addToCart = (menuItem: MenuItem, quantity: number = 1): void => {
    // Validate quantity
    if (quantity <= 0) {
      console.warn('CartContext: Cannot add item with quantity <= 0');
      return;
    }

    setItems((currentItems) => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(
        (cartItem) => cartItem.item.id === menuItem.id
      );

      if (existingItemIndex !== -1) {
        // Item exists - update quantity
        return currentItems.map((cartItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + quantity,
            };
          }
          return cartItem;
        });
      }

      // Item doesn't exist - add new item
      const newCartItem: CartItem = {
        item: menuItem,
        quantity,
      };
      return [...currentItems, newCartItem];
    });
  };

  /**
   * Removes an item completely from the cart.
   *
   * @param {string} itemId - The unique ID of the item to remove
   */
  const removeFromCart = (itemId: string): void => {
    setItems((currentItems) => {
      return currentItems.filter((cartItem) => cartItem.item.id !== itemId);
    });
  };

  /**
   * Updates the quantity of an existing cart item.
   * If the new quantity is 0 or negative, the item is removed from the cart.
   *
   * @param {string} itemId - The unique ID of the item to update
   * @param {number} quantity - The new quantity value
   */
  const updateQuantity = (itemId: string, quantity: number): void => {
    // Remove item if quantity is 0 or negative
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((currentItems) => {
      return currentItems.map((cartItem) => {
        if (cartItem.item.id === itemId) {
          return {
            ...cartItem,
            quantity,
          };
        }
        return cartItem;
      });
    });
  };

  /**
   * Clears all items from the cart.
   * Called after successful checkout to reset cart state.
   */
  const clearCart = (): void => {
    setItems([]);
  };

  /**
   * Returns the current cart subtotal (before tax).
   *
   * @returns {number} The calculated subtotal
   */
  const getSubtotal = (): number => {
    return calculateSubtotal(items);
  };

  /**
   * Returns the current tax amount.
   *
   * @returns {number} The calculated tax
   */
  const getTax = (): number => {
    return calculateTax(calculateSubtotal(items));
  };

  /**
   * Returns the current cart total (subtotal + tax).
   *
   * @returns {number} The calculated total
   */
  const getTotal = (): number => {
    const currentSubtotal = calculateSubtotal(items);
    const currentTax = calculateTax(currentSubtotal);
    return Math.round((currentSubtotal + currentTax) * 100) / 100;
  };

  // Build context value object
  const contextValue: CartContextType = {
    items,
    total,
    itemCount,
    subtotal,
    tax,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// =============================================================================
// CUSTOM HOOK
// =============================================================================

/**
 * Custom hook to access the cart context.
 *
 * Provides access to cart state and management functions.
 * Must be used within a CartProvider component.
 *
 * @returns {CartContextType} The cart context value
 * @throws {Error} If used outside of a CartProvider
 *
 * @example
 * function CartButton() {
 *   const { items, itemCount, addToCart, clearCart } = useCart();
 *
 *   return (
 *     <div>
 *       <span>Items in cart: {itemCount}</span>
 *       <button onClick={clearCart}>Clear Cart</button>
 *     </div>
 *   );
 * }
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
        'Wrap your component tree with <CartProvider> to use cart functionality.'
    );
  }

  return context;
}
