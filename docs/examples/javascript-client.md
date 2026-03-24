# JavaScript Client Examples

Complete JavaScript and TypeScript integration examples for the Todo Application API using `fetch`, `axios`, and the Auth0 SPA SDK.

These examples demonstrate how to authenticate, perform CRUD operations on to-do items, manage user profiles, and interact with AI-powered endpoints from both browser and Node.js environments.
All code uses modern JavaScript (ES2022+) with async/await and is copy-paste ready — only requiring you to substitute your own configuration values.

*Source: Tech Spec Sections 3.2, 6.1, 7.1*

## Table of Contents

- [Prerequisites](#prerequisites)
- [Library Choices](#library-choices)
- [Setup and Configuration](#setup-and-configuration)
- [Authentication](#authentication)
- [Todo Operations (fetch)](#todo-operations-fetch)
- [Todo Operations (axios)](#todo-operations-axios)
- [User Profile](#user-profile)
- [AI Processing](#ai-processing)
- [Complete API Client Class](#complete-api-client-class)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)

## Prerequisites

Before running these examples, ensure you have:

- **Node.js 18+** (for Node.js examples) or a **modern browser** (Chrome, Firefox, Safari, Edge) for browser examples
- **`axios`** library (optional — for the axios examples): `npm install axios`
- **`@auth0/auth0-spa-js`** (for browser Auth0 integration): `npm install @auth0/auth0-spa-js`
- A **running instance** of the Todo Application (local at `http://localhost:5000` or via Docker)
- A **valid Auth0 account** configured for the application
- Replace all placeholder values (`YOUR_ACCESS_TOKEN`, `YOUR_AUTH0_DOMAIN`, `YOUR_AUTH0_CLIENT_ID`, `YOUR_AUTH0_AUDIENCE`) with your actual configuration values

> **Environment note:** Examples are written in JavaScript with TypeScript type annotations shown separately in the [TypeScript Types](#typescript-types) section. All examples work in both browser and Node.js unless noted otherwise.

**Related documentation:**

- [API Overview](../api-reference/overview.md) — API conventions, authentication, and error handling
- [Authentication Endpoints](../api-reference/auth.md) — Auth endpoint details
- [Authentication Guide](../guides/authentication.md) — Complete Auth0 setup walkthrough
- [Configuration Reference](../getting-started/configuration.md) — Environment variable reference

---

## Library Choices

This document provides examples using three libraries. Choose the one that fits your project:

| Library | Best For | Dependencies |
| --- | --- | --- |
| **`fetch`** | Lightweight integrations, browser-native code, Node.js 18+ | None (built-in) |
| **`axios`** | Complex applications needing interceptors, request cancellation, and automatic JSON parsing | `npm install axios` |
| **Auth0 SPA SDK** | Browser-based single-page applications with OAuth 2.0 PKCE authentication | `npm install @auth0/auth0-spa-js` |

---

## Setup and Configuration

### Install Dependencies

```bash
# For browser applications (React, Vue, Angular, etc.)
npm install @auth0/auth0-spa-js axios

# For Node.js applications
npm install axios dotenv
```

### Configuration Constants

Create a configuration module with your API base URL and Auth0 settings:

```javascript
// config.js — API and Auth0 configuration
const CONFIG = {
  baseUrl: process.env.API_BASE_URL || "http://localhost:5000",
  auth0: {
    domain: process.env.AUTH0_DOMAIN || "YOUR_AUTH0_DOMAIN",
    clientId: process.env.AUTH0_CLIENT_ID || "YOUR_AUTH0_CLIENT_ID",
    audience: process.env.AUTH0_AUDIENCE || "YOUR_AUTH0_AUDIENCE",
    redirectUri: (typeof window !== "undefined"
      ? window.location.origin + "/callback"
      : "http://localhost:3000/callback")
  }
};
```

### API Request Helper

A reusable helper function for making authenticated `fetch` requests. This function handles JSON serialization, Bearer token injection, error parsing, and `204 No Content` responses:

```javascript
/**
 * Make an authenticated API request using fetch.
 * Automatically adds JSON headers and Bearer token.
 *
 * @param {string} endpoint - API endpoint path (e.g., "/api/todos")
 * @param {object} options  - Fetch options (method, body, headers, etc.)
 * @param {string} token    - JWT access token from Auth0
 * @returns {Promise<any>}  Parsed JSON response, or null for 204 responses
 * @throws {ApiError}       On non-2xx HTTP responses
 */
async function apiRequest(endpoint, options = {}, token) {
  const url = `${CONFIG.baseUrl}${endpoint}`;

  // Merge default headers with any custom headers
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });

  // Throw a structured error for non-2xx responses
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody);
  }

  // DELETE operations return 204 No Content — no body to parse
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
```

### Custom Error Class

A structured error class that extracts the machine-readable code, human-readable message, and field-level details from the API error response format documented in the [API Overview](../api-reference/overview.md#error-responses):

```javascript
/**
 * Structured API error with status code and parsed error body.
 * Matches the error response format: { error: { code, message, details } }
 */
class ApiError extends Error {
  constructor(status, body) {
    super(body?.error?.message || `API Error: ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = body?.error?.code || "UNKNOWN_ERROR";
    this.details = body?.error?.details || [];
  }
}
```

---

## Authentication

This section covers two authentication approaches: the **Auth0 SPA SDK** for browser-based applications and **direct API calls** for server-side (Node.js) applications.

> **Note:** For complete Auth0 account setup, application registration, and MFA configuration, see the [Authentication Guide](../guides/authentication.md). For endpoint specifications, see [Authentication Endpoints](../api-reference/auth.md).

### Browser Authentication (Auth0 SPA SDK)

The Auth0 SPA SDK handles the OAuth 2.0 Authorization Code flow with PKCE, token caching, and silent renewal automatically.

#### Initialize the Auth0 Client

```javascript
import { createAuth0Client } from "@auth0/auth0-spa-js";

// Initialize the Auth0 client — call once at application startup
const auth0 = await createAuth0Client({
  domain: "YOUR_AUTH0_DOMAIN",
  clientId: "YOUR_AUTH0_CLIENT_ID",
  authorizationParams: {
    redirect_uri: window.location.origin + "/callback",
    audience: "YOUR_AUTH0_AUDIENCE"
  }
});
```

#### Login (Redirect)

```javascript
// Redirect the user to the Auth0 login page
async function login() {
  await auth0.loginWithRedirect();
}

// Handle the callback after Auth0 redirects back to your application
async function handleCallback() {
  // Parse the authorization code from the URL
  await auth0.handleRedirectCallback();

  // Retrieve the authenticated user profile and access token
  const user = await auth0.getUser();
  const token = await auth0.getTokenSilently();

  console.log("Logged in as:", user.name);
  console.log("Access token:", token);
  return { user, token };
}
```

#### Get Access Token

```javascript
// The SDK caches the token and refreshes it automatically when expired
async function getToken() {
  const token = await auth0.getTokenSilently();
  return token;
}
```

#### Logout (Browser)

```javascript
// Log the user out and redirect to the application homepage
async function logout() {
  await auth0.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
}
```

### Server-Side Authentication (API Endpoints)

For Node.js or server-side applications that cannot use the Auth0 SPA SDK, use the authentication API endpoints directly.

#### Initiate Login

```javascript
// Step 1: Request an authorization URL from the backend
async function initiateLogin() {
  const response = await fetch(`${CONFIG.baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      redirect_uri: "http://localhost:3000/callback",
      screen_hint: "login"
    })
  });

  const data = await response.json();
  // Redirect the user's browser to this URL to authenticate with Auth0
  console.log("Open this URL to login:", data.authorization_url);
  return data;
}
```

#### Exchange Authorization Code

```javascript
// Step 2: Exchange the authorization code for tokens after Auth0 callback
async function exchangeCode(code, state) {
  const response = await fetch(`${CONFIG.baseUrl}/api/auth/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      state,
      redirect_uri: "http://localhost:3000/callback"
    })
  });

  const tokens = await response.json();
  console.log(`Token acquired. Expires in ${tokens.expires_in}s`);
  // tokens contains: access_token, refresh_token, token_type, expires_in, user
  return tokens;
}
```

#### Get Current User

```javascript
// Retrieve the authenticated user's profile using the access token
async function getCurrentUser(token) {
  return apiRequest("/api/auth/me", {}, token);
}

// Usage:
const user = await getCurrentUser(token);
console.log(`Authenticated as: ${user.name} (${user.email})`);
```

#### Refresh Token

```javascript
// Refresh an expired access token using the refresh token
async function refreshAccessToken(currentRefreshToken) {
  const response = await fetch(`${CONFIG.baseUrl}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: currentRefreshToken })
  });

  const tokens = await response.json();
  console.log(`New token acquired. Expires in ${tokens.expires_in}s`);
  return tokens;
}
```

#### Logout (Server-Side)

```javascript
// End the user session via the API
async function apiLogout(token) {
  const data = await apiRequest("/api/auth/logout", { method: "POST" }, token);
  // Redirect the user's browser to the Auth0 logout URL to clear the SSO session
  console.log("Redirect to complete logout:", data.logout_url);
  return data;
}
```

---

## Todo Operations (fetch)

CRUD operations for to-do items using the built-in `fetch` API and the `apiRequest` helper defined in [Setup and Configuration](#setup-and-configuration).

See [Todo Endpoints](../api-reference/todos.md) for the full API specification including request schemas, response fields, and status codes.

### Create a Todo

```javascript
async function createTodo(token, todoData) {
  const todo = await apiRequest("/api/todos", {
    method: "POST",
    body: JSON.stringify(todoData)
  }, token);

  console.log(`Created todo: ${todo.id} — "${todo.title}"`);
  return todo;
}

// Usage:
const newTodo = await createTodo(token, {
  title: "Review pull request",
  description: "Review the authentication module PR #42",
  priority: "high",
  due_date: "2026-04-01T17:00:00Z",
  tags: ["work", "code-review"]
});
```

### List Todos

Retrieve a paginated list of to-do items with optional filtering, sorting, and search:

```javascript
async function listTodos(token, params = {}) {
  // Build query string from parameters, skipping undefined/null values
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }
  });

  const query = queryParams.toString();
  const endpoint = `/api/todos${query ? `?${query}` : ""}`;

  const result = await apiRequest(endpoint, {}, token);
  console.log(`Found ${result.pagination.total} todos (page ${result.pagination.page}/${result.pagination.total_pages})`);
  return result;
}

// Usage — all todos (default pagination):
const allTodos = await listTodos(token);

// Filter by priority and completion status:
const highPriority = await listTodos(token, {
  priority: "high",
  completed: false,
  sort: "due_date",
  order: "asc"
});

// Paginated results:
const page2 = await listTodos(token, { page: 2, limit: 10 });

// Full-text search across titles and descriptions:
const searchResults = await listTodos(token, { search: "review" });
```

### Get a Single Todo

```javascript
async function getTodo(token, todoId) {
  return apiRequest(`/api/todos/${todoId}`, {}, token);
}

// Usage:
const todo = await getTodo(token, "507f1f77bcf86cd799439011");
console.log(`${todo.title} — ${todo.completed ? "Done" : "Pending"}`);
```

### Update a Todo (Full Replacement)

Replace the entire to-do item with the provided data. All fields must be included:

```javascript
async function updateTodo(token, todoId, data) {
  return apiRequest(`/api/todos/${todoId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }, token);
}

// Usage:
const updated = await updateTodo(token, "507f1f77bcf86cd799439011", {
  title: "Review pull request (updated)",
  description: "Review auth module PR #42 — focus on token validation",
  priority: "medium",
  completed: false,
  due_date: "2026-04-02T12:00:00Z",
  tags: ["work", "code-review", "security"]
});
```

### Partial Update (PATCH)

Update only the specified fields without replacing the entire resource:

```javascript
async function patchTodo(token, todoId, updates) {
  return apiRequest(`/api/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  }, token);
}

// Mark a to-do as completed:
await patchTodo(token, "507f1f77bcf86cd799439011", { completed: true });

// Change priority only:
await patchTodo(token, "507f1f77bcf86cd799439011", { priority: "low" });

// Update tags:
await patchTodo(token, "507f1f77bcf86cd799439011", {
  tags: ["work", "done"]
});
```

### Delete a Todo

```javascript
async function deleteTodo(token, todoId) {
  await apiRequest(`/api/todos/${todoId}`, { method: "DELETE" }, token);
  console.log(`Deleted todo: ${todoId}`);
}

// Usage:
await deleteTodo(token, "507f1f77bcf86cd799439011");
```

---

## Todo Operations (axios)

The same CRUD operations using `axios` with interceptors for automatic token injection and centralized error handling. This approach is recommended for larger applications that benefit from request/response interceptors.

### Axios Instance Setup

```javascript
import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 10000 // 10 second timeout
});

// Request interceptor — automatically attach the Bearer token to every request
api.interceptors.request.use((config) => {
  const token = getStoredToken(); // Replace with your token retrieval logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired — attempting refresh...");
      // Implement automatic token refresh and request retry here
    }
    return Promise.reject(error);
  }
);
```

### CRUD Operations

```javascript
// Create a new to-do item
const { data: newTodo } = await api.post("/api/todos", {
  title: "Review pull request",
  description: "Review the authentication module PR #42",
  priority: "high",
  due_date: "2026-04-01T17:00:00Z",
  tags: ["work", "code-review"]
});
console.log(`Created: ${newTodo.id} — "${newTodo.title}"`);

// List to-do items with query parameters
const { data: todoList } = await api.get("/api/todos", {
  params: { priority: "high", completed: false, page: 1, limit: 10 }
});
console.log(`Found ${todoList.pagination.total} high-priority items`);

// Get a single to-do item by ID
const { data: todo } = await api.get(`/api/todos/${todoId}`);
console.log(`${todo.title} — Priority: ${todo.priority}`);

// Update a to-do item (full replacement)
const { data: updated } = await api.put(`/api/todos/${todoId}`, {
  title: "Updated title",
  description: "Updated description",
  priority: "medium",
  completed: true,
  due_date: "2026-04-02T12:00:00Z",
  tags: ["work"]
});

// Partial update (PATCH) — update only specific fields
const { data: patched } = await api.patch(`/api/todos/${todoId}`, {
  completed: true
});

// Delete a to-do item
await api.delete(`/api/todos/${todoId}`);
console.log("Todo deleted successfully");
```

---

## User Profile

Manage the authenticated user's profile and account settings. The `/api/users/me` path automatically resolves to the current user based on the JWT token.

See [User Endpoints](../api-reference/users.md) for the full API specification.

### Get User Profile

```javascript
async function getProfile(token) {
  return apiRequest("/api/users/me", {}, token);
}

// Usage:
const profile = await getProfile(token);
console.log(`Welcome, ${profile.name}!`);
console.log(`Email: ${profile.email}`);
console.log(`Theme: ${profile.preferences.theme}`);
console.log(`Timezone: ${profile.preferences.timezone}`);
```

### Update User Profile

Update the display name, avatar, or application preferences. Only the provided fields are updated — omitted fields retain their current values:

```javascript
async function updateProfile(token, updates) {
  return apiRequest("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(updates)
  }, token);
}

// Update name and preferences:
const updatedProfile = await updateProfile(token, {
  name: "Jane Developer",
  preferences: {
    theme: "dark",
    default_priority: "high",
    timezone: "America/New_York"
  }
});
console.log(`Profile updated. Theme: ${updatedProfile.preferences.theme}`);
```

### Delete User Account

> ⚠️ **Warning:** This permanently deletes your account and all associated to-do items. This action cannot be undone.

```javascript
async function deleteAccount(token) {
  await apiRequest("/api/users/me", { method: "DELETE" }, token);
  console.log("Account permanently deleted.");
}

// Usage — requires explicit confirmation in production applications:
await deleteAccount(token);
```

---

## AI Processing

The Todo Application provides three AI-powered processing patterns, each optimized for different use cases. All AI endpoints require authentication and are rate-limited to 10 requests per minute.

See [AI Endpoints](../api-reference/ai.md) for full API documentation and the [AI Features Guide](../guides/ai-features.md) for usage patterns and prompt engineering tips.

### Simple Query

Direct LLM interaction for straightforward questions, task suggestions, and priority recommendations. Typical response time: 1–3 seconds.

```javascript
async function aiQuery(token, query, options = {}) {
  const result = await apiRequest("/api/ai/query", {
    method: "POST",
    body: JSON.stringify({
      query,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      context: options.context || {}
    })
  }, token);

  console.log(`AI Response (${result.metadata.processing_time_ms}ms, ` +
              `${result.metadata.tokens_used.total} tokens):`);
  console.log(result.response);
  return result;
}

// Usage — ask for subtask suggestions:
const result = await aiQuery(token, "Suggest subtasks for my marketing campaign todo", {
  maxTokens: 500,
  temperature: 0.7,
  context: { todo_id: "507f1f77bcf86cd799439011" }
});
```

### RAG Query

Context-enriched responses using document retrieval and vector embeddings. The AI searches your to-do items and related documents to provide grounded answers. Typical response time: 2–5 seconds.

```javascript
async function aiRagQuery(token, query, options = {}) {
  const result = await apiRequest("/api/ai/rag", {
    method: "POST",
    body: JSON.stringify({
      query,
      collection: options.collection || "todos",
      top_k: options.topK || 5,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.3
    })
  }, token);

  // Display the sources used to generate the response
  if (result.sources?.length) {
    console.log(`Based on ${result.sources.length} sources:`);
    result.sources.forEach((source) => {
      console.log(`  - ${source.title} (relevance: ${source.relevance_score.toFixed(2)})`);
    });
  }

  console.log(`\nResponse: ${result.response}`);
  return result;
}

// Usage — query your to-do items for context-aware answers:
const ragResult = await aiRagQuery(token, "What are my high priority tasks due this week?", {
  collection: "todos",
  topK: 10,
  temperature: 0.3
});
```

### Agent Query

Multi-step agent workflows with tool-calling capabilities. The agent can analyze, plan, and optionally create, update, or delete to-do items on your behalf. Typical response time: 5–30 seconds.

> ⚠️ **Caution:** When `allow_mutations` is set to `true`, the agent can create, update, and delete to-do items on your behalf. Use with care.

```javascript
async function aiAgentQuery(token, query, options = {}) {
  const result = await apiRequest("/api/ai/agent", {
    method: "POST",
    body: JSON.stringify({
      query,
      context: {
        allow_mutations: options.allowMutations || false,
        max_steps: options.maxSteps || 5
      },
      max_tokens: options.maxTokens || 2000
    })
  }, token);

  // Display the agent's reasoning steps
  console.log(`Agent completed in ${result.steps.length} steps:`);
  result.steps.forEach((step) => {
    console.log(`  Step ${step.step}: [${step.action}] ${step.description} — ${step.status}`);
  });

  // Display any mutations the agent performed
  if (result.mutations?.length) {
    console.log(`\nMutations performed: ${result.mutations.length}`);
    result.mutations.forEach((mutation) => {
      console.log(`  ${mutation.action}: "${mutation.title}" (${mutation.resource} ${mutation.id})`);
    });
  }

  console.log(`\nResponse: ${result.response}`);
  return result;
}

// Read-only agent query — analyze and suggest without making changes:
const schedule = await aiAgentQuery(token, "Organize my todos by priority for this week");

// Agent with mutations — create to-do items based on AI analysis:
const plan = await aiAgentQuery(token, "Create a project plan with 5 subtasks for launching the new feature", {
  allowMutations: true,
  maxSteps: 8,
  maxTokens: 2000
});
```

---

## Complete API Client Class

A complete, reusable JavaScript client class that wraps all API operations. Works in both browser and Node.js environments:

```javascript
/**
 * TodoApiClient — Complete JavaScript client for the Todo Application API.
 *
 * Usage:
 *   const client = new TodoApiClient("http://localhost:5000", "YOUR_ACCESS_TOKEN");
 *   const todos = await client.listTodos({ completed: false });
 */
class TodoApiClient {
  /**
   * Create a new API client instance.
   * @param {string} baseUrl - API base URL (default: "http://localhost:5000")
   * @param {string|null} token - JWT access token (can be set later via setToken)
   */
  constructor(baseUrl = "http://localhost:5000", token = null) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.token = token;
  }

  /**
   * Set or update the authentication token.
   * @param {string} token - JWT access token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Internal method — make an authenticated HTTP request.
   * @param {string} endpoint - API endpoint path (e.g., "/api/todos")
   * @param {object} options - Fetch options (method, body, headers)
   * @returns {Promise<any>} Parsed JSON response or null for 204
   * @throws {ApiError} On non-2xx responses
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorBody);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  // ─── Authentication ──────────────────────────────────────────────────

  /**
   * Initiate the login flow — returns an authorization URL.
   * @param {string} redirectUri - Post-login redirect URL
   * @returns {Promise<{authorization_url: string, state: string}>}
   */
  async login(redirectUri = "http://localhost:3000/callback") {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ redirect_uri: redirectUri, screen_hint: "login" })
    });
  }

  /**
   * Exchange an authorization code for access and refresh tokens.
   * @param {string} code - Authorization code from Auth0 callback
   * @param {string} state - State parameter for CSRF validation
   * @param {string} redirectUri - The redirect URI used in the login request
   * @returns {Promise<{access_token: string, refresh_token: string, expires_in: number, user: object}>}
   */
  async callback(code, state, redirectUri = "http://localhost:3000/callback") {
    const tokens = await this.request("/api/auth/callback", {
      method: "POST",
      body: JSON.stringify({ code, state, redirect_uri: redirectUri })
    });
    // Automatically set the token for subsequent requests
    this.setToken(tokens.access_token);
    return tokens;
  }

  /**
   * Refresh an expired access token.
   * @param {string} refreshToken - The refresh token from the original login
   * @returns {Promise<{access_token: string, refresh_token: string, expires_in: number}>}
   */
  async refreshToken(refreshToken) {
    const tokens = await this.request("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    this.setToken(tokens.access_token);
    return tokens;
  }

  /**
   * Log out the current user.
   * @returns {Promise<{logout_url: string}>}
   */
  async logout() {
    return this.request("/api/auth/logout", { method: "POST" });
  }

  /**
   * Get the currently authenticated user's profile.
   * @returns {Promise<object>} User profile object
   */
  async getCurrentUser() {
    return this.request("/api/auth/me");
  }

  // ─── Todos ───────────────────────────────────────────────────────────

  /**
   * Create a new to-do item.
   * @param {object} data - Todo data (title required; description, priority, due_date, tags optional)
   * @returns {Promise<object>} Created todo object with server-generated fields
   */
  async createTodo(data) {
    return this.request("/api/todos", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  /**
   * List to-do items with optional filtering, sorting, and pagination.
   * @param {object} params - Query parameters (page, limit, priority, completed, sort, order, search, tags)
   * @returns {Promise<{data: object[], pagination: object}>}
   */
  async listTodos(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });
    const query = queryParams.toString();
    return this.request(`/api/todos${query ? `?${query}` : ""}`);
  }

  /**
   * Get a single to-do item by ID.
   * @param {string} id - Todo ID (24-character hex ObjectId)
   * @returns {Promise<object>} Todo object
   */
  async getTodo(id) {
    return this.request(`/api/todos/${id}`);
  }

  /**
   * Update a to-do item (full replacement).
   * @param {string} id - Todo ID
   * @param {object} data - Complete todo data
   * @returns {Promise<object>} Updated todo object
   */
  async updateTodo(id, data) {
    return this.request(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  /**
   * Partially update a to-do item — only the provided fields are modified.
   * @param {string} id - Todo ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated todo object
   */
  async patchTodo(id, updates) {
    return this.request(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates)
    });
  }

  /**
   * Delete a to-do item.
   * @param {string} id - Todo ID
   * @returns {Promise<null>}
   */
  async deleteTodo(id) {
    return this.request(`/api/todos/${id}`, { method: "DELETE" });
  }

  // ─── User Profile ────────────────────────────────────────────────────

  /**
   * Get the authenticated user's profile.
   * @returns {Promise<object>} User profile with preferences
   */
  async getProfile() {
    return this.request("/api/users/me");
  }

  /**
   * Update the authenticated user's profile.
   * @param {object} updates - Fields to update (name, avatar_url, preferences)
   * @returns {Promise<object>} Updated user profile
   */
  async updateProfile(updates) {
    return this.request("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(updates)
    });
  }

  /**
   * Permanently delete the authenticated user's account and all data.
   * @returns {Promise<null>}
   */
  async deleteAccount() {
    return this.request("/api/users/me", { method: "DELETE" });
  }

  // ─── AI Processing ───────────────────────────────────────────────────

  /**
   * Send a simple AI query for direct LLM interaction.
   * @param {string} query - Natural language query
   * @param {object} options - Optional: maxTokens, temperature, context
   * @returns {Promise<{response: string, metadata: object}>}
   */
  async aiQuery(query, options = {}) {
    return this.request("/api/ai/query", {
      method: "POST",
      body: JSON.stringify({
        query,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        context: options.context || {}
      })
    });
  }

  /**
   * Send a RAG (Retrieval-Augmented Generation) query.
   * @param {string} query - Natural language query
   * @param {object} options - Optional: collection, topK, maxTokens, temperature
   * @returns {Promise<{response: string, sources: object[], metadata: object}>}
   */
  async aiRag(query, options = {}) {
    return this.request("/api/ai/rag", {
      method: "POST",
      body: JSON.stringify({
        query,
        collection: options.collection || "todos",
        top_k: options.topK || 5,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.3
      })
    });
  }

  /**
   * Send an agent query for multi-step AI workflows.
   * @param {string} query - Natural language instruction
   * @param {object} options - Optional: allowMutations, maxSteps, maxTokens
   * @returns {Promise<{response: string, steps: object[], mutations: object[], metadata: object}>}
   */
  async aiAgent(query, options = {}) {
    return this.request("/api/ai/agent", {
      method: "POST",
      body: JSON.stringify({
        query,
        context: {
          allow_mutations: options.allowMutations || false,
          max_steps: options.maxSteps || 5
        },
        max_tokens: options.maxTokens || 2000
      })
    });
  }
}
```

### Client Usage Example

```javascript
// Initialize the client with your API URL and access token
const client = new TodoApiClient("http://localhost:5000", "YOUR_ACCESS_TOKEN");

// Create a new to-do item
const todo = await client.createTodo({
  title: "Review PR #42",
  description: "Review the authentication module changes",
  priority: "high",
  tags: ["work", "code-review"]
});
console.log(`Created: ${todo.id}`);

// List all incomplete to-do items sorted by due date
const result = await client.listTodos({
  completed: false,
  sort: "due_date",
  order: "asc"
});
console.log(`You have ${result.pagination.total} pending items`);

// Mark the first item as completed
if (result.data.length > 0) {
  await client.patchTodo(result.data[0].id, { completed: true });
  console.log(`Completed: "${result.data[0].title}"`);
}

// Ask the AI for prioritization advice
const suggestion = await client.aiQuery("How should I prioritize my remaining tasks?");
console.log(`AI suggests: ${suggestion.response}`);

// Get your profile
const profile = await client.getProfile();
console.log(`Logged in as: ${profile.name}`);
```

---

## Error Handling

Robust error handling patterns for production applications.

### Status-Based Error Handling

Handle different error types with appropriate user-facing messages:

```javascript
/**
 * Wrap an API call with structured error handling.
 * Logs user-friendly messages based on the HTTP status code.
 *
 * @param {Function} fn - Async function that performs the API call
 * @returns {Promise<any>} The result of the API call
 * @throws {Error} Re-throws after logging
 */
async function safeApiCall(fn) {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 400:
          console.error("Bad request:", error.message);
          if (error.details.length > 0) {
            error.details.forEach((detail) => {
              console.error(`  - ${detail.field}: ${detail.message}`);
            });
          }
          break;
        case 401:
          console.error("Authentication expired. Please log in again.");
          break;
        case 403:
          console.error("You don't have permission to perform this action.");
          break;
        case 404:
          console.error("The requested resource was not found.");
          break;
        case 422:
          console.error("Validation failed:", error.message);
          break;
        case 429:
          console.error("Rate limit exceeded. Please wait before retrying.");
          break;
        default:
          console.error(`API Error (${error.status}): ${error.message}`);
      }
    } else {
      console.error("Network error:", error.message);
    }
    throw error;
  }
}

// Usage:
const todos = await safeApiCall(() => listTodos(token, { completed: false }));
```

### Retry with Exponential Backoff

Automatically retry rate-limited requests with increasing delays:

```javascript
/**
 * Retry a function with exponential backoff on rate-limit (429) errors.
 *
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts (default: 3)
 * @param {number} baseDelay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise<any>} The result of the successful call
 * @throws {Error} After all retries are exhausted or on non-retryable errors
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Only retry on rate-limit errors
      const isRetryable = error instanceof ApiError && error.status === 429;
      const isLastAttempt = attempt === maxRetries;

      if (!isRetryable || isLastAttempt) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Usage — retry AI queries that may hit rate limits:
const aiResult = await retryWithBackoff(
  () => aiQuery(token, "Summarize my tasks for this week"),
  3,    // max 3 retries
  1000  // start with 1s delay, then 2s, then 4s
);
```

See the [Troubleshooting Guide](../troubleshooting.md) for common error scenarios and resolution steps.

---

## TypeScript Types

TypeScript interfaces for all API request and response data models. Use these types for full type safety in TypeScript projects:

### Todo Types

```typescript
/** A single to-do item returned by the API */
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

/** Request body for creating a new to-do item (POST /api/todos) */
interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  due_date?: string;
  tags?: string[];
}

/** Request body for updating a to-do item (PUT /api/todos/:id) */
interface UpdateTodoRequest {
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  due_date?: string;
  tags?: string[];
}

/** Request body for partial update (PATCH /api/todos/:id) */
interface PatchTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  due_date?: string;
  tags?: string[];
}

/** Paginated list response wrapper */
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
```

### User Types

```typescript
/** User profile returned by the API */
interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
  last_login: string;
}

/** Configurable user preferences */
interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  default_priority: "low" | "medium" | "high";
  timezone: string;
}

/** Request body for updating user profile (PUT /api/users/me) */
interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
  preferences?: Partial<UserPreferences>;
}
```

### AI Types

```typescript
/** Base AI response with metadata */
interface AiResponse {
  response: string;
  metadata: {
    model: string;
    processing_time_ms: number;
    tokens_used: {
      prompt: number;
      completion: number;
      total: number;
    };
    processing_pattern: "simple" | "rag" | "agent";
  };
}

/** RAG query response with source documents */
interface AiRagResponse extends AiResponse {
  sources: Array<{
    id: string;
    title: string;
    relevance_score: number;
  }>;
}

/** Agent query response with execution steps and mutations */
interface AiAgentResponse extends AiResponse {
  steps: Array<{
    step: number;
    action: string;
    description: string;
    status: string;
  }>;
  mutations: Array<{
    action: "create" | "update" | "delete";
    resource: string;
    id: string;
    title: string;
  }>;
}
```

### Auth Types

```typescript
/** Token response from login callback or refresh */
interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

/** Login initiation response */
interface LoginResponse {
  authorization_url: string;
  state: string;
}

/** Logout response */
interface LogoutResponse {
  logout_url: string;
}
```

### Error Types

```typescript
/** Standard API error response body */
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
```

> **Note:** These types align with the API response schemas documented in the [API Reference](../api-reference/overview.md).
> For the most authoritative field definitions, refer to the individual endpoint documentation:
> [Todos](../api-reference/todos.md), [Users](../api-reference/users.md), [Auth](../api-reference/auth.md), [AI](../api-reference/ai.md).
