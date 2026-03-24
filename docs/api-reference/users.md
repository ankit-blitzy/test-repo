# User Endpoints

REST API reference for managing user profiles and account settings.

All endpoints in this section are prefixed with `/api/users`. Every user endpoint requires a valid Bearer JWT token in the `Authorization` header.
See the [API Overview](overview.md) for authentication conventions, request/response formats, and error handling.
See [Authentication Endpoints](auth.md) for token acquisition.

*Source: Tech Spec Sections 6.1 (Core Services Architecture — UserService), 6.2 (Database Design — users collection)*

## User Resource

The User resource represents a registered account in the Todo Application. Each user has a profile, configurable preferences, and timestamp metadata.

```json
{
  "id": "string (ObjectId)",
  "email": "string (unique, required)",
  "name": "string (required)",
  "avatar_url": "string (optional)",
  "preferences": {
    "theme": "string (light | dark, default: light)",
    "notifications": "boolean (default: true)",
    "default_priority": "string (low | medium | high, default: medium)",
    "timezone": "string (IANA timezone, default: UTC)"
  },
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)",
  "last_login": "string (ISO 8601 datetime)"
}
```

**Field descriptions:**

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Unique identifier (MongoDB ObjectId, 24-character hex) |
| `email` | string | User's email address. Unique across all accounts. Managed by Auth0 — cannot be changed via the API. |
| `name` | string | User's display name (max 100 characters) |
| `avatar_url` | string | URL to the user's profile picture. May be `null` if not set. |
| `preferences` | object | User-configurable application preferences |
| `preferences.theme` | string | UI color theme: `light` or `dark`. Defaults to `light`. |
| `preferences.notifications` | boolean | Whether in-app notifications are enabled. Defaults to `true`. |
| `preferences.default_priority` | string | Default priority assigned to new to-do items: `low`, `medium`, or `high`. Defaults to `medium`. |
| `preferences.timezone` | string | User's timezone in IANA format (e.g., `America/New_York`). Defaults to `UTC`. |
| `created_at` | string | Timestamp when the user account was created (ISO 8601, UTC) |
| `updated_at` | string | Timestamp of the last profile update (ISO 8601, UTC) |
| `last_login` | string | Timestamp of the user's most recent login (ISO 8601, UTC) |

> **Note:** Users are created automatically during the Auth0 authentication flow. There is no explicit user creation endpoint — user records are provisioned on first login via the authentication callback. See [Authentication Endpoints — Auth0 Callback](auth.md#auth0-callback) for details.

## Table of Contents

- [Get User Profile](#get-user-profile)
- [Update User Profile](#update-user-profile)
- [Delete User Account](#delete-user-account)
- [Error Responses](#error-responses)

---

## Get User Profile

Retrieves the authenticated user's profile information. The `/me` path automatically resolves to the current user based on the JWT token — no user ID parameter is needed.

**Method and URL:**

```text
GET /api/users/me
```

**Authentication:** Required — Bearer JWT token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |

### Request Body

None.

### Response Body (200 OK)

The full user profile object:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "Jane Developer",
  "avatar_url": "https://avatars.example.com/jane.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "default_priority": "medium",
    "timezone": "America/New_York"
  },
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-20T14:22:00Z",
  "last_login": "2026-03-24T09:15:00Z"
}
```

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Profile successfully retrieved |
| `401 Unauthorized` | Missing or invalid authentication token |
| `500 Internal Server Error` | Server-side error |

### Examples

**cURL:**

```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Python:**

```python
import requests

url = "http://localhost:5000/api/users/me"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}

response = requests.get(url, headers=headers)
user = response.json()

print(f"Name: {user['name']}")
print(f"Email: {user['email']}")
print(f"Theme: {user['preferences']['theme']}")
```

**JavaScript:**

```javascript
const response = await fetch("http://localhost:5000/api/users/me", {
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
  }
});

const user = await response.json();
console.log(`Name: ${user.name}`);
console.log(`Email: ${user.email}`);
console.log(`Theme: ${user.preferences.theme}`);
```

---

## Update User Profile

Updates the authenticated user's profile information. Only the fields provided in the request body are updated — omitted fields retain their current values (merge behavior).
The `preferences` object also supports partial updates; you can update individual preference fields without overwriting the entire object.

**Method and URL:**

```text
PUT /api/users/me
```

**Authentication:** Required — Bearer JWT token.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | No | User's display name (max 100 characters) |
| `avatar_url` | string | No | URL to user's avatar image |
| `preferences` | object | No | User preferences object (partial updates supported) |
| `preferences.theme` | string | No | UI theme: `light` or `dark` |
| `preferences.notifications` | boolean | No | Enable or disable notifications |
| `preferences.default_priority` | string | No | Default priority for new to-do items: `low`, `medium`, or `high` |
| `preferences.timezone` | string | No | User's timezone in IANA format (e.g., `America/New_York`) |

> **Note:** The `email` field cannot be changed through this endpoint. Email addresses are managed by Auth0. To change your email, update it directly in your Auth0 account settings. See the [Authentication Guide](../guides/authentication.md) for details on Auth0 account management.

**Request body example:**

```json
{
  "name": "Jane Developer",
  "preferences": {
    "theme": "dark",
    "default_priority": "high"
  }
}
```

### Response Body (200 OK)

The updated user profile object. The `updated_at` timestamp reflects the time of the update:

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "Jane Developer",
  "avatar_url": "https://avatars.example.com/jane.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "default_priority": "high",
    "timezone": "America/New_York"
  },
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-24T11:45:00Z",
  "last_login": "2026-03-24T09:15:00Z"
}
```

### Status Codes

| Status Code | Description |
| --- | --- |
| `200 OK` | Profile successfully updated |
| `400 Bad Request` | Invalid request body (malformed JSON or attempting to change a read-only field such as `email`) |
| `401 Unauthorized` | Missing or invalid authentication token |
| `422 Unprocessable Entity` | Validation failed (e.g., invalid theme value, name exceeding max length, invalid timezone format) |
| `500 Internal Server Error` | Server-side error |

### Examples

**cURL:**

```bash
curl -X PUT http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "preferences": {
      "theme": "dark",
      "default_priority": "high"
    }
  }'
```

**Python:**

```python
import requests

url = "http://localhost:5000/api/users/me"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}
payload = {
    "name": "Jane Developer",
    "preferences": {
        "theme": "dark",
        "default_priority": "high"
    }
}

response = requests.put(url, headers=headers, json=payload)
updated_user = response.json()

print(f"Updated at: {updated_user['updated_at']}")
print(f"Theme: {updated_user['preferences']['theme']}")
print(f"Priority: {updated_user['preferences']['default_priority']}")
```

**JavaScript:**

```javascript
const response = await fetch("http://localhost:5000/api/users/me", {
  method: "PUT",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Jane Developer",
    preferences: {
      theme: "dark",
      default_priority: "high"
    }
  })
});

const updatedUser = await response.json();
console.log(`Updated at: ${updatedUser.updated_at}`);
console.log(`Theme: ${updatedUser.preferences.theme}`);
console.log(`Priority: ${updatedUser.preferences.default_priority}`);
```

---

## Delete User Account

Permanently deletes the authenticated user's account and all associated data, including all to-do items, user preferences, and AI conversation history. This action is irreversible.

**Method and URL:**

```text
DELETE /api/users/me
```

**Authentication:** Required — Bearer JWT token.

> ⚠️ **Warning:** This action permanently deletes your account and all associated data. This includes all to-do items, user preferences, and AI conversation history. This action cannot be undone.

### Request Headers

| Header | Value | Required |
| --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes |

### Request Body

None.

### Response Body (204 No Content)

No response body is returned on successful deletion.

> **Note:** Deleting a user account also triggers cleanup of the corresponding Auth0 user record. After deletion, the access token and refresh token associated with this account are invalidated. Any subsequent API calls using these tokens will return `401 Unauthorized`.

### Status Codes

| Status Code | Description |
| --- | --- |
| `204 No Content` | Account successfully deleted |
| `401 Unauthorized` | Missing or invalid authentication token |
| `500 Internal Server Error` | Server-side error |

### Examples

**cURL:**

```bash
curl -X DELETE http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Python:**

```python
import requests

url = "http://localhost:5000/api/users/me"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}

response = requests.delete(url, headers=headers)

if response.status_code == 204:
    print("Account successfully deleted.")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

**JavaScript:**

```javascript
const response = await fetch("http://localhost:5000/api/users/me", {
  method: "DELETE",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
  }
});

if (response.status === 204) {
  console.log("Account successfully deleted.");
  // Clear local tokens and redirect to home page
  window.location.href = "/";
} else {
  const error = await response.json();
  console.error(`Error: ${error.error.message}`);
}
```

---

## Error Responses

User endpoints return errors in the standard format defined in the [API Overview — Error Responses](overview.md#error-responses).

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid theme value",
    "details": [
      {
        "field": "preferences.theme",
        "message": "Must be one of: light, dark"
      }
    ]
  }
}
```

### Common Error Scenarios

The following table lists error scenarios specific to user endpoints:

| Scenario | Status Code | Error Code | Example Message |
| --- | --- | --- | --- |
| Invalid `theme` value | `422` | `VALIDATION_ERROR` | Must be one of: light, dark |
| Invalid `default_priority` value | `422` | `VALIDATION_ERROR` | Must be one of: low, medium, high |
| `name` exceeds 100 characters | `422` | `VALIDATION_ERROR` | Name must be 100 characters or fewer |
| Invalid `timezone` format | `422` | `VALIDATION_ERROR` | Invalid IANA timezone identifier |
| Attempting to change `email` | `400` | `INVALID_FORMAT` | The email field is read-only and managed by Auth0 |
| Missing or invalid JWT token | `401` | `INVALID_TOKEN` | Missing or invalid authentication token |
| Expired JWT token | `401` | `TOKEN_EXPIRED` | Authentication token has expired |

For the complete error format specification, error codes, and HTTP status code reference, see the [API Overview — Error Responses](overview.md#error-responses).

For troubleshooting authentication errors, see the [Authentication Guide](../guides/authentication.md).

*Source: Tech Spec Sections 6.1, 6.2*
