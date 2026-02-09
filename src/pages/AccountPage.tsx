/**
 * AccountPage – protected page showing user dashboard.
 */

import { AccountDashboard } from '@/features/account/components/AccountDashboard';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text">My Account</h1>
      <AccountDashboard />
    </div>
  );
}
