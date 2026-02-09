/**
 * Integration tests for the Table Booking feature flow.
 * Verifies the useBooking hook's availability checking and reservation creation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBooking } from '../../src/features/booking/hooks/useBooking';

describe('Booking Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('starts with idle loading state and no booking', () => {
    const { result } = renderHook(() => useBooking());
    expect(result.current.loadingState).toBe('idle');
    expect(result.current.booking).toBeNull();
    expect(result.current.availableSlots).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('checks available time slots for a given date and party size', async () => {
    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.checkAvailableSlots('2025-07-15', 4);
    });

    expect(result.current.loadingState).toBe('success');
    expect(result.current.availableSlots.length).toBeGreaterThan(0);
    /* Each slot should have a time string and available boolean */
    result.current.availableSlots.forEach((slot) => {
      expect(slot).toHaveProperty('time');
      expect(slot).toHaveProperty('available');
      expect(typeof slot.time).toBe('string');
      expect(typeof slot.available).toBe('boolean');
    });
  });

  it('creates a booking successfully with valid data', async () => {
    const { result } = renderHook(() => useBooking());

    const bookingData = {
      date: '2025-07-15',
      time: '18:00',
      partySize: 4,
      contactInfo: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-0100',
      },
      specialRequests: 'Window seat preferred',
    };

    let bookingId: string | null = null;

    await act(async () => {
      bookingId = await result.current.makeBooking(bookingData);
    });

    expect(result.current.loadingState).toBe('success');
    expect(result.current.booking).not.toBeNull();
    expect(result.current.booking?.date).toBe('2025-07-15');
    expect(result.current.booking?.time).toBe('18:00');
    expect(result.current.booking?.partySize).toBe(4);
    expect(result.current.booking?.status).toBe('confirmed');
    expect(bookingId).toBeTruthy();
  });

  it('returns a confirmation number after booking', async () => {
    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.makeBooking({
        date: '2025-07-20',
        time: '19:00',
        partySize: 2,
        contactInfo: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '555-0200',
        },
      });
    });

    expect(result.current.booking?.confirmationNumber).toBeTruthy();
    expect(typeof result.current.booking?.confirmationNumber).toBe('string');
  });

  it('clears booking error with clearBookingError', async () => {
    const { result } = renderHook(() => useBooking());

    /* clearBookingError should work even if there was no prior error */
    act(() => {
      result.current.clearBookingError();
    });

    expect(result.current.error).toBeNull();
  });

  it('provides checkAvailableSlots, makeBooking, and clearBookingError functions', () => {
    const { result } = renderHook(() => useBooking());
    expect(typeof result.current.checkAvailableSlots).toBe('function');
    expect(typeof result.current.makeBooking).toBe('function');
    expect(typeof result.current.clearBookingError).toBe('function');
  });
});
