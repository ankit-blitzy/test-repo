/**
 * Booking feature type definitions.
 */

import type { LoadingState } from '@/types/common.types';
import type { BookingResponse, TimeSlotResponse } from '@/types/api.types';

/** Booking state */
export interface BookingState {
  availableSlots: TimeSlotResponse[];
  booking: BookingResponse | null;
  loadingState: LoadingState;
  error: string | null;
}

/** Booking hook return type */
export interface UseBookingReturn extends BookingState {
  checkAvailableSlots: (date: string, partySize: number) => Promise<void>;
  makeBooking: (data: BookingSubmitData) => Promise<string | null>;
  clearBookingError: () => void;
}

/** Data submitted when making a booking */
export interface BookingSubmitData {
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
