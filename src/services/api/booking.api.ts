/**
 * Booking API service module.
 * Handles table reservation operations: availability checking, booking creation, and management.
 * Uses mock implementations for frontend development.
 */

import type {
  CheckAvailabilityRequest,
  AvailabilityResponse,
  CreateBookingRequest,
  BookingResponse,
  ApiResponse,
} from '@/types/api.types';
import { delay, generateId, generateTimeSlots } from '@/utils/helpers';
import { OPERATING_HOURS } from '@/utils/constants';

/** In-memory mock booking store for development */
const mockBookings: BookingResponse[] = [];

/**
 * Checks table availability for a specific date and party size.
 * @param params - Date and party size for availability check
 * @returns Promise resolving to available time slots
 */
export async function checkAvailability(
  params: CheckAvailabilityRequest
): Promise<ApiResponse<AvailabilityResponse>> {
  await delay(700);

  const slots = generateTimeSlots(
    OPERATING_HOURS.open,
    OPERATING_HOURS.close,
    OPERATING_HOURS.slotDurationMinutes
  );

  const bookedSlots = mockBookings
    .filter((b) => b.date === params.date && b.status === 'confirmed')
    .map((b) => b.time);

  const availableSlots = slots.map((time) => {
    const isBooked = bookedSlots.filter((t) => t === time).length >= 5;
    const capacity = isBooked ? 0 : Math.max(1, 5 - bookedSlots.filter((t) => t === time).length);
    return {
      time,
      available: !isBooked && params.partySize <= 20,
      remainingCapacity: capacity,
    };
  });

  return {
    data: {
      date: params.date,
      slots: availableSlots,
    },
    success: true,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a new table reservation.
 * @param bookingData - Reservation details
 * @returns Promise resolving to the confirmed booking
 */
export async function createBooking(
  bookingData: CreateBookingRequest
): Promise<ApiResponse<BookingResponse>> {
  await delay(1000);

  const booking: BookingResponse = {
    id: generateId(),
    confirmationNumber: `TBL-${Date.now().toString(36).toUpperCase()}`,
    date: bookingData.date,
    time: bookingData.time,
    partySize: bookingData.partySize,
    status: 'confirmed',
    contactInfo: bookingData.contactInfo,
    specialRequests: bookingData.specialRequests,
    createdAt: new Date().toISOString(),
  };

  mockBookings.push(booking);

  return {
    data: booking,
    success: true,
    message: 'Booking confirmed',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Cancels an existing booking by ID.
 * @param bookingId - The booking ID to cancel
 * @returns Promise resolving to the cancelled booking
 */
export async function cancelBooking(bookingId: string): Promise<ApiResponse<BookingResponse>> {
  await delay(500);

  const booking = mockBookings.find((b) => b.id === bookingId);

  if (!booking) {
    throw {
      code: 'NOT_FOUND',
      message: 'Booking not found',
      statusCode: 404,
    };
  }

  booking.status = 'cancelled';

  return {
    data: booking,
    success: true,
    message: 'Booking cancelled',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retrieves the booking history for the current user.
 * @returns Promise resolving to array of past and upcoming bookings
 */
export async function getBookingHistory(): Promise<ApiResponse<BookingResponse[]>> {
  await delay(600);

  return {
    data: [...mockBookings].reverse(),
    success: true,
    timestamp: new Date().toISOString(),
  };
}
