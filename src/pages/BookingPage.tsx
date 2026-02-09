/**
 * BookingPage – table reservation page.
 */

import { BookingForm } from '@/features/booking/components/BookingForm';

export default function BookingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text">Reserve a Table</h1>
        <p className="mt-2 text-text-light">Book your spot for a delightful dine-in experience.</p>
      </div>
      <BookingForm />
    </div>
  );
}
