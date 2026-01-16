/**
 * @fileoverview Barrel export file for the components directory.
 *
 * This file provides a centralized export point for all UI components used
 * throughout the Burger House restaurant application. Using barrel exports
 * simplifies imports and improves code organization by allowing consumers
 * to import multiple components from a single path.
 *
 * @module components
 * @version 1.0.0
 *
 * @example
 * // Instead of importing from individual files:
 * // import { Button } from '@/components/common/Button';
 * // import { Header } from '@/components/layout/Header';
 * // import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
 *
 * // You can import from the barrel file:
 * import { Button, Header, ProtectedRoute } from '@/components';
 *
 * @example
 * // Importing multiple components for a page
 * import {
 *   Button,
 *   Card,
 *   Input,
 *   MainLayout,
 *   Header,
 *   Footer,
 *   LoadingSpinner,
 * } from '@/components';
 *
 * @example
 * // Importing for protected routes setup
 * import { ProtectedRoute, MainLayout } from '@/components';
 */

// =============================================================================
// AUTH COMPONENT EXPORTS
// =============================================================================

/**
 * Route authentication guard component.
 *
 * ProtectedRoute wraps routes that require user authentication. It checks
 * the authentication state via AuthContext and redirects unauthenticated
 * users to the login page while preserving the original destination URL.
 *
 * @see {@link module:components/auth/ProtectedRoute} for full documentation
 *
 * @example
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/cart" element={<CartPage />} />
 *   <Route path="/account" element={<AccountPage />} />
 * </Route>
 */
export { ProtectedRoute } from './auth/ProtectedRoute';

// =============================================================================
// COMMON COMPONENT EXPORTS
// =============================================================================

/**
 * Multi-variant button component for CTAs, form submissions, and navigation actions.
 *
 * Supports three visual variants (primary, secondary, outline), three sizes
 * (sm, md, lg), loading states, and full accessibility support.
 *
 * @see {@link module:components/common/Button} for full documentation
 *
 * @example
 * <Button variant="primary" size="lg" onClick={handleOrder}>
 *   Order Now
 * </Button>
 */
export { Button } from './common/Button';

/**
 * Content card container with shadow, padding, and rounded corners.
 *
 * Provides consistent styling for content grouping with support for
 * multiple variants (default, elevated, bordered) and optional hover effects.
 *
 * @see {@link module:components/common/Card} for full documentation
 *
 * @example
 * <Card variant="elevated">
 *   <CardHeader>Menu Item</CardHeader>
 *   <CardContent>{description}</CardContent>
 * </Card>
 */
export { Card, CardHeader, CardContent, CardFooter } from './common/Card';

/**
 * Form input component with label and validation error display.
 *
 * Integrates with react-hook-form for validation and provides consistent
 * styling with error state handling and accessibility attributes.
 *
 * @see {@link module:components/common/Input} for full documentation
 *
 * @example
 * <Input
 *   label="Email Address"
 *   type="email"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 */
export { Input } from './common/Input';

/**
 * Modal dialog overlay component for confirmations and item details.
 *
 * Provides accessible modal dialogs with focus trapping, keyboard navigation,
 * and backdrop click handling for dismissal.
 *
 * @see {@link module:components/common/Modal} for full documentation
 *
 * @example
 * <Modal
 *   isOpen={showConfirmation}
 *   onClose={() => setShowConfirmation(false)}
 *   title="Confirm Order"
 * >
 *   <p>Are you sure you want to place this order?</p>
 * </Modal>
 */
export { Modal } from './common/Modal';

/**
 * Loading indicator component with animated spinner for async operations.
 *
 * Displays a spinning animation during data fetching, form submissions,
 * or other asynchronous operations. Supports multiple sizes and optional text.
 *
 * @see {@link module:components/common/LoadingSpinner} for full documentation
 *
 * @example
 * {isLoading && <LoadingSpinner size="lg" text="Loading menu..." />}
 */
export { default as LoadingSpinner } from './common/LoadingSpinner';

// =============================================================================
// LAYOUT COMPONENT EXPORTS
// =============================================================================

/**
 * Navigation header component with auth-aware menu display.
 *
 * Renders the main navigation bar with logo, menu links, and user authentication
 * controls. Responsive with mobile hamburger menu and desktop navigation.
 *
 * @see {@link module:components/layout/Header} for full documentation
 *
 * @example
 * <Header />
 */
export { Header } from './layout/Header';

/**
 * Site footer component with navigation links, contact info, and copyright.
 *
 * Displays restaurant information, social links, and copyright notice
 * at the bottom of each page.
 *
 * @see {@link module:components/layout/Footer} for full documentation
 *
 * @example
 * <Footer />
 */
export { default as Footer } from './layout/Footer';

/**
 * Page wrapper component providing consistent layout structure.
 *
 * MainLayout wraps page content with Header and Footer components,
 * ensuring consistent layout across all pages with proper spacing
 * and responsive behavior.
 *
 * @see {@link module:components/layout/MainLayout} for full documentation
 *
 * @example
 * <MainLayout>
 *   <HomePage />
 * </MainLayout>
 */
export { MainLayout } from './layout/MainLayout';

// =============================================================================
// TYPE RE-EXPORTS
// =============================================================================

/**
 * Re-export component prop types for consumers who need type definitions.
 * This allows TypeScript users to properly type their component usage.
 */
export type { ButtonProps } from './common/Button';
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './common/Card';
export type { InputProps } from './common/Input';
export type { ModalProps } from './common/Modal';
export type { LoadingSpinnerProps } from './common/LoadingSpinner';
export type { ProtectedRouteProps } from './auth/ProtectedRoute';
export type { MainLayoutProps } from './layout/MainLayout';
