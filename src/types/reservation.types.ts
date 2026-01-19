/**
 * Reservation Type Definitions
 * Defines interfaces for table reservation functionality
 */

/**
 * Reservation status enum
 */
export type ReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no-show';

/**
 * Represents a table reservation
 */
export interface Reservation {
  id: string;
  userId: string;
  date: Date;
  time: string;
  partySize: number;
  tableNumber?: number;
  status: ReservationStatus;
  specialRequests?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Available time slot
 */
export interface TimeSlot {
  time: string;
  available: boolean;
  tablesAvailable?: number;
}

/**
 * Reservation creation request
 */
export interface CreateReservationRequest {
  date: string;
  time: string;
  partySize: number;
  specialRequests?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

/**
 * Reservation update request
 */
export interface UpdateReservationRequest {
  date?: string;
  time?: string;
  partySize?: number;
  specialRequests?: string;
}

/**
 * Reservation API response
 */
export interface ReservationAPIResponse {
  success: boolean;
  data: Reservation;
  message?: string;
}

/**
 * Reservation list API response
 */
export interface ReservationListAPIResponse {
  success: boolean;
  data: Reservation[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

/**
 * Available slots API response
 */
export interface AvailableSlotsAPIResponse {
  success: boolean;
  data: {
    date: string;
    slots: TimeSlot[];
  };
}

/**
 * Reservation form data
 */
export interface ReservationFormData {
  date: string;
  time: string;
  partySize: number;
  specialRequests: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}
