# CALC - Scientific Calculator

> A full-stack web-based scientific calculator with calculation history tracking, built with Python/Flask, React/TypeScript, and MongoDB.

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1.3-000000?logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-29.2.1-2496ED?logo=docker&logoColor=white)

---

## Overview

**CALC** is a full-stack scientific calculator application that combines standard arithmetic operations with a comprehensive suite of scientific computation functions and a persistent calculation history system.

### Feature Highlights

- **Standard Arithmetic** — Addition, subtraction, multiplication, and division with decimal and percentage support
- **Scientific Functions** — Trigonometric (sin, cos, tan), logarithmic (log, ln), power/root (x², xⁿ, √x), factorial (n!), and mathematical constants (π, e)
- **Calculation History** — Automatic persistence, browsing, reuse, and management of past calculations with configurable TTL-based expiration

### Technology Stack Summary

The application is built on a modern, containerized architecture:

- **Backend:** Python 3.13 with Flask 3.1.3 providing a RESTful API layer, backed by MongoDB 8.0 for data persistence
- **Frontend:** React 19.2.1 with TypeScript 5.9.3 and TailwindCSS 4.1.x delivering a responsive single-page application
- **Authentication:** Auth0 (SaaS) for user identity management, enabling personalized calculation history
- **Infrastructure:** Docker Compose orchestrates all services (frontend, backend, database) for seamless local development and deployment

---

## Features

### Standard Calculator

- Basic arithmetic operations: addition (+), subtraction (−), multiplication (×), division (÷)
- Decimal point input and percentage (%) calculations
- Clear (C) resets the entire calculator state; Clear Entry (CE) removes the last input
- Sign toggle (±) for positive/negative number switching
- Real-time expression display with live result preview

### Scientific Calculator

- **Trigonometric functions:** `sin`, `cos`, `tan` with support for both degree and radian input modes
- **Inverse trigonometric functions:** Available through the extended scientific keypad
- **Logarithmic functions:** `log` (base-10 logarithm) and `ln` (natural logarithm)
- **Power and root operations:** `x²` (square), `xⁿ` (arbitrary exponentiation), `√x` (square root)
- **Factorial:** `n!` — computes the factorial for non-negative integers (valid range: 0–170)
- **Mathematical constants:** `π` (pi ≈ 3.14159265358979) and `e` (Euler's number ≈ 2.71828182845905)
- **Angle mode toggle:** Switch between DEG (degrees) and RAD (radians) for all trigonometric calculations
- **Parentheses:** Full support for grouped sub-expressions using `(` and `)`

### Calculation History

- **Automatic persistence:** Every successful calculation (standard and scientific) is automatically saved to the user's history
- **Browse history:** View past calculations in reverse chronological order with expression, result, timestamp, and operation type
- **Reuse results:** Load any past calculation result directly into the calculator display as the current operand
- **Clear history:** Delete individual entries or clear the entire history with a confirmation prompt
- **TTL-based expiration:** History entries automatically expire after a configurable retention period (default: 90 days)
- **User-specific storage:** Each user's history is isolated and secured via Auth0 authentication (JWT-based)

---

## Tech Stack

| Layer | Technology | Version |
|------------|------------------------------|-------------|
| Backend | Python + Flask | 3.13 / 3.1.3 |
| Frontend | React + TypeScript | 19.2.1 / 5.9.3 |
| Styling | TailwindCSS | 4.1.x |
| Database | MongoDB | 8.0 |
| Auth | Auth0 | SaaS |
| Build | Vite | 6.3.5 |
| Math Engine | mathjs (client-side) | 15.1.1 |
| HTTP Client | Axios | 1.9.0 |
| Container | Docker + Docker Compose | 29.2.1 |
| Testing | Pytest (backend) / Vitest (frontend) | 8.3.5 / 3.2.1 |

---

## Project Structure

```
├── backend/                 # Python/Flask API server
│   ├── api/                 # Route handlers (calculator, history)
│   │   ├── __init__.py      # Blueprint registration
│   │   ├── calculator_routes.py  # Calculation endpoints
│   │   └── history_routes.py     # History CRUD endpoints
│   ├── services/            # Business logic layer
│   │   ├── __init__.py
│   │   ├── calculator_service.py          # Standard arithmetic
│   │   ├── scientific_calculator_service.py  # Scientific functions
│   │   └── history_service.py             # History management
│   ├── models/              # MongoDB document models
│   │   ├── __init__.py
│   │   ├── calculation_model.py  # Calculation document schema
│   │   └── history_model.py      # History entry schema
│   ├── middleware/           # Auth & error handling
│   │   ├── __init__.py
│   │   ├── auth_middleware.py    # Auth0 JWT validation
│   │   └── error_handler.py     # Global error handlers
│   ├── utils/               # Validators and helpers
│   │   ├── __init__.py
│   │   └── validators.py        # Input validation utilities
│   ├── tests/               # Pytest test suites
│   │   ├── conftest.py           # Test fixtures
│   │   ├── unit/                 # Unit tests
│   │   └── integration/          # Integration tests
│   ├── Dockerfile           # Backend container definition
│   ├── app.py               # Flask application entry point
│   ├── config.py            # Configuration management
│   └── requirements.txt     # Python dependencies
├── frontend/                # React/TypeScript SPA
│   ├── src/
│   │   ├── components/      # React UI components
│   │   │   ├── Calculator/  # Calculator components
│   │   │   │   ├── Calculator.tsx       # Main container
│   │   │   │   ├── Display.tsx          # Expression/result display
│   │   │   │   ├── StandardKeypad.tsx   # Standard operation keys
│   │   │   │   ├── ScientificKeypad.tsx # Scientific function keys
│   │   │   │   └── ModeToggle.tsx       # Standard/Scientific toggle
│   │   │   ├── History/     # History components
│   │   │   │   ├── HistoryPanel.tsx     # History sidebar
│   │   │   │   ├── HistoryEntry.tsx     # Individual entry card
│   │   │   │   └── HistoryClearButton.tsx  # Clear action button
│   │   │   └── Layout/      # Layout components
│   │   │       ├── AppLayout.tsx        # Page layout shell
│   │   │       └── Header.tsx           # App header
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useCalculator.ts   # Calculator state management
│   │   │   ├── useHistory.ts      # History state and API sync
│   │   │   └── useScientific.ts   # Scientific mode functions
│   │   ├── services/        # API client modules
│   │   │   ├── api.ts             # Base Axios client
│   │   │   ├── calculatorApi.ts   # Calculator API methods
│   │   │   └── historyApi.ts      # History API methods
│   │   ├── utils/           # Math engine & formatters
│   │   │   ├── mathEngine.ts      # mathjs wrapper
│   │   │   └── formatters.ts      # Number display formatting
│   │   ├── types/           # TypeScript definitions
│   │   │   └── calculator.ts      # Type/enum definitions
│   │   ├── styles/          # Global CSS
│   │   │   └── globals.css        # TailwindCSS directives
│   │   ├── __tests__/       # Vitest test suites
│   │   ├── main.tsx         # Application bootstrap
│   │   └── App.tsx          # Root component
│   ├── Dockerfile           # Frontend container definition
│   ├── nginx.conf           # Production web server config
│   ├── package.json         # Node.js dependencies
│   ├── tsconfig.json        # TypeScript configuration
│   ├── vite.config.ts       # Build configuration
│   ├── tailwind.config.ts   # TailwindCSS configuration
│   └── index.html           # HTML entry point
├── docs/                    # Project documentation
│   ├── features/            # Feature specifications
│   │   ├── scientific-calculator.md  # Scientific functions spec
│   │   └── calculation-history.md    # History system spec
│   └── api/                 # API endpoint reference
│       └── calculator-endpoints.md   # Endpoint documentation
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline
├── docker-compose.yml       # Multi-service orchestration
├── .env.example             # Environment variable template
├── .gitignore               # VCS exclusion patterns
└── readme.MD                # Project documentation (this file)
```

---

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker Engine** 29.2.1 or later
- **Docker Compose** v2.x or later
- **Node.js** 22+ (only for local frontend development without Docker)
- **Python** 3.13+ (only for local backend development without Docker)
- **MongoDB** 8.0+ (or use the Docker Compose service — recommended)
- **Auth0 Account** (free tier available at [auth0.com](https://auth0.com)) for authentication configuration

---

## Getting Started

### Using Docker Compose (Recommended)

The fastest way to get the full application running locally:

```bash
# 1. Clone the repository
git clone <repo-url>
cd calc

# 2. Copy the environment variable template
cp .env.example .env

# 3. Configure your environment variables in .env
#    Required: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE
#    Optional: MONGO_URI (defaults to mongodb://mongo:27017/calc)
#              FLASK_SECRET_KEY (set a secure random string)
#              HISTORY_TTL_DAYS (defaults to 90)

# 4. Build and start all services
docker-compose up --build

# 5. Access the application
#    Frontend:     http://localhost:3000
#    Backend API:  http://localhost:5000
#    MongoDB:      mongodb://localhost:27017
```

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including MongoDB volumes):

```bash
docker-compose down -v
```

### Local Development

For development with hot-reloading and direct debugging:

**Backend (Python/Flask):**

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask development server
flask run --port 5000
```

**Frontend (React/TypeScript):**

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server with hot module replacement
npm run dev
```

**MongoDB:**

If not using Docker Compose, ensure a MongoDB 8.0+ instance is accessible and update the `MONGO_URI` in your `.env` file accordingly.

---

## API Reference

All API endpoints require a valid Auth0 JWT bearer token in the `Authorization` header.

### Calculator Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/calculate` | Evaluate a standard arithmetic expression |
| `POST` | `/api/calculate/scientific` | Execute a scientific function (sin, cos, tan, log, ln, sqrt, pow, factorial) |

**`POST /api/calculate`** — Standard Calculation

```json
// Request
{
  "expression": "2 + 3 * 4",
  "type": "standard"
}

// Response
{
  "result": 14,
  "expression": "2 + 3 * 4"
}
```

**`POST /api/calculate/scientific`** — Scientific Function

```json
// Request
{
  "function": "sin",
  "operand": 30,
  "angleUnit": "degrees"
}

// Response
{
  "result": 0.5,
  "function": "sin",
  "input": 30
}
```

### History Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/history` | Retrieve the user's calculation history (paginated, newest first) |
| `POST` | `/api/history` | Save a calculation entry to history |
| `DELETE` | `/api/history` | Clear all history entries for the authenticated user |
| `DELETE` | `/api/history/:id` | Delete a specific history entry by ID |
| `POST` | `/api/history/:id/reuse` | Load a past calculation result back into the calculator |

> For complete API documentation including request/response schemas, error codes, and authentication details, see [`docs/api/calculator-endpoints.md`](docs/api/calculator-endpoints.md).

---

## Scientific Function Reference

The following scientific functions are available in Scientific mode. All trigonometric functions support both degree (DEG) and radian (RAD) input modes, configurable via the angle mode toggle.

| Function | Description | Example | Notes |
|----------|-------------|---------|-------|
| `sin(x)` | Sine | sin(30°) = 0.5 | Accepts DEG or RAD |
| `cos(x)` | Cosine | cos(60°) = 0.5 | Accepts DEG or RAD |
| `tan(x)` | Tangent | tan(45°) = 1.0 | Accepts DEG or RAD |
| `log(x)` | Base-10 logarithm | log(100) = 2.0 | x must be > 0 |
| `ln(x)` | Natural logarithm | ln(e) = 1.0 | x must be > 0 |
| `√x` | Square root | √16 = 4.0 | x must be ≥ 0 |
| `x²` | Square | 5² = 25 | — |
| `xⁿ` | Power (exponentiation) | 2³ = 8 | Handles overflow gracefully |
| `n!` | Factorial | 5! = 120 | n must be integer, 0 ≤ n ≤ 170 |
| `π` | Pi constant | 3.14159265358979... | Sourced from `math.pi` / `mathjs` |
| `e` | Euler's number | 2.71828182845905... | Sourced from `math.e` / `mathjs` |

### Error Handling

The calculator provides descriptive error messages for invalid operations:

- **Division by zero** — "Cannot divide by zero"
- **Square root of negative number** — "Cannot take square root of negative number"
- **Logarithm of zero or negative** — "Logarithm undefined for zero or negative values"
- **Factorial of negative or non-integer** — "Factorial requires a non-negative integer (0–170)"
- **Overflow** — "Result exceeds maximum representable value"

---

## Testing

### Backend Tests (Pytest)

```bash
cd backend

# Run all tests with verbose output
pytest tests/ -v --tb=short

# Run with coverage report
pytest --cov=. tests/

# Run only unit tests
pytest tests/unit/ -v

# Run only integration tests
pytest tests/integration/ -v
```

### Frontend Tests (Vitest)

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode (for development)
npx vitest

# Run tests with coverage
npx vitest run --coverage
```

### Test Structure

- **Backend unit tests** — Verify calculator service arithmetic, scientific function accuracy, and history CRUD operations
- **Backend integration tests** — Validate API endpoint behavior including authentication enforcement and error responses
- **Frontend component tests** — Verify React component rendering, user interaction handling, and state transitions
- **Frontend hook tests** — Validate custom hook state management logic
- **Math engine tests** — Confirm client-side calculation accuracy against known mathematical values (tolerance: ±1e-10)

---

## Environment Variables

All environment variables are documented in the [`.env.example`](.env.example) template. Copy this file to `.env` and configure the values before running the application.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/calc` | No |
| `AUTH0_DOMAIN` | Auth0 tenant domain (e.g., `your-tenant.auth0.com`) | — | Yes |
| `AUTH0_AUDIENCE` | Auth0 API audience identifier | — | Yes |
| `AUTH0_CLIENT_ID` | Auth0 application client ID | — | Yes |
| `FLASK_ENV` | Flask environment mode (`development` or `production`) | `development` | No |
| `FLASK_SECRET_KEY` | Secret key for Flask session signing (use a secure random string) | — | Yes |
| `HISTORY_TTL_DAYS` | Number of days before history entries automatically expire | `90` | No |

> **Security Note:** Never commit your `.env` file to version control. The `.gitignore` is configured to exclude `.env` files while preserving `.env.example`.

---

## Architecture

### High-Level Overview

```
┌─────────────┐       ┌─────────────────┐       ┌───────────┐
│   Browser    │──────▶│  Frontend (SPA) │       │  Auth0    │
│   Client     │◀──────│  React + TS     │◀─────▶│  (SaaS)   │
└─────────────┘       │  Port 3000      │       └───────────┘
                      └────────┬────────┘              │
                               │ HTTP/REST             │ JWKS
                               ▼                       ▼
                      ┌─────────────────┐       ┌───────────┐
                      │  Backend (API)  │──────▶│  MongoDB  │
                      │  Flask/Python   │◀──────│  8.0      │
                      │  Port 5000      │       │  Port 27017│
                      └─────────────────┘       └───────────┘
```

### Design Principles

- **Layered Architecture** — Business logic resides in the service layer (`backend/services/`), HTTP concerns in the API layer (`backend/api/`), and data access through model abstractions (`backend/models/`)
- **Authentication-First** — Every API endpoint is protected by Auth0 JWT validation middleware; no endpoint is accessible without a valid bearer token
- **Stateless Backend** — Zero server-side session state; all authentication context is carried in JWT tokens, calculator state is managed client-side, and persistent data is stored in MongoDB
- **Client-Side Computation** — The `mathjs` library powers immediate client-side calculations for a responsive user experience, with server-side validation for data integrity
- **Secure Evaluation** — Expression evaluation uses the sandboxed `mathjs.evaluate()` parser; JavaScript's native `eval()` is never used due to code injection risks

---

## License

This project is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 CALC Scientific Calculator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
