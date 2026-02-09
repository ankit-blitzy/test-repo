/**
 * Booking confirmation display component.
 * Shows the details of a successfully created reservation.
 */

import type { BookingResponse } from '@/types/api.types';
import { formatDate, formatTime, formatPartySize } from '@/utils/formatters';
import { Card, Button, Badge } from '@/components/ui';
import { Link } from 'react-router';
import { ROUTES } from '@/utils/constants';

/** Props for BookingConfirmation component */
export interface BookingConfirmationProps {
  booking: BookingResponse;
}

/**
 * Displays reservation confirmation details after a successful booking.
 */
export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  return (
    <Card className="max-w-lg mx-auto text-center">
      <div className="space-y-4">
        <div className="text-4xl" aria-hidden="true">🎉</div>

        <h2 className="text-2xl font-bold text-text">Booking Confirmed!</h2>

        <Badge variant="success" size="md">
          Confirmation: {booking.confirmationNumber}
        </Badge>

        <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-text-light">Date</span>
            <span className="font-medium text-text">{formatDate(booking.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Time</span>
            <span className="font-medium text-text">{formatTime(booking.time)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Party Size</span>
            <span className="font-medium text-text">{formatPartySize(booking.partySize)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Name</span>
            <span className="font-medium text-text">
              {booking.contactInfo.firstName} {booking.contactInfo.lastName}
            </span>
          </div>
          {booking.specialRequests && (
            <div className="flex justify-between">
              <span className="text-text-light">Special Requests</span>
              <span className="font-medium text-text">{booking.specialRequests}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-text-light">
          A confirmation has been sent to {booking.contactInfo.email}
        </p>

        <div className="flex gap-3 justify-center pt-2">
          <Link to={ROUTES.HOME}>
            <Button variant="primary">Back to Home</Button>
          </Link>
          <Link to={ROUTES.MENU}>
            <Button variant="outline">View Menu</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
