/**
 * Application-wide constants.
 * Centralizes all magic strings, configuration values, and default settings.
 */

/** Application metadata */
export const APP_NAME = 'Burger Restaurant';
export const APP_VERSION = '0.1.0';

/** API configuration */
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const API_TIMEOUT = 10000;

/** Storage keys */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CART_ITEMS: 'cart_items',
  USER_PREFERENCES: 'user_preferences',
} as const;

/** Route paths */
export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart',
  CHECKOUT: '/checkout',
  BOOKING: '/booking',
  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_BOOKINGS: '/account/bookings',
  ORDER_CONFIRMATION: '/confirmation',
  NOT_FOUND: '*',
} as const;

/** Navigation items for the main menu */
export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME, requiresAuth: false },
  { label: 'Menu', path: ROUTES.MENU, requiresAuth: false },
  { label: 'Book a Table', path: ROUTES.BOOKING, requiresAuth: false },
] as const;

/** Tax rate for order calculations (percentage) */
export const TAX_RATE = 0.08;

/** Minimum party size for table booking */
export const MIN_PARTY_SIZE = 1;

/** Maximum party size for table booking */
export const MAX_PARTY_SIZE = 20;

/** Currency configuration */
export const CURRENCY = {
  code: 'USD' as const,
  symbol: '$',
  locale: 'en-US',
};

/** Default pagination settings */
export const DEFAULT_PAGE_SIZE = 12;

/** Cart constraints */
export const MAX_CART_ITEM_QUANTITY = 99;
export const MIN_CART_ITEM_QUANTITY = 1;

/** Form validation constraints */
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 100,
  PHONE_REGEX: /^\+?[\d\s\-()]{7,20}$/,
  EMAIL_MAX_LENGTH: 254,
} as const;

/** Restaurant operating hours */
export const OPERATING_HOURS = {
  open: '10:00',
  close: '22:00',
  slotDurationMinutes: 30,
  lastBookingBeforeClose: 60,
} as const;

/** Booking advance constraints (in days) */
export const BOOKING_CONSTRAINTS = {
  minAdvanceDays: 0,
  maxAdvanceDays: 30,
} as const;
