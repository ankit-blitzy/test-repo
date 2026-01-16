/**
 * @fileoverview Table booking page component for restaurant reservations.
 * 
 * Features:
 * - Date picker for selecting reservation date (tomorrow to 30 days out)
 * - Time slot selection based on availability from booking service
 * - Guest count input (1-10 guests)
 * - Special requests text field for dietary restrictions or preferences
 * - Loading states during slot fetching and booking creation
 * - Success confirmation with full booking details
 * 
 * This is a protected route requiring user authentication to access.
 * Integrates with the booking service for availability checks and reservation creation.
 * 
 * @module pages/BookingPage
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CardContent, CardHeader, Input, LoadingSpinner } from '../components';
import type { TimeSlot, Booking } from '../types';
import { getAvailableTimeSlots, createBooking } from '../services/booking';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Returns tomorrow's date in YYYY-MM-DD format.
 * Used as the minimum selectable date for bookings.
 * 
 * @returns Date string in ISO format (YYYY-MM-DD)
 */
function getMinDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Returns the date 30 days from now in YYYY-MM-DD format.
 * Used as the maximum selectable date for bookings.
 * 
 * @returns Date string in ISO format (YYYY-MM-DD)
 */
function getMaxDate(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  return maxDate.toISOString().split('T')[0];
}

/**
 * Formats a date string for display purposes.
 * Converts YYYY-MM-DD to a human-readable format.
 * 
 * @param dateString - Date in ISO format (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Monday, January 15, 2024")
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a 24-hour time string to 12-hour format for display.
 * 
 * @param time - Time in 24-hour format (HH:mm)
 * @returns Formatted time string (e.g., "6:00 PM")
 */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * BookingPage component for making table reservations.
 * 
 * Provides a complete booking flow including:
 * - Date selection with validation (tomorrow to 30 days out)
 * - Dynamic time slot loading based on selected date
 * - Guest count selection (1-10 guests)
 * - Optional special requests field
 * - Success confirmation with booking details
 * 
 * @returns JSX element containing the booking form or success confirmation
 * 
 * @example
 * ```tsx
 * // Used in routing configuration wrapped by ProtectedRoute
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/booking" element={<BookingPage />} />
 * </Route>
 * ```
 */
export default function BookingPage(): React.JSX.Element {
  // ===========================================================================
  // HOOKS & CONTEXT
  // ===========================================================================
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // ===========================================================================
  // STATE MANAGEMENT
  // ===========================================================================

  /**
   * Selected booking date in YYYY-MM-DD format.
   * Defaults to tomorrow's date.
   */
  const [selectedDate, setSelectedDate] = useState<string>(getMinDate());

  /**
   * Selected time slot in HH:mm format.
   * Null until user selects a time.
   */
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /**
   * Number of guests for the reservation.
   * Valid range: 1-10 guests.
   */
  const [guests, setGuests] = useState<number>(2);

  /**
   * Optional special requests or notes from the customer.
   */
  const [specialRequests, setSpecialRequests] = useState<string>('');

  /**
   * Available time slots for the selected date.
   * Loaded from booking service when date changes.
   */
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  /**
   * Loading state for time slot fetching.
   */
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);

  /**
   * Loading state for booking submission.
   */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Error message from failed operations.
   * Null when there are no errors.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Successfully created booking for displaying confirmation.
   * Null until booking is successfully created.
   */
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // ===========================================================================
  // DATA FETCHING
  // ===========================================================================

  /**
   * Effect to fetch available time slots when selected date changes.
   * Resets selected time when date changes to ensure user selects a valid slot.
   */
  useEffect(() => {
    async function fetchTimeSlots(): Promise<void> {
      if (!selectedDate) return;

      setIsLoadingSlots(true);
      setError(null);
      setSelectedTime(null);

      try {
        const slots = await getAvailableTimeSlots(selectedDate);
        setTimeSlots(slots);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load available time slots. Please try again.';
        setError(errorMessage);
        setTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchTimeSlots();
  }, [selectedDate]);

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles date input change.
   * Updates selected date state which triggers time slot fetching.
   * 
   * @param event - Change event from date input
   */
  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setSelectedDate(event.target.value);
  }

  /**
   * Handles time slot selection.
   * Only allows selection of available slots.
   * 
   * @param time - Selected time in HH:mm format
   * @param available - Whether the slot is available
   */
  function handleTimeSelect(time: string, available: boolean): void {
    if (available) {
      setSelectedTime(time);
      setError(null);
    }
  }

  /**
   * Decrements guest count by 1 (minimum 1).
   */
  function handleDecrementGuests(): void {
    setGuests((prev) => Math.max(1, prev - 1));
  }

  /**
   * Increments guest count by 1 (maximum 10).
   */
  function handleIncrementGuests(): void {
    setGuests((prev) => Math.min(10, prev + 1));
  }

  /**
   * Handles special requests textarea change.
   * 
   * @param event - Change event from textarea
   */
  function handleSpecialRequestsChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setSpecialRequests(event.target.value);
  }

  /**
   * Handles form submission to create the booking.
   * Validates required fields and submits to booking service.
   * On success, displays confirmation with booking details.
   * 
   * @param event - Form submission event
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    // Validate required fields
    if (!user) {
      setError('You must be logged in to make a booking.');
      return;
    }

    if (!selectedDate) {
      setError('Please select a date for your reservation.');
      return;
    }

    if (!selectedTime) {
      setError('Please select a time for your reservation.');
      return;
    }

    if (guests < 1 || guests > 10) {
      setError('Please select between 1 and 10 guests.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const booking = await createBooking(
        user.id,
        selectedDate,
        selectedTime,
        guests,
        specialRequests.trim() || undefined
      );

      // Set success state to display confirmation
      setSuccessBooking(booking);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create booking. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Handles navigation to account page to view bookings.
   */
  function handleViewBookings(): void {
    navigate('/account', { state: { tab: 'bookings' } });
  }

  /**
   * Handles creating a new booking (resetting the form).
   */
  function handleNewBooking(): void {
    setSuccessBooking(null);
    setSelectedDate(getMinDate());
    setSelectedTime(null);
    setGuests(2);
    setSpecialRequests('');
    setError(null);
  }

  // ===========================================================================
  // RENDER - SUCCESS STATE
  // ===========================================================================

  if (successBooking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <Card className="overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 p-6 text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
              <p className="mt-2 opacity-90">
                Your table reservation has been received
              </p>
            </div>

            {/* Booking Details */}
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Confirmation Number */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-amber-800 font-medium">
                    Confirmation Number
                  </p>
                  <p className="text-lg font-bold text-amber-900 mt-1">
                    {successBooking.id.toUpperCase()}
                  </p>
                </div>

                {/* Reservation Details */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {formatDate(successBooking.date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">
                      {formatTime(successBooking.time)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-medium">
                      {successBooking.guests} {successBooking.guests === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                  {successBooking.specialRequests && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Special Requests</span>
                      <span className="font-medium text-right max-w-[200px]">
                        {successBooking.specialRequests}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Notice */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <p>
                    A confirmation email has been sent to your registered email address.
                    Please arrive 5-10 minutes before your reservation time.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleViewBookings}
                    className="w-full"
                    variant="primary"
                  >
                    View My Bookings
                  </Button>
                  <Button
                    onClick={handleNewBooking}
                    className="w-full"
                    variant="outline"
                  >
                    Make Another Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // RENDER - BOOKING FORM
  // ===========================================================================

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book a Table</h1>
        <p className="mt-2 text-gray-600">
          Reserve your table for a memorable dining experience
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">
              Reservation Details
            </h2>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {error && (
                <div 
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <Input
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                max={getMaxDate()}
                required
                aria-describedby="date-help"
              />
              <p id="date-help" className="text-sm text-gray-500 -mt-4">
                Bookings available from tomorrow up to 30 days in advance
              </p>

              {/* Guest Count */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  id="guests-label"
                >
                  Number of Guests
                </label>
                <div 
                  className="flex items-center gap-4"
                  role="group"
                  aria-labelledby="guests-label"
                >
                  <button
                    type="button"
                    onClick={handleDecrementGuests}
                    disabled={guests <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center 
                             text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease guest count"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span 
                    className="text-xl font-semibold w-12 text-center text-gray-900"
                    aria-live="polite"
                  >
                    {guests}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementGuests}
                    disabled={guests >= 10}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center 
                             text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase guest count"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-500">
                    (max 10 guests)
                  </span>
                </div>
              </div>

              {/* Time Slots Section */}
              <div>
                <label 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  id="time-slots-label"
                >
                  Select Time
                </label>
                
                {isLoadingSlots ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No available time slots for this date.</p>
                    <p className="text-sm mt-1">Please select a different date.</p>
                  </div>
                ) : (
                  <div 
                    className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                    role="group"
                    aria-labelledby="time-slots-label"
                  >
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleTimeSelect(slot.time, slot.available)}
                        disabled={!slot.available}
                        className={`
                          py-3 px-3 rounded-lg text-sm font-medium transition-all
                          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                          ${
                            selectedTime === slot.time
                              ? 'bg-amber-500 text-white shadow-md'
                              : slot.available
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                          }
                        `}
                        aria-pressed={selectedTime === slot.time}
                        aria-disabled={!slot.available}
                        aria-label={`${formatTime(slot.time)} ${slot.available ? '- available' : '- unavailable'}`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label 
                  htmlFor="special-requests"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Special Requests <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="special-requests"
                  value={specialRequests}
                  onChange={handleSpecialRequestsChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                           text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Any special requirements, dietary restrictions, or seating preferences?"
                  aria-describedby="special-requests-help"
                />
                <p id="special-requests-help" className="text-sm text-gray-500 mt-1">
                  {specialRequests.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                size="lg"
                disabled={!selectedDate || !selectedTime || isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Restaurant Info */}
        <div className="mt-8 text-center text-gray-600 space-y-2">
          <p className="font-medium">Opening Hours</p>
          <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
          <p>Saturday: 10:00 AM - 11:00 PM</p>
          <p>Sunday: 10:00 AM - 9:00 PM</p>
          <p className="mt-4 text-sm">
            For large group bookings (10+ guests), please call us at{' '}
            <a 
              href="tel:+15551234567" 
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              (555) 123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
