/**
 * Payment method selection component for the checkout form.
 * Allows users to select their preferred payment method.
 */

import type { PaymentMethod } from '@/types/api.types';
import clsx from 'clsx';

/** Props for PaymentSection component */
export interface PaymentSectionProps {
  selectedMethod: PaymentMethod | '';
  onSelectMethod: (method: PaymentMethod) => void;
  error?: string;
}

/** Available payment options */
const paymentOptions: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
  { value: 'debit_card', label: 'Debit Card', icon: '💳' },
  { value: 'cash', label: 'Cash on Pickup', icon: '💵' },
];

/**
 * Renders payment method selection as radio buttons.
 */
export function PaymentSection({ selectedMethod, onSelectMethod, error }: PaymentSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-text mb-3">Payment Method</h3>

      <div className="space-y-2">
        {paymentOptions.map((option) => (
          <label
            key={option.value}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
              selectedMethod === option.value
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.value}
              checked={selectedMethod === option.value}
              onChange={() => onSelectMethod(option.value)}
              className="text-primary focus:ring-primary"
            />
            <span className="text-lg" aria-hidden="true">{option.icon}</span>
            <span className="font-medium text-text">{option.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
