/**
 * useAccount hook – manages account data including profile, orders, bookings, and stats.
 * Coordinates multiple API calls for the account dashboard.
 */

import { useState, useCallback } from 'react';
import type {
  UserProfile,
  ProfileUpdateRequest,
  AccountStats,
} from '../types/account.types';
import type { OrderResponse, BookingResponse } from '@/types/api.types';

/* ---------- Mock helpers ---------- */

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const MOCK_PROFILE: UserProfile = {
  id: 'user-1',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '(555) 123-4567',
  createdAt: '2024-06-01T12:00:00Z',
  updatedAt: new Date().toISOString(),
};

const MOCK_ORDERS: OrderResponse[] = [
  {
    id: 'order-101',
    orderNumber: 'ORD-101',
    status: 'completed',
    items: [
      { id: 'item-1', menuItemId: 'burger-1', name: 'Classic Burger', price: 12.99, quantity: 2, subtotal: 25.98 },
    ],
    subtotal: 25.98,
    tax: 2.08,
    total: 28.06,
    contactInfo: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '(555) 123-4567' },
    pickupTime: '2025-01-05T18:30:00Z',
    paymentMethod: 'credit_card',
    createdAt: '2025-01-05T18:30:00Z',
    estimatedReadyTime: '2025-01-05T19:00:00Z',
  },
  {
    id: 'order-102',
    orderNumber: 'ORD-102',
    status: 'completed',
    items: [
      { id: 'item-2', menuItemId: 'burger-3', name: 'Bacon Deluxe', price: 15.99, quantity: 1, subtotal: 15.99 },
      { id: 'item-3', menuItemId: 'fries-1', name: 'Loaded Fries', price: 7.99, quantity: 1, subtotal: 7.99 },
    ],
    subtotal: 23.98,
    tax: 1.92,
    total: 25.9,
    contactInfo: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '(555) 123-4567' },
    pickupTime: '2025-01-20T19:15:00Z',
    paymentMethod: 'debit_card',
    createdAt: '2025-01-20T19:15:00Z',
    estimatedReadyTime: '2025-01-20T19:45:00Z',
  },
];

const MOCK_BOOKINGS: BookingResponse[] = [
  {
    id: 'booking-201',
    confirmationNumber: 'BK-XYZ789',
    date: '2025-02-14',
    time: '19:00',
    partySize: 2,
    contactInfo: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '(555) 123-4567' },
    status: 'confirmed',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'booking-202',
    confirmationNumber: 'BK-ABC456',
    date: '2025-03-08',
    time: '18:30',
    partySize: 4,
    contactInfo: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '(555) 123-4567' },
    status: 'confirmed',
    createdAt: '2025-03-01T12:00:00Z',
  },
];

/* ---------- Hook ---------- */

export function useAccount() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch the user profile */
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await delay(400);
      setProfile(MOCK_PROFILE);
    } catch {
      setError('Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Update user profile data */
  const updateProfile = useCallback(async (data: ProfileUpdateRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await delay(500);
      setProfile((prev) =>
        prev
          ? { ...prev, ...data, updatedAt: new Date().toISOString() }
          : null,
      );
      return true;
    } catch {
      setError('Failed to update profile.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Fetch order history */
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await delay(350);
      setOrders(MOCK_ORDERS);
    } catch {
      setError('Failed to load order history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Fetch booking history */
  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await delay(350);
      setBookings(MOCK_BOOKINGS);
    } catch {
      setError('Failed to load booking history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Fetch summary statistics */
  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await delay(300);
      setStats({
        totalOrders: MOCK_ORDERS.length,
        totalBookings: MOCK_BOOKINGS.length,
        totalSpent: MOCK_ORDERS.reduce((s, o) => s + o.total, 0),
        memberSince: MOCK_PROFILE.createdAt,
      });
    } catch {
      setError('Failed to load account stats.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    orders,
    bookings,
    stats,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    loadOrders,
    loadBookings,
    loadStats,
  };
}
