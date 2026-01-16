/**
 * @fileoverview Shopping cart page component for Burger House restaurant.
 * Displays cart items with quantity adjustment controls, order summary with
 * subtotal, tax (8%), and total calculations. Integrates with CartContext
 * for state management and provides checkout navigation and clear cart functionality.
 *
 * This is a protected route requiring user authentication.
 *
 * @module pages/CartPage
 * @version 1.0.0
 *
 * @example
 * // Route configuration in App.tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/cart" element={<CartPage />} />
 * </Route>
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button, Card } from '../components';
import type { CartItem } from '../types';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CartPage Component
 *
 * Shopping cart management page that displays all items in the user's cart
 * with controls for adjusting quantities, removing items, and proceeding to checkout.
 *
 * Features:
 * - Displays cart items with name, price, quantity, and line total
 * - Quantity adjustment controls (increase/decrease/remove)
 * - Order summary with subtotal, tax (8%), and total calculations
 * - Clear cart functionality to remove all items
 * - Checkout button to proceed to /checkout
 * - Empty cart state with link to browse menu
 * - Responsive layout (two columns on desktop, single column on mobile)
 *
 * @returns {React.ReactElement} The rendered cart page component
 *
 * @example
 * // Direct usage (within ProtectedRoute)
 * <CartPage />
 */
function CartPage(): React.ReactElement {
  // ---------------------------------------------------------------------------
  // HOOKS & STATE
  // ---------------------------------------------------------------------------

  /**
   * Destructure cart state and methods from CartContext.
   * - items: Array of CartItem objects in the cart
   * - removeFromCart: Function to remove an item completely
   * - updateQuantity: Function to update item quantity
   * - clearCart: Function to remove all items
   * - getSubtotal: Function returning cart subtotal before tax
   * - getTax: Function returning calculated tax amount (8%)
   * - getTotal: Function returning total including tax
   */
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
  } = useCart();

  /**
   * Navigation hook for programmatic routing to checkout page.
   */
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  /**
   * Handles quantity change for a cart item.
   * If the new quantity is <= 0, removes the item from cart.
   * Otherwise, updates the item quantity.
   *
   * @param {string} itemId - Unique identifier of the item to update
   * @param {number} newQuantity - The new quantity value
   */
  const handleQuantityChange = (itemId: string, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  /**
   * Handles checkout button click.
   * Navigates the user to the checkout page.
   */
  const handleCheckout = (): void => {
    navigate('/checkout');
  };

  /**
   * Handles clear cart button click.
   * Removes all items from the cart.
   */
  const handleClearCart = (): void => {
    clearCart();
  };

  // ---------------------------------------------------------------------------
  // EMPTY CART STATE
  // ---------------------------------------------------------------------------

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-stone-800 mb-8 text-center">
          Your Cart
        </h1>
        <Card className="max-w-md mx-auto p-8 text-center">
          {/* Empty cart icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-stone-500 mb-6">
            Looks like you haven't added anything to your cart yet.
            Browse our delicious menu to get started!
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

  // ---------------------------------------------------------------------------
  // CART WITH ITEMS
  // ---------------------------------------------------------------------------

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-stone-800 mb-8">Your Cart</h1>

      {/* Two-column layout: Items (2/3) | Summary (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((cartItem: CartItem) => (
            <Card
              key={cartItem.item.id}
              className="p-4"
              hoverable={false}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Item Image */}
                <div className="w-20 h-20 bg-amber-50 rounded-lg flex-shrink-0 overflow-hidden">
                  {cartItem.item.image ? (
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to emoji on image load error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.nextSibling) {
                          (target.nextSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-amber-100 rounded-lg flex items-center justify-center ${
                      cartItem.item.image ? 'hidden' : ''
                    }`}
                  >
                    <span className="text-3xl" role="img" aria-label="burger">
                      🍔
                    </span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-stone-800 text-lg">
                    {cartItem.item.name}
                  </h3>
                  <p className="text-stone-500 text-sm line-clamp-2">
                    {cartItem.item.description}
                  </p>
                  <p className="text-amber-600 font-semibold mt-1">
                    ${cartItem.item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  {/* Decrease Quantity Button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(cartItem.item.id, cartItem.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center 
                             hover:bg-stone-100 hover:border-stone-400 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                    aria-label={`Decrease quantity of ${cartItem.item.name}`}
                  >
                    <span className="text-lg font-medium text-stone-600">−</span>
                  </button>

                  {/* Current Quantity Display */}
                  <span
                    className="w-10 text-center font-semibold text-stone-800"
                    aria-label={`Quantity: ${cartItem.quantity}`}
                  >
                    {cartItem.quantity}
                  </span>

                  {/* Increase Quantity Button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(cartItem.item.id, cartItem.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center 
                             hover:bg-stone-100 hover:border-stone-400 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                    aria-label={`Increase quantity of ${cartItem.item.name}`}
                  >
                    <span className="text-lg font-medium text-stone-600">+</span>
                  </button>
                </div>

                {/* Line Total & Remove */}
                <div className="text-right flex flex-col items-end gap-2 min-w-[100px]">
                  {/* Line Total (price × quantity) */}
                  <p className="font-bold text-lg text-stone-800">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </p>
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(cartItem.item.id)}
                    className="text-red-500 text-sm hover:text-red-600 hover:underline 
                             transition-colors focus:outline-none focus:underline"
                    aria-label={`Remove ${cartItem.item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            {/* Summary Title */}
            <h2 className="text-xl font-bold text-stone-800 mb-6">
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-medium text-stone-800">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>

              {/* Tax (8%) */}
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Tax (8%)</span>
                <span className="font-medium text-stone-800">
                  ${getTax().toFixed(2)}
                </span>
              </div>

              {/* Divider */}
              <hr className="border-stone-200 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-stone-800">Total</span>
                <span className="text-xl font-bold text-amber-600">
                  ${getTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Proceed to Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>

              {/* Clear Cart Button */}
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>

            {/* Continue Shopping Link */}
            <Link
              to="/menu"
              className="block text-center text-amber-600 hover:text-amber-700 
                       hover:underline mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default CartPage;
