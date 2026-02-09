/**
 * Custom hook for table booking operations.
 * Manages availability checking and reservation creation.
 */

import { useState, useCallback } from 'react';
import type { LoadingState } from '@/types/common.types';
import type { BookingResponse, TimeSlotResponse } from '@/types/api.types';
import type { UseBookingReturn, BookingSubmitData } from '../types/booking.types';
import { checkAvailability, createBooking } from '@/services/api/booking.api';

/**
 * Hook for managing the table booking flow.
 * @returns UseBookingReturn with availability data, booking state, and actions
 */
export function useBooking(): UseBookingReturn {
  const [availableSlots, setAvailableSlots] = useState<TimeSlotResponse[]>([]);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * Checks available time slots for a given date and party size.
   */
  const checkAvailableSlots = useCallback(async (date: string, partySize: number) => {
    setLoadingState('loading');
    setError(null);
    try {
      const response = await checkAvailability({ date, partySize });
      setAvailableSlots(response.data.slots);
      setLoadingState('success');
    } catch {
      setError('Failed to check availability. Please try again.');
      setLoadingState('error');
    }
  }, []);

  /**
   * Creates a new table reservation.
   * @returns The booking ID on success, or null on failure
   */
  const makeBooking = useCallback(async (data: BookingSubmitData): Promise<string | null> => {
    setLoadingState('loading');
    setError(null);
    try {
      const response = await createBooking({
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        contactInfo: data.contactInfo,
        specialRequests: data.specialRequests,
      });
      setBooking(response.data);
      setLoadingState('success');
      return response.data.id;
    } catch {
      setError('Failed to create booking. Please try again.');
      setLoadingState('error');
      return null;
    }
  }, []);

  const clearBookingError = useCallback(() => {
    setError(null);
  }, []);

  return {
    availableSlots,
    booking,
    loadingState,
    error,
    checkAvailableSlots,
    makeBooking,
    clearBookingError,
  };
}
