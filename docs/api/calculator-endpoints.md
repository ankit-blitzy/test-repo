# CALC API Endpoint Reference

This document provides a complete reference for all REST API endpoints exposed by the **CALC Scientific Calculator** backend. It covers standard arithmetic calculation, scientific function execution, and calculation history management. Use this reference to integrate with the backend from the React frontend or any external HTTP client.

---

## Base URL

All API endpoints are served from the Flask backend. The default base URL for local development is:

```
http://localhost:5000
```

In production, replace this with the deployed backend URL configured via the `API_BASE_URL` environment variable.

---

## Authentication

All endpoints require a valid **Auth0 JWT Bearer token** in the `Authorization` HTTP header.

**Header Format:**

```
Authorization: Bearer <token>
```

- Tokens are obtained through the Auth0 authentication flow integrated into the frontend via the `@auth0/auth0-react` SDK.
- The backend validates tokens against the Auth0 JSON Web Key Set (JWKS) endpoint and extracts the `sub` claim as the authenticated `user_id`.
- Unauthenticated requests (missing or malformed `Authorization` header) receive a **`401 Unauthorized`** response.
- Expired or tampered tokens also result in a **`401 Unauthorized`** response.

---

## Rate Limiting

To protect the backend from abuse, API requests are rate-limited on a per-user basis.

| Parameter         | Value                          |
|-------------------|--------------------------------|
| Default Limit     | 100 requests per minute        |
| Scope             | Per authenticated user         |
| Exceeded Response | `429 Too Many Requests`        |

Rate limit metadata is included in every response via the following headers:

| Header                  | Description                                      |
|-------------------------|--------------------------------------------------|
| `X-RateLimit-Limit`     | Maximum number of requests allowed per window     |
| `X-RateLimit-Remaining` | Number of requests remaining in the current window|
| `X-RateLimit-Reset`     | Unix timestamp when the rate limit window resets   |

---

## Calculator Endpoints

### POST /api/calculate

**Description:** Evaluate a standard arithmetic expression (addition, subtraction, multiplication, division).

#### Request

- **Method:** `POST`
- **URL:** `/api/calculate`
- **Content-Type:** `application/json`
- **Authorization:** Required (Bearer token)

**Request Body:**

| Field        | Type   | Required | Description                                                                 |
|--------------|--------|----------|-----------------------------------------------------------------------------|
| `expression` | string | Yes      | The arithmetic expression to evaluate, e.g., `"2+3"`, `"10/2"`, `"4*5-1"` |
| `type`       | string | Yes      | Must be `"standard"`                                                        |

```json
{
  "expression": "2+3",
  "type": "standard"
}
```

#### Response

**Success — `200 OK`:**

| Field        | Type   | Description                                |
|--------------|--------|--------------------------------------------|
| `result`     | number | The computed result of the expression      |
| `expression` | string | The original expression that was evaluated |

```json
{
  "result": 5,
  "expression": "2+3"
}
```

**Error Responses:**

| Status Code | Condition                                                        |
|-------------|------------------------------------------------------------------|
| `400`       | Invalid expression syntax, division by zero, missing required fields |
| `401`       | Missing or invalid JWT token                                     |
| `429`       | Rate limit exceeded                                              |
| `500`       | Unexpected server error                                          |

#### Example

```bash
curl -X POST http://localhost:5000/api/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"expression": "2+3", "type": "standard"}'
```

---

### POST /api/calculate/scientific

**Description:** Execute a scientific mathematical function such as trigonometric, logarithmic, power, root, or factorial operations.

#### Request

- **Method:** `POST`
- **URL:** `/api/calculate/scientific`
- **Content-Type:** `application/json`
- **Authorization:** Required (Bearer token)

**Request Body:**

| Field       | Type   | Required | Description                                                                                          |
|-------------|--------|----------|------------------------------------------------------------------------------------------------------|
| `function`  | string | Yes      | The scientific function name. One of: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `sqrt`, `factorial`, `power` |
| `operand`   | number | Yes      | The primary numeric input to the function                                                            |
| `angleUnit` | string | No       | Angle unit for trigonometric functions. One of: `"degrees"`, `"radians"`. Defaults to `"degrees"`    |
| `exponent`  | number | No       | Required when `function` is `"power"`. The exponent value for exponentiation                         |

```json
{
  "function": "sin",
  "operand": 45,
  "angleUnit": "degrees"
}
```

#### Supported Scientific Functions

| Function    | Description           | Input Constraints                                       |
|-------------|-----------------------|---------------------------------------------------------|
| `sin`       | Sine                  | Any numeric value; `angleUnit` applies                  |
| `cos`       | Cosine                | Any numeric value; `angleUnit` applies                  |
| `tan`       | Tangent               | Any numeric value; `angleUnit` applies                  |
| `asin`      | Inverse sine          | −1 ≤ `operand` ≤ 1                                     |
| `acos`      | Inverse cosine        | −1 ≤ `operand` ≤ 1                                     |
| `atan`      | Inverse tangent       | Any numeric value                                       |
| `log`       | Base-10 logarithm     | `operand` > 0                                           |
| `ln`        | Natural logarithm     | `operand` > 0                                           |
| `sqrt`      | Square root           | `operand` ≥ 0                                           |
| `factorial` | Factorial (n!)        | 0 ≤ `operand` ≤ 170, must be a non-negative integer     |
| `power`     | Exponentiation (xⁿ)  | Requires `exponent` parameter                           |

#### Response

**Success — `200 OK`:**

| Field      | Type   | Description                                  |
|------------|--------|----------------------------------------------|
| `result`   | number | The computed result of the scientific function|
| `function` | string | The scientific function that was executed     |
| `input`    | number | The operand value that was provided           |

```json
{
  "result": 0.7071,
  "function": "sin",
  "input": 45
}
```

**Error Responses:**

| Status Code | Condition                                                                                                                                 |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `400`       | Invalid function name, operand out of bounds (e.g., `sqrt` of negative, `log` of zero or negative, `factorial` of negative/non-integer/> 170), missing required fields |
| `401`       | Missing or invalid JWT token                                                                                                              |
| `429`       | Rate limit exceeded                                                                                                                       |
| `500`       | Unexpected server error or numeric overflow                                                                                               |

#### Examples

**Trigonometric function — sine of 45 degrees:**

```bash
curl -X POST http://localhost:5000/api/calculate/scientific \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"function": "sin", "operand": 45, "angleUnit": "degrees"}'
```

**Logarithmic function — base-10 logarithm of 100:**

```bash
curl -X POST http://localhost:5000/api/calculate/scientific \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"function": "log", "operand": 100}'
```

**Power function — 2 raised to the power of 10:**

```bash
curl -X POST http://localhost:5000/api/calculate/scientific \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"function": "power", "operand": 2, "exponent": 10}'
```

---

## History Endpoints

### GET /api/history

**Description:** Retrieve the authenticated user's calculation history, paginated and ordered by most recent first.

#### Request

- **Method:** `GET`
- **URL:** `/api/history`
- **Authorization:** Required (Bearer token)

**Query Parameters:**

| Parameter | Type    | Required | Default | Description                        |
|-----------|---------|----------|---------|------------------------------------|
| `page`    | integer | No       | 1       | Page number for pagination         |
| `limit`   | integer | No       | 25      | Number of entries per page         |

#### Response

**Success — `200 OK`:**

| Field         | Type    | Description                                             |
|---------------|---------|---------------------------------------------------------|
| `entries`     | array   | List of history entry objects (see below)               |
| `count`       | integer | Number of entries returned on this page                 |
| `page`        | integer | Current page number                                     |
| `total_pages` | integer | Total number of pages available                         |

**History Entry Object:**

| Field                 | Type          | Description                                            |
|-----------------------|---------------|--------------------------------------------------------|
| `id`                  | string        | Unique entry identifier                                |
| `expression`          | string        | The calculated expression                              |
| `result`              | number        | The calculation result                                 |
| `operation_type`      | string        | `"standard"` or `"scientific"`                         |
| `scientific_function` | string | null | Scientific function name (if `operation_type` is `"scientific"`) |
| `angle_unit`          | string | null | `"degrees"` or `"radians"` (if applicable)            |
| `created_at`          | string        | ISO 8601 timestamp of when the calculation was performed |

```json
{
  "entries": [
    {
      "id": "665a1b2c3d4e5f6a7b8c9d0e",
      "expression": "sin(45°)",
      "result": 0.7071,
      "operation_type": "scientific",
      "scientific_function": "sin",
      "angle_unit": "degrees",
      "created_at": "2026-01-20T14:30:00Z"
    },
    {
      "id": "665a1b2c3d4e5f6a7b8c9d0f",
      "expression": "2+3",
      "result": 5,
      "operation_type": "standard",
      "scientific_function": null,
      "angle_unit": null,
      "created_at": "2026-01-20T14:25:00Z"
    }
  ],
  "count": 2,
  "page": 1,
  "total_pages": 1
}
```

**Error Responses:**

| Status Code | Condition                    |
|-------------|------------------------------|
| `401`       | Missing or invalid JWT token |
| `429`       | Rate limit exceeded          |

#### Example

```bash
curl -X GET "http://localhost:5000/api/history?page=1&limit=25" \
  -H "Authorization: Bearer <token>"
```

---

### POST /api/history

**Description:** Save a completed calculation to the authenticated user's history. Calculations are automatically saved after successful execution via the calculator endpoints; this endpoint can also be used for explicit saves from the client.

#### Request

- **Method:** `POST`
- **URL:** `/api/history`
- **Content-Type:** `application/json`
- **Authorization:** Required (Bearer token)

**Request Body:**

| Field                 | Type   | Required | Description                                                          |
|-----------------------|--------|----------|----------------------------------------------------------------------|
| `expression`          | string | Yes      | The expression that was calculated, e.g., `"sin(45°)"`, `"2+3"`     |
| `result`              | number | Yes      | The calculation result                                               |
| `type`                | string | Yes      | `"standard"` or `"scientific"`                                       |
| `scientific_function` | string | No       | Function name if `type` is `"scientific"` (e.g., `"sin"`, `"log"`)  |
| `angle_unit`          | string | No       | `"degrees"` or `"radians"` if applicable to the calculation         |

```json
{
  "expression": "sin(45°)",
  "result": 0.7071,
  "type": "scientific",
  "scientific_function": "sin",
  "angle_unit": "degrees"
}
```

#### Response

**Success — `201 Created`:**

| Field        | Type   | Description                                 |
|--------------|--------|---------------------------------------------|
| `id`         | string | Unique identifier of the created entry      |
| `created_at` | string | ISO 8601 timestamp of the created entry     |

```json
{
  "id": "665a1b2c3d4e5f6a7b8c9d10",
  "created_at": "2026-01-20T14:35:00Z"
}
```

**Error Responses:**

| Status Code | Condition                                              |
|-------------|--------------------------------------------------------|
| `400`       | Missing required fields or invalid field values        |
| `401`       | Missing or invalid JWT token                           |
| `429`       | Rate limit exceeded                                    |

#### Example

```bash
curl -X POST http://localhost:5000/api/history \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"expression": "sin(45°)", "result": 0.7071, "type": "scientific", "scientific_function": "sin", "angle_unit": "degrees"}'
```

---

### DELETE /api/history

**Description:** Delete all calculation history entries for the authenticated user. This action is irreversible.

#### Request

- **Method:** `DELETE`
- **URL:** `/api/history`
- **Authorization:** Required (Bearer token)
- **Request Body:** None

#### Response

**Success — `200 OK`:**

| Field           | Type    | Description                                  |
|-----------------|---------|----------------------------------------------|
| `deleted_count` | integer | Number of history entries that were deleted   |

```json
{
  "deleted_count": 25
}
```

**Error Responses:**

| Status Code | Condition                    |
|-------------|------------------------------|
| `401`       | Missing or invalid JWT token |
| `429`       | Rate limit exceeded          |

#### Example

```bash
curl -X DELETE http://localhost:5000/api/history \
  -H "Authorization: Bearer <token>"
```

---

### DELETE /api/history/:id

**Description:** Delete a specific calculation history entry by its unique identifier.

#### Request

- **Method:** `DELETE`
- **URL:** `/api/history/:id`
- **Authorization:** Required (Bearer token)
- **Request Body:** None

**URL Parameters:**

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| `id`      | string | Yes      | The unique identifier of the history entry to delete|

#### Response

**Success — `200 OK`:**

| Field     | Type    | Description                                |
|-----------|---------|--------------------------------------------|
| `deleted` | boolean | `true` if the entry was successfully deleted|

```json
{
  "deleted": true
}
```

**Error Responses:**

| Status Code | Condition                                             |
|-------------|-------------------------------------------------------|
| `401`       | Missing or invalid JWT token                          |
| `404`       | History entry with the specified `id` does not exist  |
| `429`       | Rate limit exceeded                                   |

#### Example

```bash
curl -X DELETE http://localhost:5000/api/history/665a1b2c3d4e5f6a7b8c9d0e \
  -H "Authorization: Bearer <token>"
```

---

### POST /api/history/:id/reuse

**Description:** Retrieve a history entry's expression and result to load into the calculator for reuse. This endpoint does **NOT** create a new history entry — it only returns the stored data so the frontend can populate the calculator display.

#### Request

- **Method:** `POST`
- **URL:** `/api/history/:id/reuse`
- **Authorization:** Required (Bearer token)
- **Request Body:** None

**URL Parameters:**

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| `id`      | string | Yes      | The unique identifier of the history entry to reuse |

#### Response

**Success — `200 OK`:**

| Field        | Type   | Description                                           |
|--------------|--------|-------------------------------------------------------|
| `expression` | string | The original expression from the history entry        |
| `result`     | number | The stored result value from the history entry        |

```json
{
  "expression": "sin(45°)",
  "result": 0.7071
}
```

**Error Responses:**

| Status Code | Condition                                             |
|-------------|-------------------------------------------------------|
| `401`       | Missing or invalid JWT token                          |
| `404`       | History entry with the specified `id` does not exist  |
| `429`       | Rate limit exceeded                                   |

#### Example

```bash
curl -X POST http://localhost:5000/api/history/665a1b2c3d4e5f6a7b8c9d0e/reuse \
  -H "Authorization: Bearer <token>"
```

---

## Error Response Reference

### Standard Error Response Format

All error responses returned by the API follow a consistent JSON structure:

```json
{
  "error": "string — Error type identifier",
  "message": "string — Human-readable error description",
  "status_code": 400
}
```

| Field         | Type    | Description                                              |
|---------------|---------|----------------------------------------------------------|
| `error`       | string  | A machine-readable error type identifier (e.g., `"ValueError"`, `"ZeroDivisionError"`) |
| `message`     | string  | A human-readable description of what went wrong          |
| `status_code` | integer | The HTTP status code of the error response               |

### Error Codes Summary

| Status Code | Name                  | Description                          | Example Scenarios                                                                                           |
|-------------|-----------------------|--------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `400`       | Bad Request           | Validation errors, math domain errors| Invalid expression, division by zero, `sqrt` of negative, `log` of zero, `factorial` bounds exceeded, missing required fields |
| `401`       | Unauthorized          | Authentication failure               | Missing `Authorization` header, expired JWT token, invalid token signature                                  |
| `404`       | Not Found             | Resource not found                   | History entry ID does not exist                                                                             |
| `429`       | Too Many Requests     | Rate limit exceeded                  | More than 100 requests per minute per user                                                                  |
| `500`       | Internal Server Error | Unexpected server error              | Unhandled exception, database connection failure, numeric overflow                                          |

### Math Domain Error Examples

**Division by zero:**

```json
{
  "error": "ZeroDivisionError",
  "message": "Division by zero is not allowed",
  "status_code": 400
}
```

**Square root of a negative number:**

```json
{
  "error": "ValueError",
  "message": "Cannot take square root of negative number",
  "status_code": 400
}
```

**Logarithm of zero or negative value:**

```json
{
  "error": "ValueError",
  "message": "Logarithm undefined for zero or negative values",
  "status_code": 400
}
```

**Factorial out of bounds:**

```json
{
  "error": "ValueError",
  "message": "Factorial requires a non-negative integer between 0 and 170",
  "status_code": 400
}
```

**Overflow error:**

```json
{
  "error": "OverflowError",
  "message": "Result too large to represent",
  "status_code": 400
}
```

---

## Data Schemas

### Calculation History Document

The `calculation_history` MongoDB collection stores individual calculation records. Each document follows this schema:

| Field                 | Type          | Description                                                                        |
|-----------------------|---------------|------------------------------------------------------------------------------------|
| `_id`                 | ObjectId      | Auto-generated unique identifier                                                   |
| `user_id`             | string        | Auth0 user `sub` claim identifying the document owner                              |
| `expression`          | string        | The evaluated expression (e.g., `"2+3"`, `"sin(45°)"`)                            |
| `result`              | number        | The computation result                                                             |
| `operation_type`      | string        | `"standard"` or `"scientific"`                                                     |
| `scientific_function` | string | null | Scientific function name if applicable (e.g., `"sin"`, `"log"`, `"factorial"`)     |
| `angle_unit`          | string | null | `"degrees"`, `"radians"`, or `null` if not applicable                             |
| `created_at`          | ISODate       | Timestamp of when the calculation was created                                      |
| `expires_at`          | ISODate       | TTL expiration timestamp (`created_at` + `HISTORY_TTL_DAYS`, default 90 days)      |

**Example Document:**

```json
{
  "_id": "665a1b2c3d4e5f6a7b8c9d0e",
  "user_id": "auth0|abc123def456",
  "expression": "sin(45°)",
  "result": 0.7071067811865476,
  "operation_type": "scientific",
  "scientific_function": "sin",
  "angle_unit": "degrees",
  "created_at": "2026-01-20T14:30:00.000Z",
  "expires_at": "2026-04-20T14:30:00.000Z"
}
```

### MongoDB Indexes

The following indexes are defined on the `calculation_history` collection to optimize query performance and enable automatic document expiration:

| Index Name         | Field(s)     | Type       | Purpose                                             |
|--------------------|--------------|------------|-----------------------------------------------------|
| `idx_user_id`      | `user_id`    | Standard   | Fast lookup of a user's history entries              |
| `idx_created_at`   | `created_at` | Descending | Chronological ordering for history display           |
| `idx_ttl_expires`  | `expires_at` | TTL        | Automatic document expiration after retention period |

---

## Mathematical Constants and Precision

### Available Constants

The following mathematical constants are available for use in scientific calculations and are accessible via the scientific keypad:

| Constant | Symbol | Approximate Value       | Backend Source   | Frontend Source |
|----------|--------|-------------------------|------------------|-----------------|
| Pi       | π      | 3.141592653589793       | `math.pi`        | `mathjs.pi`     |
| Euler's  | e      | 2.718281828459045       | `math.e`         | `mathjs.e`      |

These values are sourced from the respective language standard libraries and are **never hardcoded** as approximations.

### Precision Requirements

| Context                    | Precision Detail                                                                 |
|----------------------------|----------------------------------------------------------------------------------|
| Backend computation        | C double precision (~15–17 significant decimal digits) via the Python `math` module |
| Frontend display           | Up to 10 significant digits                                                      |
| Scientific notation switch | Automatically applied when \|value\| > 10¹⁰ or \|value\| < 10⁻⁴                |
| Test comparison tolerance  | ±1×10⁻¹⁰ for floating-point equality assertions                                |

### Known Precision Boundaries

- **Factorial upper bound:** `170!` is the largest factorial representable as a 64-bit float (≈ 7.257 × 10³⁰⁶). Inputs of 171 or greater produce an overflow error.
- **Trigonometric precision:** Results are accurate to machine epsilon for inputs within normal floating-point range. Very large angle values may exhibit reduced precision due to argument reduction.
- **Logarithmic precision:** `log(1)` and `ln(1)` return exactly `0`. Values very close to 1 may exhibit floating-point rounding in the least significant digits.
