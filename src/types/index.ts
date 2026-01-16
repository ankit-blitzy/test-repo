/**
 * @fileoverview TypeScript type definitions for the Burger House restaurant application.
 * This file serves as the single source of truth for all type definitions used throughout
 * the application, including user authentication, menu items, shopping cart, orders,
 * and table bookings.
 *
 * @module types
 * @version 1.0.0
 */

// =============================================================================
// ENUMS
// =============================================================================

/**
 * Enumeration of menu item categories available in the restaurant.
 * Used for categorizing and filtering menu items.
 */
export enum MenuCategory {
  /** Classic beef, chicken, and specialty burgers */
  Burgers = 'burgers',
  /** Side dishes like fries, onion rings, and salads */
  Sides = 'sides',
  /** Beverages including sodas, shakes, and water */
  Drinks = 'drinks',
  /** Sweet treats and dessert items */
  Desserts = 'desserts',
  /** Limited time offers and chef's specials */
  Specials = 'specials',
}

/**
 * Enumeration of possible order statuses for tracking order progress.
 * Follows the order lifecycle from creation to completion.
 */
export enum OrderStatus {
  /** Order has been placed but not yet confirmed by the restaurant */
  Pending = 'pending',
  /** Order has been confirmed and accepted by the restaurant */
  Confirmed = 'confirmed',
  /** Order is being prepared in the kitchen */
  Preparing = 'preparing',
  /** Order is ready for pickup or delivery */
  Ready = 'ready',
  /** Order has been delivered to the customer */
  Delivered = 'delivered',
  /** Order has been cancelled */
  Cancelled = 'cancelled',
}

/**
 * Enumeration of possible booking statuses for table reservations.
 * Tracks the reservation lifecycle from request to completion.
 */
export enum BookingStatus {
  /** Booking request submitted, awaiting confirmation */
  Pending = 'pending',
  /** Booking has been confirmed by the restaurant */
  Confirmed = 'confirmed',
  /** Booking has been cancelled by user or restaurant */
  Cancelled = 'cancelled',
  /** Booking has been completed (customer visited) */
  Completed = 'completed',
}

// =============================================================================
// INTERFACES
// =============================================================================

/**
 * Represents a registered user in the system.
 * Contains essential user information for authentication and profile management.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address, used for login and communication */
  email: string;
  /** User's display name */
  name: string;
  /** User's phone number for order/booking confirmations (optional) */
  phone?: string;
  /** Timestamp when the user account was created */
  createdAt: Date;
}

/**
 * Represents a menu item available for ordering.
 * Contains all details needed to display and order a food item.
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Name of the menu item */
  name: string;
  /** Detailed description of the menu item including ingredients */
  description: string;
  /** Price in dollars (USD) */
  price: number;
  /** URL or path to the item's image */
  image: string;
  /** Category the item belongs to */
  category: MenuCategory;
  /** Whether the item is currently available for ordering */
  isAvailable: boolean;
}

/**
 * Represents an item in the shopping cart.
 * Links a menu item with the selected quantity.
 */
export interface CartItem {
  /** The menu item being ordered */
  item: MenuItem;
  /** Quantity of this item in the cart (minimum 1) */
  quantity: number;
}

/**
 * Represents the shopping cart state.
 * Contains all items and the calculated total.
 */
export interface Cart {
  /** Array of items currently in the cart */
  items: CartItem[];
  /** Total price of all items in the cart (in USD) */
  total: number;
}

/**
 * Represents a completed or in-progress order.
 * Contains all information needed to track and fulfill an order.
 */
export interface Order {
  /** Unique identifier for the order */
  id: string;
  /** ID of the user who placed the order */
  userId: string;
  /** Items included in the order */
  items: CartItem[];
  /** Current status of the order */
  status: OrderStatus;
  /** Subtotal before tax (in USD) */
  subtotal: number;
  /** Tax amount (in USD) */
  tax: number;
  /** Total price of the order including tax (in USD) */
  total: number;
  /** Timestamp when the order was placed */
  createdAt: Date;
  /** Estimated delivery/ready time (optional) */
  estimatedDelivery?: Date;
  /** Delivery address for delivery orders (optional) */
  deliveryAddress?: string;
  /** Any special instructions from the customer (optional) */
  specialInstructions?: string;
}

/**
 * Represents a table reservation/booking.
 * Contains all information needed to manage a table reservation.
 */
export interface Booking {
  /** Unique identifier for the booking */
  id: string;
  /** ID of the user who made the booking */
  userId: string;
  /** Date of the reservation in ISO format (YYYY-MM-DD) */
  date: string;
  /** Time of the reservation in 24-hour format (HH:mm) */
  time: string;
  /** Number of guests for the reservation */
  guests: number;
  /** Current status of the booking */
  status: BookingStatus;
  /** Any special requests from the customer (optional) */
  specialRequests?: string;
  /** Assigned table number after confirmation (optional) */
  tableNumber?: number;
  /** Timestamp when the booking was created */
  createdAt: Date;
}

// =============================================================================
// TYPES
// =============================================================================

/**
 * Credentials required for user login.
 */
export type LoginCredentials = {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
};

/**
 * Data required for new user registration.
 */
export type RegisterData = {
  /** User's email address */
  email: string;
  /** User's chosen password */
  password: string;
  /** User's display name */
  name: string;
  /** User's phone number (optional) */
  phone?: string;
};

/**
 * Represents an available time slot for table bookings.
 */
export type TimeSlot = {
  /** Time in 24-hour format (HH:mm) */
  time: string;
  /** Whether this time slot is available for booking */
  available: boolean;
};

/**
 * Represents a category summary with item count for display purposes.
 * Used by the menu service to provide category listings with counts.
 */
export type CategoryInfo = {
  /** Category identifier (lowercase, matches MenuCategory values) */
  id: string;
  /** Display name for the category (capitalized) */
  name: string;
  /** Number of items in this category */
  count: number;
};
