/**
 * Checkout form component with contact info, pickup time, and payment selection.
 * Uses react-hook-form with zod validation for the checkout schema.
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useCheckout } from '../hooks/useCheckout';
import { checkoutSchema, type CheckoutFormData } from '@/utils/validation';
import { Button, Input, Alert } from '@/components/ui';
import { PaymentSection } from './PaymentSection';
import { OrderSummary } from './OrderSummary';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import type { PaymentMethod } from '@/types/api.types';

/**
 * CheckoutForm coordinates the full checkout flow.
 * Pre-fills contact information from the authenticated user.
 */
export function CheckoutForm() {
  const { submitOrder, loadingState, error, clearCheckoutError } = useCheckout();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contactInfo: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
      },
      pickupTime: '',
      specialInstructions: '',
      paymentMethod: undefined,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    clearCheckoutError();
    const orderId = await submitOrder(data);
    if (orderId) {
      navigate(`${ROUTES.ORDER_CONFIRMATION}/${orderId}`);
    }
  };

  const isLoading = loadingState === 'loading';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {error && (
            <Alert variant="error" dismissible onDismiss={clearCheckoutError}>
              {error}
            </Alert>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-text mb-3">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  autoComplete="given-name"
                  error={errors.contactInfo?.firstName?.message}
                  required
                  {...register('contactInfo.firstName')}
                />
                <Input
                  label="Last Name"
                  autoComplete="family-name"
                  error={errors.contactInfo?.lastName?.message}
                  required
                  {...register('contactInfo.lastName')}
                />
              </div>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.contactInfo?.email?.message}
                required
                {...register('contactInfo.email')}
              />
              <Input
                label="Phone"
                type="tel"
                autoComplete="tel"
                error={errors.contactInfo?.phone?.message}
                required
                {...register('contactInfo.phone')}
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div>
            <h3 className="text-lg font-bold text-text mb-3">Pickup Time</h3>
            <Input
              label="Preferred Pickup Time"
              type="time"
              error={errors.pickupTime?.message}
              required
              {...register('pickupTime')}
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-text mb-1">
              Special Instructions (optional)
            </label>
            <textarea
              id="specialInstructions"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              rows={3}
              placeholder="Any dietary restrictions or special requests?"
              {...register('specialInstructions')}
            />
            {errors.specialInstructions && (
              <p className="mt-1 text-sm text-red-600">{errors.specialInstructions.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <PaymentSection
                selectedMethod={field.value || ''}
                onSelectMethod={(method: PaymentMethod) => field.onChange(method)}
                error={errors.paymentMethod?.message}
              />
            )}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
