/**
 * Checkout feature type definitions.
 */

import type { LoadingState } from '@/types/common.types';
import type { OrderResponse, PaymentMethod } from '@/types/api.types';

/** Checkout state */
export interface CheckoutState {
  loadingState: LoadingState;
  error: string | null;
  order: OrderResponse | null;
}

/** Checkout hook return type */
export interface UseCheckoutReturn extends CheckoutState {
  submitOrder: (data: CheckoutSubmitData) => Promise<string | null>;
  clearCheckoutError: () => void;
}

/** Data submitted during checkout */
export interface CheckoutSubmitData {
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pickupTime: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
}
