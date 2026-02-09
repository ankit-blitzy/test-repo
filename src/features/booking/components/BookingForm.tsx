/**
 * Table booking form component.
 * Allows users to select date, time, party size, and provide contact info.
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBooking } from '../hooks/useBooking';
import { bookingSchema, type BookingFormData } from '@/utils/validation';
import { Button, Input, Alert } from '@/components/ui';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import { BookingConfirmation } from './BookingConfirmation';
import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '@/utils/constants';

/**
 * BookingForm manages the complete table reservation flow:
 * date selection → availability check → time slot selection → contact info → confirmation.
 */
export function BookingForm() {
  const { availableSlots, booking, loadingState, error, checkAvailableSlots, makeBooking, clearBookingError } =
    useBooking();
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: '',
      time: '',
      partySize: 2,
      contactInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      specialRequests: '',
    },
  });

  const selectedTime = watch('time');

  /* Check availability when date or party size changes */
  useEffect(() => {
    if (date && partySize >= MIN_PARTY_SIZE) {
      setValue('date', date);
      setValue('partySize', partySize);
      setValue('time', '');
      checkAvailableSlots(date, partySize);
    }
  }, [date, partySize, checkAvailableSlots, setValue]);

  const handleTimeChange = (time: string) => {
    setValue('time', time, { shouldValidate: true });
  };

  const onSubmit = async (data: BookingFormData) => {
    clearBookingError();
    await makeBooking(data);
  };

  const isLoading = loadingState === 'loading';

  /* Show confirmation when booking is successful */
  if (booking) {
    return <BookingConfirmation booking={booking} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto" noValidate>
      <h2 className="text-2xl font-bold text-text">Book a Table</h2>
      <p className="text-text-light">Reserve your spot for a delightful dine-in experience.</p>

      {error && (
        <Alert variant="error" dismissible onDismiss={clearBookingError}>
          {error}
        </Alert>
      )}

      {/* Date and Party Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AvailabilityCalendar selectedDate={date} onDateChange={setDate} error={errors.date?.message} />

        <div>
          <label htmlFor="partySize" className="block text-sm font-medium text-text mb-1">
            Party Size <span className="text-red-500">*</span>
          </label>
          <select
            id="partySize"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
          {errors.partySize && (
            <p className="mt-1 text-sm text-red-600">{errors.partySize.message}</p>
          )}
        </div>
      </div>

      {/* Time Slot Selection */}
      <TimeSlotPicker
        slots={availableSlots}
        selectedTime={selectedTime}
        onTimeChange={handleTimeChange}
        isLoading={isLoading && !date}
        error={errors.time?.message}
      />

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-bold text-text mb-3">Contact Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              autoComplete="given-name"
              error={errors.contactInfo?.firstName?.message}
              required
              {...register('contactInfo.firstName')}
            />
            <Input
              label="Last Name"
              autoComplete="family-name"
              error={errors.contactInfo?.lastName?.message}
              required
              {...register('contactInfo.lastName')}
            />
          </div>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.contactInfo?.email?.message}
            required
            {...register('contactInfo.email')}
          />
          <Input
            label="Phone"
            type="tel"
            autoComplete="tel"
            error={errors.contactInfo?.phone?.message}
            required
            {...register('contactInfo.phone')}
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-text mb-1">
          Special Requests (optional)
        </label>
        <textarea
          id="specialRequests"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          rows={3}
          placeholder="Any special requirements or celebrations?"
          {...register('specialRequests')}
        />
      </div>

      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        {isLoading ? 'Booking...' : 'Confirm Booking'}
      </Button>
    </form>
  );
}
