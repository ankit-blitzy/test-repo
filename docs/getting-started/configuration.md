# Configuration Reference

This document provides a complete reference for all environment variables and configuration options used by the Todo Application.

*Source: Tech Spec Sections 6.1, 6.3, 6.4*

The Todo Application uses environment variables loaded from a `.env` file at the project root to manage all configuration.
This approach follows the [twelve-factor app methodology](https://12factor.net/config), keeping configuration strictly separated from code.
Every configurable parameter — server ports, authentication credentials, AI model settings, and more — is controlled through environment variables.

> **Prerequisite:** This guide assumes you have completed the [Installation Guide](installation.md). If you have not installed the application yet, start there first.

## Table of Contents

- [Environment File Setup](#environment-file-setup)
- [Application Settings](#application-settings)
- [Database Configuration](#database-configuration)
- [Authentication Configuration](#authentication-configuration)
- [AI/LLM Configuration](#aillm-configuration)
- [CORS Configuration](#cors-configuration)
- [Infrastructure Configuration](#infrastructure-configuration)
- [Sample .env File](#sample-env-file)
- [Configuration Validation](#configuration-validation)
- [Next Steps](#next-steps)

---

## Environment File Setup

All configuration values are read from a `.env` file located at the project root. To get started, copy the example environment file:

```bash
cp .env.example .env
```

Open the newly created `.env` file in your editor and replace the placeholder values with your actual configuration. Each section below describes the available variables, their types, defaults, and required status.

The `.env` file is loaded automatically by the Flask backend on startup and by Docker Compose when orchestrating containers. This file is listed in `.gitignore` and is **not committed to version control**.

> **⚠️ Security Warning:** Never commit your `.env` file to version control. It contains sensitive credentials such as API keys, database passwords, and authentication secrets. If you accidentally commit it, rotate all exposed credentials immediately.

---

## Application Settings

*Source: Tech Spec Section 6.1*

Core settings that control the Flask 3.1.3 backend server behavior, logging, and runtime environment.

| Variable | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `APP_HOST` | No | String | `0.0.0.0` | Host address the Flask server binds to. Use `0.0.0.0` to accept connections from any interface, or `127.0.0.1` for localhost only. |
| `APP_PORT` | No | Integer | `5000` | Port number for the Flask server. Must not conflict with other running services. |
| `DEBUG` | No | Boolean | `false` | Enable Flask debug mode with auto-reload and verbose error pages. **Must be `false` in production.** |
| `SECRET_KEY` | **Yes** | String | — | Flask secret key for session signing and CSRF protection. Must be a cryptographically strong random string of at least 32 characters. |
| `FLASK_ENV` | No | String | `production` | Flask environment mode. Accepted values: `development`, `testing`, or `production`. Controls default logging and error display behavior. |
| `LOG_LEVEL` | No | String | `INFO` | Application logging level. Accepted values: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`. |

### Generating a Secret Key

Use the following command to generate a cryptographically secure secret key:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

This produces a 64-character hexadecimal string suitable for the `SECRET_KEY` variable. Generate a unique key for each environment (development, staging, production).

> **⚠️ Security Warning:** Never reuse secret keys across environments. Never use a predictable or short value for `SECRET_KEY` — it protects session integrity and CSRF tokens.

### Debug Mode

When `DEBUG=true`, Flask enables:

- Automatic server reload on code changes
- Detailed error pages with interactive debuggers
- Verbose request/response logging

**Never enable debug mode in production.** The interactive debugger exposes a Python shell accessible to anyone who can trigger an error, creating a critical security vulnerability.

---

## Database Configuration

*Source: Tech Spec Section 6.2*

MongoDB connection settings for the application data layer. The Todo Application uses PyMongo 4.16.0 to connect to MongoDB 8.0.

| Variable | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `MONGODB_URI` | **Yes** | String | — | Full MongoDB connection string. Supports both standard (`mongodb://`) and DNS seed list (`mongodb+srv://`) formats. |
| `MONGODB_DB_NAME` | **Yes** | String | `todo_app` | Name of the MongoDB database. The application creates collections automatically on first use. |
| `MONGODB_REPLICA_SET` | No | String | — | Replica set name. Required for MongoDB Atlas and production replica set deployments. |
| `MONGODB_MAX_POOL_SIZE` | No | Integer | `50` | Maximum number of connections in the PyMongo connection pool. |
| `MONGODB_MIN_POOL_SIZE` | No | Integer | `10` | Minimum number of idle connections maintained in the pool. |
| `MONGODB_CONNECT_TIMEOUT_MS` | No | Integer | `5000` | Maximum time in milliseconds to wait for a connection to be established. |

### Local MongoDB

For local development with a MongoDB instance running on the default port:

```bash
MONGODB_URI=mongodb://localhost:27017/todo_app
MONGODB_DB_NAME=todo_app
```

### MongoDB Atlas

For cloud-hosted MongoDB Atlas clusters, use the `mongodb+srv://` connection string format provided in the Atlas Dashboard:

```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/todo_app?retryWrites=true&w=majority
MONGODB_DB_NAME=todo_app
MONGODB_REPLICA_SET=atlas-abc123-shard-0
```

Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` with your actual Atlas credentials and cluster hostname.

> **⚠️ Security Warning:** When your `MONGODB_URI` contains a password, treat it as a secret. Never log, display, or commit connection strings containing credentials.
> For production, use MongoDB Atlas with [CSFLE](https://www.mongodb.com/docs/manual/core/csfle/) for sensitive fields.
> See the [Security Architecture](../architecture/security.md) for details.

**Troubleshooting:** For MongoDB connection issues — including timeout errors, authentication failures, and IP whitelist problems — see the [Troubleshooting Guide](../troubleshooting.md#database-connection-issues).

---

## Authentication Configuration

*Source: Tech Spec Sections 6.3, 6.4*

The Todo Application delegates authentication to [Auth0](https://auth0.com) using the OAuth 2.0 and OpenID Connect (OIDC) protocols. You must have an Auth0 account and a configured application before setting these variables.

| Variable | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `AUTH0_DOMAIN` | **Yes** | String | — | Your Auth0 tenant domain (e.g., `your-tenant.auth0.com`). Found in the Auth0 Dashboard under Application Settings. |
| `AUTH0_CLIENT_ID` | **Yes** | String | — | Application client ID from the Auth0 Dashboard. Identifies your application to Auth0. |
| `AUTH0_CLIENT_SECRET` | **Yes** | String | — | Application client secret from the Auth0 Dashboard. Used by the Flask backend for server-to-server communication. **Keep this secret.** |
| `AUTH0_AUDIENCE` | **Yes** | String | — | API audience identifier registered in Auth0 (e.g., `https://api.todoapp.com`). Used to scope access tokens. |
| `AUTH0_CALLBACK_URL` | No | String | `http://localhost:3000/callback` | OAuth 2.0 redirect URI. Auth0 redirects to this URL after successful authentication. |
| `AUTH0_LOGOUT_URL` | No | String | `http://localhost:3000` | URL to redirect the user to after logging out of Auth0. |
| `AUTH0_ALGORITHMS` | No | String | `RS256` | JWT signing algorithm used by Auth0. `RS256` (RSA with SHA-256) is the recommended default. |

### Auth0 Setup Summary

Follow these steps to obtain the required Auth0 configuration values:

1. Create a free Auth0 account at [auth0.com](https://auth0.com)
2. In the Auth0 Dashboard, create a new **Application** with type "Single Page Application" (for the React frontend)
3. Create a new **API** in the Auth0 Dashboard (e.g., name: "Todo App API", identifier: `https://api.todoapp.com`)
4. Copy the **Domain**, **Client ID**, **Client Secret**, and **API Audience** values into your `.env` file
5. In the Application settings, configure:
   - **Allowed Callback URLs:** `http://localhost:3000/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - **Allowed Web Origins:** `http://localhost:3000`

### Example Configuration

```bash
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRET
AUTH0_AUDIENCE=https://api.todoapp.com
AUTH0_CALLBACK_URL=http://localhost:3000/callback
AUTH0_LOGOUT_URL=http://localhost:3000
```

> **⚠️ Security Warning:** Never expose `AUTH0_CLIENT_SECRET` in frontend code. The client secret is used **only** by the Flask backend for server-to-server communication with Auth0. The React frontend uses only the `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, and `AUTH0_AUDIENCE` values.

For detailed Auth0 setup instructions including MFA configuration, role-based access control, and token lifecycle management, see the [Authentication Guide](../guides/authentication.md).

---

## AI/LLM Configuration

*Source: Tech Spec Section 6.1*

Settings for the LangChain 1.2.10 AI engine that powers the application's intelligent features — including task suggestions, natural language to-do creation, smart categorization, and conversational assistance.

| Variable | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `LLM_PROVIDER` | **Yes** | String | — | LLM provider identifier. Accepted values: `openai`, `anthropic`, or `azure`. |
| `LLM_API_KEY` | **Yes** | String | — | API key for the chosen LLM provider. Obtain from the provider's developer dashboard. |
| `LLM_MODEL` | No | String | `gpt-4` | Model name or identifier. Must match a model available from the selected provider. |
| `LLM_TEMPERATURE` | No | Float | `0.7` | Controls response creativity. Range: `0.0` (deterministic, factual) to `1.0` (creative, varied). |
| `LLM_MAX_TOKENS` | No | Integer | `2048` | Maximum number of tokens in the LLM response. Higher values allow longer responses but increase cost. |
| `LANGCHAIN_TRACING_V2` | No | Boolean | `false` | Enable LangChain tracing for debugging AI processing chains. Sends trace data to LangSmith. |
| `LANGCHAIN_API_KEY` | No | String | — | LangSmith API key. Required only when `LANGCHAIN_TRACING_V2=true`. Obtain from [smith.langchain.com](https://smith.langchain.com). |
| `LANGCHAIN_PROJECT` | No | String | `todo-app` | LangSmith project name for organizing trace data. |

### Provider-Specific Configuration

The Todo Application supports three LLM providers. Configure one of the following based on your preference:

**OpenAI:**

```bash
LLM_PROVIDER=openai
LLM_API_KEY=sk-YOUR_OPENAI_API_KEY
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2048
```

Obtain your API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

**Anthropic:**

```bash
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-YOUR_ANTHROPIC_API_KEY
LLM_MODEL=claude-3-sonnet-20240229
```

Obtain your API key from [console.anthropic.com](https://console.anthropic.com/).

**Azure OpenAI:**

```bash
LLM_PROVIDER=azure
LLM_API_KEY=YOUR_AZURE_OPENAI_KEY
LLM_MODEL=gpt-4
AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=YOUR_DEPLOYMENT_NAME
```

Azure OpenAI requires two additional variables: `AZURE_OPENAI_ENDPOINT` (your Azure resource URL) and `AZURE_OPENAI_DEPLOYMENT` (your model deployment name). Configure these in the [Azure Portal](https://portal.azure.com).

> **⚠️ Security Warning:** Never commit LLM API keys to version control. API keys grant direct access to paid services and can incur significant costs if exposed. Use environment variables or a secrets manager in all environments.

For detailed information about the AI processing patterns (Simple Query, RAG-Based Analysis, Multi-Step Agent), see the [AI Features Guide](../guides/ai-features.md).

---

## CORS Configuration

*Source: Tech Spec Section 6.1*

Cross-Origin Resource Sharing (CORS) settings control which frontend origins are allowed to communicate with the Flask backend API. This is essential for the React single-page application (SPA) architecture where the frontend and backend run on different ports.

| Variable | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `CORS_ORIGINS` | **Yes** | String | — | Comma-separated list of allowed origin URLs. Each origin must include the protocol and port (e.g., `http://localhost:3000`). |
| `CORS_METHODS` | No | String | `GET,POST,PUT,PATCH,DELETE,OPTIONS` | Comma-separated list of allowed HTTP methods. |
| `CORS_HEADERS` | No | String | `Content-Type,Authorization` | Comma-separated list of allowed request headers. |

### Development

For local development, allow the React development server:

```bash
CORS_ORIGINS=http://localhost:3000
```

### Production

For production deployments, list all legitimate frontend origins:

```bash
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

> **Note:** Do not use wildcard (`*`) origins in production. Always specify the exact origins that are authorized to access your API.

---

## Infrastructure Configuration

*Source: Tech Spec Sections 3.7, 4.8*

Docker and infrastructure settings used by `docker-compose.yml` and deployment configurations. These variables control port mappings and volume paths for containerized services.

| Variable | Context | Default | Description |
| --- | --- | --- | --- |
| `MONGODB_PORT` | Docker Compose | `27017` | Host port mapped to the MongoDB container. |
| `FLASK_PORT` | Docker Compose | `5000` | Host port mapped to the Flask backend container. |
| `REACT_PORT` | Docker Compose | `3000` | Host port mapped to the React frontend container. |
| `MONGODB_DATA_PATH` | Docker Compose | `./data/mongodb` | Host filesystem path for MongoDB data persistence. Ensures data survives container restarts. |

### Example

```bash
MONGODB_PORT=27017
FLASK_PORT=5000
REACT_PORT=3000
MONGODB_DATA_PATH=./data/mongodb
```

If the default ports conflict with other services on your machine, change them here. For example, to use port `5001` for the Flask backend:

```bash
FLASK_PORT=5001
```

For the complete Docker development workflow — including service orchestration, log inspection, hot-reload, and volume management — see the [Docker Development Guide](../guides/docker-development.md).

---

## Sample .env File

Below is a complete sample `.env` file containing all configuration variables with placeholder values. Copy this into your `.env` file and replace every value marked with `YOUR_` or `CHANGE_ME` with your actual configuration.

```bash
# =============================================================================
# Todo Application - Environment Configuration
# =============================================================================
# Copy this file to .env and replace placeholder values with your actual config.
# NEVER commit .env to version control.
# =============================================================================

# --- Application Settings ---
APP_HOST=0.0.0.0
APP_PORT=5000
DEBUG=true
SECRET_KEY=CHANGE_ME_TO_A_RANDOM_STRING_AT_LEAST_32_CHARS
FLASK_ENV=development
LOG_LEVEL=DEBUG

# --- Database Configuration ---
MONGODB_URI=mongodb://localhost:27017/todo_app
MONGODB_DB_NAME=todo_app
# MONGODB_REPLICA_SET=              # Uncomment for Atlas or replica set deployments
# MONGODB_MAX_POOL_SIZE=50
# MONGODB_MIN_POOL_SIZE=10
# MONGODB_CONNECT_TIMEOUT_MS=5000

# --- Authentication (Auth0) ---
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRET
AUTH0_AUDIENCE=https://api.todoapp.com
AUTH0_CALLBACK_URL=http://localhost:3000/callback
AUTH0_LOGOUT_URL=http://localhost:3000
# AUTH0_ALGORITHMS=RS256

# --- AI/LLM Configuration ---
LLM_PROVIDER=openai
LLM_API_KEY=sk-YOUR_OPENAI_API_KEY
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2048
LANGCHAIN_TRACING_V2=false
# LANGCHAIN_API_KEY=                # Uncomment for LangSmith tracing
# LANGCHAIN_PROJECT=todo-app

# --- CORS ---
CORS_ORIGINS=http://localhost:3000
# CORS_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
# CORS_HEADERS=Content-Type,Authorization

# --- Infrastructure (Docker) ---
MONGODB_PORT=27017
FLASK_PORT=5000
REACT_PORT=3000
MONGODB_DATA_PATH=./data/mongodb
```

> **Important:** Before running the application, search your `.env` file for `YOUR_` and `CHANGE_ME` to find all values that require replacement. The application will fail to start if required variables contain placeholder values.

---

## Configuration Validation

Use the following script to verify that all required environment variables are set before starting the application.

### Validation Script

Save this script as `scripts/validate-env.sh` or run it directly:

```bash
#!/bin/bash
# Validate required environment variables for the Todo Application

# Load .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)
fi

required_vars=(
  "SECRET_KEY"
  "MONGODB_URI"
  "MONGODB_DB_NAME"
  "AUTH0_DOMAIN"
  "AUTH0_CLIENT_ID"
  "AUTH0_CLIENT_SECRET"
  "AUTH0_AUDIENCE"
  "LLM_PROVIDER"
  "LLM_API_KEY"
  "CORS_ORIGINS"
)

echo "Validating Todo Application environment variables..."
echo "===================================================="

errors=0
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ MISSING: $var is not set"
    errors=$((errors + 1))
  else
    echo "✅ OK:      $var is set"
  fi
done

echo "===================================================="
if [ $errors -gt 0 ]; then
  echo "⚠️  $errors required variable(s) missing. Please update your .env file."
  exit 1
else
  echo "✅ All required environment variables are configured."
fi
```

### Running the Validation

```bash
# Run the validation script
bash scripts/validate-env.sh

# Or source .env and check a single variable manually
source .env && echo "SECRET_KEY is: ${SECRET_KEY:+set}"
```

Expected output when all variables are configured:

```text
Validating Todo Application environment variables...
====================================================
✅ OK:      SECRET_KEY is set
✅ OK:      MONGODB_URI is set
✅ OK:      MONGODB_DB_NAME is set
✅ OK:      AUTH0_DOMAIN is set
✅ OK:      AUTH0_CLIENT_ID is set
✅ OK:      AUTH0_CLIENT_SECRET is set
✅ OK:      AUTH0_AUDIENCE is set
✅ OK:      LLM_PROVIDER is set
✅ OK:      LLM_API_KEY is set
✅ OK:      CORS_ORIGINS is set
====================================================
✅ All required environment variables are configured.
```

For detailed troubleshooting of configuration issues — including missing variables, invalid values, and service startup failures — see the [Troubleshooting Guide](../troubleshooting.md#environment-variable-validation).

---

## Next Steps

After configuring your environment variables, continue with the following guides:

- ▶️ **Ready to run?** Continue to the [Quick Start Tutorial](quickstart.md) to launch the application and create your first to-do item
- 🔑 **Need Auth0 details?** See the [Authentication Guide](../guides/authentication.md) for complete Auth0 tenant setup, MFA configuration, and token lifecycle management
- 🤖 **Need an LLM API key?** Visit your provider's dashboard: [OpenAI](https://platform.openai.com/api-keys) | [Anthropic](https://console.anthropic.com/) | [Azure](https://portal.azure.com)
- 🐳 **Using Docker?** See the [Docker Development Guide](../guides/docker-development.md) for container-specific configuration and service orchestration
- 🔧 **Having issues?** Check the [Troubleshooting Guide](../troubleshooting.md) for common configuration problems and solutions
