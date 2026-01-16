/**
 * @fileoverview Root React component for the Burger House restaurant web application.
 *
 * This is the central application component that orchestrates the entire app structure.
 * It serves as the entry point for the React application and is responsible for:
 *
 * 1. **Context Providers**: Wraps the application with AuthProvider and CartProvider
 *    to provide authentication and shopping cart state management throughout the app.
 *
 * 2. **Routing Configuration**: Configures React Router v7 with BrowserRouter and
 *    defines all application routes including public and protected routes.
 *
 * 3. **Layout Structure**: Wraps all routes in MainLayout to provide consistent
 *    header, footer, and page structure across the application.
 *
 * Provider Hierarchy (Outside to Inside):
 * - AuthProvider: Provides user authentication state and methods
 * - CartProvider: Provides shopping cart state and operations
 * - BrowserRouter: Enables client-side routing with browser history
 * - MainLayout: Provides consistent page layout with Header and Footer
 * - Routes: Contains all route definitions
 *
 * Route Configuration:
 * - Public Routes: Accessible to all users (Home, Login, Register, Menu)
 * - Protected Routes: Require authentication (Cart, Booking, Checkout, Order Confirmation, Account)
 *
 * @module App
 * @version 1.0.0
 *
 * @example
 * // In main.tsx entry point
 * import React from 'react';
 * import ReactDOM from 'react-dom/client';
 * import App from './App';
 *
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 *
 * @see {@link module:context/AuthContext} for authentication state management
 * @see {@link module:context/CartContext} for shopping cart state management
 * @see {@link module:components/layout/MainLayout} for page layout structure
 * @see {@link module:components/auth/ProtectedRoute} for route authentication guard
 */

import React, { type JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// =============================================================================
// CONTEXT PROVIDER IMPORTS
// =============================================================================

/**
 * Authentication context provider.
 * Manages user session state, provides login/logout/register functions,
 * and exposes authentication status to all child components.
 */
import { AuthProvider } from './context/AuthContext';

/**
 * Shopping cart context provider.
 * Manages cart items, quantities, totals, and provides cart operations
 * (add, remove, update, clear) to all child components.
 */
import { CartProvider } from './context/CartContext';

// =============================================================================
// LAYOUT COMPONENT IMPORTS
// =============================================================================

/**
 * Main page layout wrapper component.
 * Provides consistent structure with Header, main content area, and Footer.
 * Uses Flexbox for full-height layouts with footer pushed to bottom.
 */
import { MainLayout } from './components/layout/MainLayout';

// =============================================================================
// ROUTE GUARD IMPORTS
// =============================================================================

/**
 * Protected route authentication guard component.
 * Checks authentication status and redirects unauthenticated users to login.
 * Uses React Router Outlet to render protected child routes.
 */
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// =============================================================================
// PAGE COMPONENT IMPORTS
// =============================================================================

/**
 * Page components imported from the pages barrel file.
 * Each page represents a distinct view/screen in the application.
 */
import {
  /**
   * Landing page with hero section, featured menu items, and CTAs.
   * First page users see when visiting the application.
   */
  HomePage,

  /**
   * User login page with email/password form and validation.
   * Redirects to home page after successful authentication.
   */
  LoginPage,

  /**
   * User registration page with signup form and validation.
   * Includes name, email, password, and confirm password fields.
   */
  RegisterPage,

  /**
   * Menu display page with category filtering.
   * Shows all menu items in a responsive grid with add-to-cart buttons.
   */
  MenuPage,

  /**
   * Shopping cart page for managing cart items.
   * Displays items, quantities, and totals with checkout navigation.
   * Requires authentication.
   */
  CartPage,

  /**
   * Table booking page for restaurant reservations.
   * Features date, time slot, and guest count selection.
   * Requires authentication.
   */
  BookingPage,

  /**
   * Checkout page for finalizing orders.
   * Collects delivery address and processes payment.
   * Requires authentication.
   */
  CheckoutPage,

  /**
   * Order confirmation page after successful checkout.
   * Displays order details, total, and estimated delivery time.
   * Requires authentication.
   */
  OrderConfirmationPage,

  /**
   * User account page with profile and history tabs.
   * Shows order history and booking history.
   * Requires authentication.
   */
  AccountPage,
} from './pages';

// =============================================================================
// MAIN APPLICATION COMPONENT
// =============================================================================

/**
 * Root Application Component
 *
 * The main entry point component for the Burger House restaurant application.
 * This component establishes the foundational structure of the application by:
 *
 * 1. Setting up the context provider hierarchy for state management
 * 2. Configuring client-side routing with React Router v7
 * 3. Defining all application routes with appropriate protection levels
 * 4. Wrapping routes in a consistent layout structure
 *
 * ## Provider Architecture
 *
 * The provider hierarchy is intentionally ordered for optimal functionality:
 *
 * ```
 * AuthProvider (outermost)
 *   └─ CartProvider
 *       └─ BrowserRouter
 *           └─ MainLayout
 *               └─ Routes
 * ```
 *
 * - **AuthProvider**: Must be outermost to provide auth state to all components
 * - **CartProvider**: Depends on auth state for user-specific carts (future)
 * - **BrowserRouter**: Enables routing, must wrap all route-aware components
 * - **MainLayout**: Provides consistent UI structure across all routes
 * - **Routes**: Contains the route configuration
 *
 * ## Route Configuration
 *
 * Routes are organized into two categories:
 *
 * ### Public Routes (No authentication required)
 * - `/` - HomePage: Landing page with restaurant overview
 * - `/login` - LoginPage: User authentication
 * - `/register` - RegisterPage: New user registration
 * - `/menu` - MenuPage: Browse menu items
 *
 * ### Protected Routes (Authentication required)
 * - `/cart` - CartPage: View and manage shopping cart
 * - `/booking` - BookingPage: Make table reservations
 * - `/checkout` - CheckoutPage: Complete order purchase
 * - `/order-confirmation` - OrderConfirmationPage: Order success display
 * - `/account` - AccountPage: User profile and history
 *
 * Protected routes are wrapped with the ProtectedRoute component which:
 * - Checks authentication status via AuthContext
 * - Shows loading spinner during auth verification
 * - Redirects unauthenticated users to `/login`
 * - Preserves the intended destination for post-login redirect
 *
 * @returns {JSX.Element} The complete application component tree
 *
 * @example
 * // Typical usage in main.tsx
 * import App from './App';
 *
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <App />
 *   </StrictMode>
 * );
 */
const App: React.FC = (): JSX.Element => {
  return (
    // =========================================================================
    // AUTHENTICATION PROVIDER
    // =========================================================================
    // AuthProvider must be the outermost provider to ensure authentication
    // state is available to all components, including CartProvider and routes.
    // It manages:
    // - User session state (user data, isAuthenticated, isLoading)
    // - Authentication methods (login, logout, register)
    // - Session persistence via localStorage
    <AuthProvider>
      {/* =======================================================================
          CART PROVIDER
          ======================================================================= */}
      {/* CartProvider manages shopping cart state and operations.
          It is nested inside AuthProvider because:
          - Future enhancement: user-specific cart synchronization
          - Cart operations may depend on authentication status
          - Keeps cart state scoped within authenticated context */}
      <CartProvider>
        {/* =====================================================================
            ROUTER CONFIGURATION
            ===================================================================== */}
        {/* BrowserRouter enables client-side routing using the HTML5 History API.
            - Provides clean URLs without hash fragments
            - Enables back/forward browser navigation
            - Must wrap all components that use routing hooks or components */}
        <BrowserRouter>
          {/* ===================================================================
              MAIN LAYOUT WRAPPER
              =================================================================== */}
          {/* MainLayout provides consistent page structure across all routes:
              - Header with navigation and auth controls at the top
              - Flexible main content area for route-specific content
              - Footer with links and info at the bottom
              - Full-height layout with footer pushed to bottom */}
          <MainLayout>
            {/* =================================================================
                ROUTE DEFINITIONS
                ================================================================= */}
            {/* Routes component contains all route definitions.
                It renders the first Route that matches the current URL.
                Routes are organized by access level (public vs protected). */}
            <Routes>
              {/* ===============================================================
                  PUBLIC ROUTES
                  =============================================================== */}
              {/* These routes are accessible to all users without authentication.
                  They include the main landing page, authentication pages,
                  and the menu browsing page. */}

              {/* Home Page Route
                  Path: /
                  The landing page users see when first visiting the site.
                  Features hero section, featured items, and call-to-action buttons.
                  Accessible to all users (authenticated and unauthenticated). */}
              <Route path="/" element={<HomePage />} />

              {/* Login Page Route
                  Path: /login
                  User authentication page with email/password form.
                  Includes form validation with Zod and redirects on success.
                  Shows link to register page for new users. */}
              <Route path="/login" element={<LoginPage />} />

              {/* Register Page Route
                  Path: /register
                  New user registration page with signup form.
                  Collects name, email, password with validation.
                  Auto-logs in user after successful registration. */}
              <Route path="/register" element={<RegisterPage />} />

              {/* Menu Page Route
                  Path: /menu
                  Displays all menu items with category filtering.
                  Users can browse and add items to cart.
                  Accessible to all users; adding to cart may prompt login. */}
              <Route path="/menu" element={<MenuPage />} />

              {/* ===============================================================
                  PROTECTED ROUTES
                  =============================================================== */}
              {/* These routes require user authentication.
                  ProtectedRoute component guards these routes by:
                  1. Checking authentication status via AuthContext
                  2. Showing loading spinner during auth verification
                  3. Redirecting unauthenticated users to /login
                  4. Passing original destination in state for redirect back
                  
                  Uses React Router's nested route pattern:
                  - Parent Route element renders ProtectedRoute
                  - ProtectedRoute renders <Outlet /> for child routes
                  - Child routes only render if user is authenticated */}
              <Route element={<ProtectedRoute />}>
                {/* Cart Page Route
                    Path: /cart
                    Shopping cart management page.
                    Shows cart items, quantities, and pricing.
                    Provides navigation to checkout.
                    Protected: User must be logged in. */}
                <Route path="/cart" element={<CartPage />} />

                {/* Booking Page Route
                    Path: /booking
                    Table reservation page for dine-in customers.
                    Features date picker, time slot selection, guest count.
                    Protected: User must be logged in to make reservations. */}
                <Route path="/booking" element={<BookingPage />} />

                {/* Checkout Page Route
                    Path: /checkout
                    Order finalization page.
                    Displays order summary and collects delivery details.
                    Processes payment (simulated) and creates order.
                    Protected: User must be logged in to checkout. */}
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Order Confirmation Page Route
                    Path: /order-confirmation
                    Displays successful order details after checkout.
                    Shows order ID, items, total, estimated delivery.
                    Receives order ID via URL query parameter.
                    Protected: User must be logged in to view orders. */}
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

                {/* Account Page Route
                    Path: /account
                    User profile and history dashboard.
                    Shows user info, order history, and booking history.
                    Features tabbed interface for organizing content.
                    Protected: User must be logged in to view account. */}
                <Route path="/account" element={<AccountPage />} />
              </Route>
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Default export of the App component.
 *
 * Used as the root component in main.tsx entry point.
 * This is the standard export pattern for React application root components.
 *
 * @example
 * import App from './App';
 *
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <App />
 *   </StrictMode>
 * );
 */
export default App;
