# Troubleshooting

This guide covers common issues encountered during setup, development, and usage of the Todo Application, along with their solutions.

*Source: Tech Spec Sections 4.9, 6.1, 6.2, 6.3, 6.4*

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Connection Issues](#database-connection-issues)
- [Authentication Issues](#authentication-issues)
- [API Error Codes](#api-error-codes)
- [Docker Issues](#docker-issues)
- [Environment Variable Validation](#environment-variable-validation)
- [Frontend Issues](#frontend-issues)
- [Getting Help](#getting-help)

---

## Installation Issues

### Python Version Mismatch

**Symptom:** `SyntaxError` or `ModuleNotFoundError` when running the Flask backend application.

**Cause:** The application requires Python 3.13 or later. Using an older version of Python results in incompatible syntax or missing standard library modules.

**Solution:**

1. Verify your current Python version:

   ```bash
   python --version
   ```

2. If the version is below 3.13, install Python 3.13+ from [python.org](https://www.python.org/downloads/).

3. Create a new virtual environment with the correct Python version:

   ```bash
   python3.13 -m venv venv
   source venv/bin/activate
   ```

4. Reinstall dependencies:

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

### Node.js Version Issues

**Symptom:** `npm install` failures, incompatible engine warnings, or unexpected JavaScript runtime errors in the React frontend.

**Cause:** The frontend requires Node.js LTS (22.x or later). Older Node.js versions may lack required features or produce incompatible builds.

**Solution:**

1. Verify your current Node.js and npm versions:

   ```bash
   node --version
   npm --version
   ```

2. If Node.js is outdated, install the latest LTS version using [nvm](https://github.com/nvm-sh/nvm) (recommended) or directly from [nodejs.org](https://nodejs.org/):

   ```bash
   nvm install --lts
   nvm use --lts
   ```

3. Verify the updated versions and retry installation:

   ```bash
   node --version
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### pip Install Failures

**Symptom:** `ERROR: Could not install packages` or `ResolutionImpossible` when running `pip install -r requirements.txt`.

**Cause:** Conflicting package versions, missing system-level build dependencies, or a stale pip installation.

**Solution:**

1. Ensure your virtual environment is active:

   ```bash
   source venv/bin/activate
   ```

2. Upgrade pip to the latest version:

   ```bash
   pip install --upgrade pip setuptools wheel
   ```

3. Retry the installation:

   ```bash
   pip install -r requirements.txt
   ```

4. If the error persists, install system-level build tools:

   ```bash
   # macOS
   xcode-select --install

   # Ubuntu/Debian
   sudo apt-get update && sudo apt-get install -y build-essential python3-dev

   # Windows
   # Install Visual C++ Build Tools from https://visualstudio.microsoft.com/visual-cpp-build-tools/
   ```

5. Retry `pip install -r requirements.txt` after installing build tools.

### npm Install Failures

**Symptom:** `npm ERR!` messages during `npm install` in the frontend directory.

**Cause:** Node.js version mismatch, corrupted npm cache, or missing peer dependencies.

**Solution:**

1. Clear the npm cache:

   ```bash
   npm cache clean --force
   ```

2. Remove existing modules and lock file, then reinstall:

   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. If peer dependency warnings appear, try installing with the legacy peer dependency resolution:

   ```bash
   npm install --legacy-peer-deps
   ```

### Port Conflicts

**Symptom:** `Address already in use` or `EADDRINUSE` errors when starting services.

**Cause:** Another process is already using the required port. Default ports are 5000 (Flask), 3000 (React), and 27017 (MongoDB).

**Solution:**

1. Identify the process using the port:

   ```bash
   # macOS/Linux
   lsof -i :5000
   lsof -i :3000
   lsof -i :27017

   # Windows
   netstat -ano | findstr :5000
   ```

2. Stop the conflicting process:

   ```bash
   # Using the PID from the lsof output
   kill -9 <PID>
   ```

3. Alternatively, change the port in your `.env` file:

   ```bash
   APP_PORT=5001
   REACT_PORT=3001
   ```

See the [Configuration Reference](getting-started/configuration.md) for all port configuration options.

---

## Database Connection Issues

### MongoDB Not Running

**Symptom:** `ServerSelectionTimeoutError` or `Connection refused` errors when the Flask backend starts.

**Cause:** The MongoDB service is not running on the expected host and port.

**Solution:**

1. Check if MongoDB is running:

   ```bash
   mongosh --eval "db.adminCommand('ping')"
   ```

2. If MongoDB is not running, start it:

   ```bash
   # macOS (Homebrew)
   brew services start mongodb-community@8.0

   # Linux (systemd)
   sudo systemctl start mongod

   # Docker
   docker compose up -d mongodb
   ```

3. Verify the connection again:

   ```bash
   mongosh --eval "db.adminCommand('ping')"
   # Expected output: { ok: 1 }
   ```

### Invalid Connection String

**Symptom:** `ConfigurationError` or `InvalidURI` errors in the Flask backend logs.

**Cause:** The `MONGODB_URI` value in the `.env` file is malformed or uses an incorrect format.

**Solution:**

1. Verify the connection string format in your `.env` file:

   ```bash
   # Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/todo_app

   # MongoDB Atlas
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/todo_app?retryWrites=true&w=majority
   ```

2. Ensure there are no extra spaces, quotes, or line breaks in the value.

3. Test the connection manually:

   ```bash
   mongosh "mongodb://localhost:27017/todo_app" --eval "db.getName()"
   ```

See the [Configuration Reference](getting-started/configuration.md#database-configuration) for detailed connection string options.

### Authentication Failures

**Symptom:** `Authentication failed` error when the Flask backend attempts to connect to MongoDB.

**Cause:** The username or password in the `MONGODB_URI` connection string is incorrect, or the database user lacks the required roles.

**Solution:**

1. Verify the credentials in your connection string match the database user you created.

2. For local MongoDB with authentication enabled, ensure the user exists:

   ```bash
   mongosh admin --eval "db.getUsers()"
   ```

3. For MongoDB Atlas, verify the database user in the Atlas Dashboard under **Database Access**.

4. Ensure the user has the `readWrite` role on the `todo_app` database.

### MongoDB Atlas Connection

**Symptom:** Connection timeout or `ServerSelectionTimeoutError` when connecting to a MongoDB Atlas cluster.

**Cause:** Your current IP address is not whitelisted in the Atlas Network Access settings, or a firewall or VPN is blocking the connection.

**Solution:**

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com) and navigate to **Network Access**.

2. Add your current IP address to the IP Access List. For development, you can allow access from anywhere (`0.0.0.0/0`), but restrict this for production environments.

3. If you are behind a VPN or corporate firewall, ensure outbound connections to port 27017 are allowed.

4. Test the connection using the Atlas-provided connection string:

   ```bash
   mongosh "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/todo_app"
   ```

### Collection Not Found or Empty Results

**Symptom:** API endpoints return empty arrays or `null` responses despite expecting data.

**Cause:** The database has not been seeded with initial data, or the `MONGODB_DB_NAME` in the `.env` file does not match the database name used by the application.

**Solution:**

1. Verify the database name in your `.env` file:

   ```bash
   grep MONGODB_DB_NAME .env
   ```

2. Check if collections exist and contain documents:

   ```bash
   mongosh todo_app --eval "db.getCollectionNames()"
   mongosh todo_app --eval "db.todos.countDocuments()"
   ```

3. If collections are empty, seed the database or create a to-do item through the API to trigger automatic collection creation.

> **Note:** MongoDB creates collections automatically on the first document insert. You do not need to create collections manually.

---

## Authentication Issues

### Auth0 Configuration Errors

**Symptom:** `Unauthorized` or `invalid_client` errors during the login process.

**Cause:** One or more Auth0 environment variables (`AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`) are missing or incorrect in the `.env` file.

**Solution:**

1. Verify all Auth0 variables are set in your `.env` file:

   ```bash
   grep AUTH0 .env
   ```

2. Compare each value against the settings in your Auth0 Dashboard:
   - **AUTH0_DOMAIN** — Found under Applications → Settings → Domain
   - **AUTH0_CLIENT_ID** — Found under Applications → Settings → Client ID
   - **AUTH0_CLIENT_SECRET** — Found under Applications → Settings → Client Secret
   - **AUTH0_AUDIENCE** — Found under Applications → APIs → API Identifier

3. Restart the application after updating any environment variables.

See the [Authentication Guide](guides/authentication.md) for a complete Auth0 setup walkthrough.

### Callback URL Mismatch

**Symptom:** `callback URL mismatch` error after attempting to log in through Auth0.

**Cause:** The application's callback URL is not registered in the Auth0 Dashboard under **Allowed Callback URLs**.

**Solution:**

1. Navigate to your Auth0 Dashboard → Applications → Your Application → Settings.

2. Add the following URLs to the **Allowed Callback URLs** field:

   ```text
   http://localhost:3000/callback, http://localhost:3000
   ```

3. Also add your frontend URL to **Allowed Logout URLs** and **Allowed Web Origins**:

   ```text
   http://localhost:3000
   ```

4. Save the changes and retry the login flow.

> **Important:** URLs must match exactly, including the protocol (`http` vs `https`) and port number.

### Token Expired or Invalid JWT

**Symptom:** `401 Unauthorized` responses on protected API endpoints after a previously successful login.

**Cause:** The JWT access token has expired (default: 24 hours), or the token was issued with an incorrect audience or scope.

**Solution:**

1. Check the token expiration by decoding the JWT (for development only — never share tokens):
   - Use a tool like [jwt.io](https://jwt.io) to inspect the `exp` claim.

2. If the token has expired, implement the token refresh flow using the refresh endpoint:

   ```bash
   curl -X POST http://localhost:5000/api/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
   ```

3. Verify the `AUTH0_AUDIENCE` in your `.env` matches the API Identifier in the Auth0 Dashboard.

4. If the issue persists, log out and log in again to obtain a fresh token.

### CORS Errors

**Symptom:** `Access-Control-Allow-Origin` errors in the browser console when the React frontend attempts to call the Flask backend API.

**Cause:** The frontend's origin URL is not listed in the `CORS_ORIGINS` environment variable on the backend.

**Solution:**

1. Add your frontend URL to the `CORS_ORIGINS` variable in the `.env` file:

   ```bash
   CORS_ORIGINS=http://localhost:3000
   ```

2. If running multiple frontend instances (e.g., different ports), list all origins separated by commas:

   ```bash
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

3. Restart the Flask backend for the changes to take effect.

4. Also ensure the frontend URL is added to **Allowed Web Origins** in the Auth0 Dashboard.

### MFA Issues

**Symptom:** Multi-factor authentication challenge does not appear during login, or MFA verification fails.

**Cause:** MFA is not enabled or properly configured in the Auth0 Dashboard, or the user has not completed MFA enrollment.

**Solution:**

1. Navigate to Auth0 Dashboard → Security → Multi-Factor Authentication.

2. Ensure MFA is toggled **On** and at least one factor is enabled (e.g., One-Time Password via authenticator app).

3. Set the MFA policy:
   - **Always** — Requires MFA for every login
   - **Adaptive** — Requires MFA based on risk assessment

4. If a user is having trouble enrolling, reset their MFA enrollment from the Auth0 Dashboard under Users → Select User → Multi-Factor Authentication.

> **Tip:** For local development, you can disable MFA to speed up testing. Always enable MFA for production environments.

---

## API Error Codes

The Todo Application API uses standard HTTP status codes with a consistent error response format. The table below describes each status code and common resolution steps.

| Status Code | Meaning | Common Causes | Resolution |
| --- | --- | --- | --- |
| 400 Bad Request | Invalid request payload | Missing required fields, invalid JSON syntax, malformed request body | Check request body against the API schema in the [API Reference](api-reference/overview.md) |
| 401 Unauthorized | Authentication required or failed | Missing `Authorization` header, invalid or expired Bearer token | Include a valid JWT in the `Authorization: Bearer <token>` header |
| 403 Forbidden | Insufficient permissions | User lacks the required role or is attempting to access another user's resource | Verify user roles in the Auth0 Dashboard; ensure you own the resource |
| 404 Not Found | Resource does not exist | Invalid to-do item ID, deleted resource, incorrect URL path | Verify the resource ID and URL path are correct |
| 409 Conflict | Resource conflict | Duplicate entry or concurrent modification of the same resource | Retry the operation with updated data |
| 422 Unprocessable Entity | Validation failed | Field value constraints violated (e.g., title exceeds 200 characters, invalid priority value) | Review field validation rules in the [API Reference](api-reference/overview.md) |
| 429 Too Many Requests | Rate limit exceeded | Sending too many API requests in a short time period | Implement exponential backoff; check `X-RateLimit-Remaining` response header |
| 500 Internal Server Error | Server-side failure | Unhandled exception in the application, lost database connection | Check server logs for stack traces; verify database connectivity |
| 503 Service Unavailable | Dependent service down | Backend restarting, MongoDB unavailable, Auth0 or LLM provider outage | Wait and retry; check the health of all dependent services |

### Error Response Format

All API errors follow this consistent JSON structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Todo title is required",
    "details": [
      {
        "field": "title",
        "message": "This field is required"
      }
    ]
  }
}
```

- **`error.code`** — A machine-readable error code (uppercase with underscores).
- **`error.message`** — A human-readable description of the error.
- **`error.details`** — An optional array of field-level validation errors (present for 400 and 422 responses).

See the [API Overview](api-reference/overview.md) for complete API conventions and detailed error handling documentation.

---

## Docker Issues

### Docker Compose Fails to Start

**Symptom:** `docker compose up` exits with errors or one or more containers fail to start.

**Cause:** Docker Desktop is not running, the Docker version is outdated, or cached images are corrupted.

**Solution:**

1. Verify Docker is running:

   ```bash
   docker info
   ```

2. If Docker is not running, start Docker Desktop (macOS/Windows) or the Docker daemon (Linux):

   ```bash
   # Linux
   sudo systemctl start docker
   ```

3. Tear down any stale containers and rebuild from scratch:

   ```bash
   docker compose down
   docker compose up -d --build
   ```

4. If the issue persists, remove all cached images and volumes:

   ```bash
   docker compose down -v --rmi all
   docker compose up -d --build
   ```

### Container Port Conflicts

**Symptom:** `Bind for 0.0.0.0:PORT failed: port is already allocated` when starting containers.

**Cause:** A host port required by a container (3000, 5000, or 27017) is already in use by another process or container.

**Solution:**

1. Stop conflicting processes or containers:

   ```bash
   # Find what is using the port
   lsof -i :5000

   # Stop all running Docker containers
   docker stop $(docker ps -q)
   ```

2. Alternatively, change the port mapping in `docker-compose.yml` or your `.env` file:

   ```bash
   FLASK_PORT=5001
   REACT_PORT=3001
   MONGODB_PORT=27018
   ```

3. Restart the containers:

   ```bash
   docker compose up -d
   ```

### MongoDB Container Volume Issues

**Symptom:** Database data is lost after a container restart, or `Permission denied` errors appear when writing to the MongoDB data volume.

**Cause:** Named volumes are not configured for data persistence, or the host file system permissions do not allow the container to write to the volume mount.

**Solution:**

1. Verify that named volumes are configured in `docker-compose.yml`:

   ```yaml
   volumes:
     mongodb_data:
       driver: local
   ```

2. Check that the MongoDB service uses the named volume:

   ```yaml
   mongodb:
     volumes:
       - mongodb_data:/data/db
   ```

3. List existing volumes to confirm persistence:

   ```bash
   docker volume ls
   ```

4. If you encounter permission errors, inspect the volume:

   ```bash
   docker volume inspect todo-app_mongodb_data
   ```

### Hot-Reload Not Working

**Symptom:** Code changes on the host machine are not reflected in the running Docker containers.

**Cause:** Bind mount paths in `docker-compose.yml` are incorrect, or the file watcher is not detecting changes on the host OS.

**Solution:**

1. Verify bind mount paths in `docker-compose.yml` match your project structure:

   ```yaml
   flask:
     volumes:
       - ./src:/app/src
   react:
     volumes:
       - ./frontend/src:/app/src
   ```

2. On macOS and Windows, ensure Docker Desktop's file sharing settings include your project directory.

3. Restart the specific service:

   ```bash
   docker compose restart flask
   docker compose restart react
   ```

4. If changes are still not detected, try a full rebuild:

   ```bash
   docker compose up -d --build
   ```

### Container Logs Inspection

When troubleshooting Docker issues, inspecting container logs is the fastest way to identify errors.

```bash
# View all service logs
docker compose logs

# Follow Flask backend logs in real time
docker compose logs -f flask

# Follow MongoDB logs in real time
docker compose logs -f mongodb

# View the last 100 lines of React frontend logs
docker compose logs --tail=100 react

# View logs from the last 30 minutes
docker compose logs --since 30m flask
```

**Common log patterns to look for:**

- `Running on http://0.0.0.0:5000` — Flask started successfully
- `Waiting for connections` — MongoDB is ready
- `Compiled successfully!` — React build completed
- `ConnectionRefusedError` — A service cannot reach its dependency
- `Authentication failed` — Database credential mismatch

See the [Docker Development Guide](guides/docker-development.md) for a comprehensive Docker workflow reference.

---

## Environment Variable Validation

### Missing .env File

**Symptom:** `FileNotFoundError` when the application starts, or the application uses unexpected default configuration values.

**Cause:** The `.env` file was not created from the `.env.example` template.

**Solution:**

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and configure all required variables. See the [Configuration Reference](getting-started/configuration.md) for detailed instructions.

### Required Environment Variables

The table below lists all environment variables used by the Todo Application. Variables marked as **Required** must be set before the application can start.

| Variable | Required | Default | Description | Validation |
| --- | --- | --- | --- | --- |
| `APP_PORT` | No | `5000` | Flask application port | Must be a valid port number (1024–65535) |
| `APP_HOST` | No | `0.0.0.0` | Flask bind address | Valid IP address or hostname |
| `DEBUG` | No | `false` | Enable Flask debug mode | `true` or `false` |
| `SECRET_KEY` | **Yes** | — | Flask secret key for session signing | Must be a strong random string (min 32 characters) |
| `CORS_ORIGINS` | **Yes** | — | Allowed CORS origins | Comma-separated URLs (e.g., `http://localhost:3000`) |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string | Valid MongoDB URI format |
| `MONGODB_DB_NAME` | **Yes** | `todo_app` | Database name | Non-empty string |
| `AUTH0_DOMAIN` | **Yes** | — | Auth0 tenant domain | Format: `your-tenant.auth0.com` |
| `AUTH0_CLIENT_ID` | **Yes** | — | Auth0 application client ID | Non-empty string from Auth0 Dashboard |
| `AUTH0_CLIENT_SECRET` | **Yes** | — | Auth0 application client secret | Non-empty string from Auth0 Dashboard |
| `AUTH0_AUDIENCE` | **Yes** | — | Auth0 API audience identifier | URL format matching your Auth0 API identifier |
| `LLM_PROVIDER` | **Yes** | — | LLM provider name | One of: `openai`, `anthropic`, `azure` |
| `LLM_API_KEY` | **Yes** | — | LLM provider API key | Non-empty string |
| `LLM_MODEL` | No | `gpt-4` | LLM model identifier | Valid model name for the chosen provider |

### Validation Script

Run the following script to verify that all required environment variables are set:

```bash
#!/bin/bash
# Validate required environment variables for the Todo Application

# Load .env file if it exists
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

required_vars=(
  "SECRET_KEY"
  "CORS_ORIGINS"
  "MONGODB_URI"
  "MONGODB_DB_NAME"
  "AUTH0_DOMAIN"
  "AUTH0_CLIENT_ID"
  "AUTH0_CLIENT_SECRET"
  "AUTH0_AUDIENCE"
  "LLM_PROVIDER"
  "LLM_API_KEY"
)

errors=0
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: $var is not set"
    errors=$((errors + 1))
  else
    echo "OK: $var is set"
  fi
done

echo ""
if [ $errors -gt 0 ]; then
  echo "$errors required variable(s) missing. Update your .env file."
  exit 1
else
  echo "All required environment variables are set."
fi
```

Save this script as `scripts/validate-env.sh` and run it with:

```bash
bash scripts/validate-env.sh
```

See the [Configuration Reference](getting-started/configuration.md) for the complete environment variable reference and sample `.env` file.

---

## Frontend Issues

### Blank Page or React Build Errors

**Symptom:** A white screen appears in the browser with no content, or the browser console displays errors about missing modules.

**Cause:** Frontend dependencies are missing, the build process failed, or environment variables required by React are not set.

**Solution:**

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Check for build errors:

   ```bash
   npm run build
   ```

3. Review the browser console (F12 → Console tab) for specific error messages and address them individually.

4. Verify that the React environment variables are set (variables prefixed with `REACT_APP_`):

   ```bash
   grep REACT_APP .env
   ```

### API Connection Refused from Frontend

**Symptom:** `ERR_CONNECTION_REFUSED` or network errors in the browser console when the React frontend attempts to call the Flask backend.

**Cause:** The Flask backend server is not running, or the API base URL configured in the frontend is incorrect.

**Solution:**

1. Verify the Flask backend is running:

   ```bash
   curl http://localhost:5000/api/health
   ```

2. If the backend is not running, start it:

   ```bash
   # Docker
   docker compose up -d flask

   # Manual
   cd backend
   source venv/bin/activate
   flask run --host=0.0.0.0 --port=5000
   ```

3. Check the API base URL in the frontend configuration. The default is `http://localhost:5000`.

4. If using Docker, ensure both the Flask and React containers are on the same Docker network.

### TailwindCSS Styles Not Applied

**Symptom:** The application renders with raw, unstyled HTML elements instead of the expected TailwindCSS design.

**Cause:** TailwindCSS is not configured correctly, or the PostCSS pipeline is not processing the stylesheets.

**Solution:**

1. Verify that `tailwind.config.js` includes the correct content paths:

   ```javascript
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     // ...
   };
   ```

2. Ensure the TailwindCSS directives are imported in the main CSS file:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. Restart the development server:

   ```bash
   cd frontend
   npm run dev
   ```

---

## Getting Help

If you are unable to resolve an issue using this guide, follow these steps to get additional help.

### Before Opening an Issue

1. Review this troubleshooting guide thoroughly — your issue may already be covered.
2. Search existing [GitHub Issues](https://github.com/your-org/todo-app/issues) for similar reports.
3. Review the relevant documentation section:
   - [Installation Guide](getting-started/installation.md) for setup problems
   - [Configuration Reference](getting-started/configuration.md) for environment variable issues
   - [Authentication Guide](guides/authentication.md) for login and Auth0 problems
   - [Docker Development Guide](guides/docker-development.md) for container issues
   - [API Overview](api-reference/overview.md) for API error patterns
4. For Docker setups, try a clean rebuild: `docker compose down && docker compose up --build`

### Opening an Issue

When filing a new GitHub Issue, include the following information to help the maintainers reproduce and resolve the problem:

- **Error message** — The full error output, including stack traces if available.
- **Steps to reproduce** — A numbered list of steps that reliably trigger the issue.
- **Environment details** — Operating system, Python version, Node.js version, Docker version.
- **Relevant configuration** — Your `.env` settings, **excluding all secrets** (mask `AUTH0_CLIENT_SECRET`, `LLM_API_KEY`, etc.).

See the [Contributing Guide](../CONTRIBUTING.md) for the full issue reporting process.

### Useful Diagnostic Commands

The following commands help gather diagnostic information for troubleshooting:

```bash
# Check Python version
python --version

# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Check Docker container status
docker compose ps

# View Flask backend logs
docker compose logs flask

# Check environment variables (without exposing secrets)
env | grep -E "^(APP_|MONGODB_DB|AUTH0_DOMAIN|LLM_PROVIDER|LLM_MODEL|DEBUG)"

# Test Flask backend health endpoint
curl -s http://localhost:5000/api/health

# Test MongoDB connectivity
mongosh --eval "db.serverStatus().connections"
```
