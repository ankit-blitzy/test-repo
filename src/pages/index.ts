/**
 * @fileoverview Barrel export file for the pages directory.
 *
 * This module re-exports all page components from a single entry point,
 * enabling convenient importing throughout the application. Using this
 * barrel pattern allows for clean, consolidated imports such as:
 *
 * @example
 * // Single import statement for multiple pages
 * import { HomePage, MenuPage, CartPage } from '@/pages';
 *
 * @example
 * // Using relative path
 * import { LoginPage, RegisterPage } from '../pages';
 *
 * Benefits of this pattern:
 * - **Tree-shaking compatible**: Named exports allow bundlers to eliminate unused code
 * - **Clean imports**: Single import path for all page components
 * - **Maintainability**: Centralized export management for pages module
 * - **IDE support**: Enhanced auto-import functionality
 *
 * @module pages
 * @version 1.0.0
 */

// =============================================================================
// PUBLIC PAGES
// These pages are accessible without authentication
// =============================================================================

/**
 * HomePage - Landing page component featuring hero section, featured menu items,
 * restaurant highlights, and call-to-action buttons for ordering and booking.
 */
export { default as HomePage } from './HomePage';

/**
 * LoginPage - User authentication page with login form, email/password validation,
 * and links to registration for new users.
 */
export { default as LoginPage } from './LoginPage';

/**
 * RegisterPage - New user registration page with signup form including
 * name, email, password, and password confirmation fields with Zod validation.
 */
export { default as RegisterPage } from './RegisterPage';

/**
 * MenuPage - Restaurant menu display page showing all food items with
 * category-based filtering, search functionality, and add-to-cart capabilities.
 */
export { default as MenuPage } from './MenuPage';

// =============================================================================
// CART & CHECKOUT PAGES
// Shopping cart and order processing flow
// =============================================================================

/**
 * CartPage - Shopping cart management page displaying cart items with
 * quantity adjustment controls, item removal, and subtotal calculations.
 */
export { default as CartPage } from './CartPage';

/**
 * CheckoutPage - Order checkout page handling delivery/pickup selection,
 * customer information collection, and order submission process.
 */
export { default as CheckoutPage } from './CheckoutPage';

/**
 * OrderConfirmationPage - Order success page displaying order details,
 * confirmation number, estimated delivery/pickup time after successful checkout.
 */
export { default as OrderConfirmationPage } from './OrderConfirmationPage';

// =============================================================================
// BOOKING PAGE
// Table reservation functionality
// =============================================================================

/**
 * BookingPage - Table reservation page for restaurant dine-in bookings
 * with date selection, time slot availability, and party size options.
 */
export { default as BookingPage } from './BookingPage';

// =============================================================================
// PROTECTED PAGES
// These pages require user authentication
// =============================================================================

/**
 * AccountPage - User account dashboard displaying profile information,
 * order history with status tracking, and booking history with management options.
 */
export { default as AccountPage } from './AccountPage';
