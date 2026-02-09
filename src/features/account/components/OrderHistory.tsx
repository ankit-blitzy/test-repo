/**
 * OrderHistory component – displays the user's past orders.
 */

import { useEffect } from 'react';
import { Badge, Loader, Alert } from '@/components/ui';
import type { BadgeVariant } from '@/components/ui/Badge';
import { useAccount } from '../hooks/useAccount';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { OrderStatus } from '@/types/api.types';

/** Map order status to badge variant */
function statusVariant(status: OrderStatus): BadgeVariant {
  switch (status) {
    case 'completed':
      return 'success';
    case 'preparing':
    case 'pending':
    case 'confirmed':
    case 'ready':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'info';
  }
}

export function OrderHistory() {
  const { orders, isLoading, error, loadOrders } = useAccount();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (isLoading && orders.length === 0) {
    return <Loader size="lg" label="Loading orders…" />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text">Order History</h2>

      {error && <Alert variant="error">{error}</Alert>}

      {orders.length === 0 ? (
        <p className="text-text-light">You haven't placed any orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-text">#{order.orderNumber}</span>
                <Badge variant={statusVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <ul className="text-sm text-text-light mb-2 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.name} — {formatPrice(item.subtotal)}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between text-sm">
                <span className="text-text-light">{formatDate(order.createdAt)}</span>
                <span className="font-bold text-text">{formatPrice(order.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
