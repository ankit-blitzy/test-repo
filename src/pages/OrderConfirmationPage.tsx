/**
 * @fileoverview Order Confirmation Page component for the Burger House restaurant application.
 * Displays successful order details after checkout completion including order ID, items ordered,
 * total amount, estimated delivery time, and order status. Fetches order data from the order
 * service using URL query parameters.
 *
 * This is a protected route that requires user authentication.
 *
 * @module pages/OrderConfirmationPage
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../components';
import { Order, OrderStatus } from '../types';
import { getOrderById } from '../services/order';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Formats a Date object for display in a user-friendly format.
 * Shows date and time in localized format.
 *
 * @param date - The Date object to format
 * @returns Formatted date string (e.g., "January 15, 2025 at 3:30 PM")
 */
function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Formats a number as US currency (USD).
 *
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$12.99")
 */
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Returns the appropriate Tailwind CSS color classes for an order status.
 * Each status has a distinct color to help users quickly identify order state.
 *
 * @param status - The order status to get colors for
 * @returns Tailwind CSS classes for background and text colors
 */
function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.Confirmed:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.Preparing:
      return 'bg-orange-100 text-orange-800';
    case OrderStatus.Ready:
      return 'bg-green-100 text-green-800';
    case OrderStatus.Delivered:
      return 'bg-emerald-100 text-emerald-800';
    case OrderStatus.Cancelled:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Formats the order status for display with proper capitalization.
 *
 * @param status - The order status enum value
 * @returns Human-readable status string
 */
function formatStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * OrderConfirmationPage Component
 *
 * Displays order confirmation details after a successful checkout.
 * Shows order ID, items ordered, totals, estimated delivery time,
 * order status, and provides navigation to view all orders or continue shopping.
 *
 * Features:
 * - Fetches order data from URL query parameter (orderId)
 * - Loading state while fetching order details
 * - Error handling for invalid or missing order IDs
 * - Success display with checkmark icon
 * - Order items list with quantities and line totals
 * - Order totals breakdown (subtotal, tax, total)
 * - Status badge with color-coded status
 * - Estimated delivery time display
 * - Delivery address display (if applicable)
 * - Navigation buttons for account orders and menu
 *
 * @returns JSX element rendering the order confirmation page
 *
 * @example
 * // Route configuration in App.tsx
 * <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
 *
 * @example
 * // Navigate to confirmation after order creation
 * navigate(`/order-confirmation?orderId=${order.id}`);
 */
function OrderConfirmationPage(): React.JSX.Element {
  // Get orderId from URL search parameters
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Component state
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  /**
   * Effect to fetch order details when orderId changes.
   * Handles loading states, error states, and successful data retrieval.
   */
  useEffect(() => {
    /**
     * Async function to load order data from the order service.
     */
    async function loadOrderData(): Promise<void> {
      // Validate orderId presence
      if (!orderId) {
        setError('No order ID provided. Please check your order confirmation email.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch order from service
        const fetchedOrder = await getOrderById(orderId);

        if (fetchedOrder === null) {
          setError('Order not found. The order may have been removed or the ID is incorrect.');
        } else {
          setOrder(fetchedOrder);
        }
      } catch (err) {
        // Handle fetch errors with descriptive message
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while loading your order.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrderData();
  }, [orderId]);

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 text-lg">Loading order details...</p>
      </div>
    );
  }

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Card className="text-center p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Order
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Order not found'}
          </p>
          
          <Link to="/menu">
            <Button variant="primary" size="lg">
              Browse Menu
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ==========================================================================
  // SUCCESS STATE
  // ==========================================================================

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Banner/Header */}
        <div className="text-center mb-8">
          {/* Checkmark Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Order Details
              </h2>
              <p className="text-sm text-gray-500">
                Order #{order.id}
              </p>
            </div>
            
            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
            >
              {formatStatus(order.status)}
            </span>
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
            
            {order.estimatedDelivery && (
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium text-gray-900">
                  {formatDate(order.estimatedDelivery)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Order Items Card */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Items
          </h3>
          
          {/* Items List */}
          <div className="space-y-3 mb-4">
            {order.items.map((cartItem) => (
              <div
                key={cartItem.item.id}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center">
                  <span className="text-gray-900">
                    {cartItem.item.name}
                  </span>
                  <span className="text-gray-500 ml-2">
                    × {cartItem.quantity}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(cartItem.item.price * cartItem.quantity)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 pt-4">
            {/* Subtotal */}
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            
            {/* Tax */}
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">
                {formatCurrency(order.tax)}
              </span>
            </div>
            
            {/* Total */}
            <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-amber-600">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Address Card (if exists) */}
        {order.deliveryAddress && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delivery Address
            </h3>
            <p className="text-gray-600">
              {order.deliveryAddress}
            </p>
          </Card>
        )}

        {/* Special Instructions Card (if exists) */}
        {order.specialInstructions && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Special Instructions
            </h3>
            <p className="text-gray-600 italic">
              "{order.specialInstructions}"
            </p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/account" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
            >
              View All Orders
            </Button>
          </Link>
          <Link to="/menu" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default OrderConfirmationPage;
