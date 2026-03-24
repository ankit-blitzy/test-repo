# API Overview

This document describes the conventions, authentication, error handling, and shared patterns used across all Todo Application API endpoints.

The Todo Application API follows industry-standard RESTful design principles:

- **Resource-oriented design** — endpoints represent resources (todos, users) and use standard HTTP methods for operations
- **JSON request and response bodies** — all data exchange uses `Content-Type: application/json`
- **Standard HTTP methods** — `GET` (read), `POST` (create), `PUT` (full update), `PATCH` (partial update), `DELETE` (remove) for CRUD operations
- **Standard HTTP status codes** — meaningful status codes for success (`2xx`), client errors (`4xx`), and server errors (`5xx`)
- **Stateless authentication** — every request is authenticated independently via JWT Bearer tokens issued by Auth0

*Source: Tech Spec Sections 6.1, 6.3*

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Request Format](#request-format)
- [Response Format](#response-format)
- [Pagination](#pagination)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)
- [API Endpoints Summary](#api-endpoints-summary)

---

## Base URL

All API endpoints are relative to the base URL. The base URL varies by environment:

| Environment | Base URL |
| --- | --- |
| Local Development | `http://localhost:5000/api` |
| Docker Development | `http://localhost:5000/api` |
| Staging | `https://staging-api.your-domain.com/api` |
| Production | `https://api.your-domain.com/api` |

> **Note:** All endpoint documentation in this reference uses the local development base URL (`http://localhost:5000`). Replace with the appropriate base URL for your environment.

The current API is version 1 (v1). When versioning is implemented, endpoints will be prefixed with `/api/v1/`. Currently, the API uses `/api/` without a version prefix.

---

## Authentication

The API uses Bearer token authentication with JSON Web Tokens (JWT) issued by Auth0.

### Obtaining a Token

To obtain an access token, complete the OAuth 2.0 Authorization Code flow:

1. Initiate login via `POST /api/auth/login`
2. Complete the Auth0 authentication flow (user enters credentials on the Auth0 login page)
3. Exchange the authorization code via `POST /api/auth/callback`
4. Receive the access token in the response

See [Authentication Endpoints](auth.md) for full endpoint details.

### Authenticating Requests

Include the access token in the `Authorization` header using the `Bearer` scheme:

```text
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

Example request with authentication:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/todos
```

### Token Lifecycle

- Access tokens expire after **24 hours** (86400 seconds)
- Use the refresh token endpoint (`POST /api/auth/refresh`) to obtain a new access token before or after expiration
- If the refresh token is also expired, the user must re-authenticate through the login flow

### Unauthenticated Requests

Endpoints that require authentication return `401 Unauthorized` if no token or an invalid token is provided. Only the following endpoints accept unauthenticated requests:

- `POST /api/auth/login` — initiates the login flow
- `POST /api/auth/callback` — completes the Auth0 callback
- `POST /api/auth/refresh` — refreshes an access token using a refresh token

See the [Authentication Guide](../guides/authentication.md) for complete Auth0 setup and configuration.

---

## Request Format

### Content Type

All requests that include a body must use `Content-Type: application/json`.

### Common Request Headers

| Header | Value | Required | Description |
| --- | --- | --- | --- |
| `Authorization` | `Bearer <token>` | Yes (most endpoints) | JWT access token for authentication |
| `Content-Type` | `application/json` | Yes (POST, PUT, PATCH) | Request body content type |
| `Accept` | `application/json` | Optional | Expected response format (default) |

### Request Body Conventions

- All field names use `snake_case` convention
- Dates and timestamps use ISO 8601 format (e.g., `2026-03-24T10:30:00Z`)
- Boolean values use JSON `true`/`false` (not strings)
- Optional fields can be omitted from the request body (null values are also accepted)
- Arrays are represented as JSON arrays

### Query Parameter Conventions

- Multiple values for the same parameter are comma-separated (e.g., `tags=work,personal`)
- Boolean query parameters accept `true`/`false` strings
- Pagination parameters: `page` (1-indexed) and `limit` (items per page)

---

## Response Format

### Content Type

All responses use `Content-Type: application/json`.

### Successful Response Patterns

**Single resource** (e.g., `GET /api/todos/:id`):

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Example todo",
  "completed": false,
  "created_at": "2026-03-24T10:30:00Z",
  "updated_at": "2026-03-24T10:30:00Z"
}
```

**Resource collection** (e.g., `GET /api/todos`):

```json
{
  "data": [
    { "id": "507f1f77bcf86cd799439011", "title": "First todo" },
    { "id": "507f1f77bcf86cd799439012", "title": "Second todo" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

**Created resource** (`201 Created`):

Returns the full created resource object with server-generated fields (`id`, `created_at`, `updated_at`).

**No content** (`204 No Content`):

Empty response body. Used for successful `DELETE` operations.

### Response Field Conventions

- All field names use `snake_case`
- Timestamps are ISO 8601 format in UTC (e.g., `2026-03-24T10:30:00Z`)
- IDs are MongoDB ObjectId strings (24-character hexadecimal)
- Null values are represented as JSON `null`

---

## Pagination

List endpoints return paginated results with metadata.

### Query Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | `1` | Page number (1-indexed) |
| `limit` | integer | `20` | Items per page (max: 100) |

### Pagination Metadata

All list responses include a `pagination` object with the following fields:

| Field | Type | Description |
| --- | --- | --- |
| `pagination.page` | integer | Current page number |
| `pagination.limit` | integer | Items per page |
| `pagination.total` | integer | Total number of items matching the query |
| `pagination.total_pages` | integer | Total number of pages |
| `pagination.has_next` | boolean | Whether a next page exists |
| `pagination.has_prev` | boolean | Whether a previous page exists |

### Example

```bash
# Get page 2 with 10 items per page
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "http://localhost:5000/api/todos?page=2&limit=10"
```

---

## Error Responses

When an error occurs, the API returns a JSON error response with a consistent structure.

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error message"
      }
    ]
  }
}
```

**Fields:**

- `error.code` — Machine-readable error code (uppercase, underscore-separated)
- `error.message` — Human-readable error description
- `error.details` — Optional array of field-level validation errors (present for `400`/`422` responses)

### Standard HTTP Status Codes

| Status Code | Meaning | Description |
| --- | --- | --- |
| `200 OK` | Success | Request processed successfully |
| `201 Created` | Created | Resource created successfully |
| `204 No Content` | Deleted | Resource deleted successfully (no response body) |
| `400 Bad Request` | Client Error | Invalid request body, missing required fields, malformed JSON |
| `401 Unauthorized` | Auth Error | Missing, invalid, or expired authentication token |
| `403 Forbidden` | Access Denied | Authenticated but insufficient permissions (e.g., accessing another user's resource) |
| `404 Not Found` | Not Found | Requested resource does not exist |
| `409 Conflict` | Conflict | Resource conflict (e.g., duplicate entry) |
| `422 Unprocessable Entity` | Validation Error | Request body is well-formed but fails business validation rules |
| `429 Too Many Requests` | Rate Limited | Too many requests in a given time period |
| `500 Internal Server Error` | Server Error | Unexpected server-side failure |
| `503 Service Unavailable` | Service Down | Dependent service unavailable (e.g., database, Auth0, LLM provider) |

### Common Error Codes

| Error Code | HTTP Status | Description |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400/422 | Request validation failed |
| `MISSING_FIELD` | 400 | Required field is missing |
| `INVALID_FORMAT` | 400 | Field value has invalid format |
| `INVALID_TOKEN` | 401 | JWT token is invalid |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | External service unavailable |

See [Troubleshooting](../troubleshooting.md) for common error resolution steps.

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse and ensure fair usage.

### Rate Limit Tiers

| Endpoint Category | Rate Limit | Window |
| --- | --- | --- |
| CRUD endpoints (todos, users) | 100 requests | Per minute |
| Authentication endpoints | 20 requests | Per minute |
| AI processing endpoints | 10 requests | Per minute |

### Rate Limit Headers

The following headers are included in all API responses:

| Header | Description |
| --- | --- |
| `X-RateLimit-Limit` | Maximum requests allowed in the current window |
| `X-RateLimit-Remaining` | Remaining requests in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the rate limit window resets |

### Rate Limit Exceeded Response

When the rate limit is exceeded, the API returns a `429 Too Many Requests` response:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please retry after 45 seconds.",
    "retry_after": 45
  }
}
```

### Best Practices

- Implement exponential backoff for retries when receiving `429` responses
- Monitor the `X-RateLimit-Remaining` header to preemptively throttle requests before hitting the limit
- Cache responses where appropriate to reduce the number of API calls

---

## API Endpoints Summary

The following table lists all available API endpoints across four domains. Each endpoint links to its detailed reference documentation.

| Method | Endpoint | Description | Auth Required | Reference |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Initiate login flow | No | [Auth Endpoints](auth.md) |
| `POST` | `/api/auth/callback` | Auth0 callback handler | No | [Auth Endpoints](auth.md) |
| `POST` | `/api/auth/logout` | End user session | Yes | [Auth Endpoints](auth.md) |
| `POST` | `/api/auth/refresh` | Refresh access token | No | [Auth Endpoints](auth.md) |
| `GET` | `/api/auth/me` | Get current user info | Yes | [Auth Endpoints](auth.md) |
| `POST` | `/api/todos` | Create a to-do item | Yes | [Todo Endpoints](todos.md) |
| `GET` | `/api/todos` | List to-do items (paginated) | Yes | [Todo Endpoints](todos.md) |
| `GET` | `/api/todos/:id` | Get to-do item by ID | Yes | [Todo Endpoints](todos.md) |
| `PUT` | `/api/todos/:id` | Update to-do item (full) | Yes | [Todo Endpoints](todos.md) |
| `PATCH` | `/api/todos/:id` | Update to-do item (partial) | Yes | [Todo Endpoints](todos.md) |
| `DELETE` | `/api/todos/:id` | Delete to-do item | Yes | [Todo Endpoints](todos.md) |
| `GET` | `/api/users/me` | Get user profile | Yes | [User Endpoints](users.md) |
| `PUT` | `/api/users/me` | Update user profile | Yes | [User Endpoints](users.md) |
| `DELETE` | `/api/users/me` | Delete user account | Yes | [User Endpoints](users.md) |
| `POST` | `/api/ai/query` | Simple AI query | Yes | [AI Endpoints](ai.md) |
| `POST` | `/api/ai/rag` | RAG-based AI query | Yes | [AI Endpoints](ai.md) |
| `POST` | `/api/ai/agent` | Multi-step AI agent | Yes | [AI Endpoints](ai.md) |

**Total: 17 endpoints** across 4 domains (Auth: 5, Todos: 6, Users: 3, AI: 3)

*Source: Tech Spec Sections 6.1, 6.3*
