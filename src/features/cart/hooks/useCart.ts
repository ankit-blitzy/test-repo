/**
 * Custom hook for accessing cart context.
 * Provides a convenient interface to the CartContext with error handling.
 */

import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import type { CartContextType } from '../types/cart.types';

/**
 * Hook to access the cart context.
 * Must be used within a CartProvider component tree.
 * @returns CartContextType with cart state and management methods
 * @throws Error if used outside of CartProvider
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
