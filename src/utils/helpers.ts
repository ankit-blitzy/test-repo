/**
 * General-purpose utility/helper functions used throughout the application.
 * Provides common operations for ID generation, data manipulation, and calculations.
 */

import { TAX_RATE } from './constants';

/**
 * Generates a unique identifier string using crypto API with fallback.
 * @returns A unique string identifier
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Calculates tax amount for a given subtotal.
 * @param subtotal - The pre-tax amount
 * @returns Calculated tax amount rounded to 2 decimal places
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

/**
 * Calculates the total from subtotal plus tax.
 * @param subtotal - The pre-tax amount
 * @returns Total amount including tax
 */
export function calculateTotal(subtotal: number): number {
  const tax = calculateTax(subtotal);
  return Math.round((subtotal + tax) * 100) / 100;
}

/**
 * Creates a debounced version of a function.
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Delays execution for a specified number of milliseconds.
 * Useful for simulating API calls in mock mode.
 * @param ms - Delay duration in milliseconds
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Checks if a string is empty or contains only whitespace.
 * @param value - The string to check
 * @returns True if the string is empty or whitespace
 */
export function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Safely parses a JSON string, returning a default value on failure.
 * @param json - JSON string to parse
 * @param fallback - Default value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Groups an array of objects by a given key.
 * @param items - Array of items to group
 * @param keyFn - Function that returns the group key for each item
 * @returns Object with grouped items
 */
export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Creates a class name string from conditional class entries.
 * This is a simple utility; for complex cases use clsx library.
 * @param classes - Object mapping class names to boolean conditions
 * @returns Space-separated class names string
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates a time slot array between two times with a given interval.
 * @param startTime - Start time in HH:mm format
 * @param endTime - End time in HH:mm format
 * @param intervalMinutes - Interval between slots in minutes
 * @returns Array of time strings in HH:mm format
 */
export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
}
