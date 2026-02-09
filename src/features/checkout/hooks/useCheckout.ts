/**
 * Custom hook for checkout process management.
 * Handles order submission and coordinates with cart state.
 */

import { useState, useCallback } from 'react';
import type { LoadingState } from '@/types/common.types';
import type { OrderResponse } from '@/types/api.types';
import type { UseCheckoutReturn, CheckoutSubmitData } from '../types/checkout.types';
import { useCart } from '@/features/cart/hooks/useCart';
import { createOrder } from '@/services/api/order.api';

/**
 * Hook that manages the checkout process.
 * Submits orders via the API and clears the cart on success.
 * @returns UseCheckoutReturn with order state and submit method
 */
export function useCheckout(): UseCheckoutReturn {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const { items, clearCart } = useCart();

  /**
   * Submits the current cart as an order.
   * @param data - Checkout form data with contact info, pickup time, and payment
   * @returns The order ID on success, or null on failure
   */
  const submitOrder = useCallback(
    async (data: CheckoutSubmitData): Promise<string | null> => {
      if (items.length === 0) {
        setError('Your cart is empty.');
        return null;
      }

      setLoadingState('loading');
      setError(null);

      try {
        const response = await createOrder({
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            specialInstructions: item.specialInstructions,
          })),
          contactInfo: data.contactInfo,
          pickupTime: data.pickupTime,
          specialInstructions: data.specialInstructions,
          paymentMethod: data.paymentMethod,
        });

        setOrder(response.data);
        clearCart();
        setLoadingState('success');
        return response.data.id;
      } catch {
        setError('Failed to place order. Please try again.');
        setLoadingState('error');
        return null;
      }
    },
    [items, clearCart]
  );

  const clearCheckoutError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loadingState,
    error,
    order,
    submitOrder,
    clearCheckoutError,
  };
}
