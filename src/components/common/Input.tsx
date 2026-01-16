import { forwardRef, useId, type InputHTMLAttributes } from 'react';

/**
 * InputProps interface for the Input component
 * Extends standard HTML input attributes with additional form-related props
 * Designed for integration with react-hook-form via forwardRef
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input (required for accessibility) */
  label: string;
  /** Error message to display below the input when validation fails */
  error?: string;
  /** Input type - defaults to 'text' */
  type?: string;
  /** Additional CSS classes to apply to the input element */
  className?: string;
  /** Custom id for the input element (auto-generated if not provided) */
  id?: string;
}

/**
 * Input Component
 * 
 * A form input component with integrated label and validation error display.
 * Supports various input types (text, email, password, number, tel) with
 * consistent Tailwind CSS styling including focus states and error highlighting.
 * 
 * Designed to work seamlessly with react-hook-form for form validation.
 * Uses forwardRef to allow react-hook-form's register function to attach refs.
 * 
 * @example
 * // Basic usage
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * 
 * @example
 * // With react-hook-form
 * <Input 
 *   label="Password" 
 *   type="password" 
 *   error={errors.password?.message}
 *   {...register('password')} 
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', className = '', id, ...props }, ref) => {
    // Generate a unique id for label-input association if not provided
    const generatedId = useId();
    const inputId = id || generatedId;
    
    // Generate a unique id for the error message element for aria-describedby
    const errorId = `${inputId}-error`;

    // Compute input classes based on error state
    const baseInputClasses = 
      'block w-full rounded-md border px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 sm:text-sm';
    
    const borderClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-stone-300 focus:border-amber-500 focus:ring-amber-500';

    const inputClasses = `${baseInputClasses} ${borderClasses} ${className}`.trim();

    return (
      <div>
        {/* Label element with proper htmlFor association */}
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          {label}
        </label>
        
        {/* Input element with conditional error styling and accessibility attributes */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        
        {/* Conditional error message display */}
        {error && (
          <p 
            id={errorId}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools debugging
Input.displayName = 'Input';

export default Input;
