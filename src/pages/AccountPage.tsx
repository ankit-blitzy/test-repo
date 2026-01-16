import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/order';
import { getUserBookings } from '../services/booking';
import type { Order, Booking } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

type Tab = 'profile' | 'orders' | 'bookings';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialTab = (location.state as { tab?: Tab })?.tab || 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user && orders.length === 0) {
      const loadOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const data = await getUserOrders(user.id);
          setOrders(data);
        } finally {
          setIsLoadingOrders(false);
        }
      };
      loadOrders();
    }
  }, [activeTab, user, orders.length]);

  useEffect(() => {
    if (activeTab === 'bookings' && user && bookings.length === 0) {
      const loadBookings = async () => {
        setIsLoadingBookings(true);
        try {
          const data = await getUserBookings(user.id);
          setBookings(data);
        } finally {
          setIsLoadingBookings(false);
        }
      };
      loadBookings();
    }
  }, [activeTab, user, bookings.length]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile' },
    { id: 'orders' as Tab, label: 'Orders' },
    { id: 'bookings' as Tab, label: 'Bookings' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && user && (
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Name</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <label className="block text-sm text-gray-600">Phone</label>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t">
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </Card>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {isLoadingOrders ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {order.items.map(item => `${item.menuItem.name} x ${item.quantity}`).join(', ')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-600">${order.total.toFixed(2)}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          {isLoadingBookings ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-600 mb-4">You haven't made any reservations yet.</p>
              <Button onClick={() => navigate('/booking')}>Book a Table</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <Card key={booking.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-600">
                        {booking.time} · {booking.guestCount} guests
                      </p>
                      {booking.specialRequests && (
                        <p className="text-sm text-gray-500 mt-2">
                          Note: {booking.specialRequests}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
