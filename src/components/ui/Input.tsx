/**
 * Reusable form Input component with label, validation states, and error messages.
 * Designed for integration with react-hook-form via register prop spreading.
 */

import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

/** Input component props */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Helper text displayed below the input when no error */
  helperText?: string;
}

/**
 * Form input component with built-in label, validation, and error display.
 * Uses forwardRef pattern for compatibility with react-hook-form register.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, className, id, ...props },
  ref
) {
  const inputId = id || props.name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full rounded-lg border px-3 py-2 text-text transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'placeholder:text-text-light',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
            : 'border-gray-300 focus:border-primary focus:ring-primary/50',
          props.disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-text-light">
          {helperText}
        </p>
      )}
    </div>
  );
});
