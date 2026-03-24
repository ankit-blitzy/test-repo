# cURL Examples

Copy-paste-ready cURL commands for interacting with every endpoint in the Todo Application API.

This reference covers all 17 API endpoints organized by domain: authentication, to-do operations, user profile management, and AI processing. Each command is ready to use in your terminal with minimal modification — just replace the placeholder values with your actual credentials and configuration.

*Source: Tech Spec Section 6.1*

## Prerequisites

Before using these commands, ensure the following:

- **cURL** installed (version 7.0 or later) — verify with `curl --version`
- **A running Todo Application instance** — either via local development (`http://localhost:5000`) or Docker Compose setup
- **A valid Auth0 account** configured for the application
- **jq** (optional) — for pretty-printing JSON responses — install via `brew install jq` (macOS), `apt-get install jq` (Linux), or `choco install jq` (Windows)

Replace all placeholder values (`YOUR_ACCESS_TOKEN`, `YOUR_AUTH0_DOMAIN`, `YOUR_AUTH0_CLIENT_ID`, `YOUR_REFRESH_TOKEN`) with your actual values before running commands.

## How to Use This Guide

- Each section corresponds to an API domain: [Authentication](#authentication), [To-Do Operations](#to-do-operations), [User Profile](#user-profile), and [AI Processing](#ai-processing)
- Commands use the local development base URL `http://localhost:5000`
- All authenticated endpoints require a Bearer token in the `Authorization` header
- Export your token to a shell variable for convenience so you do not have to repeat it in every command
- See the [API Overview](../api-reference/overview.md) for complete API conventions, error handling, and rate limiting details

## Table of Contents

- [Setup](#setup)
- [Authentication](#authentication)
  - [Initiate Login](#initiate-login)
  - [Exchange Authorization Code](#exchange-authorization-code)
  - [Get Current User (Auth)](#get-current-user-auth)
  - [Refresh Token](#refresh-token)
  - [Logout](#logout)
- [To-Do Operations](#to-do-operations)
  - [Create a To-Do](#create-a-to-do)
  - [Create a Minimal To-Do](#create-a-minimal-to-do)
  - [List All To-Dos](#list-all-to-dos)
  - [List To-Dos with Filtering](#list-to-dos-with-filtering)
  - [List To-Dos with Pagination](#list-to-dos-with-pagination)
  - [Search To-Dos](#search-to-dos)
  - [Filter by Tags](#filter-by-tags)
  - [Get a Single To-Do](#get-a-single-to-do)
  - [Update a To-Do (Full Replacement)](#update-a-to-do-full-replacement)
  - [Partial Update a To-Do](#partial-update-a-to-do)
  - [Change To-Do Priority](#change-to-do-priority)
  - [Delete a To-Do](#delete-a-to-do)
- [User Profile](#user-profile)
  - [Get User Profile](#get-user-profile)
  - [Update User Profile](#update-user-profile)
  - [Update Only Preferences](#update-only-preferences)
  - [Delete User Account](#delete-user-account)
- [AI Processing](#ai-processing)
  - [Simple Query](#simple-query)
  - [Simple Query with Context](#simple-query-with-context)
  - [RAG Query](#rag-query)
  - [RAG Query with Filters](#rag-query-with-filters)
  - [Agent Query (Read-Only)](#agent-query-read-only)
  - [Agent Query with Mutations](#agent-query-with-mutations)
- [Useful Patterns](#useful-patterns)
- [Error Handling](#error-handling)

---

## Setup

Set environment variables so you do not have to repeat common values in every command.

### Environment Variables

```bash
# Set your base URL
export BASE_URL="http://localhost:5000"

# Set your access token (obtained via the authentication flow below)
export TOKEN="YOUR_ACCESS_TOKEN"

# Set Auth0 configuration (used for login flows)
export AUTH0_DOMAIN="YOUR_AUTH0_DOMAIN"
export AUTH0_CLIENT_ID="YOUR_AUTH0_CLIENT_ID"
```

### Verify Connectivity

Confirm the API is reachable before running further commands:

```bash
# Verify the API is running
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/todos
# Expected: 401 (if not authenticated) or 200 (if authenticated)
```

> **Note:** All commands below use `$BASE_URL` and `$TOKEN` variables. If you are not using environment variables, replace `$BASE_URL` with `http://localhost:5000` and `$TOKEN` with your actual access token.

See the [Installation Guide](../getting-started/installation.md) for full setup instructions and the [Configuration Reference](../getting-started/configuration.md) for all environment variable options.

---

## Authentication

These commands cover the full OAuth 2.0 login lifecycle: initiating login, exchanging an authorization code for tokens, retrieving the current user, refreshing expired tokens, and logging out.

See [Authentication Endpoints](../api-reference/auth.md) for complete endpoint documentation including request schemas, response field descriptions, and status codes.

### Initiate Login

Start the OAuth 2.0 Authorization Code flow. The response contains an `authorization_url` — open it in a browser to authenticate with Auth0.

```bash
# Initiate the OAuth 2.0 login flow
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "redirect_uri": "http://localhost:3000/callback",
    "screen_hint": "login"
  }'
```

**Expected response (200 OK):**

```json
{
  "authorization_url": "https://YOUR_AUTH0_DOMAIN/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/callback&scope=openid%20profile%20email&state=abc123&code_challenge=xyz789&code_challenge_method=S256",
  "state": "abc123"
}
```

> **Next step:** Open the `authorization_url` in a browser to complete authentication. After login, Auth0 redirects to your callback URL with a `code` and `state` parameter in the query string.

### Exchange Authorization Code

Exchange the authorization code from the Auth0 redirect for access and refresh tokens.

```bash
# Exchange the authorization code for tokens
curl -X POST $BASE_URL/api/auth/callback \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AUTHORIZATION_CODE_FROM_AUTH0",
    "state": "STATE_FROM_LOGIN_RESPONSE",
    "redirect_uri": "http://localhost:3000/callback"
  }'
```

**Expected response (200 OK):**

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

> **Important:** Save the `access_token` — you need it for all authenticated requests. Export it to your shell for convenience:

```bash
# Export the token for use in subsequent commands
export TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get Current User (Auth)

Retrieve the authenticated user's identity and authentication information from the JWT token.

```bash
# Get the currently authenticated user
curl -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response (200 OK):**

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

### Refresh Token

Obtain a new access token using a refresh token when the current access token has expired or is about to expire. Access tokens expire after 24 hours (86400 seconds).

```bash
# Refresh an expired access token
curl -X POST $BASE_URL/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

**Expected response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

> **Tip:** Update your exported `TOKEN` variable after refreshing:

```bash
export TOKEN="new_access_token_from_response"
```

### Logout

End the user session and receive the Auth0 logout URL. Redirect to the returned URL in a browser to fully clear the Auth0 session.

```bash
# Logout and get Auth0 logout URL
curl -X POST $BASE_URL/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "return_to": "http://localhost:3000"
  }'
```

**Expected response (200 OK):**

```json
{
  "logout_url": "https://YOUR_AUTH0_DOMAIN/v2/logout?client_id=YOUR_CLIENT_ID&returnTo=http://localhost:3000",
  "message": "Logout initiated. Redirect to logout_url to complete."
}
```

> **Complete the logout:** Open the `logout_url` in a browser to clear the Auth0 session. Without this step, the Auth0 session remains active and the user can re-authenticate without entering credentials.

---

## To-Do Operations

These commands cover the full CRUD lifecycle for to-do items: creating, listing, retrieving, updating, and deleting.

See [To-Do Endpoints](../api-reference/todos.md) for complete endpoint documentation including the to-do resource schema, request/response field descriptions, and all status codes.

### Create a To-Do

Create a new to-do item with all available fields.

```bash
# Create a new todo item
curl -X POST $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review pull request",
    "description": "Review the authentication module PR #42",
    "priority": "high",
    "due_date": "2026-04-01T17:00:00Z",
    "tags": ["work", "code-review"]
  }'
```

**Expected response (201 Created):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Review pull request",
  "description": "Review the authentication module PR #42",
  "completed": false,
  "priority": "high",
  "due_date": "2026-04-01T17:00:00Z",
  "tags": ["work", "code-review"],
  "created_at": "2026-03-24T10:30:00Z",
  "updated_at": "2026-03-24T10:30:00Z",
  "user_id": "507f1f77bcf86cd799439012"
}
```

### Create a Minimal To-Do

Create a to-do item with only the required `title` field. All other fields use their defaults: `priority` defaults to `medium`, `completed` defaults to `false`.

```bash
# Create a todo with only required fields
curl -X POST $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries"
  }'
```

### List All To-Dos

Retrieve a paginated list of all to-do items for the authenticated user. Returns page 1 with 20 items per page by default.

```bash
# List all todos (default: page 1, 20 items)
curl -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response (200 OK):**

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Review pull request",
      "description": "Review the authentication module PR #42",
      "completed": false,
      "priority": "high",
      "due_date": "2026-04-01T17:00:00Z",
      "tags": ["work", "code-review"],
      "created_at": "2026-03-24T10:30:00Z",
      "updated_at": "2026-03-24T10:30:00Z",
      "user_id": "507f1f77bcf86cd799439012"
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Buy groceries",
      "description": null,
      "completed": false,
      "priority": "medium",
      "due_date": null,
      "tags": [],
      "created_at": "2026-03-24T11:00:00Z",
      "updated_at": "2026-03-24T11:00:00Z",
      "user_id": "507f1f77bcf86cd799439012"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

### List To-Dos with Filtering

Filter to-do items by priority, completion status, and sort order.

```bash
# List high-priority incomplete todos, sorted by due date
curl -X GET "$BASE_URL/api/todos?priority=high&completed=false&sort=due_date&order=asc" \
  -H "Authorization: Bearer $TOKEN"
```

### List To-Dos with Pagination

Control page size and navigate through large result sets.

```bash
# Get page 2 with 10 items per page
curl -X GET "$BASE_URL/api/todos?page=2&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Search To-Dos

Perform full-text search across to-do titles and descriptions.

```bash
# Search for todos containing "review"
curl -X GET "$BASE_URL/api/todos?search=review" \
  -H "Authorization: Bearer $TOKEN"
```

### Filter by Tags

Retrieve to-do items matching one or more tags. Provide multiple tags as a comma-separated list.

```bash
# Filter todos by tags
curl -X GET "$BASE_URL/api/todos?tags=work,urgent" \
  -H "Authorization: Bearer $TOKEN"
```

### Get a Single To-Do

Retrieve a specific to-do item by its MongoDB ObjectId.

```bash
# Get a specific todo by ID
curl -X GET $BASE_URL/api/todos/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

### Update a To-Do (Full Replacement)

Replace all fields of a to-do item. All writable fields should be included in the request body — omitted fields may be reset to defaults.

```bash
# Update all fields of a todo (PUT — full replacement)
curl -X PUT $BASE_URL/api/todos/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review pull request #42",
    "description": "Review the updated authentication module",
    "priority": "high",
    "completed": false,
    "due_date": "2026-04-02T17:00:00Z",
    "tags": ["work", "code-review", "urgent"]
  }'
```

### Partial Update a To-Do

Update only specific fields using PATCH. Only the fields included in the request body are modified — all other fields remain unchanged.

```bash
# Mark a todo as completed (PATCH — partial update)
curl -X PATCH $BASE_URL/api/todos/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Change To-Do Priority

Another partial update example — change only the priority level.

```bash
# Change priority only
curl -X PATCH $BASE_URL/api/todos/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "low"
  }'
```

### Delete a To-Do

Permanently remove a to-do item. Returns `204 No Content` with an empty response body on success.

```bash
# Delete a todo (returns 204 No Content)
curl -X DELETE $BASE_URL/api/todos/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer $TOKEN"
```

---

## User Profile

These commands manage the authenticated user's profile information and preferences.

See [User Endpoints](../api-reference/users.md) for complete endpoint documentation including the user resource schema, field descriptions, and all status codes.

### Get User Profile

Retrieve the authenticated user's full profile including display name, email, avatar, and preferences.

```bash
# Get the authenticated user's profile
curl -X GET $BASE_URL/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response (200 OK):**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "Jane Developer",
  "avatar_url": "https://avatars.example.com/jane.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en",
    "default_priority": "medium",
    "timezone": "America/New_York"
  },
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-20T14:22:00Z",
  "last_login": "2026-03-24T09:15:00Z"
}
```

### Update User Profile

Update the user's display name and preferences. Only fields included in the request body are modified — omitted fields retain their current values.

```bash
# Update user profile and preferences
curl -X PUT $BASE_URL/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "default_priority": "high",
      "timezone": "America/New_York"
    }
  }'
```

### Update Only Preferences

Update a single preference without affecting other profile fields or preference values.

```bash
# Update only the theme preference
curl -X PUT $BASE_URL/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "theme": "light"
    }
  }'
```

### Delete User Account

Permanently delete the authenticated user's account and all associated data.

> ⚠️ **Warning:** This permanently deletes your account and all associated data, including all to-do items. This action cannot be undone.

```bash
# Permanently delete user account (IRREVERSIBLE)
curl -X DELETE $BASE_URL/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:** `204 No Content` (empty response body).

---

## AI Processing

These commands interact with the AI-powered processing engine built on LangChain. Three processing patterns are available — Simple Query, RAG (Retrieval-Augmented Generation), and Multi-Step Agent — each optimized for different use cases and complexity levels.

See [AI Endpoints](../api-reference/ai.md) for complete endpoint documentation including request schemas, response metadata, token usage, and rate limiting details.

> **Rate limit:** AI endpoints are limited to **10 requests per minute** — stricter than CRUD endpoints due to LLM provider costs.

### Simple Query

Ask the AI a straightforward question or request task suggestions. This is the fastest AI processing pattern with typical response times of 1–3 seconds.

```bash
# Ask the AI for task suggestions
curl -X POST $BASE_URL/api/ai/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Suggest three subtasks for my Launch marketing campaign todo",
    "max_tokens": 500,
    "temperature": 0.7
  }'
```

**Expected response (200 OK):**

```json
{
  "response": "Here are three subtasks for your 'Launch marketing campaign' todo:\n\n1. **Design social media assets** — Create graphics and copy for Twitter, LinkedIn, and Instagram posts\n2. **Draft email campaign** — Write the announcement email and set up the email automation sequence\n3. **Prepare analytics dashboard** — Set up tracking for campaign KPIs including click-through rates and conversions",
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 1850,
    "tokens_used": {
      "prompt": 125,
      "completion": 180,
      "total": 305
    },
    "processing_pattern": "simple"
  }
}
```

### Simple Query with Context

Reference a specific to-do item in the query by providing its ID as context.

```bash
# Ask the AI about a specific todo
curl -X POST $BASE_URL/api/ai/query \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How can I break down this task into smaller steps?",
    "context": {
      "todo_id": "507f1f77bcf86cd799439011",
      "include_history": true
    }
  }'
```

### RAG Query

Query using Retrieval-Augmented Generation. The system retrieves relevant to-do items and documents from the vector store to provide context-aware responses. Typical response times are 2–5 seconds.

```bash
# Query using Retrieval-Augmented Generation
curl -X POST $BASE_URL/api/ai/rag \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are my high priority tasks due this week?",
    "collection": "todos",
    "top_k": 10,
    "temperature": 0.3
  }'
```

**Expected response (200 OK):**

```json
{
  "response": "Based on your to-do items, you have 3 high-priority tasks due this week:\n\n1. **Review pull request #42** (Due: March 25) — Authentication module review\n2. **Deploy staging environment** (Due: March 26) — Infrastructure setup\n3. **Client presentation prep** (Due: March 27) — Q1 results presentation",
  "sources": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Review pull request #42",
      "relevance_score": 0.95
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Deploy staging environment",
      "relevance_score": 0.91
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "title": "Client presentation prep",
      "relevance_score": 0.88
    }
  ],
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 3200,
    "tokens_used": {
      "prompt": 850,
      "completion": 220,
      "total": 1070
    },
    "processing_pattern": "rag",
    "documents_retrieved": 3
  }
}
```

### RAG Query with Filters

Narrow the document retrieval scope using metadata filters for more targeted results.

```bash
# RAG query filtering by completion status and tags
curl -X POST $BASE_URL/api/ai/rag \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Summarize my incomplete work tasks",
    "collection": "todos",
    "top_k": 15,
    "context": {
      "filters": {
        "completed": false,
        "tags": ["work"]
      }
    }
  }'
```

### Agent Query (Read-Only)

Execute a multi-step AI agent for complex analysis tasks. With `allow_mutations` set to `false` (the default), the agent performs read-only analysis without modifying any data. Typical response times are 5–30 seconds depending on complexity.

```bash
# Multi-step agent query (read-only mode)
curl -X POST $BASE_URL/api/ai/agent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Organize my incomplete todos by priority and create a daily schedule for this week",
    "context": {
      "allow_mutations": false,
      "max_steps": 5
    },
    "max_tokens": 2000
  }'
```

**Expected response (200 OK):**

```json
{
  "response": "Here is your organized weekly schedule based on your incomplete to-do items:\n\n**Monday:**\n- Review pull request #42 (High priority)\n- Update API documentation (Medium)\n\n**Tuesday:**\n- Deploy staging environment (High)\n- Fix login bug #38 (Medium)\n\n**Wednesday:**\n- Client presentation prep (High)\n- Write unit tests for auth module (Medium)",
  "steps": [
    {
      "step": 1,
      "action": "retrieve_todos",
      "description": "Retrieved 12 incomplete todos",
      "status": "completed"
    },
    {
      "step": 2,
      "action": "analyze",
      "description": "Sorted todos by priority and due date",
      "status": "completed"
    },
    {
      "step": 3,
      "action": "generate_schedule",
      "description": "Created weekly schedule based on priorities and deadlines",
      "status": "completed"
    }
  ],
  "mutations": [],
  "metadata": {
    "model": "gpt-4",
    "processing_time_ms": 12500,
    "tokens_used": {
      "prompt": 2200,
      "completion": 1500,
      "total": 3700
    },
    "processing_pattern": "agent",
    "steps_executed": 3,
    "steps_limit": 5
  }
}
```

### Agent Query with Mutations

Execute a multi-step AI agent that can create, update, and delete to-do items on your behalf.

> ⚠️ **Caution:** When `allow_mutations` is `true`, the agent can create, update, and delete to-do items on your behalf. Review the `mutations` array in the response to verify all changes made by the agent.

```bash
# Multi-step agent query that can create/modify todos
curl -X POST $BASE_URL/api/ai/agent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Create a project plan with 5 subtasks for launching the new website",
    "context": {
      "allow_mutations": true,
      "max_steps": 8
    },
    "max_tokens": 3000
  }'
```

---

## Useful Patterns

Helpful cURL techniques for working with the Todo Application API.

### Pretty-Print JSON Responses

Pipe the response through `jq` for human-readable formatted output.

```bash
# Pipe through jq for formatted output
curl -s -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" | jq .
```

If `jq` is not installed, use Python as an alternative:

```bash
# Alternative: use Python for JSON formatting
curl -s -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Save Response to File

Save the raw JSON response to a file for later analysis.

```bash
# Save API response to a file
curl -s -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -o todos.json
```

### Check Response Status Code Only

Verify an endpoint returns the expected HTTP status code without displaying the response body.

```bash
# Get only the HTTP status code
curl -s -o /dev/null -w "%{http_code}" \
  -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

### Include Response Headers

Display response headers alongside the body. Useful for inspecting rate limit headers and content type.

```bash
# Show response headers (useful for rate limiting info)
curl -i -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

### Verbose Mode for Debugging

Display the full HTTP request and response including headers, TLS handshake, and timing information.

```bash
# Full request/response debugging
curl -v -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN"
```

### Batch Create Multiple To-Dos

Use a bash loop to create multiple to-do items from a list of titles.

```bash
# Create multiple todos using a bash loop
for title in "Task 1" "Task 2" "Task 3"; do
  curl -s -X POST $BASE_URL/api/todos \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"$title\"}"
  echo ""
done
```

---

## Error Handling

Common error responses you may encounter and how to interpret them. For detailed troubleshooting steps, see the [Troubleshooting Guide](../troubleshooting.md).

See the [API Overview — Error Responses](../api-reference/overview.md#error-responses) for the complete error response format and all standard HTTP status codes.

### 401 Unauthorized — Missing Authorization Header

Sending a request to a protected endpoint without the `Authorization` header results in a `401` response.

```bash
# This will return 401 Unauthorized
curl -X GET $BASE_URL/api/todos
```

**Expected error response:**

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Missing or invalid authentication token"
  }
}
```

**Fix:** Include the `Authorization: Bearer $TOKEN` header in your request.

### 400 Bad Request — Invalid Request Body

Sending a request with missing required fields or malformed JSON results in a `400` response.

```bash
# This will return 400 Bad Request (missing required "title" field)
curl -X POST $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "No title provided"}'
```

**Expected error response:**

```json
{
  "error": {
    "code": "MISSING_FIELD",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

**Fix:** Include all required fields in the request body. For the `POST /api/todos` endpoint, `title` is the only required field.

### 404 Not Found — Resource Does Not Exist

Requesting a to-do item or resource that does not exist returns a `404` response.

```bash
# This will return 404 Not Found
curl -X GET $BASE_URL/api/todos/000000000000000000000000 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected error response:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

**Fix:** Verify the resource ID is correct. Use the [List All To-Dos](#list-all-to-dos) command to see available to-do items and their IDs.

### 429 Too Many Requests — Rate Limit Exceeded

Sending too many requests in a short period triggers rate limiting.

```bash
# Check rate limit headers to monitor your usage
curl -i -X GET $BASE_URL/api/todos \
  -H "Authorization: Bearer $TOKEN" 2>&1 | grep -i "x-ratelimit"
```

**Expected rate limit headers:**

```text
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1711276800
```

**Fix:** Wait until the rate limit window resets (check the `X-RateLimit-Reset` header) or implement exponential backoff in your scripts. AI endpoints have a stricter limit of 10 requests per minute.

---

## Related Documentation

- [API Overview](../api-reference/overview.md) — API conventions, authentication, error handling, and rate limiting
- [To-Do Endpoints](../api-reference/todos.md) — Complete to-do CRUD endpoint reference
- [User Endpoints](../api-reference/users.md) — User profile management endpoint reference
- [Authentication Endpoints](../api-reference/auth.md) — Authentication flow endpoint reference
- [AI Endpoints](../api-reference/ai.md) — AI processing endpoint reference
- [Troubleshooting Guide](../troubleshooting.md) — Common issues and resolution steps
- [Python Client Examples](python-client.md) — Python integration examples using requests/httpx
- [JavaScript Client Examples](javascript-client.md) — JavaScript/TypeScript integration examples using fetch/axios
