/**
 * Loading spinner component for indicating async operations.
 * Supports multiple sizes and an optional loading text.
 */

import clsx from 'clsx';

/** Loader component props */
export interface LoaderProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Optional text displayed below the spinner (alias: label) */
  text?: string;
  /** Alias for text prop */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

/**
 * Animated loading spinner component.
 * Displays a spinning circle with optional accompanying text.
 */
export function Loader({ size = 'md', text, label, className }: LoaderProps) {
  const displayText = text ?? label;

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-2', className)} role="status">
      <svg
        className={clsx('animate-spin text-primary', sizeClasses[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {displayText && <p className="text-sm text-text-light">{displayText}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
