# Python Client Examples

Complete Python integration examples for the Todo Application API using `requests` and `httpx` libraries.

This guide provides ready-to-use Python scripts covering authentication, to-do CRUD operations, user profile management, and AI-powered query processing. All examples include type hints, docstrings, and inline comments for clarity.

*Source: Tech Spec Sections 3.2, 6.1*

## Table of Contents

- [Prerequisites](#prerequisites)
- [Library Choices](#library-choices)
- [Setup and Configuration](#setup-and-configuration)
- [Authentication](#authentication)
- [To-Do Operations](#to-do-operations)
- [User Profile](#user-profile)
- [AI Processing](#ai-processing)
- [Complete Client Class](#complete-client-class)
- [Error Handling](#error-handling)
- [Async Examples (httpx)](#async-examples-httpx)

**Related documentation:**

- [API Overview](../api-reference/overview.md) — API conventions, authentication, and error handling
- [Authentication Endpoints](../api-reference/auth.md) — Full auth endpoint reference
- [To-Do Endpoints](../api-reference/todos.md) — Full to-do endpoint reference
- [User Endpoints](../api-reference/users.md) — Full user endpoint reference
- [AI Endpoints](../api-reference/ai.md) — Full AI endpoint reference
- [Configuration Reference](../getting-started/configuration.md) — Environment variables
- [Troubleshooting](../troubleshooting.md) — Common issues and solutions

---

## Prerequisites

Before running the examples in this guide, ensure you have the following:

- **Python 3.13** installed (examples use f-strings, type hints with `|` union syntax, and modern syntax)
- **`requests`** library installed for synchronous HTTP calls
- **`httpx`** library installed for async HTTP calls (optional — only needed for the [Async Examples](#async-examples-httpx) section)
- **`python-dotenv`** library installed for environment variable management
- A **running instance** of the Todo Application (local at `http://localhost:5000` or via Docker)
- A **valid Auth0 account** configured for the application — see the [Authentication Guide](../guides/authentication.md)
- Replace all **placeholder values** (`YOUR_ACCESS_TOKEN`, `YOUR_AUTH0_DOMAIN`, etc.) with your actual configuration values

Install the required Python packages:

```bash
pip install requests httpx python-dotenv
```

---

## Library Choices

This guide demonstrates two Python HTTP libraries:

- **`requests`** — Synchronous HTTP client. Simple, widely adopted, and ideal for scripts, CLI tools, and backend service integrations. All primary examples use `requests`.
- **`httpx`** — Modern HTTP client with both synchronous and asynchronous support. Best for async applications (FastAPI, asyncio) and when you need HTTP/2 or connection pooling. Async examples are provided in the [Async Examples](#async-examples-httpx) section.

---

## Setup and Configuration

### Install Dependencies

```bash
pip install requests httpx python-dotenv
```

### Configuration Module

Create a reusable configuration module to manage API credentials and base URL. This module loads values from a `.env` file and provides sensible defaults for local development:

```python
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API Configuration
BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000")
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "YOUR_AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "YOUR_AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET", "YOUR_AUTH0_CLIENT_SECRET")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "YOUR_AUTH0_AUDIENCE")
```

### Helper Function

Use this helper to build authenticated request headers consistently across all API calls:

```python
import requests


def get_headers(token: str) -> dict:
    """Build authorization headers for API requests."""
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
```

### Sample `.env` File

Create a `.env` file in your project root with the following values. Replace the placeholders with your actual credentials:

```text
API_BASE_URL=http://localhost:5000
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://your-api-identifier
```

> **Security note:** Never commit your `.env` file to version control. Add `.env` to your `.gitignore` file.

---

## Authentication

These functions implement the OAuth 2.0 Authorization Code flow with Auth0. See [Authentication Endpoints](../api-reference/auth.md) for full API documentation.

### Initiate Login

Start the OAuth 2.0 login flow by requesting an authorization URL from the API. Redirect the user's browser to this URL to authenticate with Auth0:

```python
import requests


def initiate_login(
    base_url: str, redirect_uri: str = "http://localhost:3000/callback"
) -> dict:
    """
    Initiate the OAuth 2.0 login flow and get the authorization URL.

    Args:
        base_url: API base URL (e.g., http://localhost:5000)
        redirect_uri: URL where Auth0 redirects after login

    Returns:
        Dict with 'authorization_url' and 'state' for CSRF protection
    """
    response = requests.post(
        f"{base_url}/api/auth/login",
        json={
            "redirect_uri": redirect_uri,
            "screen_hint": "login",
        },
    )
    response.raise_for_status()
    data = response.json()
    print(f"Open this URL in your browser to login:\n{data['authorization_url']}")
    return data
```

### Exchange Authorization Code

After the user authenticates with Auth0, exchange the authorization code from the callback for access and refresh tokens:

```python
def exchange_code(base_url: str, code: str, state: str) -> dict:
    """
    Exchange an authorization code for access and refresh tokens.

    Args:
        base_url: API base URL
        code: Authorization code from Auth0 callback redirect
        state: State parameter from the callback (for CSRF verification)

    Returns:
        Dict with 'access_token', 'refresh_token', 'expires_in', and 'user'
    """
    response = requests.post(
        f"{base_url}/api/auth/callback",
        json={
            "code": code,
            "state": state,
            "redirect_uri": "http://localhost:3000/callback",
        },
    )
    response.raise_for_status()
    tokens = response.json()
    print(f"Access token acquired. Expires in {tokens['expires_in']} seconds.")
    return tokens
```

### Get Current User

Retrieve the authenticated user's identity information using the current access token:

```python
def get_current_user(base_url: str, token: str) -> dict:
    """
    Get the currently authenticated user's information.

    Args:
        base_url: API base URL
        token: JWT access token

    Returns:
        Dict with user identity fields (id, email, name)
    """
    response = requests.get(
        f"{base_url}/api/auth/me",
        headers=get_headers(token),
    )
    response.raise_for_status()
    return response.json()
```

### Refresh Access Token

Obtain a new access token using a refresh token, without requiring the user to log in again:

```python
def refresh_access_token(base_url: str, refresh_token: str) -> dict:
    """
    Get a new access token using a refresh token.

    Args:
        base_url: API base URL
        refresh_token: Refresh token from the original login

    Returns:
        Dict with new 'access_token', 'refresh_token', and 'expires_in'
    """
    response = requests.post(
        f"{base_url}/api/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    response.raise_for_status()
    return response.json()
```

### Logout

End the user's session and obtain the Auth0 logout URL to complete the sign-out process:

```python
def logout(base_url: str, token: str) -> dict:
    """
    Initiate logout and get the Auth0 logout URL.

    Args:
        base_url: API base URL
        token: JWT access token

    Returns:
        Dict with 'logout_url' to redirect the user for complete sign-out
    """
    response = requests.post(
        f"{base_url}/api/auth/logout",
        headers=get_headers(token),
    )
    response.raise_for_status()
    data = response.json()
    print(f"Redirect to this URL to complete logout:\n{data['logout_url']}")
    return data
```

---

## To-Do Operations

These functions cover the full lifecycle of to-do items: create, list, get, update, partial update, and delete. See [To-Do Endpoints](../api-reference/todos.md) for full API documentation.

### Create a To-Do

```python
def create_todo(base_url: str, token: str, title: str, **kwargs) -> dict:
    """
    Create a new to-do item.

    Args:
        base_url: API base URL
        token: JWT access token
        title: Todo title (required, max 200 characters)
        **kwargs: Optional fields — description, priority, due_date, tags

    Returns:
        Created todo object with server-generated id and timestamps
    """
    data = {"title": title, **kwargs}
    response = requests.post(
        f"{base_url}/api/todos",
        json=data,
        headers=get_headers(token),
    )
    response.raise_for_status()
    todo = response.json()
    print(f"Created todo: {todo['id']} — {todo['title']}")
    return todo
```

**Usage examples:**

```python
# Simple todo with just a title
todo = create_todo(BASE_URL, token, "Buy groceries")

# Detailed todo with all optional fields
todo = create_todo(
    BASE_URL,
    token,
    title="Review pull request",
    description="Review the authentication module PR #42",
    priority="high",
    due_date="2026-04-01T17:00:00Z",
    tags=["work", "code-review"],
)
```

### List To-Dos

Retrieve a paginated list of to-do items with optional filtering, sorting, and search:

```python
def list_todos(
    base_url: str,
    token: str,
    page: int = 1,
    limit: int = 20,
    completed: bool | None = None,
    priority: str | None = None,
    sort: str = "created_at",
    order: str = "desc",
    search: str | None = None,
    tags: list[str] | None = None,
) -> dict:
    """
    List todos with optional filtering, sorting, and pagination.

    Args:
        base_url: API base URL
        token: JWT access token
        page: Page number, 1-indexed (default: 1)
        limit: Items per page, max 100 (default: 20)
        completed: Filter by completion status (True/False/None for all)
        priority: Filter by priority level (low, medium, high)
        sort: Sort field (created_at, updated_at, due_date, priority, title)
        order: Sort direction (asc or desc)
        search: Full-text search across titles and descriptions
        tags: Filter by tags (comma-separated internally)

    Returns:
        Dict with 'data' (list of todos) and 'pagination' metadata
    """
    params: dict = {"page": page, "limit": limit, "sort": sort, "order": order}
    if completed is not None:
        params["completed"] = str(completed).lower()
    if priority:
        params["priority"] = priority
    if search:
        params["search"] = search
    if tags:
        params["tags"] = ",".join(tags)

    response = requests.get(
        f"{base_url}/api/todos",
        params=params,
        headers=get_headers(token),
    )
    response.raise_for_status()
    result = response.json()
    print(
        f"Found {result['pagination']['total']} todos "
        f"(page {result['pagination']['page']})"
    )
    return result
```

**Usage examples:**

```python
# All todos (default pagination)
todos = list_todos(BASE_URL, token)

# High-priority incomplete todos
todos = list_todos(BASE_URL, token, priority="high", completed=False)

# Search todos by keyword
todos = list_todos(BASE_URL, token, search="review")

# Todos with specific tags, sorted by due date
todos = list_todos(
    BASE_URL, token, tags=["work"], sort="due_date", order="asc"
)
```

### Get a Single To-Do

Retrieve a specific to-do item by its unique identifier:

```python
def get_todo(base_url: str, token: str, todo_id: str) -> dict:
    """
    Get a specific todo by its ID.

    Args:
        base_url: API base URL
        token: JWT access token
        todo_id: MongoDB ObjectId of the todo (24-character hex string)

    Returns:
        Todo object with all fields
    """
    response = requests.get(
        f"{base_url}/api/todos/{todo_id}",
        headers=get_headers(token),
    )
    response.raise_for_status()
    return response.json()
```

### Update a To-Do (Full Replacement)

Replace all fields of an existing to-do item. All writable fields must be included in the request body:

```python
def update_todo(base_url: str, token: str, todo_id: str, data: dict) -> dict:
    """
    Update a todo with full replacement (PUT).

    All writable fields must be provided. Fields omitted from the request
    body are reset to their default values.

    Args:
        base_url: API base URL
        token: JWT access token
        todo_id: MongoDB ObjectId of the todo
        data: Complete todo data (title, description, priority, etc.)

    Returns:
        Updated todo object
    """
    response = requests.put(
        f"{base_url}/api/todos/{todo_id}",
        json=data,
        headers=get_headers(token),
    )
    response.raise_for_status()
    todo = response.json()
    print(f"Updated todo: {todo['id']} — {todo['title']}")
    return todo
```

**Usage example:**

```python
updated = update_todo(BASE_URL, token, "507f1f77bcf86cd799439011", {
    "title": "Review pull request #42",
    "description": "Updated description with review notes",
    "priority": "medium",
    "completed": False,
    "due_date": "2026-04-02T17:00:00Z",
    "tags": ["work", "code-review", "urgent"],
})
```

### Partial Update a To-Do

Update only specific fields of a to-do item without affecting other fields:

```python
def patch_todo(base_url: str, token: str, todo_id: str, updates: dict) -> dict:
    """
    Partially update a todo (PATCH).

    Only the fields included in the request body are updated.
    Omitted fields retain their current values.

    Args:
        base_url: API base URL
        token: JWT access token
        todo_id: MongoDB ObjectId of the todo
        updates: Fields to update (only changed fields)

    Returns:
        Updated todo object with all fields
    """
    response = requests.patch(
        f"{base_url}/api/todos/{todo_id}",
        json=updates,
        headers=get_headers(token),
    )
    response.raise_for_status()
    return response.json()
```

**Usage examples:**

```python
# Mark a todo as completed
patch_todo(BASE_URL, token, "507f1f77bcf86cd799439011", {"completed": True})

# Change priority only
patch_todo(BASE_URL, token, "507f1f77bcf86cd799439011", {"priority": "low"})

# Update multiple fields at once
patch_todo(BASE_URL, token, "507f1f77bcf86cd799439011", {
    "priority": "high",
    "due_date": "2026-03-28T09:00:00Z",
})
```

### Delete a To-Do

Permanently remove a to-do item. Returns no content on success:

```python
def delete_todo(base_url: str, token: str, todo_id: str) -> None:
    """
    Delete a todo by its ID.

    Args:
        base_url: API base URL
        token: JWT access token
        todo_id: MongoDB ObjectId of the todo

    Returns:
        None on success (204 No Content)
    """
    response = requests.delete(
        f"{base_url}/api/todos/{todo_id}",
        headers=get_headers(token),
    )
    response.raise_for_status()
    print(f"Deleted todo: {todo_id}")
```

---

## User Profile

These functions manage the authenticated user's profile and account. See [User Endpoints](../api-reference/users.md) for full API documentation.

### Get User Profile

Retrieve the authenticated user's profile information:

```python
def get_profile(base_url: str, token: str) -> dict:
    """
    Get the authenticated user's profile.

    Args:
        base_url: API base URL
        token: JWT access token

    Returns:
        User profile object with name, email, preferences, and timestamps
    """
    response = requests.get(
        f"{base_url}/api/users/me",
        headers=get_headers(token),
    )
    response.raise_for_status()
    return response.json()
```

### Update User Profile

Update the authenticated user's display name, avatar, or preferences. Only the fields included in the request body are changed — omitted fields keep their current values:

```python
def update_profile(base_url: str, token: str, updates: dict) -> dict:
    """
    Update the authenticated user's profile.

    Supports partial updates — only include the fields you want to change.
    The 'email' field cannot be changed via this endpoint (managed by Auth0).

    Args:
        base_url: API base URL
        token: JWT access token
        updates: Fields to update (name, avatar_url, preferences)

    Returns:
        Updated user profile object
    """
    response = requests.put(
        f"{base_url}/api/users/me",
        json=updates,
        headers=get_headers(token),
    )
    response.raise_for_status()
    return response.json()
```

**Usage example:**

```python
# Update display name and preferences
updated_user = update_profile(BASE_URL, token, {
    "name": "Jane Developer",
    "preferences": {
        "theme": "dark",
        "default_priority": "high",
        "timezone": "America/New_York",
    },
})
print(f"Updated profile: {updated_user['name']}")
print(f"Theme: {updated_user['preferences']['theme']}")
```

### Delete User Account

> ⚠️ **Warning:** This permanently deletes your account and all associated data — including all to-do items, preferences, and conversation history. This action cannot be undone.

```python
def delete_account(base_url: str, token: str) -> None:
    """
    Permanently delete the authenticated user's account.

    WARNING: This is irreversible. All todos, preferences,
    and conversation history will be permanently deleted.

    Args:
        base_url: API base URL
        token: JWT access token

    Returns:
        None on success (204 No Content)
    """
    response = requests.delete(
        f"{base_url}/api/users/me",
        headers=get_headers(token),
    )
    response.raise_for_status()
    print("Account permanently deleted.")
```

---

## AI Processing

These functions interact with the AI-powered query processing endpoints. The AI engine supports three processing patterns — simple queries, RAG (Retrieval-Augmented Generation), and multi-step agent workflows.

See [AI Endpoints](../api-reference/ai.md) for full API documentation and [AI Features Guide](../guides/ai-features.md) for usage patterns.

### Simple Query

Process a natural language query using direct LLM interaction. Best for straightforward questions, task suggestions, and priority recommendations:

```python
def ai_simple_query(base_url: str, token: str, query: str, **kwargs) -> dict:
    """
    Process a simple AI query.

    Args:
        base_url: API base URL
        token: JWT access token
        query: Natural language query (max 2000 characters)
        **kwargs: Optional — context (dict), max_tokens (int), temperature (float)

    Returns:
        Dict with 'response' text and 'metadata' (model, timing, token usage)
    """
    data = {"query": query, **kwargs}
    response = requests.post(
        f"{base_url}/api/ai/query",
        json=data,
        headers=get_headers(token),
    )
    response.raise_for_status()
    result = response.json()
    print(
        f"AI Response ({result['metadata']['processing_time_ms']}ms, "
        f"{result['metadata']['tokens_used']['total']} tokens):"
    )
    print(result["response"])
    return result
```

**Usage example:**

```python
result = ai_simple_query(
    BASE_URL,
    token,
    "Suggest three subtasks for my Launch marketing campaign todo",
    max_tokens=500,
    temperature=0.7,
)
```

### RAG Query

Process a query using Retrieval-Augmented Generation. The system retrieves relevant documents from the vector store to provide context-specific responses:

```python
def ai_rag_query(base_url: str, token: str, query: str, **kwargs) -> dict:
    """
    Process a RAG (Retrieval-Augmented Generation) query.

    Args:
        base_url: API base URL
        token: JWT access token
        query: Natural language query (max 2000 characters)
        **kwargs: Optional — collection (str), top_k (int),
                  context (dict), max_tokens (int), temperature (float)

    Returns:
        Dict with 'response', 'sources' (retrieved documents), and 'metadata'
    """
    data = {"query": query, **kwargs}
    response = requests.post(
        f"{base_url}/api/ai/rag",
        json=data,
        headers=get_headers(token),
    )
    response.raise_for_status()
    result = response.json()

    # Display sources used for the response
    if "sources" in result:
        print(f"Based on {len(result['sources'])} sources:")
        for source in result["sources"]:
            print(
                f"  - {source['title']} "
                f"(relevance: {source['relevance_score']:.2f})"
            )

    return result
```

**Usage example:**

```python
result = ai_rag_query(
    BASE_URL,
    token,
    "What are my high priority tasks due this week?",
    collection="todos",
    top_k=10,
    temperature=0.3,
)
```

### Agent Query

Process complex queries using a multi-step AI agent with tool-calling capabilities. The agent can autonomously execute multiple steps to fulfill your request:

> ⚠️ **Caution:** When `allow_mutations=True`, the agent can create, update, and delete to-do items on your behalf. Review the `steps` and `mutations` arrays in the response to verify all changes.

```python
def ai_agent_query(
    base_url: str,
    token: str,
    query: str,
    allow_mutations: bool = False,
    max_steps: int = 5,
    max_tokens: int = 2000,
) -> dict:
    """
    Process a multi-step AI agent query.

    Args:
        base_url: API base URL
        token: JWT access token
        query: Natural language instruction (max 4000 characters)
        allow_mutations: If True, agent can create/update/delete todos
        max_steps: Maximum agent steps (default: 5, max: 10)
        max_tokens: Maximum response tokens (default: 2000, max: 8000)

    Returns:
        Dict with 'response', 'steps', 'mutations', and 'metadata'
    """
    data = {
        "query": query,
        "context": {
            "allow_mutations": allow_mutations,
            "max_steps": max_steps,
        },
        "max_tokens": max_tokens,
    }
    response = requests.post(
        f"{base_url}/api/ai/agent",
        json=data,
        headers=get_headers(token),
    )
    response.raise_for_status()
    result = response.json()

    # Display agent execution steps
    print(f"Agent completed in {len(result['steps'])} steps:")
    for step in result["steps"]:
        print(
            f"  Step {step['step']}: {step['action']} — {step['description']}"
        )

    # Display mutations if the agent modified any data
    if result.get("mutations"):
        print(f"\nMutations performed: {len(result['mutations'])}")
        for mutation in result["mutations"]:
            print(f"  {mutation['action']}: {mutation['title']}")

    return result
```

**Usage examples:**

```python
# Read-only analysis (safe — no data modifications)
result = ai_agent_query(
    BASE_URL,
    token,
    "Organize my incomplete todos by priority and create a daily schedule",
)

# With mutations enabled (USE WITH CAUTION — modifies your data)
result = ai_agent_query(
    BASE_URL,
    token,
    "Create a project plan with 5 subtasks for the website launch",
    allow_mutations=True,
    max_steps=8,
)
```

---

## Complete Client Class

The `TodoApiClient` class wraps all API operations into a single, reusable client. It manages authentication headers automatically and uses a persistent `requests.Session` for connection pooling:

```python
import requests
from typing import Any


class TodoApiClient:
    """
    A complete Python client for the Todo Application API.

    Manages authentication, connection pooling, and provides methods
    for all API operations: auth, todos, user profile, and AI processing.

    Usage:
        client = TodoApiClient(
            base_url="http://localhost:5000",
            token="YOUR_ACCESS_TOKEN",
        )
        todos = client.list_todos(completed=False)
    """

    def __init__(
        self, base_url: str = "http://localhost:5000", token: str | None = None
    ) -> None:
        """
        Initialize the API client.

        Args:
            base_url: API server base URL (default: http://localhost:5000)
            token: Optional JWT access token for authentication
        """
        self.base_url = base_url.rstrip("/")
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"

    def set_token(self, token: str) -> None:
        """Set or update the authentication token."""
        self.token = token
        self.session.headers["Authorization"] = f"Bearer {token}"

    # -------------------------------------------------------------------------
    # Authentication
    # -------------------------------------------------------------------------

    def login(
        self, redirect_uri: str = "http://localhost:3000/callback"
    ) -> dict:
        """Initiate the OAuth 2.0 login flow."""
        response = self.session.post(
            f"{self.base_url}/api/auth/login",
            json={"redirect_uri": redirect_uri, "screen_hint": "login"},
        )
        response.raise_for_status()
        return response.json()

    def callback(self, code: str, state: str) -> dict:
        """Exchange an authorization code for tokens."""
        response = self.session.post(
            f"{self.base_url}/api/auth/callback",
            json={
                "code": code,
                "state": state,
                "redirect_uri": "http://localhost:3000/callback",
            },
        )
        response.raise_for_status()
        tokens = response.json()
        # Automatically set the token for subsequent requests
        self.set_token(tokens["access_token"])
        return tokens

    def refresh_token(self, refresh_token: str) -> dict:
        """Get a new access token using a refresh token."""
        response = self.session.post(
            f"{self.base_url}/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )
        response.raise_for_status()
        tokens = response.json()
        # Automatically update the token for subsequent requests
        self.set_token(tokens["access_token"])
        return tokens

    def logout(self) -> dict:
        """Initiate logout and get the Auth0 logout URL."""
        response = self.session.post(f"{self.base_url}/api/auth/logout")
        response.raise_for_status()
        return response.json()

    def get_current_user(self) -> dict:
        """Get the currently authenticated user's identity."""
        response = self.session.get(f"{self.base_url}/api/auth/me")
        response.raise_for_status()
        return response.json()

    # -------------------------------------------------------------------------
    # Todo Operations
    # -------------------------------------------------------------------------

    def create_todo(self, title: str, **kwargs: Any) -> dict:
        """
        Create a new to-do item.

        Args:
            title: Todo title (required, max 200 characters)
            **kwargs: Optional — description, priority, due_date, tags
        """
        data = {"title": title, **kwargs}
        response = self.session.post(
            f"{self.base_url}/api/todos", json=data
        )
        response.raise_for_status()
        return response.json()

    def list_todos(self, **kwargs: Any) -> dict:
        """
        List todos with optional filtering, sorting, and pagination.

        Keyword Args:
            page: Page number (default: 1)
            limit: Items per page (default: 20, max: 100)
            completed: Filter by completion status (bool)
            priority: Filter by priority (low, medium, high)
            sort: Sort field (created_at, updated_at, due_date, priority, title)
            order: Sort direction (asc, desc)
            search: Full-text search query
            tags: List of tags to filter by
        """
        params: dict = {}
        for key, value in kwargs.items():
            if value is not None:
                if key == "completed":
                    params[key] = str(value).lower()
                elif key == "tags" and isinstance(value, list):
                    params[key] = ",".join(value)
                else:
                    params[key] = value
        response = self.session.get(
            f"{self.base_url}/api/todos", params=params
        )
        response.raise_for_status()
        return response.json()

    def get_todo(self, todo_id: str) -> dict:
        """Get a specific todo by its ID."""
        response = self.session.get(
            f"{self.base_url}/api/todos/{todo_id}"
        )
        response.raise_for_status()
        return response.json()

    def update_todo(self, todo_id: str, data: dict) -> dict:
        """Update a todo with full replacement (PUT)."""
        response = self.session.put(
            f"{self.base_url}/api/todos/{todo_id}", json=data
        )
        response.raise_for_status()
        return response.json()

    def patch_todo(self, todo_id: str, updates: dict) -> dict:
        """Partially update a todo (PATCH)."""
        response = self.session.patch(
            f"{self.base_url}/api/todos/{todo_id}", json=updates
        )
        response.raise_for_status()
        return response.json()

    def delete_todo(self, todo_id: str) -> None:
        """Delete a todo by its ID."""
        response = self.session.delete(
            f"{self.base_url}/api/todos/{todo_id}"
        )
        response.raise_for_status()

    # -------------------------------------------------------------------------
    # User Profile
    # -------------------------------------------------------------------------

    def get_profile(self) -> dict:
        """Get the authenticated user's profile."""
        response = self.session.get(f"{self.base_url}/api/users/me")
        response.raise_for_status()
        return response.json()

    def update_profile(self, updates: dict) -> dict:
        """Update the authenticated user's profile."""
        response = self.session.put(
            f"{self.base_url}/api/users/me", json=updates
        )
        response.raise_for_status()
        return response.json()

    def delete_account(self) -> None:
        """Permanently delete the authenticated user's account."""
        response = self.session.delete(f"{self.base_url}/api/users/me")
        response.raise_for_status()

    # -------------------------------------------------------------------------
    # AI Processing
    # -------------------------------------------------------------------------

    def ai_query(self, query: str, **kwargs: Any) -> dict:
        """
        Process a simple AI query.

        Args:
            query: Natural language query (max 2000 characters)
            **kwargs: Optional — context, max_tokens, temperature
        """
        data = {"query": query, **kwargs}
        response = self.session.post(
            f"{self.base_url}/api/ai/query", json=data
        )
        response.raise_for_status()
        return response.json()

    def ai_rag(self, query: str, **kwargs: Any) -> dict:
        """
        Process a RAG (Retrieval-Augmented Generation) query.

        Args:
            query: Natural language query (max 2000 characters)
            **kwargs: Optional — collection, top_k, context, max_tokens, temperature
        """
        data = {"query": query, **kwargs}
        response = self.session.post(
            f"{self.base_url}/api/ai/rag", json=data
        )
        response.raise_for_status()
        return response.json()

    def ai_agent(
        self,
        query: str,
        allow_mutations: bool = False,
        max_steps: int = 5,
        max_tokens: int = 2000,
    ) -> dict:
        """
        Process a multi-step AI agent query.

        Args:
            query: Natural language instruction (max 4000 characters)
            allow_mutations: Allow the agent to modify todos (default: False)
            max_steps: Maximum agent steps (default: 5, max: 10)
            max_tokens: Maximum response tokens (default: 2000, max: 8000)
        """
        data = {
            "query": query,
            "context": {
                "allow_mutations": allow_mutations,
                "max_steps": max_steps,
            },
            "max_tokens": max_tokens,
        }
        response = self.session.post(
            f"{self.base_url}/api/ai/agent", json=data
        )
        response.raise_for_status()
        return response.json()
```

### Client Usage Example

```python
# Initialize the client with your access token
client = TodoApiClient(
    base_url="http://localhost:5000",
    token="YOUR_ACCESS_TOKEN",
)

# Create a new todo
todo = client.create_todo(
    "Review PR #42", priority="high", tags=["work"]
)
print(f"Created: {todo['title']} (ID: {todo['id']})")

# List incomplete todos sorted by due date
todos = client.list_todos(completed=False, sort="due_date")
for item in todos["data"]:
    status = "✓" if item["completed"] else "○"
    print(f"  {status} {item['title']} [{item['priority']}]")

# Mark a todo as completed
client.patch_todo(todo["id"], {"completed": True})

# Get user profile
profile = client.get_profile()
print(f"Logged in as: {profile['name']} ({profile['email']})")

# Ask the AI for task prioritization suggestions
result = client.ai_query("How should I prioritize my tasks today?")
print(f"AI says: {result['response']}")

# Use RAG to find relevant todos
result = client.ai_rag(
    "What tasks are related to the website launch?",
    collection="todos",
    top_k=5,
)
print(f"Found {len(result['sources'])} relevant items")
```

---

## Error Handling

All examples in this guide use `response.raise_for_status()` to raise exceptions on HTTP errors. This section demonstrates robust error handling patterns for production use. See [Troubleshooting](../troubleshooting.md) for common issues and solutions.

### Basic Error Handling

Wrap API calls with comprehensive exception handling to capture HTTP errors, connection failures, and timeouts:

```python
import requests


def safe_api_call(func, *args, **kwargs):
    """
    Wrapper with comprehensive error handling for API calls.

    Catches HTTP errors, connection failures, and timeouts,
    and prints a human-readable error message before re-raising.

    Args:
        func: The API function to call
        *args: Positional arguments for the function
        **kwargs: Keyword arguments for the function

    Returns:
        The result of the API call

    Raises:
        requests.exceptions.HTTPError: On 4xx/5xx responses
        requests.exceptions.ConnectionError: On connection failure
        requests.exceptions.Timeout: On request timeout
    """
    try:
        return func(*args, **kwargs)
    except requests.exceptions.HTTPError as e:
        # Parse the error response body for a detailed message
        error_body = e.response.json() if e.response.content else {}
        error_message = (
            error_body.get("error", {}).get("message", "Unknown error")
        )
        print(
            f"API Error {e.response.status_code}: {error_message}"
        )
        raise
    except requests.exceptions.ConnectionError:
        print(
            "Connection failed. Is the API server running at "
            f"{args[0] if args else 'the configured URL'}?"
        )
        raise
    except requests.exceptions.Timeout:
        print("Request timed out. The server may be overloaded.")
        raise
```

**Usage:**

```python
# Wrap any API call for safe error handling
todo = safe_api_call(create_todo, BASE_URL, token, "My new task")

# Or use in a try/except block directly
try:
    todos = list_todos(BASE_URL, token, priority="high")
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 401:
        print("Token expired — please refresh your access token")
    elif e.response.status_code == 429:
        print("Rate limited — wait before retrying")
```

### Automatic Token Refresh on 401

Automatically refresh the access token when a request returns `401 Unauthorized`, then retry the original request:

```python
def api_call_with_retry(
    client: TodoApiClient,
    method: str,
    *args,
    refresh_token: str,
    **kwargs,
):
    """
    Call a client method with automatic token refresh on 401 Unauthorized.

    If the initial request fails with 401, refreshes the access token
    using the provided refresh token and retries the original request.

    Args:
        client: TodoApiClient instance
        method: Name of the client method to call (e.g., 'list_todos')
        *args: Positional arguments for the method
        refresh_token: Refresh token for obtaining a new access token
        **kwargs: Keyword arguments for the method

    Returns:
        The result of the API call
    """
    try:
        return getattr(client, method)(*args, **kwargs)
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401 and refresh_token:
            # Token expired — refresh and retry
            print("Access token expired. Refreshing...")
            new_tokens = client.refresh_token(refresh_token)
            print(
                f"Token refreshed. New token expires in "
                f"{new_tokens['expires_in']} seconds."
            )
            return getattr(client, method)(*args, **kwargs)
        raise
```

**Usage:**

```python
client = TodoApiClient(
    base_url="http://localhost:5000",
    token="YOUR_ACCESS_TOKEN",
)

# This automatically refreshes the token if it expires
todos = api_call_with_retry(
    client,
    "list_todos",
    refresh_token="YOUR_REFRESH_TOKEN",
    completed=False,
)
```

---

## Async Examples (httpx)

For async Python applications (e.g., FastAPI, asyncio scripts), `httpx` provides an async HTTP client with connection pooling and HTTP/2 support.

### Install httpx

```bash
pip install httpx
```

### Async To-Do Workflow

This example demonstrates an async workflow that creates a to-do item, lists all items, and fetches multiple items in parallel:

```python
import httpx
import asyncio


async def async_todo_workflow() -> None:
    """Example async workflow using httpx for concurrent API operations."""
    async with httpx.AsyncClient(
        base_url="http://localhost:5000",
        headers={
            "Authorization": "Bearer YOUR_ACCESS_TOKEN",
            "Content-Type": "application/json",
        },
    ) as client:
        # Create a new todo
        response = await client.post(
            "/api/todos",
            json={"title": "Async task", "priority": "high"},
        )
        response.raise_for_status()
        todo = response.json()
        print(f"Created: {todo['title']} (ID: {todo['id']})")

        # List all todos
        response = await client.get("/api/todos")
        response.raise_for_status()
        todos = response.json()
        print(f"Total todos: {todos['pagination']['total']}")

        # Parallel requests — fetch multiple todos simultaneously
        # This is significantly faster than sequential requests
        todo_ids = [t["id"] for t in todos["data"][:5]]
        tasks = [client.get(f"/api/todos/{tid}") for tid in todo_ids]
        responses = await asyncio.gather(*tasks)
        print("Fetched todos in parallel:")
        for resp in responses:
            resp.raise_for_status()
            t = resp.json()
            print(f"  - {t['title']} ({t['priority']})")


# Run the async workflow
asyncio.run(async_todo_workflow())
```

### Async AI Query

AI queries benefit from async execution because they have longer response times (1–30 seconds). Use `httpx` to run multiple AI queries concurrently without blocking:

```python
import httpx
import asyncio


async def async_ai_queries() -> None:
    """Run multiple AI queries concurrently using httpx."""
    async with httpx.AsyncClient(
        base_url="http://localhost:5000",
        headers={
            "Authorization": "Bearer YOUR_ACCESS_TOKEN",
            "Content-Type": "application/json",
        },
        timeout=60.0,  # AI queries may take up to 30 seconds
    ) as client:
        # Define multiple queries to run in parallel
        queries = [
            {
                "url": "/api/ai/query",
                "json": {
                    "query": "Suggest priorities for my tasks today",
                    "max_tokens": 500,
                },
            },
            {
                "url": "/api/ai/rag",
                "json": {
                    "query": "What tasks are related to the product launch?",
                    "collection": "todos",
                    "top_k": 5,
                },
            },
        ]

        # Execute all queries concurrently
        tasks = [
            client.post(q["url"], json=q["json"]) for q in queries
        ]
        responses = await asyncio.gather(*tasks, return_exceptions=True)

        # Process results
        for i, resp in enumerate(responses):
            if isinstance(resp, Exception):
                print(f"Query {i + 1} failed: {resp}")
                continue
            resp.raise_for_status()
            data = resp.json()
            print(
                f"Query {i + 1} completed "
                f"({data['metadata']['processing_time_ms']}ms): "
                f"{data['response'][:100]}..."
            )


# Run the concurrent AI queries
asyncio.run(async_ai_queries())
```

### Async Client Class

For production async applications, wrap the httpx client in a reusable async context manager:

```python
import httpx
from typing import Any


class AsyncTodoApiClient:
    """Async Python client for the Todo Application API using httpx."""

    def __init__(
        self,
        base_url: str = "http://localhost:5000",
        token: str | None = None,
        timeout: float = 30.0,
    ) -> None:
        """
        Initialize the async API client.

        Args:
            base_url: API server base URL
            token: Optional JWT access token
            timeout: Request timeout in seconds (default: 30)
        """
        headers: dict[str, str] = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers=headers,
            timeout=timeout,
        )

    async def __aenter__(self) -> "AsyncTodoApiClient":
        """Enter async context manager."""
        return self

    async def __aexit__(self, *args: Any) -> None:
        """Close the httpx client on context exit."""
        await self.client.aclose()

    def set_token(self, token: str) -> None:
        """Set or update the authentication token."""
        self.client.headers["Authorization"] = f"Bearer {token}"

    async def create_todo(self, title: str, **kwargs: Any) -> dict:
        """Create a new to-do item."""
        response = await self.client.post(
            "/api/todos", json={"title": title, **kwargs}
        )
        response.raise_for_status()
        return response.json()

    async def list_todos(self, **kwargs: Any) -> dict:
        """List todos with optional filtering and pagination."""
        params: dict = {}
        for key, value in kwargs.items():
            if value is not None:
                if key == "completed":
                    params[key] = str(value).lower()
                elif key == "tags" and isinstance(value, list):
                    params[key] = ",".join(value)
                else:
                    params[key] = value
        response = await self.client.get("/api/todos", params=params)
        response.raise_for_status()
        return response.json()

    async def get_todo(self, todo_id: str) -> dict:
        """Get a specific todo by its ID."""
        response = await self.client.get(f"/api/todos/{todo_id}")
        response.raise_for_status()
        return response.json()

    async def patch_todo(self, todo_id: str, updates: dict) -> dict:
        """Partially update a todo."""
        response = await self.client.patch(
            f"/api/todos/{todo_id}", json=updates
        )
        response.raise_for_status()
        return response.json()

    async def delete_todo(self, todo_id: str) -> None:
        """Delete a todo by its ID."""
        response = await self.client.delete(f"/api/todos/{todo_id}")
        response.raise_for_status()

    async def ai_query(self, query: str, **kwargs: Any) -> dict:
        """Process a simple AI query."""
        response = await self.client.post(
            "/api/ai/query", json={"query": query, **kwargs}
        )
        response.raise_for_status()
        return response.json()

    async def ai_rag(self, query: str, **kwargs: Any) -> dict:
        """Process a RAG query."""
        response = await self.client.post(
            "/api/ai/rag", json={"query": query, **kwargs}
        )
        response.raise_for_status()
        return response.json()
```

**Usage:**

```python
import asyncio


async def main() -> None:
    async with AsyncTodoApiClient(
        base_url="http://localhost:5000",
        token="YOUR_ACCESS_TOKEN",
    ) as client:
        # Create and list todos concurrently
        todo = await client.create_todo("Async task", priority="high")
        todos = await client.list_todos(completed=False)

        # Run AI query with extended timeout
        result = await client.ai_query(
            "Prioritize my tasks for today", max_tokens=500
        )
        print(result["response"])


asyncio.run(main())
```
