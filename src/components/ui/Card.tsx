/**
 * Reusable Card component for content containers.
 * Provides a consistent surface with optional header, footer, and image sections.
 */

import { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

/** Card component props */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Optional padding override (default: 'md') */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether the card has a hover elevation effect */
  hoverable?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Card component for displaying content in a contained surface.
 */
export function Card({ children, padding = 'md', hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-surface rounded-xl border border-gray-200 shadow-sm',
        paddingClasses[padding],
        hoverable && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Card Header sub-component */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={clsx('border-b border-gray-200 pb-3 mb-3', className)} {...props}>
      {children}
    </div>
  );
}

/** Card Footer sub-component */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div className={clsx('border-t border-gray-200 pt-3 mt-3', className)} {...props}>
      {children}
    </div>
  );
}
