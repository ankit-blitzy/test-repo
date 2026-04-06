# Scientific Calculator Functions

The CALC application extends a standard arithmetic calculator with a comprehensive suite of scientific operations, enabling users to perform trigonometric, logarithmic, power, root, and combinatorial computations alongside basic arithmetic. Scientific mode is accessible via a **Standard/Scientific mode toggle** in the calculator UI, which expands the keypad to reveal additional function buttons.

All scientific functions are implemented on two targets to provide both immediate feedback and verified results:

- **Backend (Python 3.13):** Server-side computation using Python's built-in `math` module, providing C double-precision accuracy. Results are validated, persisted to calculation history, and returned via REST API.
- **Frontend (mathjs v15.1.1):** Client-side computation using the `mathjs` library's sandboxed expression parser, delivering instant UI responsiveness while the backend processes the request asynchronously.

---

## Function Catalog

### Trigonometric Functions

Trigonometric functions accept an angle value and return the corresponding ratio. Inverse trigonometric functions accept a ratio and return the angle. All trigonometric functions respect the current **angle unit** setting (Degrees or Radians). When the angle unit is set to **degrees**, the backend converts the input to radians using `math.radians()` before invoking the trigonometric function.

| Function | Input | Output | Backend Implementation | Frontend Implementation |
|----------|-------|--------|----------------------|------------------------|
| `sin(x)` | Angle value | Sine of x (range: -1 to 1) | `math.sin(math.radians(x))` when degrees; `math.sin(x)` when radians | `mathjs.sin(x)` with unit-aware evaluation |
| `cos(x)` | Angle value | Cosine of x (range: -1 to 1) | `math.cos(math.radians(x))` when degrees; `math.cos(x)` when radians | `mathjs.cos(x)` with unit-aware evaluation |
| `tan(x)` | Angle value | Tangent of x | `math.tan(math.radians(x))` when degrees; `math.tan(x)` when radians | `mathjs.tan(x)` with unit-aware evaluation |
| `asin(x)` | Value in range -1 to 1 | Angle (inverse sine) | `math.asin(x)` returns radians; converted to degrees via `math.degrees()` if needed | `mathjs.asin(x)` |
| `acos(x)` | Value in range -1 to 1 | Angle (inverse cosine) | `math.acos(x)` returns radians; converted to degrees via `math.degrees()` if needed | `mathjs.acos(x)` |
| `atan(x)` | Any real number | Angle (inverse tangent) | `math.atan(x)` returns radians; converted to degrees via `math.degrees()` if needed | `mathjs.atan(x)` |

> **Important:** Degree-to-radian conversion is mandatory on the backend when the `angleUnit` parameter is `"degrees"`. The backend uses `math.radians()` to perform this conversion before passing the value to any trigonometric function. Inverse trigonometric functions return values in radians by default and are converted to degrees using `math.degrees()` when the user's angle unit preference is degrees.

### Logarithmic Functions

Logarithmic functions compute the logarithm of a positive real number. Both functions reject zero and negative operands, returning a descriptive error message.

| Function | Input | Output | Backend Implementation | Frontend Implementation |
|----------|-------|--------|----------------------|------------------------|
| `log(x)` | Positive real number (x > 0) | Base-10 logarithm of x | `math.log10(x)` | `mathjs.log10(x)` |
| `ln(x)` | Positive real number (x > 0) | Natural logarithm (base e) of x | `math.log(x)` | `mathjs.log(x)` |

> **Validation:** Both `log(x)` and `ln(x)` reject zero and negative operands. Attempting to compute `log(0)`, `log(-5)`, `ln(0)`, or `ln(-3)` returns a `400 Bad Request` response with a descriptive error message.

### Power and Root Functions

Power and root functions handle exponentiation and root extraction with overflow protection and input validation.

| Function | Input | Output | Backend Implementation | Frontend Implementation |
|----------|-------|--------|----------------------|------------------------|
| `x²` | Any real number x | Square of x | `math.pow(x, 2)` | `mathjs.pow(x, 2)` |
| `xⁿ` | Base x, exponent n | x raised to the power n | `math.pow(x, n)` | `mathjs.pow(x, n)` |
| `√x` | Non-negative real number (x ≥ 0) | Square root of x | `math.sqrt(x)` | `mathjs.sqrt(x)` |

> **Validation:** The square root function (`√x`) rejects negative operands with a descriptive error message. Power functions handle overflow cases gracefully — for example, computing `10^309` (which exceeds the maximum representable float) returns a `400 Bad Request` with a "Result overflow" error rather than crashing.

### Factorial Function

The factorial function computes the product of all positive integers up to n (denoted n!).

| Function | Input | Output | Backend Implementation | Frontend Implementation |
|----------|-------|--------|----------------------|------------------------|
| `n!` | Non-negative integer (0 ≤ n ≤ 170) | Factorial of n | `math.factorial(n)` | `mathjs.factorial(n)` |

> **Critical Constraints:**
>
> - Input must be a **non-negative integer**. Negative numbers and non-integer values (e.g., 3.5, -2) are rejected with the error message: "Factorial requires a non-negative integer."
> - Input must be in the range **0 to 170** inclusive. The value 170! is the largest factorial representable as a Python float before overflow. Values above 170 are rejected with the error message: "Factorial input must be between 0 and 170."
> - `0!` is defined as `1` per mathematical convention.

### Mathematical Constants

Mathematical constants insert precise values sourced directly from the computation libraries. Hardcoded approximations are **never** used — the application always references the library-provided constant values.

| Constant | Value | Backend Source | Frontend Source |
|----------|-------|---------------|----------------|
| `π` (pi) | 3.14159265358979... (full precision from library) | `math.pi` | `mathjs.pi` |
| `e` (Euler's number) | 2.71828182845905... (full precision from library) | `math.e` | `mathjs.e` |

> **Critical Rule:** Hardcoded approximations of π or e must **never** be used anywhere in the codebase. All references to these constants must use `math.pi` / `math.e` on the backend and the `pi` / `e` constants from `mathjs` on the frontend. This ensures maximum precision and consistency across both computation targets.

---

## Angle Mode

The scientific calculator supports two angle measurement modes for trigonometric functions:

| Mode | Description | Default |
|------|-------------|---------|
| **Degrees** | Angles measured in degrees (360° = full circle) | ✅ Yes |
| **Radians** | Angles measured in radians (2π = full circle) | No |

### Default Mode

The default angle mode is **Degrees**, matching the behavior of common handheld scientific calculators. This ensures that entering `sin(90)` produces `1.0` without requiring users to understand radian conversion.

### Toggle Mechanism

A **Deg/Rad toggle button** is displayed on the scientific keypad when scientific mode is active. The toggle:

- Displays the currently active mode (e.g., "DEG" or "RAD") as a visual indicator
- Switches between Degrees and Radians on each press
- Affects all subsequent trigonometric function evaluations
- Persists for the duration of the calculator session

### Backend Conversion Process

When the `angleUnit` parameter is `"degrees"`, the backend applies the following conversion before invoking any trigonometric function:

1. Receive the angle value and `angleUnit` parameter from the API request
2. If `angleUnit` is `"degrees"`, convert the value to radians: `radians_value = math.radians(degrees_value)`
3. Pass the radians value to the trigonometric function (e.g., `math.sin(radians_value)`)
4. For inverse trigonometric functions, the result (in radians) is converted back to degrees using `math.degrees()` when the user's angle unit is degrees

When `angleUnit` is `"radians"`, no conversion is applied — the value is passed directly to the trigonometric function.

### API Contract

All trigonometric API endpoints accept an explicit `angleUnit` parameter in the request body. Valid values are:

- `"degrees"` — the operand is interpreted as a degree value
- `"radians"` — the operand is interpreted as a radian value

If `angleUnit` is omitted, the backend defaults to `"degrees"`.

### Example

| Expression | Angle Mode | Result |
|-----------|------------|--------|
| `sin(90)` | Degrees | `1.0` |
| `sin(π/2)` | Radians | `1.0` |
| `cos(0)` | Degrees | `1.0` |
| `cos(0)` | Radians | `1.0` |
| `tan(45)` | Degrees | `1.0` |

---

## Error Handling

All mathematical edge cases are caught and returned as structured JSON error responses. The backend never allows unhandled exceptions to propagate to the client.

| Error Condition | Function(s) Affected | Error Message | HTTP Status Code |
|----------------|---------------------|---------------|-----------------|
| Division by zero | Standard arithmetic (`÷`) | "Division by zero is not allowed" | 400 Bad Request |
| Logarithm of zero | `log`, `ln` | "Cannot compute logarithm of zero or negative number" | 400 Bad Request |
| Logarithm of negative number | `log`, `ln` | "Cannot compute logarithm of zero or negative number" | 400 Bad Request |
| Square root of negative number | `√x` | "Cannot compute square root of negative number" | 400 Bad Request |
| Factorial of negative number | `n!` | "Factorial requires a non-negative integer" | 400 Bad Request |
| Factorial of non-integer | `n!` | "Factorial requires a non-negative integer" | 400 Bad Request |
| Factorial input exceeds bounds (n > 170) | `n!` | "Factorial input must be between 0 and 170" | 400 Bad Request |
| Power overflow (e.g., 10^309) | `xⁿ` | "Result overflow" | 400 Bad Request |

### Error Response Format

All errors are returned as structured JSON with a consistent schema:

```json
{
  "error": "<human-readable error message>",
  "code": "<machine-readable error code>"
}
```

Example error codes include: `DIVISION_BY_ZERO`, `INVALID_LOG_INPUT`, `INVALID_SQRT_INPUT`, `INVALID_FACTORIAL_INPUT`, `FACTORIAL_OUT_OF_BOUNDS`, `RESULT_OVERFLOW`.

---

## Precision Requirements

### Backend Computation Precision

Python's `math` module uses **C double precision (IEEE 754 64-bit floating-point)**, providing approximately **15 to 17 significant decimal digits** of precision. This is the standard precision level for scientific calculators and is sufficient for all supported operations.

### Frontend Display Precision

The calculator UI displays results with up to **10 significant digits**. This avoids presenting misleading trailing digits that arise from floating-point representation artifacts while still providing practical precision for scientific work.

### Automatic Scientific Notation

The display automatically switches to scientific notation under the following conditions:

- Numbers with **absolute value greater than 10¹⁰** (10,000,000,000) are displayed in scientific notation (e.g., `1.23e+15`)
- Numbers with **absolute value less than 10⁻⁴** (0.0001) are displayed in scientific notation (e.g., `5.67e-8`)
- Numbers within the range 10⁻⁴ to 10¹⁰ are displayed in standard decimal notation

### Test Tolerance

Floating-point comparison in automated tests uses a tolerance of **±1e-10** to account for inherent floating-point representation imprecision. This tolerance is tight enough to catch meaningful errors while accommodating the expected rounding behavior of IEEE 754 arithmetic.

---

## Usage Examples

The following table provides reference examples for all supported scientific operations, including expected results verified against known mathematical values.

| Function | Input | Angle Mode | Expected Result |
|----------|-------|------------|-----------------|
| `sin(30°)` | 30 | Degrees | `0.5` |
| `cos(60°)` | 60 | Degrees | `0.5` |
| `tan(45°)` | 45 | Degrees | `1.0` |
| `sin(π/2)` | π/2 | Radians | `1.0` |
| `cos(0)` | 0 | Any | `1.0` |
| `asin(0.5)` | 0.5 | Degrees (output) | `30.0` |
| `log(100)` | 100 | N/A | `2.0` |
| `ln(e)` | e | N/A | `1.0` |
| `√16` | 16 | N/A | `4.0` |
| `√2` | 2 | N/A | `1.41421356237...` |
| `5!` | 5 | N/A | `120` |
| `0!` | 0 | N/A | `1` |
| `2^10` | base=2, exp=10 | N/A | `1024` |
| `3²` | 3 | N/A | `9` |
| `π` | — | N/A | `3.14159265358979...` (from `math.pi` / `mathjs.pi`) |
| `e` | — | N/A | `2.71828182845905...` (from `math.e` / `mathjs.e`) |

---

## API Endpoints

All calculation API endpoints require authentication. A valid **Auth0 JWT bearer token** must be included in the `Authorization` header of every request.

### Standard Arithmetic Calculation

**`POST /api/calculate`**

Evaluates a standard arithmetic expression.

**Request:**

```json
{
  "expression": "2+3",
  "type": "standard"
}
```

**Response (200 OK):**

```json
{
  "result": 5,
  "expression": "2+3"
}
```

### Scientific Function Calculation

**`POST /api/calculate/scientific`**

Executes a scientific function on a given operand.

**Request:**

```json
{
  "function": "sin",
  "operand": 45,
  "angleUnit": "degrees"
}
```

**Response (200 OK):**

```json
{
  "result": 0.7071,
  "function": "sin",
  "input": 45
}
```

### Authentication

All endpoints require a valid Auth0 JWT bearer token:

```
Authorization: Bearer <access_token>
```

Requests without a valid token receive a `401 Unauthorized` response. Expired or malformed tokens are rejected with a descriptive error message.

---

## Architecture Notes

### Dual Computation Model

The CALC application employs a **dual computation model** for scientific calculations:

- **Client-side (mathjs):** The frontend uses the `mathjs` library to evaluate expressions locally, providing **immediate UI responsiveness**. Results appear on the display as soon as the user presses the equals button or activates a scientific function, with no network latency.
- **Server-side (Python `math` module):** The backend independently computes the same operation for **validation and persistence**. The server-validated result is saved to the calculation history in MongoDB and can be used to reconcile any discrepancies with the client-side result.

### Expression Evaluation Security

JavaScript's native `eval()` function is **never** used for expression evaluation anywhere in the application. All expression parsing on the frontend is performed by `mathjs.evaluate()`, which provides a **sandboxed expression parser** that prevents code injection attacks. The parser only accepts mathematical expressions and rejects arbitrary JavaScript code.

### Layered Architecture

Scientific calculation processing follows a strict layered architecture:

1. **API Routes** (`backend/api/calculator_routes.py`) — Receive HTTP requests, validate input format, delegate to the service layer
2. **Service Layer** (`backend/services/scientific_calculator_service.py`) — Implement business logic including input validation, angle unit conversion, error handling, and computation orchestration
3. **Math Module** (Python `math` standard library) — Perform the actual mathematical computation with C double-precision accuracy

Route handlers never contain business logic directly. All computation, validation, and error handling is encapsulated within the service layer.
