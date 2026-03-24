# Authentication Endpoints

REST API reference for authentication operations using Auth0 OAuth 2.0/OIDC, including login, callback handling, logout, token refresh, and current user retrieval.

All endpoints in this section are prefixed with `/api/auth`.

*Source: Tech Spec Sections 6.3, 6.4*

## Authentication Model

The Todo Application uses [Auth0](https://auth0.com) as the identity provider (IdP) via the **OAuth 2.0 Authorization Code flow with PKCE**. The authentication model works as follows:

- **Token-based authentication:** All authentication state is maintained through JSON Web Tokens (JWT) issued by Auth0.
- **Access tokens** are issued by Auth0 after a successful login and validated by the Flask backend on every protected request.
- **Refresh tokens** are used for silent token renewal, allowing the client to obtain new access tokens without requiring the user to re-authenticate.
- **JWT claims** include user identity information (`sub`, `email`, `name`) and are validated against Auth0's JSON Web Key Set (JWKS) endpoint.
- **Three-checkpoint validation:** The Flask backend validates the JWT signature, expiration, and audience claim on every request to a protected endpoint.

### Configuration Prerequisites

Before using the authentication endpoints, ensure the following are configured:

- **Auth0 domain, client ID, client secret, and audience** must be set in the `.env` file.
- **Callback URLs** must be registered in the Auth0 application settings.
- See the [Configuration Reference](../getting-started/configuration.md) for environment variable setup.
- See the [Authentication Guide](../guides/authentication.md) for the complete Auth0 setup walkthrough, including account creation, application registration, and MFA configuration.

## Table of Contents

- [Initiate Login](#initiate-login)
- [Auth0 Callback](#auth0-callback)
- [Logout](#logout)
- [Refresh Token](#refresh-token)
- [Get Current User](#get-current-user)
- [Error Responses](#error-responses)

---

## Initiate Login

Initiates the OAuth 2.0 Authorization Code flow by generating an Auth0 authorization URL.
The client receives this URL and redirects the user's browser to Auth0's login page.
The authorization URL includes the appropriate parameters: client ID, redirect URI, scope,
response type, state (for CSRF protection), and PKCE code challenge.

This is the first step in the authentication flow. After the user authenticates on the Auth0 login page, Auth0 redirects back to the application's callback URL with an authorization code, which is then exchanged for tokens via the [Auth0 Callback](#auth0-callback) endpoint.

**Method and URL:**

```text
POST /api/auth/login
```

**Authentication:** Not required — this endpoint initiates authentication.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `redirect_uri` | string | No | Post-login redirect URL. Defaults to the configured callback URL in the application settings. Must be registered in Auth0's Allowed Callback URLs. |
| `screen_hint` | string | No | Auth0 screen hint — `login` to show the login form or `signup` to show the registration form. Defaults to `login`. |

**Request body example:**

```json
{
  "redirect_uri": "http://localhost:3000/callback",
  "screen_hint": "login"
}
```

### Response Body (200 OK)

```json
{
  "authorization_url": "https://YOUR_AUTH0_DOMAIN/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&scope=openid%20profile%20email&state=abc123&code_challenge=xyz789&code_challenge_method=S256",
  "state": "abc123"
}
```

| Field | Type | Description |
| --- | --- | --- |
| `authorization_url` | string | The full Auth0 authorization URL. Redirect the user's browser to this URL to start the login flow. |
| `state` | string | A unique, randomly generated state parameter used for CSRF protection. The client should store this value and verify it matches the state returned in the callback. |

> **Flow note:** The client should redirect the user's browser to the `authorization_url`.
> After the user authenticates with Auth0, Auth0 redirects back to the `redirect_uri`
> with an authorization code and the `state` parameter.
> The client then exchanges this code via the [Auth0 Callback](#auth0-callback) endpoint.

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Authorization URL generated successfully |
| `400 Bad Request` | Invalid `redirect_uri` (not registered in Auth0) or invalid `screen_hint` value |
| `500 Internal Server Error` | Auth0 configuration error or server failure |

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "redirect_uri": "http://localhost:3000/callback",
    "screen_hint": "login"
  }'
```

**Python:**

```python
import requests

response = requests.post(
    "http://localhost:5000/api/auth/login",
    json={
        "redirect_uri": "http://localhost:3000/callback",
        "screen_hint": "login"
    }
)

data = response.json()
authorization_url = data["authorization_url"]
state = data["state"]

# Store state for CSRF verification, then redirect user to authorization_url
print(f"Redirect user to: {authorization_url}")
```

**JavaScript:**

```javascript
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    redirect_uri: "http://localhost:3000/callback",
    screen_hint: "login"
  })
});

const data = await response.json();

// Store state for CSRF verification
sessionStorage.setItem("auth_state", data.state);

// Redirect user to Auth0 login page
window.location.href = data.authorization_url;
```

---

## Auth0 Callback

Handles the Auth0 callback after user authentication. This endpoint exchanges the authorization code
received from Auth0 for access and refresh tokens. The state parameter is verified to protect against
CSRF attacks. If this is the user's first login, a new user record is automatically created in the database.

This is the second step in the authentication flow, following the [Initiate Login](#initiate-login) redirect. After a successful exchange, the client receives JWT tokens to authenticate subsequent API requests.

**Method and URL:**

```text
POST /api/auth/callback
```

**Authentication:** Not required — this endpoint completes authentication.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | Yes | The authorization code received from Auth0 via the redirect URL query parameter. This is a single-use code that expires after a short time. |
| `state` | string | Yes | The state parameter from the Auth0 redirect. Must match the state value returned by the [Initiate Login](#initiate-login) endpoint to verify CSRF protection. |
| `redirect_uri` | string | No | Must match the `redirect_uri` used in the original login request. Required by Auth0 for authorization code validation. |

**Request body example:**

```json
{
  "code": "authorization_code_from_auth0",
  "state": "abc123",
  "redirect_uri": "http://localhost:3000/callback"
}
```

### Response Body (200 OK)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.refresh_token_value...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jane Developer",
    "avatar_url": "https://avatars.example.com/jane.jpg"
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `access_token` | string | JWT access token for authenticating API requests. Include this in the `Authorization: Bearer <token>` header. |
| `refresh_token` | string | Refresh token for obtaining new access tokens without re-authentication. |
| `token_type` | string | Always `"Bearer"`. Indicates the token scheme for the `Authorization` header. |
| `expires_in` | integer | Access token lifetime in seconds. `86400` equals 24 hours. |
| `user` | object | Basic user profile information. |
| `user.id` | string | The user's unique identifier in the application database (MongoDB ObjectId). |
| `user.email` | string | The user's email address from Auth0. |
| `user.name` | string | The user's display name from Auth0. |
| `user.avatar_url` | string | URL to the user's profile picture. |

> **Security notes:**
>
> - The `access_token` should be stored securely — in memory or a secure storage mechanism. **Never store tokens in `localStorage`** due to XSS vulnerability risks.
> - The `refresh_token` should be stored securely and used exclusively for token renewal via the [Refresh Token](#refresh-token) endpoint.
> - `expires_in` is in seconds — `86400` equals 24 hours. Implement proactive token refresh before expiration.
> - On first-time login, a new user record is automatically created in the database using the identity claims from Auth0.

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Authentication successful — access and refresh tokens issued |
| `400 Bad Request` | Missing required `code` or `state` parameter |
| `401 Unauthorized` | Invalid authorization code, expired code, or state mismatch (possible CSRF attack) |
| `500 Internal Server Error` | Auth0 token exchange failure or server error |

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/auth/callback" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "authorization_code_from_auth0",
    "state": "abc123",
    "redirect_uri": "http://localhost:3000/callback"
  }'
```

**Python:**

```python
import requests

response = requests.post(
    "http://localhost:5000/api/auth/callback",
    json={
        "code": "authorization_code_from_auth0",
        "state": "abc123",
        "redirect_uri": "http://localhost:3000/callback"
    }
)

data = response.json()
access_token = data["access_token"]
refresh_token = data["refresh_token"]
user = data["user"]

# Store tokens securely for subsequent API requests
print(f"Authenticated as: {user['name']} ({user['email']})")
print(f"Token expires in: {data['expires_in']} seconds")
```

**JavaScript:**

```javascript
const response = await fetch("http://localhost:5000/api/auth/callback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    code: "authorization_code_from_auth0",
    state: "abc123",
    redirect_uri: "http://localhost:3000/callback"
  })
});

const data = await response.json();

// Verify state matches the value stored during login initiation
const storedState = sessionStorage.getItem("auth_state");
if (storedState !== "abc123") {
  throw new Error("State mismatch — possible CSRF attack");
}

// Store tokens in memory (never in localStorage)
const accessToken = data.access_token;
const refreshToken = data.refresh_token;

console.log(`Authenticated as: ${data.user.name}`);
```

---

## Logout

Ends the user's session by invalidating the refresh token on the server side and returning the Auth0 logout URL. The client should redirect the user to the provided `logout_url` to clear the Auth0 session, completing the logout process on both the application and identity provider sides.

**Method and URL:**

```text
POST /api/auth/logout
```

**Authentication:** Required — Bearer JWT token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `return_to` | string | No | URL to redirect to after the Auth0 logout completes. Defaults to the application root URL. Must be listed in Auth0's Allowed Logout URLs. |

**Request body example:**

```json
{
  "return_to": "http://localhost:3000"
}
```

### Response Body (200 OK)

```json
{
  "logout_url": "https://YOUR_AUTH0_DOMAIN/v2/logout?client_id=YOUR_CLIENT_ID&returnTo=http://localhost:3000",
  "message": "Logout initiated. Redirect to logout_url to complete."
}
```

| Field | Type | Description |
| --- | --- | --- |
| `logout_url` | string | Auth0 logout URL. Redirect the user's browser to this URL to clear the Auth0 session. |
| `message` | string | Human-readable confirmation message. |

> **Logout flow:** To fully log out a user, the client should:
>
> 1. Call this endpoint to invalidate the server-side session and receive the Auth0 logout URL.
> 2. Clear all locally stored tokens (access token and refresh token) from memory.
> 3. Redirect the user's browser to the `logout_url` to clear the Auth0 session and cookies.
>
> Skipping step 3 leaves the Auth0 session active — the user could re-authenticate without entering credentials.

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Logout initiated — redirect URL provided |
| `401 Unauthorized` | Missing or invalid authentication token |
| `500 Internal Server Error` | Server error |

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/auth/logout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "return_to": "http://localhost:3000"
  }'
```

**Python:**

```python
import requests

access_token = "YOUR_ACCESS_TOKEN"

response = requests.post(
    "http://localhost:5000/api/auth/logout",
    headers={"Authorization": f"Bearer {access_token}"},
    json={"return_to": "http://localhost:3000"}
)

data = response.json()
logout_url = data["logout_url"]

# Clear local token storage, then redirect user to logout_url
print(f"Redirect user to complete logout: {logout_url}")
```

**JavaScript:**

```javascript
let accessToken = "YOUR_ACCESS_TOKEN";

const response = await fetch("http://localhost:5000/api/auth/logout", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    return_to: "http://localhost:3000"
  })
});

const data = await response.json();

// Clear tokens from memory
accessToken = null;
refreshToken = null;

// Redirect to Auth0 logout to clear the IdP session
window.location.href = data.logout_url;
```

---

## Refresh Token

Exchanges a valid refresh token for a new access token. This enables silent token renewal without requiring the user to re-authenticate through the login flow. The client should call this endpoint proactively before the current access token expires to maintain a seamless user experience.

**Method and URL:**

```text
POST /api/auth/refresh
```

**Authentication:** Not required — this endpoint uses the refresh token for authorization instead of the access token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `refresh_token` | string | Yes | The refresh token obtained during the initial login via the [Auth0 Callback](#auth0-callback) endpoint. |

**Request body example:**

```json
{
  "refresh_token": "v1.refresh_token_value..."
}
```

### Response Body (200 OK)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

| Field | Type | Description |
| --- | --- | --- |
| `access_token` | string | A new JWT access token. Replace the previous access token with this one for subsequent API requests. |
| `token_type` | string | Always `"Bearer"`. |
| `expires_in` | integer | New access token lifetime in seconds. |

> **Refresh token rotation:** If Auth0 refresh token rotation is enabled (recommended for security),
> a new `refresh_token` field may also be included in the response. When present, the client
> **must** replace the stored refresh token with the new one — the previous refresh token
> is invalidated after use.

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | New access token issued successfully |
| `400 Bad Request` | Missing `refresh_token` field in request body |
| `401 Unauthorized` | Invalid, expired, or revoked refresh token |
| `500 Internal Server Error` | Auth0 token refresh failure or server error |

### Token Refresh Strategy

Implement the following token refresh strategy for a reliable user experience:

- **Proactive refresh:** Refresh the access token when it is within **5 minutes** of expiration. Do not wait for the token to expire and trigger a `401` response.
- **Expired refresh token:** If the refresh token is also expired or revoked, redirect the user to the [login flow](#initiate-login) to re-authenticate.
- **Retry on 401:** When an API call returns `401 Unauthorized`, attempt a single token refresh before prompting the user to re-login. This handles edge cases where the token expired between the proactive check and the API call.
- **Concurrent requests:** If multiple API calls trigger token refresh simultaneously, implement a token refresh lock to avoid multiple concurrent refresh requests.

### Examples

**cURL:**

```bash
curl -X POST "http://localhost:5000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "v1.refresh_token_value..."
  }'
```

**Python:**

```python
import requests
import time

refresh_token = "v1.refresh_token_value..."

response = requests.post(
    "http://localhost:5000/api/auth/refresh",
    json={"refresh_token": refresh_token}
)

if response.status_code == 200:
    data = response.json()
    new_access_token = data["access_token"]
    expires_in = data["expires_in"]

    # Calculate expiration time for proactive refresh scheduling
    expiration_time = time.time() + expires_in
    refresh_at = expiration_time - 300  # Refresh 5 minutes before expiry

    print(f"New token obtained, expires in {expires_in} seconds")

    # If refresh token rotation is enabled, update stored refresh token
    if "refresh_token" in data:
        refresh_token = data["refresh_token"]
elif response.status_code == 401:
    # Refresh token expired — redirect user to login
    print("Refresh token expired. User must re-authenticate.")
```

**JavaScript:**

```javascript
async function refreshAccessToken(currentRefreshToken) {
  const response = await fetch("http://localhost:5000/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: currentRefreshToken })
  });

  if (response.ok) {
    const data = await response.json();

    // Update stored access token
    const newAccessToken = data.access_token;

    // Schedule next refresh 5 minutes before expiration
    const refreshDelay = (data.expires_in - 300) * 1000;
    setTimeout(() => refreshAccessToken(currentRefreshToken), refreshDelay);

    // Handle refresh token rotation if present
    if (data.refresh_token) {
      currentRefreshToken = data.refresh_token;
    }

    return newAccessToken;
  } else if (response.status === 401) {
    // Refresh token expired — redirect to login
    window.location.href = "/login";
    return null;
  }
}
```

---

## Get Current User

Retrieves the currently authenticated user's identity and authentication information based on the JWT access token. This is a lightweight endpoint that returns core identity data — roles, Auth0 identifier, and email verification status.

For the full user profile including preferences, settings, and account details, use [GET /api/users/me](users.md#get-user-profile).

**Method and URL:**

```text
GET /api/auth/me
```

**Authentication:** Required — Bearer JWT token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |

### Request Body

None — this is a `GET` request with no request body.

### Response Body (200 OK)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "Jane Developer",
  "auth0_id": "auth0|507f1f77bcf86cd799439011",
  "roles": ["user"],
  "email_verified": true
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | The user's unique identifier in the application database (MongoDB ObjectId). |
| `email` | string | The user's email address from Auth0. |
| `name` | string | The user's display name. |
| `auth0_id` | string | The user's unique identifier in Auth0 (format: `provider\|id`). |
| `roles` | array of strings | The user's assigned roles (e.g., `["user"]`, `["user", "admin"]`). |
| `email_verified` | boolean | Whether the user's email address has been verified through Auth0. |

> **Distinction from `/api/users/me`:** This endpoint returns identity and authentication-specific information (Auth0 ID, roles, email verification status). For full profile data including user preferences, display settings, and account metadata, use [GET /api/users/me](users.md#get-user-profile).

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | User information retrieved successfully |
| `401 Unauthorized` | Missing or invalid authentication token |
| `500 Internal Server Error` | Server error |

### Examples

**cURL:**

```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Python:**

```python
import requests

access_token = "YOUR_ACCESS_TOKEN"

response = requests.get(
    "http://localhost:5000/api/auth/me",
    headers={"Authorization": f"Bearer {access_token}"}
)

if response.status_code == 200:
    user = response.json()
    print(f"User: {user['name']} ({user['email']})")
    print(f"Roles: {', '.join(user['roles'])}")
    print(f"Email verified: {user['email_verified']}")
elif response.status_code == 401:
    print("Authentication required — token missing or expired")
```

**JavaScript:**

```javascript
const accessToken = "YOUR_ACCESS_TOKEN";

const response = await fetch("http://localhost:5000/api/auth/me", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${accessToken}`
  }
});

if (response.ok) {
  const user = await response.json();
  console.log(`User: ${user.name} (${user.email})`);
  console.log(`Roles: ${user.roles.join(", ")}`);
  console.log(`Email verified: ${user.email_verified}`);
} else if (response.status === 401) {
  console.error("Authentication required — token missing or expired");
}
```

---

## Error Responses

Authentication endpoints return errors in the standard format defined in the [API Overview — Error Handling](overview.md#error-responses) section. The error response body follows this structure:

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided authentication token is invalid or expired"
  }
}
```

### Authentication-Specific Error Codes

The following error codes are specific to the authentication endpoints, in addition to the [common error codes](overview.md#common-error-codes) documented in the API Overview:

| Error Code | HTTP Status | Description | Recommended Action |
| --- | --- | --- | --- |
| `INVALID_TOKEN` | 401 | JWT token is malformed or has an invalid signature | Re-authenticate via the [login flow](#initiate-login) |
| `TOKEN_EXPIRED` | 401 | JWT access token has expired | Use the [Refresh Token](#refresh-token) endpoint to obtain a new access token |
| `REFRESH_TOKEN_EXPIRED` | 401 | Refresh token has expired or been revoked | Re-authenticate via the [login flow](#initiate-login) |
| `INVALID_STATE` | 401 | State parameter mismatch during callback — possible CSRF attack | Restart the [login flow](#initiate-login) with a new state parameter |
| `INVALID_CODE` | 401 | Authorization code is invalid, expired, or has already been used | Restart the [login flow](#initiate-login) to obtain a new authorization code |
| `AUTH0_ERROR` | 500 | Auth0 service returned an error during token exchange or validation | Verify Auth0 configuration in `.env`, check Auth0 service status, and retry |
| `CALLBACK_MISMATCH` | 400 | The callback URL in the request does not match a registered URL in Auth0 | Register the URL in the Auth0 dashboard under Allowed Callback URLs |

### Error Response Examples

**Invalid or expired token (401):**

```json
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "The access token has expired. Use the refresh token endpoint to obtain a new access token."
  }
}
```

**State mismatch during callback (401):**

```json
{
  "error": {
    "code": "INVALID_STATE",
    "message": "The state parameter does not match the expected value. This may indicate a CSRF attack. Please restart the login flow."
  }
}
```

**Auth0 service error (500):**

```json
{
  "error": {
    "code": "AUTH0_ERROR",
    "message": "Failed to exchange authorization code with Auth0. Verify your Auth0 configuration and try again."
  }
}
```

### Related Resources

- [API Overview — Error Handling](overview.md#error-responses) for the complete error response format and standard HTTP status codes
- [API Overview — Rate Limiting](overview.md#rate-limiting) for authentication endpoint rate limits (20 requests per minute)
- [Authentication Guide](../guides/authentication.md) for Auth0 setup, MFA configuration, and troubleshooting
- [Troubleshooting — Authentication Issues](../troubleshooting.md#authentication-issues) for common authentication error resolution steps
