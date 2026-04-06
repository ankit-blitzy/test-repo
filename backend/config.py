"""
Application configuration module for the CALC Scientific Calculator backend.

Loads all configuration from environment variables with sensible defaults
for local development. In production, environment variables should be set
explicitly via the deployment environment (Docker, cloud provider, etc.).

Configuration attributes are defined as class-level attributes on the Config
class to ensure compatibility with Flask's app.config.from_object() pattern.
"""

import os


class Config:
    """
    Centralized application configuration loaded from environment variables.

    All attributes are class-level (not instance-level) for compatibility with
    Flask's ``app.config.from_object(Config)`` configuration pattern. Each
    attribute reads from a specific environment variable with a sensible default
    value suitable for local development.

    Attributes:
        MONGO_URI: MongoDB connection string. Defaults to a local MongoDB
            instance with the 'calc' database. Docker Compose overrides this
            with the 'mongo' service hostname.
        AUTH0_DOMAIN: Auth0 tenant domain (e.g., 'your-tenant.auth0.com').
            Required for JWT validation in production; empty string disables
            authentication checks in development.
        AUTH0_AUDIENCE: Auth0 API audience identifier used for JWT audience
            claim verification. Must match the API identifier configured in
            the Auth0 dashboard.
        AUTH0_ALGORITHMS: List of accepted JWT signing algorithms. Hardcoded
            to ['RS256'] as mandated by Auth0's asymmetric signing standard.
        SECRET_KEY: Flask secret key used for session signing and CSRF
            protection. Must be overridden with a strong random value in
            production deployments.
        DEBUG: Boolean flag enabling Flask debug mode. Automatically set to
            True when FLASK_ENV is 'development' (the default), and False
            for any other value (e.g., 'production', 'staging').
        HISTORY_TTL_DAYS: Number of days before calculation history entries
            expire via MongoDB TTL index. Defaults to 90 days as specified
            in the application requirements.
        CORS_ORIGINS: Allowed CORS origin(s) for cross-origin requests from
            the frontend. Defaults to 'http://localhost:3000' for the Vite
            dev server. In production, set to the actual frontend deployment
            URL. The wildcard '*' should only be used in development mode.
    """

    # -------------------------------------------------------------------------
    # MongoDB Configuration
    # -------------------------------------------------------------------------
    # Connection URI for the MongoDB instance. The default points to a local
    # MongoDB server with the 'calc' database. When running via Docker Compose,
    # the MONGO_URI environment variable is set to use the 'mongo' service name
    # as the hostname (e.g., 'mongodb://mongo:27017/calc').
    MONGO_URI: str = os.environ.get("MONGO_URI", "mongodb://localhost:27017/calc")

    # -------------------------------------------------------------------------
    # Auth0 Configuration
    # -------------------------------------------------------------------------
    # Auth0 tenant domain for JWT token validation. This is the domain portion
    # of the Auth0 tenant URL (e.g., 'my-app.us.auth0.com'). An empty default
    # allows the application to start without Auth0 configuration during early
    # development, but authentication middleware will reject all requests until
    # a valid domain is configured.
    AUTH0_DOMAIN: str = os.environ.get("AUTH0_DOMAIN", "")

    # Auth0 API audience identifier. This must match the 'identifier' field of
    # the API resource registered in the Auth0 dashboard. Used to verify the
    # 'aud' claim in incoming JWT tokens.
    AUTH0_AUDIENCE: str = os.environ.get("AUTH0_AUDIENCE", "")

    # Accepted JWT signing algorithms. Auth0 uses RS256 (RSA Signature with
    # SHA-256) for asymmetric token signing. This is hardcoded rather than
    # configurable to prevent algorithm confusion attacks where an attacker
    # could downgrade to a weaker algorithm.
    AUTH0_ALGORITHMS: list = ["RS256"]

    # -------------------------------------------------------------------------
    # Flask Configuration
    # -------------------------------------------------------------------------
    # Flask secret key for session management and CSRF token generation. The
    # default value is suitable only for local development. In production, this
    # MUST be replaced with a cryptographically strong random string (e.g.,
    # generated via `python -c "import secrets; print(secrets.token_hex(32))"`).
    SECRET_KEY: str = os.environ.get(
        "FLASK_SECRET_KEY", "dev-secret-key-change-in-production"
    )

    # Debug mode flag derived from the FLASK_ENV environment variable. When
    # FLASK_ENV is set to 'development' (the default), debug mode is enabled,
    # providing detailed error pages, auto-reload, and verbose logging. For
    # any other value (e.g., 'production', 'staging', 'testing'), debug mode
    # is disabled to prevent information leakage in deployed environments.
    DEBUG: bool = os.environ.get("FLASK_ENV", "development") == "development"

    # -------------------------------------------------------------------------
    # History Configuration
    # -------------------------------------------------------------------------
    # Time-to-live in days for calculation history entries. MongoDB's TTL index
    # on the 'expires_at' field will automatically remove documents older than
    # this threshold. The default of 90 days balances storage efficiency with
    # user convenience. The value is cast to int because os.environ.get()
    # always returns strings.
    HISTORY_TTL_DAYS: int = int(os.environ.get("HISTORY_TTL_DAYS", "90"))

    # -------------------------------------------------------------------------
    # CORS Configuration
    # -------------------------------------------------------------------------
    # Allowed origin(s) for Cross-Origin Resource Sharing. The default permits
    # requests from the Vite development server running on localhost:3000. In
    # production, this should be set to the actual frontend URL (e.g.,
    # 'https://calc.example.com'). Per security requirements, the wildcard
    # origin ('*') must only be used in development mode.
    CORS_ORIGINS: str = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
