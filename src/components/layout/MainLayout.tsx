/**
 * @fileoverview Main layout wrapper component for Burger House restaurant website.
 * Provides consistent page structure across all routes by combining the Header
 * and Footer components with a main content area for child components.
 * 
 * @module components/layout/MainLayout
 * @version 1.0.0
 * 
 * Features:
 * - Full-height viewport layout using CSS Flexbox
 * - Sticky header at the top of the page
 * - Footer pushed to bottom of viewport on short content pages
 * - Flexible main content area that grows to fill available space
 * - Consistent structure for all page components
 * 
 * Layout Structure:
 * ```
 * ┌─────────────────────────────────────┐
 * │              Header                 │  ← Sticky navigation
 * ├─────────────────────────────────────┤
 * │                                     │
 * │           Main Content              │  ← flex-grow (children)
 * │           (children)                │
 * │                                     │
 * ├─────────────────────────────────────┤
 * │              Footer                 │  ← Pushed to bottom
 * └─────────────────────────────────────┘
 * ```
 * 
 * @example
 * ```tsx
 * import { MainLayout } from './components/layout/MainLayout';
 * 
 * function App() {
 *   return (
 *     <MainLayout>
 *       <HomePage />
 *     </MainLayout>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // With React Router
 * import { MainLayout } from './components/layout/MainLayout';
 * import { Routes, Route } from 'react-router-dom';
 * 
 * function App() {
 *   return (
 *     <MainLayout>
 *       <Routes>
 *         <Route path="/" element={<HomePage />} />
 *         <Route path="/menu" element={<MenuPage />} />
 *       </Routes>
 *     </MainLayout>
 *   );
 * }
 * ```
 */

import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props interface for the MainLayout component.
 * Defines the shape of props accepted by the layout wrapper.
 * 
 * @interface MainLayoutProps
 * @property {ReactNode} children - Page content to render between header and footer.
 *   Accepts any valid React renderable content including elements, strings,
 *   numbers, fragments, portals, null, undefined, and booleans.
 * 
 * @example
 * ```tsx
 * const props: MainLayoutProps = {
 *   children: <HomePage />
 * };
 * ```
 */
export interface MainLayoutProps {
  /**
   * Page content to render in the main content area.
   * This content is placed between the Header and Footer components.
   * Can be any valid React node: elements, strings, arrays, fragments, etc.
   */
  children: ReactNode;
}

// =============================================================================
// COMPONENT IMPLEMENTATION
// =============================================================================

/**
 * MainLayout is the primary page wrapper component for the Burger House application.
 * 
 * This component provides a consistent layout structure across all routes by:
 * - Rendering the Header component at the top of every page
 * - Placing page-specific content (children) in the main content area
 * - Rendering the Footer component at the bottom of every page
 * 
 * The layout uses CSS Flexbox with `min-h-screen` to ensure:
 * - The layout always fills at least the full viewport height
 * - The footer is pushed to the bottom even on pages with little content
 * - The main content area grows to fill available space
 * 
 * @param {MainLayoutProps} props - Component props
 * @param {ReactNode} props.children - Page content to render between header and footer
 * @returns {React.JSX.Element} The rendered layout with header, main content, and footer
 * 
 * @example
 * ```tsx
 * // Basic usage with a single page component
 * <MainLayout>
 *   <HomePage />
 * </MainLayout>
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with React Router for multiple routes
 * <MainLayout>
 *   <Routes>
 *     <Route path="/" element={<HomePage />} />
 *     <Route path="/menu" element={<MenuPage />} />
 *     <Route path="/booking" element={<BookingPage />} />
 *   </Routes>
 * </MainLayout>
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with conditional content
 * <MainLayout>
 *   {isLoading ? <LoadingSpinner /> : <ContentPage />}
 * </MainLayout>
 * ```
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }): React.JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 
        Header Component
        - Renders sticky navigation bar at the top of every page
        - Contains brand logo, navigation links, cart icon, and auth controls
        - Responsive with mobile hamburger menu
      */}
      <Header />

      {/* 
        Main Content Area
        - flex-grow ensures this area expands to fill available space
        - Pushes the footer to the bottom on pages with little content
        - Children are the page-specific content passed to the layout
      */}
      <main className="flex-grow" role="main">
        {children}
      </main>

      {/* 
        Footer Component
        - Renders at the bottom of every page
        - Contains navigation links, contact info, hours, and social links
        - Always pushed to bottom via Flexbox layout
      */}
      <Footer />
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

// Named export of MainLayout is the primary export above
// MainLayoutProps is also exported as a named export for TypeScript consumers
