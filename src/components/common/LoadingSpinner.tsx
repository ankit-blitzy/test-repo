/**
 * LoadingSpinner Component
 * 
 * A versatile loading indicator component that displays an animated spinner.
 * Used throughout the application during async operations like API calls,
 * page transitions, and form submissions.
 * 
 * Features:
 * - Multiple sizes (sm, md, lg) for different contexts
 * - SVG-based spinner with smooth CSS animation
 * - Optional loading text display
 * - Tailwind CSS styling with amber color to match restaurant theme
 * - Fullscreen overlay variant for page-level loading states
 */

import React from 'react';

/**
 * Props interface for the LoadingSpinner component
 * 
 * @property size - Size variant of the spinner ('sm' | 'md' | 'lg'), defaults to 'md'
 * @property text - Optional text to display alongside or below the spinner
 * @property className - Optional additional CSS classes for custom styling
 * @property fullscreen - Optional flag to render as fullscreen overlay
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner - 'sm' (16px), 'md' (32px), or 'lg' (48px) */
  size?: 'sm' | 'md' | 'lg';
  /** Optional loading text to display */
  text?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** If true, renders spinner as fullscreen overlay with backdrop */
  fullscreen?: boolean;
}

/**
 * Size configuration mapping for the spinner dimensions
 * Maps size variants to Tailwind CSS width/height classes
 */
const sizeStyles: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * Text size configuration based on spinner size
 * Ensures text scales appropriately with spinner size
 */
const textSizeStyles: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/**
 * LoadingSpinner Component
 * 
 * Renders an animated SVG spinner with optional loading text.
 * The spinner uses a two-part SVG design:
 * - A faded circle for the track
 * - A highlighted arc that creates the spinning effect
 * 
 * @example
 * // Basic usage
 * <LoadingSpinner />
 * 
 * @example
 * // With size and text
 * <LoadingSpinner size="lg" text="Loading menu items..." />
 * 
 * @example
 * // Fullscreen overlay
 * <LoadingSpinner fullscreen text="Processing your order..." />
 * 
 * @example
 * // With custom styling
 * <LoadingSpinner size="sm" className="my-4" />
 */
export default function LoadingSpinner({
  size = 'md',
  text,
  className = '',
  fullscreen = false,
}: LoadingSpinnerProps): React.ReactElement {
  /**
   * SVG Spinner Element
   * Uses a circular track with a partial arc for the spinning effect
   * The animate-spin class provides smooth 360-degree rotation
   */
  const spinnerElement = (
    <svg
      className={`animate-spin text-amber-500 ${sizeStyles[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      {/* Background circle track - faded for visual depth */}
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      {/* Animated arc segment - creates the spinning visual effect */}
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  /**
   * Text element rendered when text prop is provided
   * Positioned below the spinner with appropriate spacing and styling
   */
  const textElement = text ? (
    <p
      className={`mt-2 text-stone-600 font-medium ${textSizeStyles[size]}`}
      aria-live="polite"
    >
      {text}
    </p>
  ) : null;

  /**
   * Fullscreen Overlay Variant
   * Renders the spinner centered on a fixed backdrop that covers the entire viewport
   * Useful for page-level loading states like initial data fetching or form submissions
   */
  if (fullscreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm ${className}`}
        role="alert"
        aria-busy="true"
      >
        {spinnerElement}
        {textElement}
      </div>
    );
  }

  /**
   * Standard Inline Variant
   * Renders the spinner centered within a flex container
   * Can be placed inline within content or used as a section loader
   */
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-busy="true"
    >
      {spinnerElement}
      {textElement}
    </div>
  );
}
