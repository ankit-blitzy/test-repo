/**
 * Unit tests for formatter utility functions.
 * Tests all formatting functions used for display throughout the application.
 */

import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDate,
  formatTime,
  formatPhone,
  formatOrderNumber,
  truncateText,
  formatPartySize,
  formatDuration,
  capitalize,
  formatStatus,
} from '../../../src/utils/formatters';

describe('formatPrice', () => {
  it('formats a price with two decimal places and currency symbol', () => {
    expect(formatPrice(12.99)).toBe('$12.99');
  });

  it('formats zero as $0.00', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats a whole number with trailing zeros', () => {
    expect(formatPrice(10)).toBe('$10.00');
  });

  it('formats a large price correctly', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string to default format', () => {
    const result = formatDate('2025-06-15T12:00:00Z');
    expect(result).toBe('Jun 15, 2025');
  });

  it('formats an ISO date string with custom format', () => {
    const result = formatDate('2025-01-01T00:00:00Z', 'yyyy-MM-dd');
    expect(result).toBe('2025-01-01');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(formatDate('')).toBe('');
  });
});

describe('formatTime', () => {
  it('converts 24-hour time to 12-hour format with AM', () => {
    expect(formatTime('09:30')).toBe('9:30 AM');
  });

  it('converts noon correctly', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  it('converts afternoon time with PM', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
  });

  it('converts midnight correctly', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('returns original string for invalid time', () => {
    expect(formatTime('invalid')).toBe('invalid');
  });
});

describe('formatPhone', () => {
  it('formats a 10-digit US phone number', () => {
    expect(formatPhone('5551234567')).toBe('(555) 123-4567');
  });

  it('formats an 11-digit US phone number with country code', () => {
    expect(formatPhone('15551234567')).toBe('+1 (555) 123-4567');
  });

  it('returns original string for non-standard length', () => {
    expect(formatPhone('123')).toBe('123');
  });

  it('strips non-digit characters before formatting', () => {
    expect(formatPhone('(555) 123-4567')).toBe('(555) 123-4567');
  });
});

describe('formatOrderNumber', () => {
  it('prefixes order number with hash symbol', () => {
    expect(formatOrderNumber('ORD-12345')).toBe('#ORD-12345');
  });

  it('handles numeric order numbers', () => {
    expect(formatOrderNumber('12345')).toBe('#12345');
  });
});

describe('truncateText', () => {
  it('returns the full text if shorter than max length', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates text at max length with ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('returns the full text if exactly max length', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });
});

describe('formatPartySize', () => {
  it('returns singular for 1 guest', () => {
    expect(formatPartySize(1)).toBe('1 guest');
  });

  it('returns plural for multiple guests', () => {
    expect(formatPartySize(4)).toBe('4 guests');
  });

  it('returns plural for 2 guests', () => {
    expect(formatPartySize(2)).toBe('2 guests');
  });
});

describe('formatDuration', () => {
  it('formats minutes less than 60 as Xm', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  it('formats exactly 60 minutes as 1h', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('formats multiple hours', () => {
    expect(formatDuration(120)).toBe('2h');
  });
});

describe('capitalize', () => {
  it('capitalizes the first letter of a lowercase word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('does not change already capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('capitalizes single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('formatStatus', () => {
  it('converts snake_case status to readable format', () => {
    expect(formatStatus('in_progress')).toBe('In Progress');
  });

  it('converts camelCase status to readable format', () => {
    expect(formatStatus('pendingConfirmation')).toBe('Pending Confirmation');
  });

  it('handles single word status', () => {
    expect(formatStatus('confirmed')).toBe('Confirmed');
  });

  it('handles lowercase status', () => {
    expect(formatStatus('pending')).toBe('Pending');
  });
});
