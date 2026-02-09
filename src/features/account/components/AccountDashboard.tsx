/**
 * AccountDashboard component – the main account landing page.
 * Shows quick stats and navigation to sub-sections.
 */

import { useEffect, useState } from 'react';
import { Card, Loader, Alert, Button } from '@/components/ui';
import { useAccount } from '../hooks/useAccount';
import { formatPrice, formatDate } from '@/utils/formatters';
import { ProfileForm } from './ProfileForm';
import { OrderHistory } from './OrderHistory';
import { BookingHistory } from './BookingHistory';

type Tab = 'overview' | 'profile' | 'orders' | 'bookings';

export function AccountDashboard() {
  const { stats, isLoading, error, loadStats } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'profile', label: 'Profile' },
    { key: 'orders', label: 'Orders' },
    { key: 'bookings', label: 'Reservations' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <nav className="flex gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={activeTab === t.key ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </nav>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Tab content */}
      {activeTab === 'overview' && (
        <>
          {isLoading && !stats ? (
            <Loader size="lg" label="Loading dashboard…" />
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
                <p className="text-sm text-text-light">Orders Placed</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{stats.totalBookings}</p>
                <p className="text-sm text-text-light">Reservations</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(stats.totalSpent)}
                </p>
                <p className="text-sm text-text-light">Total Spent</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {formatDate(stats.memberSince)}
                </p>
                <p className="text-sm text-text-light">Member Since</p>
              </Card>
            </div>
          ) : (
            <p className="text-text-light">No account data available.</p>
          )}

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="outline" onClick={() => setActiveTab('orders')}>
              View Orders
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('bookings')}>
              View Reservations
            </Button>
            <Button variant="outline" onClick={() => setActiveTab('profile')}>
              Edit Profile
            </Button>
          </div>
        </>
      )}

      {activeTab === 'profile' && <ProfileForm />}
      {activeTab === 'orders' && <OrderHistory />}
      {activeTab === 'bookings' && <BookingHistory />}
    </div>
  );
}
