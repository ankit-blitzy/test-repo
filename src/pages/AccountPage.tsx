/**
 * @fileoverview User account page component for the Burger House restaurant application.
 * Displays user profile information, order history, and booking history with a tabbed interface.
 * Provides functionality to view and manage personal data, past orders, and reservations.
 *
 * Features:
 * - Tabbed navigation between Profile, Orders, and Bookings sections
 * - User profile display with avatar, name, email, phone, and registration date
 * - Order history with status badges and item details
 * - Booking history with status badges and cancellation capability
 * - Logout functionality
 * - Loading states for async data fetching
 *
 * @module pages/AccountPage
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * // In router configuration (protected route)
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/account" element={<AccountPage />} />
 * </Route>
 * ```
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, LoadingSpinner } from '../components';
import type { Order, Booking } from '../types';
import { getOrdersByUser } from '../services/order';
import { getBookingsByUser, cancelBooking } from '../services/booking';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Type representing the available tab options in the account page.
 */
type TabType = 'profile' | 'orders' | 'bookings';

/**
 * Interface for individual tab configuration.
 */
interface TabConfig {
  /** Unique identifier for the tab */
  id: TabType;
  /** Display label for the tab */
  label: string;
  /** Icon to display alongside the label */
  icon: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Tab configuration array for rendering tab navigation.
 */
const TABS: TabConfig[] = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'orders', label: 'Orders', icon: '🍔' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Formats a date for display.
 * Handles both Date objects and ISO date strings.
 *
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date and time for display.
 *
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date and time string (e.g., "January 15, 2024 at 2:30 PM")
 */
function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Formats a number as currency (USD).
 *
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$12.99")
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Returns CSS classes for status badge based on status value.
 *
 * @param status - The status string to style
 * @returns Object containing background and text color classes
 */
function getStatusBadgeClasses(status: string): { bg: string; text: string } {
  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'confirmed':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'preparing':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'ready':
      return { bg: 'bg-purple-100', text: 'text-purple-800' };
    case 'delivered':
    case 'completed':
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
    case 'cancelled':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
}

/**
 * Gets the user's initials from their name for the avatar.
 *
 * @param name - The user's full name
 * @returns Two-letter initials (e.g., "JD" for "John Doe")
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AccountPage component - User profile and history management page.
 *
 * Displays a tabbed interface allowing users to:
 * - View and manage their profile information
 * - Browse their order history
 * - View and cancel their table bookings
 *
 * This is a protected route that requires authentication.
 *
 * @returns The rendered AccountPage component
 *
 * @example
 * ```tsx
 * // Basic usage in routes
 * <Route path="/account" element={<AccountPage />} />
 * ```
 */
export default function AccountPage(): React.JSX.Element {
  // ===========================================================================
  // HOOKS
  // ===========================================================================

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ===========================================================================
  // STATE
  // ===========================================================================

  /**
   * Currently active tab in the interface.
   */
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  /**
   * User's order history.
   */
  const [orders, setOrders] = useState<Order[]>([]);

  /**
   * User's booking history.
   */
  const [bookings, setBookings] = useState<Booking[]>([]);

  /**
   * Loading state for orders fetch.
   */
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  /**
   * Loading state for bookings fetch.
   */
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);

  /**
   * Track if orders have been loaded to prevent duplicate fetches.
   */
  const [ordersLoaded, setOrdersLoaded] = useState<boolean>(false);

  /**
   * Track if bookings have been loaded to prevent duplicate fetches.
   */
  const [bookingsLoaded, setBookingsLoaded] = useState<boolean>(false);

  /**
   * Loading state for booking cancellation.
   */
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // ===========================================================================
  // EFFECTS
  // ===========================================================================

  /**
   * Effect to fetch orders when the orders tab is activated.
   * Only fetches if orders haven't been loaded yet.
   */
  useEffect(() => {
    if (activeTab === 'orders' && user && !ordersLoaded && !isLoadingOrders) {
      const loadOrders = async (): Promise<void> => {
        setIsLoadingOrders(true);
        try {
          const fetchedOrders = await getOrdersByUser(user.id);
          setOrders(fetchedOrders);
          setOrdersLoaded(true);
        } catch (error) {
          console.error('Failed to load orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      };

      loadOrders();
    }
  }, [activeTab, user, ordersLoaded, isLoadingOrders]);

  /**
   * Effect to fetch bookings when the bookings tab is activated.
   * Only fetches if bookings haven't been loaded yet.
   */
  useEffect(() => {
    if (activeTab === 'bookings' && user && !bookingsLoaded && !isLoadingBookings) {
      const loadBookings = async (): Promise<void> => {
        setIsLoadingBookings(true);
        try {
          const fetchedBookings = await getBookingsByUser(user.id);
          setBookings(fetchedBookings);
          setBookingsLoaded(true);
        } catch (error) {
          console.error('Failed to load bookings:', error);
        } finally {
          setIsLoadingBookings(false);
        }
      };

      loadBookings();
    }
  }, [activeTab, user, bookingsLoaded, isLoadingBookings]);

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles booking cancellation.
   * Calls the cancelBooking service and refreshes the bookings list.
   *
   * @param bookingId - The ID of the booking to cancel
   */
  const handleCancelBooking = async (bookingId: string): Promise<void> => {
    setCancellingBookingId(bookingId);
    try {
      const success = await cancelBooking(bookingId);
      if (success) {
        // Refresh bookings list after successful cancellation
        if (user) {
          const updatedBookings = await getBookingsByUser(user.id);
          setBookings(updatedBookings);
        }
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setCancellingBookingId(null);
    }
  };

  /**
   * Handles user logout.
   * Calls the logout function and navigates to the home page.
   */
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  /**
   * Handles tab change.
   *
   * @param tab - The tab to switch to
   */
  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  // ===========================================================================
  // RENDER HELPERS
  // ===========================================================================

  /**
   * Renders a status badge with appropriate styling.
   *
   * @param status - The status to display
   * @returns JSX for the status badge
   */
  const renderStatusBadge = (status: string): React.JSX.Element => {
    const { bg, text } = getStatusBadgeClasses(status);
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
      >
        {displayStatus}
      </span>
    );
  };

  /**
   * Renders the profile tab content.
   *
   * @returns JSX for the profile section
   */
  const renderProfileTab = (): React.JSX.Element => {
    if (!user) {
      return (
        <Card className="p-6 text-center">
          <p className="text-gray-600">User information not available.</p>
        </Card>
      );
    }

    return (
      <div className="max-w-lg">
        <Card className="p-6">
          {/* Avatar and Name Header */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Circle with Initials */}
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">Burger House Member</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <span className="text-gray-400 text-xl">📧</span>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <span className="text-gray-400 text-xl">📱</span>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">
                  {user.phone || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <span className="text-gray-400 text-xl">📅</span>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  /**
   * Renders the orders tab content.
   *
   * @returns JSX for the orders section
   */
  const renderOrdersTab = (): React.JSX.Element => {
    // Loading state
    if (isLoadingOrders) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading your orders..." />
        </div>
      );
    }

    // Empty state
    if (orders.length === 0) {
      return (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🍔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders yet. Check out our delicious menu!
          </p>
          <Link to="/menu">
            <Button variant="primary">Browse Menu</Button>
          </Link>
        </Card>
      );
    }

    // Orders list
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            {/* Order Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Order #{order.id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              {renderStatusBadge(order.status)}
            </div>

            {/* Order Items Summary */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{order.items.length}</span>{' '}
                {order.items.length === 1 ? 'item' : 'items'}
              </p>
              <div className="text-sm text-gray-700">
                {order.items.map((cartItem, index) => (
                  <span key={cartItem.item.id}>
                    {cartItem.item.name} × {cartItem.quantity}
                    {index < order.items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="text-sm text-gray-600">
                {order.deliveryAddress && (
                  <p>Delivery to: {order.deliveryAddress}</p>
                )}
              </div>
              <p className="text-lg font-bold text-amber-600">
                {formatCurrency(order.total)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  /**
   * Renders the bookings tab content.
   *
   * @returns JSX for the bookings section
   */
  const renderBookingsTab = (): React.JSX.Element => {
    // Loading state
    if (isLoadingBookings) {
      return (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading your bookings..." />
        </div>
      );
    }

    // Empty state
    if (bookings.length === 0) {
      return (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t made any table reservations yet. Book a table for your
            next visit!
          </p>
          <Link to="/booking">
            <Button variant="primary">Book a Table</Button>
          </Link>
        </Card>
      );
    }

    // Bookings list
    return (
      <div className="space-y-4">
        {bookings.map((booking) => {
          const isPending = booking.status === 'pending';
          const isCancelling = cancellingBookingId === booking.id;

          return (
            <Card key={booking.id} className="p-6">
              {/* Booking Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Booking #{booking.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booked on {formatDateTime(booking.createdAt)}
                  </p>
                </div>
                {renderStatusBadge(booking.status)}
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4 mb-4">
                {/* Date */}
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(booking.date)}
                  </p>
                </div>

                {/* Time */}
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{booking.time}</p>
                </div>

                {/* Guests */}
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium text-gray-900">
                    {booking.guests} {booking.guests === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>

              {/* Table Number (if assigned) */}
              {booking.tableNumber && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Table Number</p>
                  <p className="font-medium text-amber-600">
                    Table {booking.tableNumber}
                  </p>
                </div>
              )}

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                  <p className="text-gray-700">{booking.specialRequests}</p>
                </div>
              )}

              {/* Cancel Button (only for pending bookings) */}
              {isPending && (
                <div className="border-t border-gray-100 pt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={isCancelling}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Account navigation">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                      transition-colors duration-200 focus:outline-none focus:ring-2
                      focus:ring-amber-500 focus:ring-offset-2
                      ${
                        isActive
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
        </div>
      </div>
    </div>
  );
}
