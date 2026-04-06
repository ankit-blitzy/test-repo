"""
Input validation utilities for the CALC Scientific Calculator backend.

This module provides the primary defense layer for input sanitization and
validation, used by the service layer (backend/services/) and route handlers
(backend/api/). All validation functions follow an ALLOWLIST approach and
raise ValueError with descriptive messages on invalid input.

Security: This module NEVER uses eval() or any form of dynamic code execution.
All expression validation is performed through character and token allowlisting
only (per AAP 0.7.5 security requirements).

Functions:
    validate_numeric: Verify a value is a finite int or float.
    validate_expression: Sanitize and validate mathematical expressions.
    validate_angle_unit: Validate and normalize angle unit strings.
    validate_factorial_input: Validate factorial operand bounds (0-170).
    validate_positive_for_log: Validate positive operands for logarithms.
    validate_non_negative_for_sqrt: Validate non-negative operands for sqrt.
    validate_power_inputs: Validate power base/exponent for overflow.
    validate_range: Generic numeric range validation.
"""

import re
import math


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Valid angle units for trigonometric functions (AAP 0.7.2)
VALID_ANGLE_UNITS = ('degrees', 'radians')

# Maximum factorial input — 170! is the largest representable Python float
# before overflow to infinity (AAP 0.7.2)
MAX_FACTORIAL_INPUT = 170

# Maximum log10 magnitude for Python float (~1.7e308 → log10 ≈ 308.25)
_FLOAT_MAX_LOG10_MAGNITUDE = 308

# Allowed scientific function names for expression validation.
# Sorted by length descending to ensure longest-first replacement and
# prevent partial-match issues (e.g., 'asin' must be stripped before 'sin').
ALLOWED_FUNCTION_NAMES = sorted(
    [
        'factorial',
        'sqrt',
        'asin',
        'acos',
        'atan',
        'sin',
        'cos',
        'tan',
        'log',
        'pow',
        'ln',
        'pi',
        'e',
    ],
    key=len,
    reverse=True,
)

# Compiled regex pattern that matches any allowed function name token.
# Used to strip known function names from expressions before character
# validation of the remaining text (per AAP 0.7.5 allowlist approach).
_FUNCTION_TOKEN_PATTERN = re.compile(
    '|'.join(re.escape(fn) for fn in ALLOWED_FUNCTION_NAMES)
)

# Set of characters permitted in expressions AFTER function names are removed.
# Includes: digits, decimal point, arithmetic operators, parentheses, comma,
# caret (for power notation), space, and the letter 'E'/'e' for scientific
# notation in numeric literals (e.g., 1.5e10).
ALLOWED_EXPRESSION_CHARS = frozenset('0123456789.+-*/(),^ eE')


# ---------------------------------------------------------------------------
# Validation Functions
# ---------------------------------------------------------------------------


def validate_numeric(value, param_name='value'):
    """Validate that a value is a finite numeric type (int or float).

    Explicitly rejects booleans (which are a subclass of int in Python),
    strings, None, and non-finite float values (inf, -inf, NaN).

    Args:
        value: The value to validate.
        param_name: Human-readable name for error messages. Defaults to
            'value'.

    Returns:
        The validated numeric value (int or float), unchanged.

    Raises:
        ValueError: If the value is not a finite int or float.
    """
    # bool is a subclass of int in Python — reject it explicitly first
    if isinstance(value, bool):
        raise ValueError(
            f"{param_name} must be a finite numeric value, got bool"
        )

    if not isinstance(value, (int, float)):
        raise ValueError(
            f"{param_name} must be a finite numeric value, "
            f"got {type(value).__name__}"
        )

    # Reject infinity and NaN with specific messages
    if not math.isfinite(value):
        if value == math.inf or value == -math.inf:
            raise ValueError(
                f"{param_name} must be a finite numeric value, "
                f"got {'infinity' if value == math.inf else '-infinity'}"
            )
        # The only remaining non-finite float is NaN
        raise ValueError(
            f"{param_name} must be a finite numeric value, got NaN"
        )

    return value


def validate_expression(expression):
    """Validate and sanitize a mathematical expression string.

    Uses an ALLOWLIST approach: known scientific function names are stripped,
    and the remaining characters are checked against a permitted character
    set. Any character not in the allowlist causes immediate rejection.

    This function performs validation ONLY — it never evaluates the
    expression (no eval(), no exec(), no dynamic code execution).

    Args:
        expression: The mathematical expression string to validate.

    Returns:
        The stripped (but otherwise unmodified) expression string if valid.

    Raises:
        ValueError: If the expression is not a non-empty string or contains
            characters outside the allowlist.
    """
    # Type check
    if not isinstance(expression, str):
        raise ValueError(
            "Expression must be a non-empty string, "
            f"got {type(expression).__name__}"
        )

    # Strip and check for empty
    stripped = expression.strip()
    if not stripped:
        raise ValueError("Expression must be a non-empty string")

    # --- Token-based allowlist validation ---
    # 1. Lowercase copy for case-insensitive function name matching
    lowered = stripped.lower()

    # 2. Remove all recognised function name tokens (longest-first via the
    #    pre-compiled pattern) so that only non-function characters remain
    remaining = _FUNCTION_TOKEN_PATTERN.sub('', lowered)

    # 3. Check every remaining character against the allowed set
    disallowed = set()
    for ch in remaining:
        if ch not in ALLOWED_EXPRESSION_CHARS:
            disallowed.add(ch)

    if disallowed:
        # Sort for deterministic error messages
        chars_display = ', '.join(
            repr(c) for c in sorted(disallowed)
        )
        raise ValueError(
            f"Expression contains invalid characters: {chars_display}"
        )

    return stripped


def validate_angle_unit(angle_unit):
    """Validate and normalize an angle unit string.

    Accepts 'degrees' or 'radians' (case-insensitive, leading/trailing
    whitespace stripped). Returns the normalized lowercase string.

    Args:
        angle_unit: The angle unit string to validate.

    Returns:
        The normalized angle unit string ('degrees' or 'radians').

    Raises:
        ValueError: If the angle_unit is not a string or not one of the
            accepted values.
    """
    if not isinstance(angle_unit, str):
        raise ValueError(
            f"Angle unit must be a string, got {type(angle_unit).__name__}"
        )

    normalized = angle_unit.strip().lower()

    if normalized not in VALID_ANGLE_UNITS:
        raise ValueError(
            f"Invalid angle unit: '{normalized}'. "
            f"Must be 'degrees' or 'radians'"
        )

    return normalized


def validate_factorial_input(n):
    """Validate a factorial operand for bounds and type.

    Factorial is only defined for non-negative integers. The upper bound of
    170 is enforced because 170! ≈ 7.257e306 is the largest factorial
    representable as a Python float; 171! overflows to infinity.

    Args:
        n: The factorial operand to validate.

    Returns:
        The validated operand as a Python int in the range [0, 170].

    Raises:
        ValueError: If the operand is not a non-negative integer in range
            0–170, or is not numeric.
    """
    # Base numeric validation (rejects bool, str, None, inf, nan)
    n = validate_numeric(n, 'factorial input')

    # Must be a whole number (integer or float with no fractional part)
    if isinstance(n, float):
        if n != int(n):
            raise ValueError(
                f"Factorial input must be an integer, got {n}"
            )

    # Convert to int for range checking and return
    n_int = int(n)

    if n_int < 0:
        raise ValueError("Factorial input must be non-negative")

    if n_int > MAX_FACTORIAL_INPUT:
        raise ValueError(
            f"Factorial input must be <= {MAX_FACTORIAL_INPUT} (got {n_int}). "
            f"Values above {MAX_FACTORIAL_INPUT} cause float overflow"
        )

    return n_int


def validate_positive_for_log(value, function_name='log'):
    """Validate that a value is strictly positive for logarithm computation.

    Logarithm is undefined for zero and negative numbers. This validator
    provides distinct error messages for each case.

    Args:
        value: The operand to validate.
        function_name: Name of the logarithm function ('log', 'ln', 'log10')
            used in error messages. Defaults to 'log'.

    Returns:
        The validated positive numeric value.

    Raises:
        ValueError: If the value is zero, negative, or not numeric.
    """
    value = validate_numeric(value, f'{function_name} operand')

    if value == 0:
        raise ValueError(
            f"Cannot compute {function_name}(0): "
            f"logarithm of zero is undefined"
        )

    if value < 0:
        raise ValueError(
            f"Cannot compute {function_name}({value}): "
            f"logarithm of negative number is undefined"
        )

    return value


def validate_non_negative_for_sqrt(value):
    """Validate that a value is non-negative for square root computation.

    Square root of a negative number is undefined in the real number domain.

    Args:
        value: The operand to validate.

    Returns:
        The validated non-negative numeric value.

    Raises:
        ValueError: If the value is negative or not numeric.
    """
    value = validate_numeric(value, 'square root operand')

    if value < 0:
        raise ValueError(
            f"Cannot take square root of negative number: {value}"
        )

    return value


def validate_power_inputs(base, exponent):
    """Validate base and exponent for a power operation.

    Checks both operands for numeric validity and then estimates whether
    the result would overflow Python's float range (~1.7e308). Also handles
    the special case of 0 raised to a negative power.

    Args:
        base: The base of the power operation.
        exponent: The exponent of the power operation.

    Returns:
        A tuple (base, exponent) with validated numeric values.

    Raises:
        ValueError: If either operand is not numeric, or if the result
            would overflow, or if 0 is raised to a negative power.
    """
    base = validate_numeric(base, 'power base')
    exponent = validate_numeric(exponent, 'power exponent')

    # Special case: 0 raised to a negative power is division by zero
    if base == 0 and exponent < 0:
        raise ValueError("Cannot raise 0 to a negative power")

    # Estimate result magnitude to detect overflow before it happens.
    # For |base| > 1 and exponent != 0, use log10 to estimate the
    # magnitude of base**exponent.
    if base != 0 and exponent != 0:
        abs_base = abs(base)
        abs_exponent = abs(exponent)

        # Only estimate overflow when the base magnitude can contribute
        if abs_base > 1 and abs_exponent > 0:
            try:
                log10_magnitude = abs_exponent * math.log10(abs_base)
            except (ValueError, OverflowError):
                # math.log10 itself overflowed or got invalid input
                raise ValueError(
                    f"Power operation would overflow: {base}^{exponent}"
                )

            if log10_magnitude > _FLOAT_MAX_LOG10_MAGNITUDE:
                raise ValueError(
                    f"Power operation would overflow: {base}^{exponent}"
                )

        # Handle large negative exponents with base between 0 and 1
        # (result approaches infinity for very large negative exponents
        # of fractional bases, but Python handles this gracefully as 0.0
        # or inf; check the inverse case)
        if 0 < abs_base < 1 and abs_exponent > 0:
            try:
                # For 0 < |base| < 1, base**exp = 10^(exp * log10(base))
                # log10(base) is negative, so result magnitude depends on
                # sign of exponent. A negative exponent makes it grow.
                log10_base = math.log10(abs_base)  # negative value
                estimated = abs_exponent * abs(log10_base)
            except (ValueError, OverflowError):
                raise ValueError(
                    f"Power operation would overflow: {base}^{exponent}"
                )

            # If exponent is negative and base is fractional, result grows
            if exponent < 0 and estimated > _FLOAT_MAX_LOG10_MAGNITUDE:
                raise ValueError(
                    f"Power operation would overflow: {base}^{exponent}"
                )

    return (base, exponent)


def validate_range(value, min_val=None, max_val=None, param_name='value'):
    """Validate that a numeric value falls within optional bounds.

    Supports open-ended ranges: either min_val or max_val (or both) may be
    None to indicate no constraint on that side.

    Args:
        value: The numeric value to validate.
        min_val: Minimum allowed value (inclusive), or None for no lower
            bound. Defaults to None.
        max_val: Maximum allowed value (inclusive), or None for no upper
            bound. Defaults to None.
        param_name: Human-readable name for error messages. Defaults to
            'value'.

    Returns:
        The validated numeric value.

    Raises:
        ValueError: If the value is outside the specified range or not
            numeric.
    """
    value = validate_numeric(value, param_name)

    if min_val is not None and value < min_val:
        raise ValueError(
            f"{param_name} must be >= {min_val}, got {value}"
        )

    if max_val is not None and value > max_val:
        raise ValueError(
            f"{param_name} must be <= {max_val}, got {value}"
        )

    return value
