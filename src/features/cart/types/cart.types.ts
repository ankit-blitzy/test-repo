/**
 * Cart feature type definitions.
 * Defines types for cart items, cart state, and cart operations.
 */

/** Individual item in the shopping cart */
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  specialInstructions?: string;
}

/** Cart state managed by CartContext */
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

/** Cart context value exposed to consumers */
export interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}
