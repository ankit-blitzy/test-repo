/**
 * Common shared type definitions used across the application.
 * Provides base types for API responses, pagination, and entity models.
 */

/** Unique identifier type used for all entities */
export type ID = string;

/** ISO 8601 date string type */
export type DateString = string;

/** Generic nullable type helper */
export type Nullable<T> = T | null;

/** Status types used across multiple features */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Base entity interface with common audit fields */
export interface BaseEntity {
  id: ID;
  createdAt: DateString;
  updatedAt: DateString;
}

/** Pagination parameters for list requests */
export interface PaginationParams {
  page: number;
  limit: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Sort direction for ordered queries */
export type SortDirection = 'asc' | 'desc';

/** Sort parameters */
export interface SortParams {
  field: string;
  direction: SortDirection;
}

/** Price type represented as a number (in cents or smallest currency unit) */
export type Price = number;

/** Currency code following ISO 4217 */
export type CurrencyCode = 'USD';

/** Formatted price display helper type */
export interface FormattedPrice {
  amount: Price;
  currency: CurrencyCode;
  display: string;
}

/** Contact information shared across features */
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Address information */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/** Time slot representation */
export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

/** Navigation route item */
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiresAuth: boolean;
}

/** Toast/notification message */
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

/** Generic select option */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
