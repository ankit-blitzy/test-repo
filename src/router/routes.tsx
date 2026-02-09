/**
 * Application route definitions with lazy-loaded pages.
 * Uses React Router 7 createBrowserRouter API.
 */

import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

/* Lazy-loaded pages */
const HomePage = lazy(() => import('@/pages/HomePage'));
const MenuPage = lazy(() => import('@/pages/MenuPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/**
 * Application router instance.
 * MainLayout is used as the root layout wrapping all routes (provides Header/Footer + Outlet).
 */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      /* Public routes */
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'booking', element: <BookingPage /> },

      /* Protected routes */
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'account', element: <AccountPage /> },
          { path: 'confirmation/:orderId', element: <OrderConfirmationPage /> },
        ],
      },

      /* Catch-all 404 */
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
