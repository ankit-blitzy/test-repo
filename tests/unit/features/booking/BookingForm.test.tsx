/**
 * Unit tests for the BookingForm component.
 * Verifies form rendering, field presence, and basic interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { BookingForm } from '../../../../src/features/booking/components/BookingForm';

/* Mock the useBooking hook at module level */
const mockCheckAvailableSlots = vi.fn();
const mockMakeBooking = vi.fn();
const mockClearBookingError = vi.fn();

vi.mock('../../../../src/features/booking/hooks/useBooking', () => ({
  useBooking: () => ({
    availableSlots: [],
    booking: null,
    loadingState: 'idle' as const,
    error: null,
    checkAvailableSlots: mockCheckAvailableSlots,
    makeBooking: mockMakeBooking,
    clearBookingError: mockClearBookingError,
  }),
}));

/** Wrapper providing MemoryRouter */
function renderBookingForm() {
  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(MemoryRouter, null, children);
  }

  return render(createElement(Wrapper, null, createElement(BookingForm)));
}

describe('BookingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the booking heading', () => {
    renderBookingForm();
    expect(screen.getByText('Book a Table')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    renderBookingForm();
    expect(
      screen.getByText(/reserve your spot for a delightful dine-in experience/i)
    ).toBeInTheDocument();
  });

  it('renders the party size selector', () => {
    renderBookingForm();
    expect(screen.getByLabelText(/party size/i)).toBeInTheDocument();
  });

  it('renders the contact information section heading', () => {
    renderBookingForm();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('renders contact info fields', () => {
    renderBookingForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('renders the special requests textarea', () => {
    renderBookingForm();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
  });

  it('renders the confirm booking submit button', () => {
    renderBookingForm();
    expect(
      screen.getByRole('button', { name: /confirm booking/i })
    ).toBeInTheDocument();
  });

  it('has party size options from 1 to 20', () => {
    renderBookingForm();
    const select = screen.getByLabelText(/party size/i) as HTMLSelectElement;
    expect(select.options.length).toBe(20);
    expect(select.options[0].text).toContain('1');
    expect(select.options[19].text).toContain('20');
  });

  it('defaults party size to 2', () => {
    renderBookingForm();
    const select = screen.getByLabelText(/party size/i) as HTMLSelectElement;
    expect(select.value).toBe('2');
  });
});
