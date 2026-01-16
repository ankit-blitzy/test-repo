import { BookingStatus, type Booking, type TimeSlot } from '../types';

// Mock bookings storage
const bookings: Map<string, Booking> = new Map();

export interface CreateBookingData {
  userId: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export async function getAvailableTimeSlots(date: string): Promise<TimeSlot[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const slots: TimeSlot[] = [
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: true },
    { time: '12:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: true },
    { time: '18:30', available: true },
    { time: '19:00', available: true },
    { time: '19:30', available: true },
    { time: '20:00', available: true },
    { time: '20:30', available: true },
  ];
  
  // Mark some slots as unavailable based on existing bookings
  bookings.forEach(booking => {
    if (booking.date === date) {
      const slot = slots.find(s => s.time === booking.time);
      if (slot) {
        slot.available = false;
      }
    }
  });
  
  return slots;
}

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const booking: Booking = {
    id: `booking_${Date.now()}`,
    userId: data.userId,
    date: data.date,
    time: data.time,
    guests: data.guests,
    specialRequests: data.specialRequests,
    status: BookingStatus.Confirmed,
    createdAt: new Date(),
  };
  
  bookings.set(booking.id, booking);
  return booking;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return Array.from(bookings.values()).filter(booking => booking.userId === userId);
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const booking = bookings.get(bookingId);
  if (booking) {
    booking.status = BookingStatus.Cancelled;
    bookings.set(bookingId, booking);
  }
}
