"""Auth0 JWT authentication middleware for the CALC Scientific Calculator backend.

This module provides the ``require_auth`` decorator function that protects
Flask API endpoints by validating Auth0-issued JSON Web Tokens (JWT).  The
decorator performs the following sequence on every incoming request:

1. Extracts the Bearer token from the ``Authorization`` HTTP header.
2. Fetches the Auth0 tenant's JSON Web Key Set (JWKS) to obtain the RS256
   public signing key (cached after first retrieval).
3. Decodes and validates the JWT — verifying the cryptographic signature,
   expiration time, audience claim, and issuer claim.
4. Extracts the ``sub`` (subject) claim as the authenticated ``user_id``.
5. Passes ``user_id`` as a keyword argument to the wrapped route handler.

All authentication failures return HTTP 401 with a structured JSON response::

    {
        "error": "<error_type_string>",
        "message": "<human_readable_description>"
    }

Usage::

    from middleware.auth_middleware import require_auth

    @app.route('/api/protected')
    @require_auth
    def protected_endpoint(user_id):
        # user_id is extracted from JWT 'sub' claim
        return jsonify({"user": user_id})

Security Notes:
    - The decorator enforces the Authentication-First Pattern: no calculation
      or history endpoint is accessible without a valid bearer token.
    - The ``user_id`` is extracted exclusively from the JWT ``sub`` claim to
      prevent spoofing via request parameters or headers.
    - The JWKS client uses HTTPS to fetch the signing keys, ensuring integrity
      of the key material in transit.
    - Algorithm is restricted to RS256 (asymmetric) to prevent algorithm
      confusion attacks where an attacker might downgrade to HS256 (symmetric).

Configuration Dependencies (from ``current_app.config``):
    AUTH0_DOMAIN (str):
        Auth0 tenant domain, e.g. ``"my-app.us.auth0.com"``.
    AUTH0_AUDIENCE (str):
        Auth0 API audience identifier for JWT ``aud`` claim validation.
    AUTH0_ALGORITHMS (list[str]):
        Accepted JWT signing algorithms, typically ``["RS256"]``.
"""

import json
import urllib.request
from functools import wraps

from flask import request, jsonify, current_app
import jwt
from jwt import PyJWKClient


# ---------------------------------------------------------------------------
# Module-level JWKS Client Cache
# ---------------------------------------------------------------------------
# The PyJWKClient instance is cached at module scope to avoid constructing a
# new HTTP client and re-fetching the JWKS endpoint on every request.  The
# PyJWKClient class itself implements internal key caching, but instantiation
# overhead (URL parsing, connection setup) is avoided by reusing the same
# object.  The companion ``_jwks_client_domain`` variable tracks which Auth0
# domain the cached client was created for, allowing automatic invalidation
# if the configuration changes (e.g., during testing or blue-green deploys).
_jwks_client = None
_jwks_client_domain = None


def get_jwks_client():
    """Return a cached :class:`PyJWKClient` for the configured Auth0 domain.

    On first invocation (or when the configured ``AUTH0_DOMAIN`` changes),
    this function creates a new ``PyJWKClient`` pointing at the Auth0
    tenant's JWKS endpoint (``https://<domain>/.well-known/jwks.json``)
    and stores it in the module-level cache.  Subsequent calls with the
    same domain return the cached instance without any network I/O.

    The function **must** be called within a Flask application context
    because it reads ``AUTH0_DOMAIN`` from ``current_app.config``.

    Returns:
        PyJWKClient: A reusable JWKS client configured for the current
            Auth0 tenant domain.

    Raises:
        ValueError: If ``AUTH0_DOMAIN`` is not set or is an empty string
            in the application configuration.  This prevents cryptic
            downstream errors from attempting HTTPS requests to an invalid
            URL.
    """
    global _jwks_client, _jwks_client_domain

    auth0_domain = current_app.config.get("AUTH0_DOMAIN", "")

    if not auth0_domain:
        raise ValueError(
            "AUTH0_DOMAIN is not configured. Set the AUTH0_DOMAIN environment "
            "variable or update the application configuration."
        )

    # Invalidate the cache if the domain has changed since the last call.
    if _jwks_client is None or _jwks_client_domain != auth0_domain:
        jwks_url = f"https://{auth0_domain}/.well-known/jwks.json"
        _jwks_client = PyJWKClient(jwks_url)
        _jwks_client_domain = auth0_domain

    return _jwks_client


def require_auth(f):
    """Decorator that enforces Auth0 JWT authentication on Flask route handlers.

    When applied to a Flask route function, this decorator intercepts every
    incoming request and performs full JWT validation before the route logic
    executes.  If validation succeeds, the route handler is invoked with an
    additional ``user_id`` keyword argument containing the authenticated
    user's identity (the JWT ``sub`` claim).

    The decorated function's original metadata (``__name__``, ``__doc__``,
    ``__module__``) is preserved via :func:`functools.wraps`, ensuring that
    Flask's URL rule registration and introspection work correctly.

    Args:
        f (callable): The Flask route handler function to protect.

    Returns:
        callable: A wrapper function that performs JWT validation before
            delegating to ``f``.

    Error Responses (all HTTP 401):
        ``authorization_error``:
            The ``Authorization`` header is missing, empty, or does not
            follow the ``Bearer <token>`` format.
        ``token_expired``:
            The JWT's ``exp`` claim indicates the token has expired.
        ``invalid_claims``:
            The JWT's ``aud`` (audience) or ``iss`` (issuer) claims do
            not match the expected values from the application config.
        ``invalid_token``:
            The JWT failed general validation — invalid signature, malformed
            token, unsupported algorithm, or other PyJWT decode errors.
        ``authorization_error``:
            An unexpected non-JWT error occurred during the authentication
            flow (e.g., network failure when fetching JWKS).

    Example::

        @app.route('/api/calculate', methods=['POST'])
        @require_auth
        def calculate(user_id):
            # 'user_id' is the Auth0 'sub' claim, e.g. "auth0|abc123"
            data = request.get_json()
            result = calculator_service.evaluate(data['expression'])
            return jsonify({"result": result})
    """

    @wraps(f)
    def decorated(*args, **kwargs):
        # ------------------------------------------------------------------
        # Step 1: Extract the Bearer token from the Authorization header
        # ------------------------------------------------------------------
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "error": "authorization_error",
                "message": "Authorization header is missing or malformed"
            }), 401

        # The token is everything after the 7-character "Bearer " prefix.
        token = auth_header[7:]

        if not token:
            return jsonify({
                "error": "authorization_error",
                "message": "Authorization header is missing or malformed"
            }), 401

        try:
            # --------------------------------------------------------------
            # Step 2: Obtain the signing key from Auth0's JWKS endpoint
            # --------------------------------------------------------------
            jwks_client = get_jwks_client()
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            # --------------------------------------------------------------
            # Step 3: Decode and fully validate the JWT
            # --------------------------------------------------------------
            # jwt.decode() performs the following validations automatically:
            #   - RS256 signature verification using the JWKS public key
            #   - Expiration check (``exp`` claim vs. current UTC time)
            #   - Audience verification (``aud`` claim vs. AUTH0_AUDIENCE)
            #   - Issuer verification (``iss`` claim vs. Auth0 domain URL)
            payload = jwt.decode(
                token,
                key=signing_key.key,
                algorithms=current_app.config.get("AUTH0_ALGORITHMS", ["RS256"]),
                audience=current_app.config.get("AUTH0_AUDIENCE", ""),
                issuer=f"https://{current_app.config.get('AUTH0_DOMAIN', '')}/",
            )

            # --------------------------------------------------------------
            # Step 4: Extract the authenticated user identity
            # --------------------------------------------------------------
            # The ``sub`` (subject) claim is the canonical user identifier
            # in Auth0 tokens. It is the sole source of truth for user_id
            # throughout the application (per AAP Section 0.7.1).
            user_id = payload.get("sub")

            if not user_id:
                return jsonify({
                    "error": "invalid_token",
                    "message": "Token is missing the 'sub' claim"
                }), 401

        except jwt.ExpiredSignatureError:
            # The token's ``exp`` claim is in the past — user needs to
            # re-authenticate or refresh their token.
            return jsonify({
                "error": "token_expired",
                "message": "Token has expired"
            }), 401

        except (jwt.InvalidAudienceError, jwt.InvalidIssuerError):
            # The ``aud`` or ``iss`` claim does not match what is configured
            # in Auth0. This typically indicates a misconfigured client or
            # an attempt to use a token issued for a different API/tenant.
            return jsonify({
                "error": "invalid_claims",
                "message": "Invalid token claims. Please check the audience and issuer"
            }), 401

        except jwt.PyJWTError:
            # Catch-all for any other PyJWT-specific errors: invalid
            # signature, malformed token structure, unsupported algorithm,
            # decode failures, JWKS key mismatch, etc.
            return jsonify({
                "error": "invalid_token",
                "message": "Token validation failed"
            }), 401

        except Exception:
            # Catch-all for unexpected non-JWT errors such as network
            # failures when fetching the JWKS endpoint, DNS resolution
            # errors, or configuration issues.  A generic message is
            # returned to avoid leaking internal details.
            return jsonify({
                "error": "authorization_error",
                "message": "Unable to process authentication"
            }), 401

        # ------------------------------------------------------------------
        # Step 5: Delegate to the wrapped route handler with user_id
        # ------------------------------------------------------------------
        return f(*args, user_id=user_id, **kwargs)

    return decorated
