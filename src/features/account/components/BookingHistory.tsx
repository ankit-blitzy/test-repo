/**
 * BookingHistory component – displays the user's past and upcoming reservations.
 */

import { useEffect } from 'react';
import { Badge, Loader, Alert } from '@/components/ui';
import type { BadgeVariant } from '@/components/ui/Badge';
import { useAccount } from '../hooks/useAccount';
import { formatDate } from '@/utils/formatters';
import type { BookingStatus } from '@/types/api.types';

/** Map booking status to badge variant */
function statusVariant(status: BookingStatus): BadgeVariant {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'no_show':
      return 'warning';
    default:
      return 'info';
  }
}

export function BookingHistory() {
  const { bookings, isLoading, error, loadBookings } = useAccount();

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (isLoading && bookings.length === 0) {
    return <Loader size="lg" label="Loading bookings…" />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text">Reservation History</h2>

      {error && <Alert variant="error">{error}</Alert>}

      {bookings.length === 0 ? (
        <p className="text-text-light">You don't have any reservations yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-text">
                  {booking.confirmationNumber}
                </span>
                <Badge variant={statusVariant(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-text-light">
                <span>Date: {formatDate(booking.date)}</span>
                <span>Time: {booking.time}</span>
                <span>Party Size: {booking.partySize}</span>
                <span>
                  Name: {booking.contactInfo.firstName} {booking.contactInfo.lastName}
                </span>
              </div>

              {booking.specialRequests && (
                <p className="mt-2 text-sm text-text-light italic">
                  &quot;{booking.specialRequests}&quot;
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
