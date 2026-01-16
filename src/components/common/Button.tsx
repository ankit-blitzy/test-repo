import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * Button component props interface
 * Extends standard HTML button attributes to support all native button functionality
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Size of the button affecting padding and font size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Content to be rendered inside the button */
  children: ReactNode;
}

/**
 * Multi-variant Button component for the Burger House restaurant application.
 * 
 * Features:
 * - Three visual variants: primary (amber), secondary (stone), outline (amber border)
 * - Three sizes: small, medium, large
 * - Loading state with spinner animation
 * - Full accessibility support with focus-visible ring
 * - Ref forwarding for advanced use cases
 * 
 * @example
 * // Primary button (default)
 * <Button onClick={handleClick}>Order Now</Button>
 * 
 * @example
 * // Secondary button with loading state
 * <Button variant="secondary" isLoading={isSubmitting}>Submit</Button>
 * 
 * @example
 * // Outline button, large size
 * <Button variant="outline" size="lg">View Menu</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles applied to all button variants
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'font-medium',
      'transition-colors',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
    ].join(' ');

    // Variant-specific styles with amber/orange color scheme for burger restaurant theme
    const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: [
        'bg-amber-500',
        'text-white',
        'hover:bg-amber-600',
        'focus-visible:ring-amber-500',
      ].join(' '),
      secondary: [
        'bg-stone-100',
        'text-stone-900',
        'hover:bg-stone-200',
        'focus-visible:ring-stone-500',
      ].join(' '),
      outline: [
        'border',
        'border-amber-500',
        'text-amber-600',
        'hover:bg-amber-50',
        'focus-visible:ring-amber-500',
      ].join(' '),
    };

    // Size-specific styles with height classes for consistent button dimensions
    const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    // Combine all styles into a single className string
    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Determine if button should be disabled (explicit disabled prop or loading state)
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center">
            {/* Loading spinner SVG with animation */}
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

// Display name for React DevTools debugging
Button.displayName = 'Button';
