/**
 * Alert component for displaying contextual messages and notifications.
 * Supports multiple severity levels with appropriate icons and colors.
 */

import { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

/** Alert severity levels */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/** Alert component props */
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Alert content */
  children: ReactNode;
  /** Severity variant */
  variant?: AlertVariant;
  /** Optional title */
  title?: string;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Callback when the dismiss button is clicked */
  onDismiss?: () => void;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

const iconPaths: Record<AlertVariant, string> = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
};

/**
 * Alert component for displaying important messages with severity context.
 */
export function Alert({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      className={clsx('flex items-start gap-3 rounded-lg border p-4', variantClasses[variant], className)}
      role="alert"
      {...props}
    >
      <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[variant]} />
      </svg>
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 rounded p-1 hover:bg-black/10 transition-colors"
          aria-label="Dismiss alert"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
