# Usage Guide

This guide provides step-by-step instructions for managing your to-do items using the Todo Application.

Whether you are an end user learning how to organize tasks or a developer integrating with the API, this guide covers every core task management workflow — from creating and viewing items to filtering, searching, and performing bulk operations.

*Source: Tech Spec Sections 2.2 (F-005 — Task Management), 7.2 (UI Use Cases — Standard CRUD), 7.6 (Screens and User Interactions)*

## Prerequisites

Before following this guide, ensure the following:

- **Todo Application installed and running** — see the [Installation Guide](../getting-started/installation.md)
- **User account created and authenticated** — see the [Authentication Guide](authentication.md)
- **Basic familiarity with the application interface** — see the [Quick Start Tutorial](../getting-started/quickstart.md) for a first-run walkthrough

## Table of Contents

- [Creating To-Do Items](#creating-to-do-items)
- [Viewing To-Do Items](#viewing-to-do-items)
- [Editing To-Do Items](#editing-to-do-items)
- [Completing To-Do Items](#completing-to-do-items)
- [Deleting To-Do Items](#deleting-to-do-items)
- [Filtering and Sorting](#filtering-and-sorting)
- [Searching](#searching)
- [Bulk Operations](#bulk-operations)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Next Steps](#next-steps)

---

## Creating To-Do Items

Creating a new to-do item is the most common action in the application. You can add items through the user interface or programmatically through the API.

### Using the User Interface

1. Navigate to the main task list view (the application dashboard).
2. Click the **"Add Todo"** button or the **"+"** icon in the toolbar.
3. Fill in the item fields in the creation form:
   - **Title** (required): A brief description of what needs to be done (max 200 characters).
   - **Description** (optional): Detailed information, notes, or context for the item (max 2000 characters).
   - **Priority** (optional): Select `Low`, `Medium`, or `High`. Defaults to `Medium` if not specified.
   - **Due Date** (optional): Choose a target completion date using the date picker.
   - **Tags** (optional): Add one or more labels to organize and categorize the item (e.g., `work`, `personal`, `urgent`).
4. Click **"Create"** or **"Save"** to submit the new item.
5. The new to-do item appears at the top of your task list.

### Using the API

Developers can create to-do items programmatically by sending a `POST` request to the todos endpoint:

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "medium",
    "due_date": "2026-04-01T00:00:00Z",
    "tags": ["shopping", "personal"]
  }'
```

**Expected Response** (`201 Created`):

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "priority": "medium",
  "due_date": "2026-04-01T00:00:00Z",
  "tags": ["shopping", "personal"],
  "created_at": "2026-03-24T10:30:00Z",
  "updated_at": "2026-03-24T10:30:00Z",
  "user_id": "507f1f77bcf86cd799439012"
}
```

> **Tip:** The AI assistant can also create to-do items from natural language input. Instead of filling out a form, you can type something like *"Remind me to buy groceries tomorrow"* and the AI will parse and create the item for you. See the [AI Features Guide](ai-features.md) for details.

*Source: Tech Spec Section 7.2 — Standard CRUD Interaction Pattern*

---

## Viewing To-Do Items

The application provides two views for inspecting your to-do items: the task list view for browsing all items at a glance, and the task detail view for examining a single item in full.

### Task List View

The main dashboard displays all of your to-do items in a list format. Each row in the list shows the following information:

- **Completion checkbox** — indicates whether the item is complete or active
- **Title** — the item's title text
- **Priority indicator** — a color-coded badge showing `Low`, `Medium`, or `High`
- **Due date** — the target completion date (highlighted if overdue)
- **Tags** — category labels attached to the item

For large lists, results are **paginated**. Use the page navigation controls at the bottom of the list to move between pages, or adjust the number of items displayed per page.

### Task Detail View

Click on any to-do item in the list to open its detail view. The detail view displays all available fields:

| Field | Description |
| --- | --- |
| Title | The item's title text |
| Description | Detailed notes and context |
| Priority | `Low`, `Medium`, or `High` |
| Due Date | Target completion date |
| Tags | Category labels |
| Completion Status | Whether the item is complete or active |
| Created Date | When the item was originally created |
| Last Modified | When the item was last updated |

### API Examples

Retrieve your to-do items programmatically using `GET` requests:

```bash
# List all to-do items
curl -X GET "http://localhost:5000/api/todos" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**List Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "priority": "medium",
      "due_date": "2026-04-01T00:00:00Z",
      "tags": ["shopping", "personal"],
      "created_at": "2026-03-24T10:30:00Z",
      "updated_at": "2026-03-24T10:30:00Z",
      "user_id": "507f1f77bcf86cd799439012"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

```bash
# Get a specific to-do item by ID
curl -X GET "http://localhost:5000/api/todos/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Detail Response** (`200 OK`):

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "priority": "medium",
  "due_date": "2026-04-01T00:00:00Z",
  "tags": ["shopping", "personal"],
  "created_at": "2026-03-24T10:30:00Z",
  "updated_at": "2026-03-24T10:30:00Z",
  "user_id": "507f1f77bcf86cd799439012"
}
```

For the complete endpoint specification including all query parameters, request headers, and error codes, see the [Todo API Endpoints](../api-reference/todos.md) reference.

*Source: Tech Spec Section 7.6 — Application Screens*

---

## Editing To-Do Items

You can modify any field of an existing to-do item at any time. The application supports both full replacement updates and partial field updates.

### Using the User Interface

1. Navigate to the to-do item by clicking on it in the task list.
2. Click the **"Edit"** button or the **pencil icon** to enter edit mode.
3. Modify any fields you want to change: title, description, priority, due date, or tags.
4. Click **"Save"** to apply your changes.
5. The updated to-do item reflects the changes immediately in both the detail and list views.

### Using the API

The API supports two update methods:

- **`PUT`** — Full update: replaces the entire item with the provided data. All fields should be included.
- **`PATCH`** — Partial update: updates only the fields included in the request body. Omitted fields remain unchanged.

```bash
# Full update (PUT) — replaces all fields
curl -X PUT "http://localhost:5000/api/todos/TODO_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and snacks",
    "description": "Milk, eggs, bread, chips, salsa",
    "priority": "high",
    "due_date": "2026-04-01T00:00:00Z",
    "tags": ["shopping", "personal"]
  }'
```

```bash
# Partial update (PATCH) — updates only specified fields
curl -X PATCH "http://localhost:5000/api/todos/TODO_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priority": "high"}'
```

**Response** (`200 OK`): Returns the full updated to-do item object.

> **Note:** When using `PATCH`, only the fields you include in the request body are modified. All other fields retain their current values. This is the recommended approach for small changes like updating a single field.

*Source: Tech Spec Section 7.2 — Standard CRUD Interaction Pattern*

---

## Completing To-Do Items

Marking items as complete (or incomplete) is a core workflow for tracking your progress.

### Marking an Item Complete

1. In the task list view, click the **checkbox** or **completion toggle** next to the to-do item.
2. The item updates immediately with a visual completion indicator (strikethrough text and a checked checkbox).
3. Completed items remain in your list but can be filtered out of the active view using the [Filtering and Sorting](#filtering-and-sorting) controls.

### Marking an Item Incomplete

1. Find the completed item in your list (you may need to adjust your filter to show completed items).
2. Click the **checkbox** or **completion toggle** again to un-complete the item.
3. The item returns to the active to-do list with the completion indicator removed.

### Using the API

Toggle completion status using a `PATCH` request with the `completed` field:

```bash
# Mark a to-do item as complete
curl -X PATCH "http://localhost:5000/api/todos/TODO_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

```bash
# Mark a to-do item as incomplete
curl -X PATCH "http://localhost:5000/api/todos/TODO_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": false}'
```

**Response** (`200 OK`): Returns the full updated to-do item object with the new `completed` value.

---

## Deleting To-Do Items

When a to-do item is no longer needed, you can permanently remove it from your list.

### Using the User Interface

1. Navigate to the to-do item in the task list or open its detail view.
2. Click the **"Delete"** button or the **trash icon**.
3. A confirmation dialog appears asking you to confirm the deletion.
4. Click **"Confirm"** to permanently delete the item, or **"Cancel"** to keep it.

> **Warning:** Deletion is permanent. Deleted to-do items cannot be recovered. If you want to keep a record of completed work, consider marking items as complete instead of deleting them.

### Using the API

```bash
curl -X DELETE "http://localhost:5000/api/todos/TODO_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:** `204 No Content` — the item has been permanently removed. No response body is returned.

If the item does not exist or does not belong to the authenticated user, the API returns `404 Not Found`.

---

## Filtering and Sorting

As your to-do list grows, filtering and sorting help you focus on the items that matter most right now.

### Filtering

Use the filter controls in the toolbar above the task list to narrow down displayed items:

- **By completion status:**
  - **Active** — show only incomplete items (default view)
  - **Completed** — show only completed items
  - **All** — show both active and completed items

- **By priority:**
  - **Low** — show only low-priority items
  - **Medium** — show only medium-priority items
  - **High** — show only high-priority items

- **By due date range:**
  - **Overdue** — items past their due date
  - **Due Today** — items due today
  - **Due This Week** — items due within the current week
  - **Due This Month** — items due within the current month

- **By tags:** Select one or more tags to show only items with those labels.

Multiple filters can be combined. For example, you can filter for high-priority active items due this week.

### Sorting

Use the sort controls to reorder displayed items:

- **By creation date:** Newest first or Oldest first
- **By due date:** Soonest first or Latest first
- **By priority:** Highest first or Lowest first
- **By title:** Alphabetical A–Z or Z–A

### API Examples

Apply filters and sorting via query parameters when calling the list endpoint:

```bash
# Filter by completion status and sort by due date (soonest first)
curl -X GET "http://localhost:5000/api/todos?completed=false&sort=due_date&order=asc" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

```bash
# Filter by high priority, sort by creation date (newest first)
curl -X GET "http://localhost:5000/api/todos?priority=high&sort=created_at&order=desc" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Pagination

Results are paginated by default. Use the `page` and `limit` query parameters to control pagination:

```bash
# Get page 1 with 20 items per page
curl -X GET "http://localhost:5000/api/todos?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | `1` | Page number (1-based) |
| `limit` | integer | `20` | Items per page (max 100) |
| `completed` | boolean | — | Filter by completion status (`true` or `false`) |
| `priority` | string | — | Filter by priority (`low`, `medium`, `high`) |
| `sort` | string | `created_at` | Sort field (`created_at`, `due_date`, `priority`, `title`) |
| `order` | string | `desc` | Sort order (`asc` or `desc`) |
| `search` | string | — | Full-text search in title and description |
| `tags` | string | — | Comma-separated tag filter (e.g., `work,urgent`) |

For the complete query parameter reference, see the [API Overview](../api-reference/overview.md).

---

## Searching

The search feature lets you find to-do items quickly by matching text content across your entire list.

### Search Capabilities

- **Title search** — matches text within item titles
- **Description search** — matches text within item descriptions
- **Full-text search** — searches across all text fields simultaneously

### Using the User Interface

1. Click the **search bar** at the top of the task list (or press `/` to focus it).
2. Type your search query. Results filter in real time as you type.
3. The list updates to show only items matching your query.
4. Clear the search bar to return to the full list view.

### Using the API

```bash
# Search for to-do items containing "groceries"
curl -X GET "http://localhost:5000/api/todos?search=groceries" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

The `search` parameter can be combined with other filter and sort parameters:

```bash
# Search for "meeting" among high-priority active items
curl -X GET "http://localhost:5000/api/todos?search=meeting&priority=high&completed=false" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

> **Tip:** The AI assistant can also help you find and organize items using natural language queries like *"What tasks are related to my marketing project?"*. See the [AI Features Guide](ai-features.md) for details.

---

## Bulk Operations

Bulk operations let you perform actions on multiple to-do items simultaneously, saving time when you need to manage several items at once.

### Available Operations

- **Select multiple items:** Click the checkboxes next to each item you want to include in the bulk action.
- **Bulk complete:** Mark all selected items as complete in a single action.
- **Bulk delete:** Delete all selected items at once (requires confirmation).
- **Bulk priority change:** Change the priority level of all selected items to a new value.

### Using Bulk Operations

1. **Select items:** Click the checkbox next to each to-do item you want to act on. A selection counter appears in the toolbar showing how many items are selected.
2. **Choose an action:** The bulk action toolbar appears above the list with available operations (Complete, Delete, Change Priority).
3. **Confirm:** A confirmation dialog appears before the action is executed. Review the number of affected items and click **"Confirm"** to proceed.
4. **Result:** All selected items are updated simultaneously and the list refreshes to reflect the changes.

> **Note:** Bulk operations require confirmation to prevent accidental changes. You can cancel at the confirmation step to undo your selection.

---

## Keyboard Shortcuts

Keyboard shortcuts provide fast access to common actions without using the mouse. Shortcuts are available when the task list area is focused.

| Shortcut | Action |
| --- | --- |
| `N` | Create a new to-do item |
| `E` | Edit the selected to-do item |
| `Delete` / `Backspace` | Delete the selected to-do item |
| `Space` | Toggle completion of the selected item |
| `↑` / `↓` | Navigate between to-do items in the list |
| `Enter` | Open the to-do item detail view |
| `/` | Focus the search bar |
| `Esc` | Close the current dialog or deselect items |
| `Ctrl + A` / `Cmd + A` | Select all items in the current view |

> **Note:** Keyboard shortcuts are available when the task list is focused. Click on the task list area to activate keyboard navigation. Shortcuts are disabled when a text input field or dialog is active.

---

## Next Steps

Now that you understand the core task management workflows, explore these related guides to get more out of the Todo Application:

- **AI-powered features** — Use natural language to create, find, and organize items: [AI Features Guide](ai-features.md)
- **Full API reference** — Complete endpoint documentation for developers: [API Reference](../api-reference/overview.md)
- **Authentication setup** — Configure Auth0 login, MFA, and access control: [Authentication Guide](authentication.md)
- **Docker development** — Run the full stack with Docker Compose: [Docker Development Guide](docker-development.md)
- **Troubleshooting** — Resolve common issues and error codes: [Troubleshooting](../troubleshooting.md)
