/**
 * API-related type definitions for request/response contracts.
 * Structures match the expected backend API interface for future integration.
 */

import type { ID, DateString } from './common.types';

/** Base API response wrapper */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: DateString;
}

/** API error response structure */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

/** Authentication request payloads */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

/** Authentication response */
export interface AuthResponse {
  user: {
    id: ID;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Menu API responses */
export interface MenuCategoryResponse {
  id: ID;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  itemCount: number;
  sortOrder: number;
}

export interface MenuItemResponse {
  id: ID;
  name: string;
  description: string;
  price: number;
  categoryId: ID;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  allergens: string[];
  nutritionInfo?: NutritionInfo;
  customizations?: MenuCustomization[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MenuCustomization {
  id: ID;
  name: string;
  options: CustomizationOption[];
  required: boolean;
  maxSelections: number;
}

export interface CustomizationOption {
  id: ID;
  name: string;
  priceModifier: number;
}

/** Order API types */
export interface CreateOrderRequest {
  items: OrderItemRequest[];
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pickupTime?: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
}

export interface OrderItemRequest {
  menuItemId: ID;
  quantity: number;
  customizations?: Record<string, string[]>;
  specialInstructions?: string;
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash';

export interface OrderResponse {
  id: ID;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItemResponse[];
  subtotal: number;
  tax: number;
  total: number;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pickupTime: string;
  specialInstructions?: string;
  paymentMethod: PaymentMethod;
  createdAt: DateString;
  estimatedReadyTime: DateString;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItemResponse {
  id: ID;
  menuItemId: ID;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  customizations?: Record<string, string[]>;
  specialInstructions?: string;
}

/** Booking API types */
export interface CheckAvailabilityRequest {
  date: string;
  partySize: number;
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlotResponse[];
}

export interface TimeSlotResponse {
  time: string;
  available: boolean;
  remainingCapacity: number;
}

export interface CreateBookingRequest {
  date: string;
  time: string;
  partySize: number;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
}

export interface BookingResponse {
  id: ID;
  confirmationNumber: string;
  date: string;
  time: string;
  partySize: number;
  status: BookingStatus;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  createdAt: DateString;
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

/** User profile API types */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UserProfileResponse {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: DateString;
}
