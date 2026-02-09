/**
 * Time slot picker component for selecting a booking time.
 * Displays available and unavailable time slots as a grid.
 */

import type { TimeSlotResponse } from '@/types/api.types';
import { formatTime } from '@/utils/formatters';
import { Loader } from '@/components/ui';
import clsx from 'clsx';

/** Props for TimeSlotPicker component */
export interface TimeSlotPickerProps {
  slots: TimeSlotResponse[];
  selectedTime: string;
  onTimeChange: (time: string) => void;
  isLoading?: boolean;
  error?: string;
}

/**
 * Renders a grid of selectable time slot buttons.
 * Unavailable slots are visually disabled.
 */
export function TimeSlotPicker({ slots, selectedTime, onTimeChange, isLoading, error }: TimeSlotPickerProps) {
  if (isLoading) {
    return <Loader size="sm" text="Checking availability..." />;
  }

  if (slots.length === 0) {
    return <p className="text-sm text-text-light">Select a date and party size to see available times.</p>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text mb-2">
        Select Time <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => slot.available && onTimeChange(slot.time)}
            disabled={!slot.available}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedTime === slot.time
                ? 'bg-primary text-white'
                : slot.available
                  ? 'bg-gray-100 text-text hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed line-through'
            )}
            aria-label={`${formatTime(slot.time)} - ${slot.available ? 'Available' : 'Unavailable'}`}
            aria-pressed={selectedTime === slot.time}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
