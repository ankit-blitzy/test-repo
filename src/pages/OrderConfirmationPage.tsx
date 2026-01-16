import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOrder } from '../services/order';
import type { Order } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await getOrder(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner className="py-12" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <Link to="/menu">
          <Button>Return to Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We've received it and will start preparing it shortly.
        </p>

        <Card className="p-6 text-left mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <span className="text-sm text-gray-500">#{order.id.slice(-8)}</span>
          </div>

          <div className="space-y-3 mb-4">
            {order.items.map(item => (
              <div key={item.menuItem.id} className="flex justify-between">
                <span>
                  {item.menuItem.name} x {item.quantity}
                </span>
                <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-amber-600">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.deliveryAddress && (
            <div className="border-t mt-4 pt-4">
              <h3 className="font-medium mb-2">Delivery Address</h3>
              <p className="text-gray-600">{order.deliveryAddress}</p>
            </div>
          )}

          <div className="border-t mt-4 pt-4">
            <h3 className="font-medium mb-2">Estimated Delivery</h3>
            <p className="text-gray-600">30-45 minutes</p>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/account">
            <Button variant="outline">View All Orders</Button>
          </Link>
          <Link to="/menu">
            <Button>Order Again</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
