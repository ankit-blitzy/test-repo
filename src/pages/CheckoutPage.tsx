/**
 * CheckoutPage – protected page for completing an order.
 */

import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
