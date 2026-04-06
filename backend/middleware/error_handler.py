"""Global error handling middleware for the CALC Scientific Calculator backend.

This module provides a centralized error handling registration function that
attaches Flask error handlers to the application instance. Each handler catches
a specific Python exception type raised during scientific calculations and input
validation, converting it into a structured JSON error response with the
appropriate HTTP status code.

Error Response Format (all handlers):
    {
        "error": "<snake_case_error_type>",
        "message": "<human_readable_description>"
    }

Registered Handlers:
    - ValueError        -> 400 Bad Request   (invalid inputs, domain errors)
    - ZeroDivisionError -> 400 Bad Request   (division by zero)
    - OverflowError     -> 400 Bad Request   (result exceeds float limits)
    - Exception         -> 500 Internal Error (catch-all for unhandled errors)

Usage:
    from middleware.error_handler import register_error_handlers

    app = Flask(__name__)
    register_error_handlers(app)
"""

from flask import jsonify


def register_error_handlers(app):
    """Register global error handlers on the given Flask application instance.

    This function attaches four error handlers to the Flask application using
    the ``@app.errorhandler()`` decorator pattern.  Handlers are registered in
    order of specificity — concrete exception types first, followed by the
    generic ``Exception`` catch-all — ensuring that domain-specific errors
    receive precise HTTP 400 responses while truly unexpected failures return
    a safe HTTP 500 response that does not leak internal details.

    Args:
        app: A Flask application instance on which the error handlers will
            be registered.  Typically called once during application
            initialization in ``create_app()``.

    Registered Handlers:
        ValueError (HTTP 400):
            Catches invalid input values such as non-numeric input, invalid
            expression syntax, factorial of a negative number, square root of
            a negative number, or logarithm of zero/negative.  The original
            exception message is preserved via ``str(error)`` so that the
            service layer's descriptive message reaches the client.

        ZeroDivisionError (HTTP 400):
            Catches division-by-zero errors from standard arithmetic
            operations.  Returns a fixed, user-friendly message rather than
            Python's default ``"division by zero"`` string.

        OverflowError (HTTP 400):
            Catches numeric overflow when a calculation result exceeds the
            representable range of a Python float (e.g. ``10 ** 309``).
            Returns a fixed, user-friendly message.

        Exception (HTTP 500):
            Catch-all for any unhandled exception not matched by the specific
            handlers above.  Returns a generic message to prevent leaking
            internal implementation details to the client.
    """

    @app.errorhandler(ValueError)
    def handle_value_error(error):
        """Handle ValueError exceptions — invalid inputs and domain errors.

        Propagates the original exception message from the service layer so
        that the client receives a descriptive reason for the failure (e.g.
        "Cannot take square root of a negative number").

        Returns:
            tuple: A (response, status_code) pair where response is a JSON
                object with ``error`` and ``message`` keys, and status_code
                is 400.
        """
        return jsonify({
            "error": "bad_request",
            "message": str(error)
        }), 400

    @app.errorhandler(ZeroDivisionError)
    def handle_zero_division(error):
        """Handle ZeroDivisionError exceptions — division by zero.

        Returns a fixed, human-readable message instead of Python's default
        exception string.

        Returns:
            tuple: A (response, status_code) pair where response is a JSON
                object with ``error`` and ``message`` keys, and status_code
                is 400.
        """
        return jsonify({
            "error": "bad_request",
            "message": "Division by zero is not allowed"
        }), 400

    @app.errorhandler(OverflowError)
    def handle_overflow_error(error):
        """Handle OverflowError exceptions — numeric overflow.

        Triggered when a calculation result exceeds the representable range
        of a Python float (approximately ±1.8 × 10^308).

        Returns:
            tuple: A (response, status_code) pair where response is a JSON
                object with ``error`` and ``message`` keys, and status_code
                is 400.
        """
        return jsonify({
            "error": "bad_request",
            "message": "Calculation result is too large to represent"
        }), 400

    @app.errorhandler(Exception)
    def handle_generic_error(error):
        """Handle all unhandled exceptions — catch-all safety net.

        Returns a generic error message that does **not** expose internal
        implementation details, stack traces, or sensitive information to
        the client.  This is critical for production security.

        Returns:
            tuple: A (response, status_code) pair where response is a JSON
                object with ``error`` and ``message`` keys, and status_code
                is 500.
        """
        return jsonify({
            "error": "internal_server_error",
            "message": "An unexpected error occurred"
        }), 500
