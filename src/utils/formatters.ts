/**
 * Formatting utility functions for displaying prices, dates, and other data.
 * Provides consistent data presentation throughout the application.
 */

import { format, parseISO, isValid } from 'date-fns';
import { CURRENCY } from './constants';

/**
 * Formats a numeric price value to a localized currency string.
 * @param amount - The price amount (e.g., 12.99)
 * @returns Formatted currency string (e.g., "$12.99")
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats an ISO date string to a human-readable date.
 * @param dateString - ISO 8601 date string
 * @param formatStr - date-fns format string (default: 'MMM d, yyyy')
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(dateString: string, formatStr: string = 'MMM d, yyyy'): string {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return '';
  }
  return format(date, formatStr);
}

/**
 * Formats a time string (HH:mm) to 12-hour format with AM/PM.
 * @param time - Time string in HH:mm format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';

  if (isNaN(hours)) {
    return time;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
}

/**
 * Formats a phone number string for display.
 * @param phone - Raw phone number string
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Formats an order number with prefix for display.
 * @param orderNumber - Raw order number string
 * @returns Formatted order number with '#' prefix
 */
export function formatOrderNumber(orderNumber: string): string {
  return `#${orderNumber}`;
}

/**
 * Truncates a string to a maximum length with ellipsis.
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with '...' if exceeds maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Formats a party size for display.
 * @param size - Number of guests
 * @returns Formatted string (e.g., "2 guests" or "1 guest")
 */
export function formatPartySize(size: number): string {
  return size === 1 ? '1 guest' : `${size} guests`;
}

/**
 * Formats a number of minutes into a human-readable duration.
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m" or "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Capitalizes the first letter of a string.
 * @param text - Input string
 * @returns String with first letter capitalized
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Formats a status value into a human-readable label.
 * @param status - Snake_case or camelCase status string
 * @returns Human-readable status with words capitalized
 */
export function formatStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map((word) => capitalize(word.toLowerCase()))
    .join(' ');
}
