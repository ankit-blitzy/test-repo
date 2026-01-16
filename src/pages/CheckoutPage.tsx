import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/order';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Please enter a complete address'),
  specialInstructions: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({
        userId: user.id,
        items,
        subtotal,
        tax,
        total,
        deliveryAddress: data.deliveryAddress,
        specialInstructions: data.specialInstructions,
      });
      clearCart();
      navigate(`/order-confirmation?orderId=${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
                <Input
                  label="Full Address"
                  {...register('deliveryAddress')}
                  error={errors.deliveryAddress?.message}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Special Instructions</h2>
                <textarea
                  {...register('specialInstructions')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Any special requests for your order?"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Payment</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    Payment will be collected upon delivery (Cash or Card accepted)
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Place Order
              </Button>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {items.map(cartItem => (
                <div key={cartItem.item.id} className="flex justify-between text-sm">
                  <span>
                    {cartItem.item.name} x {cartItem.quantity}
                  </span>
                  <span>${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
