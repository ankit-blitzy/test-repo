# Core Functionality

This document provides a detailed reference for all core functional capabilities of the To-Do List Application. It covers every task management operation — creation, editing, deletion, completion tracking, priority management, due date handling, filtering and sorting, and data storage — with API patterns, validation rules, and illustrative code examples. All operations are routed through the archie-service-backend API gateway per architectural constraint C-001.

[← Back to README](../README.md)

*Source: Technical Specification §2.2*

---

## Functionality Overview

The table below summarizes the eight core functional areas of the To-Do List Application. Each area is described in detail in its own section within this document.

| # | Functional Area | Description |
|---|----------------|-------------|
| 1 | [Task Creation](#task-creation) | Add new tasks with a title, description, priority level, and optional due date |
| 2 | [Task Editing](#task-editing) | Modify any property of an existing task with partial update support |
| 3 | [Task Deletion](#task-deletion) | Permanently remove a task from the system |
| 4 | [Completion Tracking](#completion-tracking) | Toggle a task between complete and incomplete states |
| 5 | [Priority Management](#priority-management) | Categorize tasks as High, Medium, or Low priority with sorting support |
| 6 | [Due Date Handling](#due-date-handling) | Assign deadlines, detect overdue tasks, and sort by date |
| 7 | [Task Filtering and Sorting](#task-filtering-and-sorting) | Narrow and order the task list using multiple criteria |
| 8 | [Data Storage Patterns](#data-storage-patterns) | Persist and retrieve task data in MongoDB via PyMongo |

---

## Task Creation

Task creation allows users to add new tasks to the system. The U! frontend sends a POST request to the archie-service-backend, which validates the input, assigns default values, generates timestamps, and persists the new task document in MongoDB.

*Source: Technical Specification §2.2, §4.1*

### API Pattern

| Attribute | Value |
|-----------|-------|
| Method | `POST` |
| Endpoint | `/api/tasks` |
| Content-Type | `application/json` |

### Request Fields

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `title` | String | Yes | — | Non-empty, maximum 200 characters |
| `description` | String | No | `""` (empty string) | Free-text, no length limit enforced |
| `priority` | String | No | `"Medium"` | Must be one of `"High"`, `"Medium"`, `"Low"` |
| `due_date` | String (ISO 8601) | No | `null` | Valid date in `YYYY-MM-DD` format when provided |

### Validation Rules

- **title** is required and must be a non-empty string with a maximum length of 200 characters. Requests missing a title or providing an empty string are rejected with a `400 Bad Request` response.
- **priority**, when provided, must be exactly one of `"High"`, `"Medium"`, or `"Low"`. Any other value is rejected.
- **due_date**, when provided, must be a valid ISO 8601 date string (e.g., `"2026-03-15"`). Invalid date formats are rejected.

### Illustrative Request Payload

```json
{ "title": "Review project proposal", "priority": "High", "due_date": "2026-04-01" }
```

### Illustrative Response

```json
{ "_id": "664a1b2c3d4e5f6a7b8c9d0e", "title": "Review project proposal", "priority": "High", "due_date": "2026-04-01", "is_completed": false, "created_at": "2026-03-10T12:00:00Z", "updated_at": "2026-03-10T12:00:00Z" }
```

The response returns the complete task object including the auto-generated `_id`, default `is_completed` value of `false`, and server-generated `created_at` and `updated_at` timestamps. See the [Data Model](data-model.md) for the full collection schema.

---

## Task Editing

Task editing allows users to modify one or more properties of an existing task. The archie-service-backend supports partial updates — only the fields included in the request body are changed, while all other fields remain unchanged.

*Source: Technical Specification §2.2*

### API Pattern

| Attribute | Value |
|-----------|-------|
| Method | `PATCH` |
| Endpoint | `/api/tasks/{task_id}` |
| Content-Type | `application/json` |

### Updatable Fields

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | Non-empty, maximum 200 characters |
| `description` | String | Free-text |
| `priority` | String | Must be `"High"`, `"Medium"`, or `"Low"` |
| `due_date` | String (ISO 8601) / `null` | Valid date or `null` to remove the deadline |

### Partial Update Support

Only the fields present in the request body are updated. For example, sending `{ "priority": "Low" }` updates only the priority field — the title, description, due date, and completion status remain unchanged. The `updated_at` timestamp is always refreshed on any successful edit.

### Validation Rules

The same validation rules that apply to task creation apply to task editing. The `title`, if provided, must be non-empty and at most 200 characters. The `priority`, if provided, must be one of the three accepted values. The `due_date`, if provided, must be a valid ISO 8601 date string or `null`.

### Illustrative Request

```json
{ "title": "Review updated project proposal", "priority": "Low" }
```

The response returns the full updated task object with the new `updated_at` timestamp reflecting the time of the edit.

---

## Task Deletion

Task deletion permanently removes a task document from the system. The To-Do List Application uses hard deletes — once deleted, a task cannot be recovered.

*Source: Technical Specification §2.2*

### API Pattern

| Attribute | Value |
|-----------|-------|
| Method | `DELETE` |
| Endpoint | `/api/tasks/{task_id}` |

### Deletion Workflow

1. The U! frontend sends a DELETE request with the target task's `_id` in the URL path.
2. The archie-service-backend locates the task document in MongoDB.
3. If the task exists, it is permanently removed from the `tasks` collection.
4. If the task does not exist, a `404 Not Found` response is returned.

### Cascade Behavior

Tasks are standalone documents in MongoDB with no foreign key relationships or dependent records. Deleting a task has no cascade effects on other documents.

### Illustrative Response

```json
{ "message": "Task deleted successfully", "deleted_id": "664a1b2c3d4e5f6a7b8c9d0e" }
```

---

## Completion Tracking

Completion tracking enables users to mark tasks as complete or incomplete. This is implemented as a toggle operation — each request flips the `is_completed` field between `true` and `false`.

*Source: Technical Specification §2.2*

### API Pattern

| Attribute | Value |
|-----------|-------|
| Method | `PATCH` |
| Endpoint | `/api/tasks/{task_id}/toggle-complete` |

### State Transitions

| Current State | Action | New State |
|---------------|--------|-----------|
| `is_completed: false` | Toggle | `is_completed: true` |
| `is_completed: true` | Toggle | `is_completed: false` |

The toggle is idempotent in the sense that calling it always flips the current value. The `updated_at` timestamp is refreshed on every toggle.

### Visual Implications

In the U! frontend, completed tasks are visually distinguished from active tasks. Common indicators include strikethrough text on the task title, dimmed styling, and a filled checkbox. These visual treatments are described in detail in the [UI Design](ui-design.md) documentation.

### Illustrative Response

```json
{ "_id": "664a1b2c3d4e5f6a7b8c9d0e", "is_completed": true, "updated_at": "2026-03-10T14:30:00Z" }
```

---

## Priority Management

Priority management allows users to categorize tasks by urgency. Every task carries a priority level that influences display order and visual styling in the U! frontend.

*Source: Technical Specification §2.2*

### Level Definitions

| Priority | Meaning | Use Case |
|----------|---------|----------|
| **High** | Urgent — requires immediate attention | Critical deadlines, blockers, time-sensitive tasks |
| **Medium** | Standard — default priority for new tasks | Regular work tasks, routine activities |
| **Low** | Deferrable — can be addressed later | Nice-to-have tasks, future considerations |

### Default Value

When a new task is created without specifying a priority, it defaults to **Medium**.

### Sorting Behavior

When the task list is sorted by priority, tasks are ordered from highest to lowest urgency:

**High** > **Medium** > **Low**

Tasks sharing the same priority level are sub-sorted by their `created_at` timestamp (most recent first) unless a different secondary sort is specified by the user.

### Update Mechanism

Priority is updated through the standard [task editing](#task-editing) endpoint by including the `priority` field in the PATCH request body.

### Color Mapping

Priority levels are visually represented with color-coded badges in the U! frontend:

| Priority | Color | Visual Indicator |
|----------|-------|------------------|
| **High** | Red | Red badge or border accent |
| **Medium** | Yellow / Amber | Yellow or amber badge |
| **Low** | Green | Green badge or border accent |

Detailed visual specifications are documented in the [UI Design](ui-design.md) documentation.

---

## Due Date Handling

Due date handling enables users to assign temporal deadlines to tasks. The system supports date storage, overdue detection, and date-based sorting to help users manage time-sensitive work.

*Source: Technical Specification §2.2*

### Date Format

Due dates follow the **ISO 8601** standard and are transmitted as date strings in `YYYY-MM-DD` format (e.g., `"2026-03-15"`).

### Timezone Considerations

- **Storage:** Dates are stored in UTC within MongoDB as ISODate objects.
- **Display:** The U! frontend converts stored UTC dates to the user's local timezone for display.
- **Comparison:** Overdue calculations compare the stored UTC date against the current UTC date to avoid timezone-related discrepancies.

### Overdue Logic

A task is flagged as **overdue** when both of the following conditions are true:

1. The task's `due_date` is before the current date (in UTC).
2. The task's `is_completed` field is `false`.

Tasks that are already completed are never flagged as overdue, regardless of their due date. The U! frontend applies visual indicators (such as red text or a warning icon) to overdue tasks.

### Sorting

Tasks can be sorted by `due_date` in ascending or descending order. Ascending order places the nearest deadlines first, which is the recommended default for users who want to focus on upcoming work.

### Null Handling

Tasks without a `due_date` (i.e., `due_date` is `null`) are treated as having **no deadline**. When sorting by due date:

- In ascending order, tasks without a due date appear at the end of the list.
- In descending order, tasks without a due date appear at the beginning of the list.

---

## Task Filtering and Sorting

Task filtering and sorting allow users to narrow the displayed task list and control its order. The archie-service-backend accepts query parameters to filter and sort the tasks collection, returning only the matching results to the U! frontend.

*Source: Technical Specification §2.2*

### Query Parameters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `status` | String | `all`, `active`, `completed` | Filter by completion status |
| `priority` | String | `High`, `Medium`, `Low`, `all` | Filter by priority level |
| `due_date_from` | String (ISO 8601) | Date string | Include tasks with due date on or after this date |
| `due_date_to` | String (ISO 8601) | Date string | Include tasks with due date on or before this date |
| `search` | String | Free text | Search within task titles and descriptions |
| `sort_by` | String | `created_at`, `due_date`, `priority`, `title` | Field to sort by |
| `sort_order` | String | `asc`, `desc` | Sort direction (ascending or descending) |
| `page` | Integer | Positive integer | Page number for paginated results (1-based) |
| `limit` | Integer | Positive integer | Maximum number of tasks per page |

### Combined Filters

Multiple filter criteria are applied simultaneously using **AND** logic. For example, filtering by `status=active` and `priority=High` returns only tasks that are both incomplete and high-priority.

### Pagination

For task lists that grow large, the API supports page-based pagination through the `page` and `limit` parameters. The response includes metadata indicating the total count, current page, and total pages to enable the U! frontend to render pagination controls.

### Sorting Options

| Sort Field | Behavior |
|------------|----------|
| `created_at` | Tasks ordered by creation timestamp |
| `due_date` | Tasks ordered by deadline (nulls handled per [Due Date Handling](#due-date-handling)) |
| `priority` | Tasks ordered by urgency: High > Medium > Low |
| `title` | Tasks ordered alphabetically by title |

### Illustrative Query

```bash
GET /api/tasks?status=active&priority=High&sort_by=due_date&sort_order=asc&page=1&limit=20
```

This request retrieves the first page of active, high-priority tasks sorted by their due date in ascending order, returning up to 20 results per page.

---

## Data Storage Patterns

All task data in the To-Do List Application is persisted in **MongoDB 8.0.x**. The archie-service-backend communicates with MongoDB through the **PyMongo 4.16.x** driver, executing standard CRUD operations against the `tasks` collection.

*Source: Technical Specification §6.2, §3.5*

### Connection

The archie-service-backend establishes a connection to MongoDB at startup using the PyMongo driver. The connection string is configured via the `DATABASE_URL` environment variable and managed through the flask-pymongo extension, which integrates PyMongo's connection pooling with Flask's application context.

### Operations Mapping

Each task management operation maps to a corresponding PyMongo method:

| Application Operation | PyMongo Method | Description |
|----------------------|----------------|-------------|
| Create a task | `insert_one()` | Inserts a new task document into the `tasks` collection |
| Retrieve all tasks | `find()` | Queries the `tasks` collection with optional filters and sorting |
| Retrieve a single task | `find_one()` | Retrieves a single task document by its `_id` |
| Update a task | `update_one()` | Applies partial updates to a task document using `$set` |
| Delete a task | `delete_one()` | Removes a task document from the `tasks` collection by `_id` |

### Data Integrity

- **Timestamps:** The `created_at` field is set server-side at insertion time and is never modified. The `updated_at` field is refreshed on every update operation.
- **Validation:** Input validation is performed in the archie-service-backend before any database write. Invalid requests are rejected before reaching MongoDB.
- **Atomicity:** Each PyMongo operation (`insert_one`, `update_one`, `delete_one`) is atomic at the document level, ensuring no partial writes occur.

### Cross-References

- See [Data Model](data-model.md) for the complete collection schema, field definitions, indexing strategy, and sample documents.
- See [Technology Stack](technology-stack.md) for details on MongoDB 8.0.x and PyMongo 4.16.x configuration and justification.
- See [Features](features.md) for the user-facing feature catalog that maps to these operations.

---

*This document is part of the To-Do List Application documentation. Return to the [README](../README.md) for the full documentation index.*
