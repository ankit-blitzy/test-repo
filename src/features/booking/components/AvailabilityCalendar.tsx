/**
 * Date picker component for selecting a booking date.
 * Uses native HTML date input with min/max constraints.
 */

import { format, addDays } from 'date-fns';
import { Input } from '@/components/ui';
import { BOOKING_CONSTRAINTS } from '@/utils/constants';

/** Props for AvailabilityCalendar component */
export interface AvailabilityCalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  error?: string;
}

/**
 * Renders a date input for selecting booking dates.
 * Constrains selection to the valid booking window.
 */
export function AvailabilityCalendar({ selectedDate, onDateChange, error }: AvailabilityCalendarProps) {
  const today = new Date();
  const minDate = format(addDays(today, BOOKING_CONSTRAINTS.minAdvanceDays), 'yyyy-MM-dd');
  const maxDate = format(addDays(today, BOOKING_CONSTRAINTS.maxAdvanceDays), 'yyyy-MM-dd');

  return (
    <Input
      label="Select Date"
      type="date"
      value={selectedDate}
      onChange={(e) => onDateChange(e.target.value)}
      min={minDate}
      max={maxDate}
      error={error}
      required
    />
  );
}
