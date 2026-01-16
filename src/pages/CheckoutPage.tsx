/**
 * @fileoverview Checkout Page Component for the Burger House restaurant application.
 * Handles the final order submission process with form validation.
 *
 * This component:
 * - Displays cart summary with order totals (items, subtotal, tax, total)
 * - Collects delivery address and special instructions via validated form
 * - Uses react-hook-form with Zod validation for form handling
 * - Integrates with order service and CartContext for order creation
 * - Redirects to order confirmation page on successful submission
 * - Protected route requiring user authentication
 *
 * @module pages/CheckoutPage
 * @version 1.0.0
 */

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/order';
import { Button, Card, Input } from '../components';

// =============================================================================
// SCHEMA DEFINITIONS
// =============================================================================

/**
 * Zod validation schema for checkout form data.
 * Validates delivery address (minimum 10 characters for complete address)
 * and optional special instructions.
 */
const checkoutSchema = z.object({
  /** Delivery address with minimum 10 characters */
  deliveryAddress: z.string().min(10, 'Please enter a valid address'),
  /** Optional special instructions for the order */
  specialInstructions: z.string().optional(),
});

/**
 * TypeScript type inferred from the Zod checkout schema.
 * Used for type-safe form handling with react-hook-form.
 */
type CheckoutFormData = z.infer<typeof checkoutSchema>;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CheckoutPage Component
 *
 * Order checkout page that handles the final order submission process.
 * Features a two-column layout with checkout form on the left and order summary on the right.
 *
 * Features:
 * - Form validation using react-hook-form with Zod resolver
 * - Delivery address input with validation feedback
 * - Special instructions textarea for customer notes
 * - Real-time order summary with line items and totals
 * - Loading state during order submission
 * - Error handling with user feedback
 * - Automatic redirect on successful order placement
 *
 * @example
 * // Route configuration
 * <Route path="/checkout" element={
 *   <ProtectedRoute>
 *     <CheckoutPage />
 *   </ProtectedRoute>
 * } />
 *
 * @returns The checkout page component
 */
function CheckoutPage(): JSX.Element | null {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  /**
   * State for tracking form submission status.
   * Shows loading spinner in button when true.
   */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * State for storing error messages from failed submissions.
   * Displayed as an alert banner above the form.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Cart context destructuring - provides cart items and calculation methods.
   * Uses getter functions (getSubtotal, getTax, getTotal) for reactive calculations.
   */
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();

  /**
   * Auth context destructuring - provides current user for order creation.
   */
  const { user } = useAuth();

  /**
   * React Router navigation hook for programmatic redirects.
   */
  const navigate = useNavigate();

  /**
   * React Hook Form setup with Zod validation.
   * Provides register function, submit handler, and form error state.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: '',
      specialInstructions: '',
    },
  });

  // ---------------------------------------------------------------------------
  // GUARDS
  // ---------------------------------------------------------------------------

  /**
   * Empty cart guard - redirect to cart page if no items.
   * Uses Navigate component for declarative redirect with replace.
   */
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // ---------------------------------------------------------------------------
  // CALCULATED VALUES
  // ---------------------------------------------------------------------------

  /**
   * Pre-calculate order totals for display and form submission.
   * These are computed once per render from the cart context.
   */
  const subtotal = getSubtotal();
  const tax = getTax();
  const total = getTotal();

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handles form submission for order creation.
   * Validates user authentication, creates order via service,
   * clears cart on success, and redirects to confirmation page.
   *
   * @param data - Validated form data from react-hook-form
   */
  const onSubmit = async (data: CheckoutFormData): Promise<void> => {
    // Ensure user is authenticated before proceeding
    if (!user) {
      setError('You must be logged in to place an order.');
      return;
    }

    // Set loading state and clear any previous errors
    setIsSubmitting(true);
    setError(null);

    try {
      // Call order service to create the order
      const order = await createOrder({
        userId: user.id,
        items,
        subtotal,
        tax,
        total,
        deliveryAddress: data.deliveryAddress,
        specialInstructions: data.specialInstructions,
      });

      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation with order ID
      navigate(`/order-confirmation?orderId=${order.id}`, { replace: true });
    } catch (err) {
      // Handle error and display user-friendly message
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while placing your order. Please try again.';
      setError(errorMessage);
    } finally {
      // Reset loading state regardless of outcome
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

      {/* Two Column Layout - Form on left (2/3), Summary on right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== LEFT COLUMN - CHECKOUT FORM ===== */}
        <div className="lg:col-span-2">
          <Card className="p-6" hoverable={false}>
            <h2 className="text-xl font-semibold text-stone-900 mb-6">
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Banner - Displayed when order submission fails */}
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="font-medium">Order Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}

              {/* Delivery Address Textarea */}
              <div>
                <label
                  htmlFor="deliveryAddress"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="deliveryAddress"
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 sm:text-sm ${
                    errors.deliveryAddress
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500'
                  }`}
                  placeholder="Enter your complete delivery address (e.g., 123 Main Street, Apt 4B, City, State 12345)"
                  aria-invalid={errors.deliveryAddress ? 'true' : undefined}
                  aria-describedby={
                    errors.deliveryAddress ? 'deliveryAddress-error' : undefined
                  }
                  {...register('deliveryAddress')}
                />
                {errors.deliveryAddress && (
                  <p
                    id="deliveryAddress-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.deliveryAddress.message}
                  </p>
                )}
              </div>

              {/* Special Instructions Textarea (Optional) */}
              <div>
                <label
                  htmlFor="specialInstructions"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Special Instructions{' '}
                  <span className="text-stone-400">(optional)</span>
                </label>
                <textarea
                  id="specialInstructions"
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                  placeholder="Any special requests? (e.g., no onions, extra sauce, ring doorbell)"
                  {...register('specialInstructions')}
                />
              </div>

              {/* Payment Information Notice */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-lg font-medium text-stone-900 mb-3">
                  Payment Method
                </h3>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Payment will be collected upon delivery. We accept cash and
                        all major credit/debit cards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Hidden on mobile, shown at bottom of right column */}
              <div className="hidden lg:block">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* ===== RIGHT COLUMN - ORDER SUMMARY ===== */}
        <div>
          <Card className="p-6 lg:sticky lg:top-24" hoverable={false}>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Order Summary
            </h2>

            {/* Order Items List */}
            <div className="space-y-3 mb-4">
              {items.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex justify-between items-start text-sm"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-stone-900 font-medium">
                      {cartItem.item.name}
                    </span>
                    <span className="text-stone-500 ml-2">
                      × {cartItem.quantity}
                    </span>
                  </div>
                  <span className="text-stone-900 font-medium whitespace-nowrap">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200 my-4" />

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="text-stone-900">${subtotal.toFixed(2)}</span>
              </div>

              {/* Tax (8%) */}
              <div className="flex justify-between">
                <span className="text-stone-600">Tax (8%)</span>
                <span className="text-stone-900">${tax.toFixed(2)}</span>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between">
                <span className="text-stone-600">Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-stone-200 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-stone-900">Total</span>
              <span className="text-xl font-bold text-amber-600">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Submit Button - Visible on mobile only */}
            <div className="mt-6 lg:hidden">
              <Button
                type="submit"
                form="checkout-form"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>

            {/* Order Info */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="flex items-start text-xs text-stone-500">
                <svg
                  className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Estimated delivery: 30-45 minutes after order confirmation
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Default export for component
export default CheckoutPage;
