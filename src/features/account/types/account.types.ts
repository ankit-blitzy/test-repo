/**
 * Type definitions for the Account feature module.
 * Covers user profile, order history, and booking history.
 */

import type { OrderResponse, BookingResponse } from '@/types/api.types';

/** Profile update request payload */
export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** User profile data returned from API */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

/** Summary statistics for the account dashboard */
export interface AccountStats {
  totalOrders: number;
  totalBookings: number;
  totalSpent: number;
  memberSince: string;
}

/** Account context type exposed by the useAccount hook */
export interface AccountContextType {
  profile: UserProfile | null;
  orders: OrderResponse[];
  bookings: BookingResponse[];
  stats: AccountStats | null;
  isLoading: boolean;
  error: string | null;
  loadProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateRequest) => Promise<boolean>;
  loadOrders: () => Promise<void>;
  loadBookings: () => Promise<void>;
  loadStats: () => Promise<void>;
}
