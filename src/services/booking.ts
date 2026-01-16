/**
 * @fileoverview Booking service module for table reservation functionality.
 * Provides mock API functions for checking table availability by date,
 * fetching available time slots, creating bookings, cancelling reservations,
 * and getting booking history by user.
 * 
 * Uses simulated async operations with typed Booking and TimeSlot interfaces.
 * This is a core service for the table booking page.
 * 
 * @module services/booking
 * @version 1.0.0
 */

import { BookingStatus, type Booking, type TimeSlot } from '../types';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Array of available time slots for table reservations.
 * Covers lunch service (11:00-14:00) and dinner service (18:00-21:00).
 */
const AVAILABLE_TIME_SLOTS: string[] = [
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
];

/**
 * Maximum number of tables available per time slot.
 * When this limit is reached, the slot becomes unavailable.
 */
const MAX_TABLES_PER_SLOT: number = 10;

// =============================================================================
// MOCK DATA STORAGE
// =============================================================================

/**
 * In-memory storage for mock bookings (simulating database).
 * In a production environment, this would be replaced with actual database calls.
 */
const mockBookings: Booking[] = [];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generates a unique booking ID using timestamp and random string.
 * Format: 'booking-{timestamp}-{randomString}'
 * 
 * @returns A unique booking identifier string
 * @example
 * const id = generateBookingId();
 * // Returns: 'booking-1642234567890-a1b2c3'
 */
function generateBookingId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `booking-${timestamp}-${randomPart}`;
}

/**
 * Counts the number of existing bookings for a specific date and time slot.
 * Only counts bookings that are pending or confirmed (not cancelled or completed).
 * 
 * @param date - The date to check in ISO format (YYYY-MM-DD)
 * @param time - The time slot to check in 24-hour format (HH:mm)
 * @returns The number of active bookings for the specified slot
 */
function countBookingsForSlot(date: string, time: string): number {
  return mockBookings.filter(
    (booking) =>
      booking.date === date &&
      booking.time === time &&
      (booking.status === BookingStatus.Pending ||
        booking.status === BookingStatus.Confirmed)
  ).length;
}

/**
 * Simulates network delay for mock API calls.
 * Returns a random delay between min and max milliseconds.
 * 
 * @param minMs - Minimum delay in milliseconds (default: 200)
 * @param maxMs - Maximum delay in milliseconds (default: 600)
 * @returns A promise that resolves after the random delay
 */
function simulateNetworkDelay(minMs: number = 200, maxMs: number = 600): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// =============================================================================
// PUBLIC SERVICE FUNCTIONS
// =============================================================================

/**
 * Retrieves available time slots for a given date.
 * Marks slots as unavailable if MAX_TABLES_PER_SLOT has been reached.
 * 
 * @param date - The date to check availability for in ISO format (YYYY-MM-DD)
 * @returns A promise resolving to an array of TimeSlot objects with availability status
 * @example
 * const slots = await getAvailableTimeSlots('2024-12-25');
 * // Returns: [{ time: '11:00', available: true }, { time: '11:30', available: false }, ...]
 */
export async function getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
  // Simulate network delay
  await simulateNetworkDelay();

  // Build time slots with availability status
  const timeSlots: TimeSlot[] = AVAILABLE_TIME_SLOTS.map((time) => {
    const bookingsCount = countBookingsForSlot(date, time);
    return {
      time,
      available: bookingsCount < MAX_TABLES_PER_SLOT,
    };
  });

  return timeSlots;
}

/**
 * Creates a new table booking with the provided details.
 * The booking starts with 'pending' status until confirmed by the restaurant.
 * 
 * @param userId - The ID of the user making the booking
 * @param date - The reservation date in ISO format (YYYY-MM-DD)
 * @param time - The reservation time in 24-hour format (HH:mm)
 * @param guests - The number of guests for the reservation
 * @param specialRequests - Optional special requests or notes from the customer
 * @returns A promise resolving to the created Booking object
 * @throws Error if the requested time slot is not available
 * @example
 * const booking = await createBooking('user-123', '2024-12-25', '19:00', 4, 'Window seat preferred');
 */
export async function createBooking(
  userId: string,
  date: string,
  time: string,
  guests: number,
  specialRequests?: string
): Promise<Booking> {
  // Simulate network delay
  await simulateNetworkDelay(300, 600);

  // Validate time slot availability
  const currentBookings = countBookingsForSlot(date, time);
  if (currentBookings >= MAX_TABLES_PER_SLOT) {
    throw new Error(`The time slot ${time} on ${date} is no longer available.`);
  }

  // Validate time slot is in our available times
  if (!AVAILABLE_TIME_SLOTS.includes(time)) {
    throw new Error(`Invalid time slot: ${time}. Please select a valid reservation time.`);
  }

  // Validate guest count
  if (guests < 1 || guests > 20) {
    throw new Error('Guest count must be between 1 and 20.');
  }

  // Create the new booking
  const newBooking: Booking = {
    id: generateBookingId(),
    userId,
    date,
    time,
    guests,
    status: BookingStatus.Pending,
    specialRequests: specialRequests?.trim() || undefined,
    createdAt: new Date(),
  };

  // Store the booking
  mockBookings.push(newBooking);

  return newBooking;
}

/**
 * Retrieves all bookings for a specific user.
 * Returns bookings sorted by date (most recent first).
 * 
 * @param userId - The ID of the user whose bookings to retrieve
 * @returns A promise resolving to an array of Booking objects for the user
 * @example
 * const userBookings = await getBookingsByUser('user-123');
 */
export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  // Simulate network delay
  await simulateNetworkDelay();

  // Filter bookings for the specified user
  const userBookings = mockBookings.filter(
    (booking) => booking.userId === userId
  );

  // Sort by date (most recent first), then by time
  return userBookings.sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);
    if (dateComparison !== 0) return dateComparison;
    return b.time.localeCompare(a.time);
  });
}

/**
 * Retrieves a single booking by its unique identifier.
 * 
 * @param bookingId - The unique ID of the booking to retrieve
 * @returns A promise resolving to the Booking object if found, or null if not found
 * @example
 * const booking = await getBookingById('booking-1642234567890-a1b2c3');
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  // Simulate network delay
  await simulateNetworkDelay();

  // Find the booking by ID
  const booking = mockBookings.find((b) => b.id === bookingId);

  return booking || null;
}

/**
 * Confirms a pending booking and assigns a table number.
 * Only bookings with 'pending' status can be confirmed.
 * 
 * @param bookingId - The unique ID of the booking to confirm
 * @param tableNumber - The table number to assign to the booking
 * @returns A promise resolving to the updated Booking object if successful, or null if not found
 * @throws Error if the booking is not in pending status
 * @example
 * const confirmedBooking = await confirmBooking('booking-123', 5);
 */
export async function confirmBooking(
  bookingId: string,
  tableNumber: number
): Promise<Booking | null> {
  // Simulate network delay
  await simulateNetworkDelay(300, 500);

  // Find the booking index
  const bookingIndex = mockBookings.findIndex((b) => b.id === bookingId);

  // Return null if booking not found
  if (bookingIndex === -1) {
    return null;
  }

  const booking = mockBookings[bookingIndex];

  // Validate booking status - can only confirm pending bookings
  if (booking.status !== BookingStatus.Pending) {
    throw new Error(
      `Cannot confirm booking with status '${booking.status}'. Only pending bookings can be confirmed.`
    );
  }

  // Validate table number
  if (tableNumber < 1 || tableNumber > 50) {
    throw new Error('Invalid table number. Table number must be between 1 and 50.');
  }

  // Update the booking
  const updatedBooking: Booking = {
    ...booking,
    status: BookingStatus.Confirmed,
    tableNumber,
  };

  // Replace in storage
  mockBookings[bookingIndex] = updatedBooking;

  return updatedBooking;
}

/**
 * Cancels an existing booking.
 * Bookings can only be cancelled if they are not already completed.
 * 
 * @param bookingId - The unique ID of the booking to cancel
 * @returns A promise resolving to true if cancellation was successful, false otherwise
 * @example
 * const success = await cancelBooking('booking-123');
 * if (success) {
 *   console.log('Booking cancelled successfully');
 * }
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
  // Simulate network delay
  await simulateNetworkDelay(200, 400);

  // Find the booking index
  const bookingIndex = mockBookings.findIndex((b) => b.id === bookingId);

  // Return false if booking not found
  if (bookingIndex === -1) {
    return false;
  }

  const booking = mockBookings[bookingIndex];

  // Cannot cancel completed bookings
  if (booking.status === BookingStatus.Completed) {
    return false;
  }

  // Cannot cancel already cancelled bookings
  if (booking.status === BookingStatus.Cancelled) {
    return false;
  }

  // Update the booking status to cancelled
  const updatedBooking: Booking = {
    ...booking,
    status: BookingStatus.Cancelled,
  };

  // Replace in storage
  mockBookings[bookingIndex] = updatedBooking;

  return true;
}
