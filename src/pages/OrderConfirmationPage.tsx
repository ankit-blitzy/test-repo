/**
 * OrderConfirmationPage – displays order success after checkout.
 */

import { Link, useParams } from 'react-router';
import { Button, Card } from '@/components/ui';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <p className="text-5xl">✅</p>
        <h1 className="text-2xl font-bold text-text">Order Confirmed!</h1>
        <p className="text-text-light">
          Thank you for your order. Your order number is{' '}
          <span className="font-semibold text-primary">{orderId ?? 'N/A'}</span>.
        </p>
        <p className="text-sm text-text-light">
          We&apos;ll have your food ready for pickup shortly. You can track your order from your
          account page.
        </p>
        <div className="flex flex-col gap-2 pt-4">
          <Link to="/account">
            <Button fullWidth>View My Orders</Button>
          </Link>
          <Link to="/menu">
            <Button fullWidth variant="outline">
              Order More
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
