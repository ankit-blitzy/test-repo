/**
 * Number and display formatting utilities for the CALC Scientific Calculator.
 *
 * Provides three standalone formatting functions used throughout the frontend:
 * - toDisplayString: Converts numeric results to user-friendly display strings
 *   with automatic scientific notation switching per AAP Section 0.7.2.
 * - truncateExpression: Shortens long mathematical expressions for the
 *   calculator display area with a Unicode ellipsis indicator.
 * - formatTimestamp: Converts Date objects or ISO-8601 strings into relative
 *   time labels ("Just now", "5 min ago") or absolute date strings for the
 *   calculation history panel.
 *
 * This module has ZERO internal or external dependencies — it relies only on
 * built-in JavaScript/TypeScript APIs (Number, Math, Date, Intl).
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum number of significant digits shown in the calculator display. */
const MAX_SIGNIFICANT_DIGITS = 10;

/** Threshold above which numbers switch to scientific notation. */
const SCIENTIFIC_UPPER_THRESHOLD = 1e10;

/**
 * Threshold below which non-zero numbers switch to scientific notation.
 * Numbers with 0 < |value| < 1e-4 are displayed in scientific form.
 */
const SCIENTIFIC_LOWER_THRESHOLD = 1e-4;

/** Default maximum character length for truncated expressions. */
const DEFAULT_MAX_EXPRESSION_LENGTH = 30;

/** Time constants in milliseconds for relative timestamp calculation. */
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_WEEK = 7 * MS_PER_DAY;

// ---------------------------------------------------------------------------
// Helpers (private)
// ---------------------------------------------------------------------------

/**
 * Strips trailing zeros after a decimal point and removes a dangling decimal
 * point if all fractional digits were zeros.
 *
 * Examples:
 *   "2.5000000000" → "2.5"
 *   "100.0000000"  → "100"
 *   "3.141592654"  → "3.141592654"  (no trailing zeros to strip)
 *
 * @param value - A numeric string that may contain a decimal point.
 * @returns The cleaned string with no unnecessary trailing zeros.
 */
function stripTrailingZeros(value: string): string {
  if (!value.includes('.')) {
    return value;
  }
  // Remove trailing '0' characters after the decimal point
  const stripped = value.replace(/0+$/, '');
  // Remove a trailing decimal point left behind (e.g. "100.")
  return stripped.endsWith('.') ? stripped.slice(0, -1) : stripped;
}

/**
 * Cleans trailing zeros from the mantissa portion of a scientific-notation
 * string such as "1.20000e+5" → "1.2e+5".
 *
 * @param sci - A string in scientific notation (e.g. "1.23000e+10").
 * @returns The cleaned scientific-notation string.
 */
function cleanScientificNotation(sci: string): string {
  // Split on 'e' or 'E' to isolate the mantissa and exponent
  const eIndex = sci.indexOf('e');
  if (eIndex === -1) {
    // Fallback — not in scientific notation; just strip normally
    return stripTrailingZeros(sci);
  }
  const mantissa = sci.substring(0, eIndex);
  const exponent = sci.substring(eIndex); // includes 'e'
  return stripTrailingZeros(mantissa) + exponent;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts a numeric value to a user-friendly display string for the
 * calculator screen.
 *
 * Rules (per AAP Section 0.7.2 — Precision Requirements):
 * - Up to 10 significant digits are shown.
 * - Numbers with |value| > 10^10 or 0 < |value| < 10^-4 are rendered in
 *   scientific notation.
 * - Trailing fractional zeros are removed (e.g. "2.5000" → "2.5").
 * - Special values: NaN → "Error", ±Infinity → "Infinity" / "-Infinity",
 *   0 → "0".
 *
 * @param num - The numeric value to format.
 * @returns A formatted display string.
 *
 * @example
 * toDisplayString(3.14159265358979)  // "3.141592654"
 * toDisplayString(12345678901)       // "1.234567890e+10" (scientific)
 * toDisplayString(0.00001)           // "1e-5" (scientific)
 * toDisplayString(NaN)               // "Error"
 */
export function toDisplayString(num: number): string {
  // ------ Special-value guards ------
  if (Number.isNaN(num)) {
    return 'Error';
  }
  if (!Number.isFinite(num)) {
    // Covers both Infinity and -Infinity
    return num > 0 ? 'Infinity' : '-Infinity';
  }
  if (num === 0) {
    return '0';
  }

  const absVal = Math.abs(num);

  // ------ Scientific notation branch ------
  if (absVal > SCIENTIFIC_UPPER_THRESHOLD || absVal < SCIENTIFIC_LOWER_THRESHOLD) {
    // Use toExponential with (MAX_SIGNIFICANT_DIGITS - 1) fractional digits
    // so the total significant digit count equals MAX_SIGNIFICANT_DIGITS.
    const sci = num.toExponential(MAX_SIGNIFICANT_DIGITS - 1);
    return cleanScientificNotation(sci);
  }

  // ------ Normal decimal branch ------
  const precise = num.toPrecision(MAX_SIGNIFICANT_DIGITS);
  // toPrecision may still return scientific notation when the integer part
  // has more digits than the requested precision (e.g. (1e10).toPrecision(10)
  // yields "1.000000000e+10"). Detect this and clean appropriately.
  if (precise.includes('e') || precise.includes('E')) {
    return cleanScientificNotation(precise);
  }
  return stripTrailingZeros(precise);
}

/**
 * Truncates a mathematical expression string to fit within a maximum display
 * width, appending a Unicode ellipsis character (…) when truncation occurs.
 *
 * @param expr      - The expression string to potentially truncate.
 * @param maxLength - Maximum allowed length including the ellipsis character.
 *                    Defaults to 30 characters (suitable for the calculator
 *                    display area).
 * @returns The original expression if it fits, or a truncated version ending
 *          with "…".
 *
 * @example
 * truncateExpression("2+3")                           // "2+3"
 * truncateExpression("sin(45) + cos(30) * 2", 10)     // "sin(45) +…"
 */
export function truncateExpression(
  expr: string,
  maxLength: number = DEFAULT_MAX_EXPRESSION_LENGTH,
): string {
  if (expr.length <= maxLength) {
    return expr;
  }
  // Reserve one character for the ellipsis, then append it
  return expr.substring(0, maxLength - 1) + '\u2026';
}

/**
 * Formats a timestamp into a human-readable relative or absolute string for
 * display in the calculation history panel.
 *
 * Relative labels are used for recent entries:
 * - < 1 minute  → "Just now"
 * - < 1 hour    → "X min ago"
 * - < 24 hours  → "X hr ago"
 * - < 7 days    → "X days ago"
 *
 * Older entries receive an absolute date string, e.g. "Jan 15, 2026",
 * produced via `Date.toLocaleDateString` with the "en-US" locale.
 *
 * @param date - A Date object or an ISO-8601 date string (e.g. from MongoDB
 *               `created_at` field).
 * @returns A formatted timestamp string, or "Invalid date" if the input
 *          cannot be parsed.
 *
 * @example
 * formatTimestamp(new Date())                    // "Just now"
 * formatTimestamp("2026-01-15T10:30:00Z")        // "Jan 15, 2026" (if old)
 */
export function formatTimestamp(date: Date | string): string {
  // ------ Parse input ------
  const parsed: Date = typeof date === 'string' ? new Date(date) : date;

  // Guard against invalid dates
  if (Number.isNaN(parsed.getTime())) {
    return 'Invalid date';
  }

  const now = Date.now();
  const diffMs = now - parsed.getTime();

  // ------ Relative time labels (only for past dates) ------
  if (diffMs < 0) {
    // Future dates skip relative labels and use the absolute format
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (diffMs < MS_PER_MINUTE) {
    return 'Just now';
  }
  if (diffMs < MS_PER_HOUR) {
    const minutes = Math.floor(diffMs / MS_PER_MINUTE);
    return `${minutes} min ago`;
  }
  if (diffMs < MS_PER_DAY) {
    const hours = Math.floor(diffMs / MS_PER_HOUR);
    return `${hours} hr ago`;
  }
  if (diffMs < MS_PER_WEEK) {
    const days = Math.floor(diffMs / MS_PER_DAY);
    return `${days} days ago`;
  }

  // ------ Absolute date label ------
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
