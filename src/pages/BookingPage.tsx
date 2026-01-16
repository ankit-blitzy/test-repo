import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableTimeSlots, createBooking } from '../services/booking';
import { useAuth } from '../context/AuthContext';
import type { TimeSlot } from '../types';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function BookingPage() {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (date) {
      const loadSlots = async () => {
        setIsLoading(true);
        try {
          const slots = await getAvailableTimeSlots(date);
          setTimeSlots(slots);
          setSelectedTime(null);
        } catch (err) {
          setError('Failed to load time slots');
        } finally {
          setIsLoading(false);
        }
      };
      loadSlots();
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !selectedTime) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await createBooking({
        userId: user.id,
        date,
        time: selectedTime,
        guests: guestCount,
        specialRequests: specialRequests || undefined,
      });
      navigate('/account', { state: { tab: 'bookings' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Table</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Select Date"
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              min={today}
              required
            />

            {/* Time Slots */}
            {date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`
                          py-2 px-3 rounded-lg text-sm font-medium transition-colors
                          ${
                            selectedTime === slot.time
                              ? 'bg-amber-500 text-white'
                              : slot.available
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">{guestCount}</span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (optional)
              </label>
              <textarea
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Any special requirements or dietary restrictions?"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!date || !selectedTime || isSubmitting}
              isLoading={isSubmitting}
            >
              Confirm Booking
            </Button>
          </form>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center text-gray-600">
          <p>Opening Hours: Mon-Fri 11am-10pm, Sat 10am-11pm, Sun 10am-9pm</p>
          <p className="mt-2">For large group bookings (10+), please call us at (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
}
