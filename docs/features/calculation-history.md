# Calculation History System

The Calculation History system is a core feature of the CALC Scientific Calculator that provides persistent tracking of all user calculations. It enables users to:

- **View** past calculations with their inputs, operations, and computed results
- **Clear** the entire history or remove individual entries selectively
- **Reuse** past calculation results as input for new operations, streamlining repetitive workflows

The system leverages **MongoDB** as its persistence layer, storing calculation records in the `calculation_history` collection. Each user's history is isolated and secured through **Auth0 authentication** — the user identity is extracted from the JWT `sub` claim, ensuring that users can only access their own calculation records. History entries are automatically expired via a configurable TTL (Time-To-Live) mechanism to manage storage growth.

---

## Workflow

### Automatic Persistence

Every successful calculation — whether standard arithmetic or scientific — is **automatically saved** to the authenticated user's history. No explicit "save" action is required from the user. This ensures a complete and seamless record of all computations.

### Data Flow

The history persistence workflow follows these steps:

1. **User Input** — The user performs a calculation by entering an expression or invoking a scientific function (e.g., `sin(45°)`, `2 + 3 × 4`) via the calculator keypad.
2. **Calculation Execution** — The `useCalculator` or `useScientific` hook evaluates the expression using the client-side `mathEngine` (powered by `mathjs`) and displays the result in the calculator display.
3. **Auto-Save Trigger** — Upon successful evaluation, the frontend `useHistory` hook automatically calls `POST /api/history` with the calculation details (expression, result, operation type).
4. **Backend Persistence** — The Flask `HistoryService` receives the request, validates the payload, enriches the document with `user_id` (from JWT), `created_at`, and `expires_at` timestamps, and inserts the record into the MongoDB `calculation_history` collection.
5. **History Panel Update** — The `HistoryPanel` component refreshes to display the newly saved entry at the top of the list, maintaining reverse chronological order.

### Flow Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌───────────────┐
│  User Input  │───▶│  Calculation  │───▶│  Display Result  │───▶│  Auto-Save via   │───▶│  Update History │
│  (Keypad)    │    │  (mathEngine)  │    │  (Display)       │    │  POST /api/hist  │    │  Panel (UI)     │
└─────────────┘    └──────────────┘    └─────────────────┘    └──────────────────┘    └───────────────┘
                                                                        │
                                                                        ▼
                                                              ┌──────────────────┐
                                                              │  MongoDB Insert   │
                                                              │  (HistoryService) │
                                                              └──────────────────┘
```

---

## Data Model

### MongoDB Collection: `calculation_history`

Each calculation is stored as a document in the `calculation_history` collection with the following schema:

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated unique document identifier |
| `user_id` | string | Auth0 `sub` claim identifying the authenticated user |
| `expression` | string | The full calculation expression (e.g., `"sin(45°)"`, `"2 + 3 × 4"`) |
| `result` | number | The computed numeric result value |
| `operation_type` | string | Enum: `"standard"` or `"scientific"` |
| `scientific_function` | string \| null | Scientific function name if applicable (e.g., `"sin"`, `"log"`); `null` for standard operations |
| `angle_unit` | string \| null | `"degrees"`, `"radians"`, or `null` for non-trigonometric operations |
| `created_at` | ISODate | Timestamp when the calculation was performed |
| `expires_at` | ISODate | Timestamp for TTL-based automatic deletion |

### Example Document

```json
{
  "_id": "ObjectId",
  "user_id": "auth0|abc123",
  "expression": "sin(45°)",
  "result": 0.7071067811865476,
  "operation_type": "scientific",
  "scientific_function": "sin",
  "angle_unit": "degrees",
  "created_at": "2026-01-20T10:30:00Z",
  "expires_at": "2026-04-20T10:30:00Z"
}
```

### MongoDB Indexes

The following indexes are created on the `calculation_history` collection to optimize query performance and enable automatic document expiration:

| Index Name | Field(s) | Type | Purpose |
|------------|----------|------|---------|
| `idx_user_id` | `user_id` | Standard | Fast lookup of a specific user's history entries |
| `idx_created_at` | `created_at` | Descending | Efficient chronological ordering for history display (most recent first) |
| `idx_ttl_expires` | `expires_at` | TTL | Automatic document expiration — MongoDB's background TTL monitor removes expired documents |

---

## TTL Expiration

### Mechanism

History entries are automatically expired and removed from the database by MongoDB's built-in TTL (Time-To-Live) monitor. This ensures that the `calculation_history` collection does not grow unbounded and that stale records are cleaned up without manual intervention.

### Configuration

- **Default Retention Period:** **90 days** from the time of calculation
- **Environment Variable:** `HISTORY_TTL_DAYS` — configurable in the `.env` file to override the default
- **Computation:** The `expires_at` field is set to `created_at + HISTORY_TTL_DAYS` at the time the history entry is inserted

### Example Configuration

To reduce the retention period to 30 days, set the following in your `.env` file:

```env
HISTORY_TTL_DAYS=30
```

### Important Notes

- MongoDB's background TTL deletion task runs approximately **every 60 seconds**. As a result, the exact time a document is deleted may vary slightly after the `expires_at` timestamp is reached.
- The TTL index is created on the `expires_at` field with `expireAfterSeconds: 0`, meaning MongoDB uses the `expires_at` value directly as the absolute expiration time.
- Changing `HISTORY_TTL_DAYS` only affects **newly created** entries. Existing entries retain their original `expires_at` value unless manually updated.

---

## Pagination

### Overview

The history retrieval endpoint supports **cursor-based pagination** to efficiently handle users with large calculation histories without loading all records into memory at once.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | The page number to retrieve (1-indexed) |
| `limit` | integer | `25` | Number of entries per page (max: 100) |

### Ordering

All history entries are returned in **descending `created_at` order** — the most recent calculations appear first.

### API Usage

```
GET /api/history?page=1&limit=25
```

### Response Format

```json
{
  "entries": [
    {
      "id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "expression": "sin(45°)",
      "result": 0.7071067811865476,
      "operation_type": "scientific",
      "scientific_function": "sin",
      "angle_unit": "degrees",
      "created_at": "2026-01-20T10:30:00Z"
    }
  ],
  "count": 42
}
```

The `count` field represents the **total number** of history entries for the user across all pages, enabling the frontend to calculate total page count and display appropriate pagination controls.

### Frontend Integration

The `HistoryPanel` component implements **scroll-based loading** for large history lists. As the user scrolls toward the bottom of the history panel, the next page of results is automatically fetched, providing a seamless infinite-scroll experience.

---

## Reuse Mechanism

### Overview

The reuse feature allows users to load a previous calculation result back into the active calculator display, enabling them to build upon past computations without manually re-entering values.

### Workflow

1. The user clicks the **"Reuse"** button on a history entry card in the `HistoryPanel`.
2. The frontend calls `POST /api/history/:id/reuse` with the history entry ID.
3. The backend retrieves the stored entry and returns the `expression` and `result`.
4. The `result` value is loaded into the calculator display as the **current operand**, ready for further operations.
5. The `expression` is displayed in the expression line for **context**, so the user can see what produced the value.

### Critical Rule: No Duplicate Entries

The reuse action **does NOT** create a new history entry. It only loads the previous result into the calculator. A new history entry is created only if the user **subsequently performs a new calculation** using the reused value. This prevents the history from being polluted with duplicate entries from repeated reuse actions.

### API Contract

**Endpoint:** `POST /api/history/:id/reuse`

**Response:**

```json
{
  "expression": "sin(45°)",
  "result": 0.7071067811865476
}
```

**Error Responses:**

| Status Code | Condition | Response |
|-------------|-----------|----------|
| 404 | History entry not found or does not belong to the authenticated user | `{ "error": "History entry not found" }` |
| 401 | Missing or invalid JWT token | `{ "error": "Authentication required" }` |

---

## Clearing History

### Overview

Users can remove calculation history entries through two mechanisms: clearing all entries at once, or deleting individual entries selectively.

### Clear All

Deletes **all** history entries for the authenticated user in a single operation.

- **Endpoint:** `DELETE /api/history`
- **Response:** `{ "deleted_count": 25 }`
- **UI Behavior:** The "Clear All" button is located at the top of the `HistoryPanel`. Clicking it triggers a **confirmation dialog** (e.g., "Are you sure you want to clear all history? This action cannot be undone.") to prevent accidental deletion. The history panel displays the empty state after successful clearing.

### Clear Individual Entry

Deletes a **single** history entry by its unique identifier.

- **Endpoint:** `DELETE /api/history/:id`
- **Response:** `{ "deleted": true }`
- **UI Behavior:** Each history entry card includes a delete action (trash icon or swipe-to-delete gesture on mobile). Deletion is immediate without a confirmation dialog for individual entries, as the action is easily reversible by re-performing the calculation.

### Error Responses

| Status Code | Condition | Response |
|-------------|-----------|----------|
| 404 | Entry ID not found or does not belong to the user | `{ "error": "History entry not found" }` |
| 401 | Missing or invalid JWT token | `{ "error": "Authentication required" }` |

---

## API Endpoints

### Endpoint Reference

All history-related API endpoints are listed below. Every endpoint requires an **Auth0 JWT bearer token** in the `Authorization` header. The `user_id` is automatically extracted from the JWT `sub` claim — users can only access their own history.

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/api/history` | Retrieve user's calculation history (paginated) | — | `{ "entries": [...], "count": 25 }` |
| POST | `/api/history` | Save a calculation to history | `{ "expression": "...", "result": ..., "type": "..." }` | `{ "id": "...", "created_at": "..." }` |
| DELETE | `/api/history` | Clear all history entries for the authenticated user | — | `{ "deleted_count": 25 }` |
| DELETE | `/api/history/:id` | Delete a specific history entry by ID | — | `{ "deleted": true }` |
| POST | `/api/history/:id/reuse` | Load a history entry's result into the calculator | — | `{ "expression": "...", "result": ... }` |

### Authentication

All endpoints enforce Auth0 JWT authentication via the `auth_middleware` decorator:

- **Header:** `Authorization: Bearer <access_token>`
- **Token Source:** Auth0-issued JWT with RS256 signature
- **User Identification:** Extracted from the `sub` claim of the decoded JWT

Requests without a valid token receive a `401 Unauthorized` response:

```json
{
  "error": "Authentication required",
  "message": "A valid Auth0 JWT bearer token is required in the Authorization header"
}
```

### Common Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid request body or missing required fields |
| 401 | Missing or invalid authentication token |
| 404 | History entry not found or does not belong to the user |
| 429 | Rate limit exceeded (default: 100 requests/minute/user) |
| 500 | Internal server error |

---

## User Interface

### HistoryPanel Component

The `HistoryPanel` provides a responsive container for displaying the user's calculation history. Its layout adapts to the viewport size:

| Viewport | Breakpoint | Layout |
|----------|------------|--------|
| Desktop | ≥1024px | Collapsible right sidebar with 320px width |
| Tablet | 768px–1023px | Bottom sheet drawer triggered by a floating action button |
| Mobile | <768px | Full-screen overlay modal |

### History Entry Cards

Each history entry is rendered as a card displaying:

- **Expression** — The original calculation expression (e.g., `sin(45°)`)
- **Result** — The computed result, displayed with an arrow separator (expression → result)
- **Timestamp** — Relative time label (e.g., "2 minutes ago", "Yesterday")
- **Operation Type Badge** — A small badge indicating `Standard` or `Scientific`
- **Reuse Button** — Loads the result into the calculator as the current operand

### Clear All Button

Located at the top of the `HistoryPanel`, the "Clear All" button:

- Displays a **confirmation dialog** before executing the clear operation
- Is disabled when there are no history entries to clear
- Triggers a full history refresh after successful clearing

### Empty State

When the user has no calculation history (either a new user or after clearing), the panel displays:

- A placeholder illustration (calculator icon or empty list graphic)
- The message: **"No calculations yet"**
- A subtle prompt encouraging the user to start calculating

### Display Order

History entries are displayed in **reverse chronological order** — the most recent calculation always appears at the top of the list. New entries animate into position at the top when saved.

---

## Security

### Authentication

All history endpoints are protected by **Auth0 JWT authentication**. Every API request must include a valid bearer token in the `Authorization` header. The backend `auth_middleware` decorator validates the token's signature (RS256) against Auth0's JWKS endpoint and verifies the token's expiration, audience, and issuer claims.

### User Isolation

Each user's history is strictly isolated from other users:

- The `user_id` field in every history document is set from the JWT `sub` claim at the time of creation
- All query operations (read, delete, reuse) include a `user_id` filter, ensuring users can **only access, modify, and delete their own entries**
- Attempting to access another user's history entry returns a `404 Not Found` response (not `403 Forbidden`, to avoid revealing the existence of other users' data)

### MongoDB Injection Prevention

All MongoDB queries are constructed using **PyMongo's parameterized query interface**. String interpolation or concatenation is never used in query construction. This eliminates the risk of NoSQL injection attacks. Example:

```python
# Correct — parameterized query
collection.find({"user_id": user_id, "_id": ObjectId(entry_id)})

# NEVER — string interpolation
collection.find({"user_id": f"{user_id}"})  # Prohibited
```

### Rate Limiting

To prevent abuse of the history endpoints, basic rate limiting is enforced:

- **Default Limit:** 100 requests per minute per authenticated user
- **Scope:** Applied to all `/api/history` endpoints
- **Response on Exceed:** `429 Too Many Requests` with a `Retry-After` header indicating when the user can resume making requests
