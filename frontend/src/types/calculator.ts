/**
 * Core TypeScript Type Definitions for the CALC Scientific Calculator
 *
 * This file is the single source of truth for all type contracts consumed by
 * every frontend module — components, hooks, services, and utilities.
 *
 * Structure: Enums → Type Aliases → Interfaces
 * (dependency order — enums are defined first since interfaces reference them)
 *
 * IMPORTANT: This file has ZERO internal or external dependencies.
 * All values are self-contained and match the backend API contract exactly.
 */

// =============================================================================
// Enums
// =============================================================================

/**
 * Scientific calculator functions available in Scientific mode.
 *
 * Enum string values use lowercase literals that match the backend API
 * `function` field exactly (e.g., `{ "function": "sin", ... }`).
 *
 * Includes trigonometric functions (with inverse variants), logarithmic
 * functions, power/root operations, and factorial.
 */
export enum ScientificFunction {
  /** Sine — trigonometric sine function */
  SIN = 'sin',
  /** Cosine — trigonometric cosine function */
  COS = 'cos',
  /** Tangent — trigonometric tangent function */
  TAN = 'tan',
  /** Arcsine — inverse sine function */
  ASIN = 'asin',
  /** Arccosine — inverse cosine function */
  ACOS = 'acos',
  /** Arctangent — inverse tangent function */
  ATAN = 'atan',
  /** Logarithm — base-10 logarithm */
  LOG = 'log',
  /** Natural Logarithm — base-e (Euler's number) logarithm */
  LN = 'ln',
  /** Square Root — principal square root (√x) */
  SQRT = 'sqrt',
  /** Power — exponentiation (xⁿ) */
  POWER = 'power',
  /** Square — raise to the power of 2 (x²) */
  SQUARE = 'square',
  /** Factorial — product of all positive integers up to n (n!) */
  FACTORIAL = 'factorial',
}

/**
 * Angle unit for trigonometric calculations.
 *
 * Values match the backend API `angleUnit` field exactly
 * (e.g., `{ "angleUnit": "degrees" }`).
 *
 * The default angle unit across the application is DEGREES,
 * matching standard calculator behavior.
 */
export enum AngleUnit {
  /** Degrees — 360° in a full rotation (default) */
  DEGREES = 'degrees',
  /** Radians — 2π in a full rotation */
  RADIANS = 'radians',
}

/**
 * Calculation operation type differentiating standard arithmetic
 * from scientific calculations.
 *
 * Values match the backend API `type` field exactly
 * (e.g., `{ "type": "standard" }`).
 */
export enum OperationType {
  /** Standard arithmetic operations: +, -, ×, ÷ */
  STANDARD = 'standard',
  /** Scientific operations: sin, cos, tan, log, ln, √, x², xⁿ, n! */
  SCIENTIFIC = 'scientific',
}

// =============================================================================
// Type Aliases
// =============================================================================

/**
 * Calculator display mode — controls which keypad is visible.
 *
 * Uses a string literal union (not an enum) for lightweight
 * mode switching in component props and state.
 *
 * - `'standard'`  → Shows the standard arithmetic keypad (STD badge)
 * - `'scientific'` → Shows the extended scientific keypad (SCI badge)
 */
export type CalculatorMode = 'standard' | 'scientific';

// =============================================================================
// Interfaces
// =============================================================================

/**
 * Complete state of the calculator at any point in time.
 *
 * Managed by the `useCalculator` hook and consumed by Display,
 * StandardKeypad, ScientificKeypad, and ModeToggle components.
 */
export interface CalculatorState {
  /**
   * The full expression string being built by the user.
   * Displayed in the primary (top) display line.
   * Example: "sin(45°) + 2 × 3"
   */
  expression: string;

  /**
   * The current display value shown in the secondary (bottom) display line.
   * Contains the live-computed result or the current input digits.
   */
  displayValue: string;

  /**
   * The arithmetic operator waiting to be applied after the next operand
   * is entered (e.g., "+", "-", "×", "÷"), or null if no operator is pending.
   */
  pendingOperation: string | null;

  /**
   * The left operand stored from a previous input, awaiting the right
   * operand before the pending operation can be evaluated. Null when
   * no value is stored (e.g., after clear or at initial state).
   */
  previousValue: number | null;

  /**
   * Whether the calculator is expecting a new number input.
   * Set to true after an operator press or function evaluation,
   * so the next digit input replaces (rather than appends to) the display.
   */
  waitingForOperand: boolean;

  /**
   * Current calculator mode controlling which keypad is displayed.
   * Uses the CalculatorMode type alias ('standard' or 'scientific').
   */
  mode: CalculatorMode;

  /**
   * Current angle unit for trigonometric functions.
   * Defaults to AngleUnit.DEGREES per standard calculator convention.
   */
  angleUnit: AngleUnit;

  /**
   * Error message string for display when a mathematical error occurs
   * (e.g., "Cannot take square root of negative number"),
   * or null if there is no active error.
   */
  error: string | null;
}

/**
 * Result of a calculation returned from the backend API or
 * computed client-side by the math engine.
 *
 * Maps to the response shape from:
 * - POST /api/calculate       → standard arithmetic
 * - POST /api/calculate/scientific → scientific functions
 */
export interface CalculationResult {
  /** The expression that was evaluated (e.g., "2+3" or "sin(45°)") */
  expression: string;

  /** The numerical result of the calculation */
  result: number;

  /** Whether this was a standard or scientific calculation */
  operationType: OperationType;

  /**
   * The specific scientific function used, or null for standard
   * arithmetic operations.
   */
  scientificFunction: ScientificFunction | null;

  /**
   * The angle unit used for trigonometric calculations, or null
   * for non-trigonometric operations.
   */
  angleUnit: AngleUnit | null;
}

/**
 * A single history record persisted in MongoDB and displayed
 * in the HistoryPanel sidebar.
 *
 * Maps to the MongoDB `calculation_history` collection document shape.
 * Every successful calculation is automatically saved as a HistoryEntry.
 */
export interface HistoryEntry {
  /**
   * MongoDB ObjectId as a string identifier.
   * Used for deletion (DELETE /api/history/:id) and
   * reuse (POST /api/history/:id/reuse) endpoints.
   */
  id: string;

  /** The expression that was evaluated (e.g., "sin(45°)") */
  expression: string;

  /** The numerical result of the calculation */
  result: number;

  /** Whether this was a standard or scientific calculation */
  operationType: OperationType;

  /**
   * The specific scientific function used, or null for standard
   * arithmetic operations.
   */
  scientificFunction: ScientificFunction | null;

  /**
   * The angle unit used for trigonometric calculations, or null
   * for non-trigonometric operations.
   */
  angleUnit: AngleUnit | null;

  /**
   * ISO 8601 timestamp string from the backend indicating when
   * the calculation was performed and saved.
   */
  createdAt: string;

  /**
   * Auth0 `sub` claim identifying the user who performed
   * the calculation. Used for per-user history isolation.
   */
  userId: string;
}

/**
 * Structured error response from the backend API.
 *
 * Returned by the error handling middleware for math domain errors
 * (400), authentication failures (401), and server errors (500).
 */
export interface ApiError {
  /** Descriptive error message (e.g., "Cannot take square root of negative number") */
  message: string;

  /** HTTP status code (e.g., 400, 401, 500) */
  code: number;
}

/**
 * Paginated response from the GET /api/history endpoint.
 *
 * Contains the history entries for the current page and the total
 * count for pagination context (default page size: 25 entries).
 */
export interface HistoryResponse {
  /** Array of history entries for the current page, ordered by createdAt descending */
  entries: HistoryEntry[];

  /** Total number of history entries for the authenticated user */
  count: number;
}
