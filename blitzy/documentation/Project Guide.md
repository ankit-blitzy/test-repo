# Project Guide: Burger Restaurant Website — Ingredient Feature Implementation

## 1. Executive Summary

This project implements a Burger Restaurant Website frontend application built with React 19, TypeScript 5.9, Vite 7.3, and Tailwind CSS 4.1. The core feature addition is **menu item ingredient display**, allowing customers to see ingredients for each menu item (e.g., "Normal Burger" with quality beef patty, fresh lettuce, tomato slices, cheddar cheese, and soft burger bun).

**Project Completion: 52.3% (127 hours completed out of 243 total hours)**

The ingredient feature itself is **fully implemented and tested**. All validation gates pass: TypeScript compiles with 0 errors, Vite builds successfully, all 60 unit tests pass, and ESLint reports 0 errors. The remaining 116 hours of work consist primarily of secondary page implementations (login, register, dashboard, etc.), additional shared components, and documentation — none of which block the core ingredient feature.

### Completion Calculation
- **Completed**: 127 hours (infrastructure, types, ordering feature, stores, hooks, components, pages, utilities, styling, tests, validation fixes)
- **Remaining**: 116 hours (9 missing pages, 3 checkout components, 4 shared components, tests, docs — with 1.44x enterprise multiplier applied)
- **Total**: 127 + 116 = 243 hours
- **Formula**: 127 ÷ 243 × 100 = **52.3%**

---

## 2. Validation Results Summary

### 2.1 Final Validator Accomplishments

The Final Validator agent verified and fixed all quality gates to production-ready status:

| Gate | Status | Details |
|------|--------|---------|
| Dependencies | ✅ PASS | 287 packages installed, 0 vulnerabilities |
| TypeScript Compilation | ✅ PASS | `npx tsc --noEmit` — 0 errors, strict mode enabled |
| Vite Build | ✅ PASS | 1,922 modules transformed in 2.8s; dist: 269.17 kB JS, 30.41 kB CSS |
| Unit Tests | ✅ PASS | 60/60 tests passing across 4 test suites |
| ESLint | ✅ PASS | 0 errors, 2 intentional warnings (console.error suppression in test setup) |
| Runtime (Dev) | ✅ PASS | Vite dev server on port 5173 serves HTML correctly |
| Runtime (Preview) | ✅ PASS | Vite preview on port 4173 serves built production assets |

### 2.2 Fixes Applied During Validation

| Fix | Description |
|-----|-------------|
| ESLint config creation | Created `eslint.config.js` with ESLint 9 flat config + TypeScript parser support |
| `let` → `const` fix | Fixed prefer-const violation in `src/features/ordering/hooks/useMenu.ts` |
| Unused parameter fix | Renamed `callback` → `_callback` in `tests/setup.ts` (2 instances) |
| Unused import removal | Removed unused `vi`, `mockMenuItems`, `mockCategories` imports from test file |
| Dependency additions | Added `typescript-eslint@^8.54.0` and `@eslint/js@^9.39.2` as dev dependencies |
| `.prettierrc` creation | Created formatting rules configuration file |
| `.env.example` creation | Created environment variable template |

### 2.3 Test Results Detail

| Test Suite | Tests | Status | Duration |
|------------|-------|--------|----------|
| `cartStore.test.ts` | 24 | ✅ All pass | 11ms |
| `IngredientList.test.tsx` | 8 | ✅ All pass | 110ms |
| `MenuItemCard.test.tsx` | 11 | ✅ All pass | 197ms |
| `menuStore.test.ts` | 17 | ✅ All pass | 3,929ms |
| **Total** | **60** | **✅ 100%** | **4.25s** |

Key ingredient-specific tests verified:
- Normal Burger has all 5 correct ingredients
- Ingredient display renders with overflow ("+N more")
- Menu search filters by ingredient name
- Empty/undefined ingredient arrays handled gracefully

---

## 3. Project Hours Breakdown

### 3.1 Hours Visualization

```mermaid
pie title Project Hours Breakdown
    "Completed Work" : 127
    "Remaining Work" : 116
```

### 3.2 Completed Hours by Category (127 hours)

| Category | Files | Lines | Hours | Description |
|----------|-------|-------|-------|-------------|
| Core Infrastructure | 8/8 | ~350 | 8.5h | package.json, Vite/TS configs, entry points |
| Type Definitions | 6/6 | 563 | 10h | MenuItem (with ingredients), Cart, Order, Auth, Reservation types |
| Ordering Feature | 13/16 | 1,495 | 33h | Stores, hooks, MenuItemCard, IngredientList, CartDrawer, MenuList |
| Mock Data | 3/3 | 330 | 6h | 14 menu items with ingredients, 5 categories, helper functions |
| Page Components | 2/11 | 348 | 10h | HomePage (hero, features), MenuPage (filtering, ingredient display) |
| Shared Components | 9/13 | 571 | 17.5h | Button, Input, Header, Footer, Navigation, LoadingSpinner + barrels |
| Utilities | 4/4 | 496 | 13h | Zod validation (with ingredients), formatters, API client |
| Styling | 1/1 | 89 | 2h | Tailwind CSS 4.1 global styles with @theme config |
| Configuration | 4/5 | ~50 | 2.5h | ESLint, Prettier, .gitignore, .env.example |
| Tests | 6/6 | 849 | 21h | 60 unit tests + setup + vitest config |
| Validation Fixes | — | — | 3h | ESLint config, lint fixes, dependency additions |
| **Total** | **56 files** | **5,141** | **127h** | |

### 3.3 Remaining Hours by Task (116 hours)

| # | Task | Raw Hours | After Multiplier | Priority | Severity |
|---|------|-----------|-------------------|----------|----------|
| 1 | Implement Checkout feature components (Checkout.tsx, OrderSummary.tsx, index.ts) | 8.5h | 12h | High | High |
| 2 | Implement CartPage component with full cart management UI | 5h | 7h | High | High |
| 3 | Implement CheckoutPage component with order submission flow | 6h | 9h | High | High |
| 4 | Implement LoginPage component with form validation | 5h | 7h | Medium | Medium |
| 5 | Implement RegisterPage component with user registration | 5h | 7h | Medium | Medium |
| 6 | Implement ReservePage component with table booking | 6h | 9h | Medium | Medium |
| 7 | Implement Dashboard pages (Dashboard, Orders, Reservations, Profile) | 16h | 23h | Medium | Medium |
| 8 | Implement Modal shared component with accessibility support | 4.5h | 6h | Medium | Medium |
| 9 | Implement ErrorBoundary component for error handling | 3h | 4h | Medium | High |
| 10 | Implement ProtectedRoute component for auth guards | 3h | 4h | Medium | High |
| 11 | Update readme.MD with project documentation and setup instructions | 1h | 2h | Low | Low |
| 12 | Write missing unit tests (Button) and integration tests (menuFlow, cartFlow) | 11h | 16h | Medium | Medium |
| 13 | Create feature documentation (ordering.md, ingredients.md, menu-endpoints.md) | 5h | 7h | Low | Low |
| 14 | Configure real API environment endpoints and remove mock fallbacks | 2h | 3h | Low | Medium |
| | **Total Remaining** | **81h** | **116h** | | |

> **Enterprise multipliers applied**: Compliance (1.15×) × Uncertainty (1.25×) = 1.44× on all remaining estimates

---

## 4. Implementation Status by Group

### 4.1 File Creation Status

| Group | Planned | Created | Missing | Completion |
|-------|---------|---------|---------|------------|
| Group 1: Core Infrastructure | 8 | 8 | 0 | 100% |
| Group 2: Type Definitions | 6 | 6 | 0 | 100% |
| Group 3: Ordering Feature | 16 | 13 | 3 (Checkout) | 81% |
| Group 4: Mock Data | 3 | 3 | 0 | 100% |
| Group 5: Page Components | 11 | 2 | 9 | 18% |
| Group 6: Shared Components | 13 | 9 | 4 | 69% |
| Group 7: Utilities | 4 | 4 | 0 | 100% |
| Group 8: Styling | 1 | 1 | 0 | 100% |
| Group 9: Configuration | 5 | 4 | 1 (readme) | 80% |
| Group 10: Tests | 6 | 6 | 0 | 100% |
| **Total** | **73** | **56** | **17** | **76.7%** |

### 4.2 Core Ingredient Feature Status — 100% Complete

All ingredient-specific requirements are fully implemented and tested:

| Requirement ID | Description | Status |
|----------------|-------------|--------|
| ING-001 | MenuItem interface with `ingredients?: string[]` | ✅ Complete |
| ING-002 | Normal Burger with 5 specified ingredients in mock data | ✅ Complete |
| ING-003 | IngredientList component renders ingredient pills on MenuItemCard | ✅ Complete |
| ING-004 | Menu store filters by ingredient name in search | ✅ Complete |

### 4.3 Missing Files Detail

**9 Page Components** (placeholder routes exist in App.tsx):
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/pages/ReservePage.tsx`
- `src/pages/dashboard/DashboardPage.tsx`
- `src/pages/dashboard/OrdersPage.tsx`
- `src/pages/dashboard/ReservationsPage.tsx`
- `src/pages/dashboard/ProfilePage.tsx`

**3 Checkout Feature Components**:
- `src/features/ordering/components/Checkout/Checkout.tsx`
- `src/features/ordering/components/Checkout/OrderSummary.tsx`
- `src/features/ordering/components/Checkout/index.ts`

**4 Shared Components**:
- `src/components/ui/Modal/Modal.tsx` + `index.ts`
- `src/components/common/ErrorBoundary/ErrorBoundary.tsx`
- `src/components/common/ProtectedRoute/ProtectedRoute.tsx`

**1 Documentation Update**: `readme.MD` (currently contains placeholder text "adf")

---

## 5. Development Guide

### 5.1 System Prerequisites

| Requirement | Version | Verification Command |
|-------------|---------|---------------------|
| Node.js | ≥20.19.0 | `node --version` (verified: v20.20.0) |
| npm | ≥10.0.0 | `npm --version` (verified: 11.1.0) |
| Git | Any recent | `git --version` |
| OS | Linux, macOS, or Windows with WSL | — |

### 5.2 Environment Setup

```bash
# 1. Clone the repository and checkout the feature branch
git clone <repository-url>
cd <repository-name>
git checkout blitzy-c00cb0f5-63e3-42b5-8f0b-41605423e572

# 2. Create environment configuration
cp .env.example .env
# Edit .env with your values:
#   VITE_API_BASE_URL=http://localhost:3001/api
#   VITE_APP_NAME=Burger Restaurant
#   VITE_APP_VERSION=1.0.0
#   VITE_ENABLE_MOCK_DATA=true
```

### 5.3 Dependency Installation

```bash
# Install all dependencies (287 packages)
npm install

# Expected output: "added 287 packages" with 0 vulnerabilities
```

**Key dependencies installed:**
| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.4 | UI library |
| react-dom | 19.2.4 | React DOM bindings |
| react-router | 7.12.2 | Client-side routing |
| zustand | 5.0.11 | State management |
| zod | 3.25.67 | Schema validation |
| vite | 7.3.1 | Build tool |
| typescript | 5.9.3 | Type system |
| tailwindcss | 4.1.18 | CSS framework |
| vitest | 3.2.4 | Test runner |

### 5.4 Build & Verification

```bash
# TypeScript type check (should report 0 errors)
npx tsc --noEmit

# Production build (tsc + vite build)
npm run build
# Expected: "✓ built in ~2.8s"
# Output: dist/index.html, dist/assets/index.css (30 kB), dist/assets/index.js (269 kB)

# Run all unit tests (60 tests expected)
npm run test
# Expected: "60 passed (60)" across 4 test files

# Lint check (0 errors expected)
npm run lint
# Expected: 0 errors, 2 warnings (intentional console.error in test setup)
```

### 5.5 Application Startup

```bash
# Development server with HMR (Hot Module Replacement)
npm run dev
# → Local: http://localhost:5173/

# OR Production preview (requires build first)
npm run build && npm run preview
# → Local: http://localhost:4173/
```

### 5.6 Verification Steps

1. **Open http://localhost:5173/** — HomePage loads with hero section, "Order Now" and "Make Reservation" buttons
2. **Navigate to http://localhost:5173/menu** — MenuPage displays with:
   - Category filter sidebar (Burgers, Sides, Drinks, Desserts, Specials)
   - Search input for filtering by name, description, or ingredient
   - Menu item cards showing name, description, price, and **ingredient pills** (amber-colored tags)
   - "Normal Burger" card displaying: Quality beef patty, Fresh lettuce, Tomato slices, Cheddar cheese, Soft burger bun
   - "Add to Cart" buttons on available items
3. **Click "Add to Cart"** on any item — Cart drawer slides open from the right showing the item
4. **Search "cheddar"** — Filters to items containing "Cheddar cheese" in ingredients
5. **Other routes** (`/login`, `/register`, `/cart`, `/checkout`, `/reserve`, `/dashboard/*`) show placeholder "coming soon" pages

### 5.7 Project Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR on port 5173 |
| `npm run build` | TypeScript check + Vite production build to `dist/` |
| `npm run preview` | Serve production build on port 4173 |
| `npm run test` | Run all Vitest unit tests (non-watch mode) |
| `npm run lint` | Run ESLint on all source files |

---

## 6. Risk Assessment

### 6.1 Technical Risks

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| Missing ErrorBoundary leaves uncaught React errors unhandled | High | Medium | Application crashes show white screen | Implement ErrorBoundary component wrapping route children; prioritize in remaining tasks |
| 9 pages use PlaceholderPage — no real functionality | Medium | Certain | Users cannot login, checkout, or manage account | Implement pages sequentially: Cart/Checkout first (ordering flow), then Auth pages |
| No ProtectedRoute means all routes are publicly accessible | Medium | Medium | Unauthenticated users could access dashboard routes | Implement ProtectedRoute with auth store integration |
| Mock data only — no real API integration | Medium | Certain | Application cannot fetch real menu data or persist orders | Configure API client base URL; implement real fetch calls when backend is ready |

### 6.2 Security Risks

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| No authentication implementation | High | Certain | No user sessions, login, or protected routes | Implement auth store, login/register pages, and ProtectedRoute |
| Cart data stored in localStorage without encryption | Low | Low | Cart contents visible in browser DevTools | Acceptable for non-sensitive cart data; add encryption if storing payment info |
| No CSRF or API security headers configured | Medium | Medium | API calls vulnerable to cross-site attacks | Configure API client with CSRF tokens and proper headers when backend is ready |

### 6.3 Operational Risks

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| No error monitoring or logging infrastructure | Medium | Certain | Runtime errors go undetected | Add error boundary with logging service integration (e.g., Sentry) |
| No health check or uptime monitoring | Low | Low | Downtime not detected automatically | Add monitoring when deploying to production |
| No CI/CD pipeline configured | Medium | Certain | Manual build and deploy process | Set up GitHub Actions with build, test, lint, and deploy steps |

### 6.4 Integration Risks

| Risk | Severity | Likelihood | Impact | Mitigation |
|------|----------|------------|--------|------------|
| Backend API not yet available | High | Certain | Cannot transition from mock to real data | API client utilities and types are already prepared; swap mock data for fetch calls |
| No end-to-end test coverage | Medium | Certain | Integration issues between features undetected | Add Cypress or Playwright E2E tests for critical user flows |
| Menu API response format not finalized | Low | Medium | Type mismatches when connecting to real API | MenuAPIResponse type and Zod schemas provide validation; adjust if API format differs |

---

## 7. Human Task List (Prioritized)

### 7.1 High Priority — Blocks Core Functionality

| # | Task | Hours | Action Steps |
|---|------|-------|-------------|
| 1 | **Implement Checkout feature components** | 12h | Create `src/features/ordering/components/Checkout/Checkout.tsx` with order review, `OrderSummary.tsx` with line items and totals, `index.ts` barrel export. Wire into ordering feature barrel. Connect to cartStore for item data. |
| 2 | **Implement CartPage component** | 7h | Create `src/pages/CartPage.tsx` with cart item list, quantity controls, removal, subtotal/tax/total display. Import CartDrawer components and cartStore. Replace placeholder route in App.tsx. |
| 3 | **Implement CheckoutPage component** | 9h | Create `src/pages/CheckoutPage.tsx` with delivery/pickup selection, contact info form, order confirmation. Use Checkout feature components and Zod `createOrderSchema` for validation. Replace placeholder route. |

### 7.2 Medium Priority — Required for Production

| # | Task | Hours | Action Steps |
|---|------|-------|-------------|
| 4 | **Implement LoginPage component** | 7h | Create `src/pages/LoginPage.tsx` with email/password form. Use Zod `loginSchema` validation. Add auth store integration for session management. Replace placeholder route. |
| 5 | **Implement RegisterPage component** | 7h | Create `src/pages/RegisterPage.tsx` with full registration form. Use Zod `registerSchema` validation (email, password, first/last name, phone). Replace placeholder route. |
| 6 | **Implement ReservePage component** | 9h | Create `src/pages/ReservePage.tsx` with date/time picker, party size, contact info. Use Zod `reservationSchema` for validation. Connect to reservation types. Replace placeholder route. |
| 7 | **Implement Dashboard pages** | 23h | Create 4 files under `src/pages/dashboard/`: DashboardPage (overview with order/reservation counts), OrdersPage (order history list), ReservationsPage (reservation management), ProfilePage (user profile editing). Replace all dashboard placeholder routes. |
| 8 | **Implement Modal shared component** | 6h | Create `src/components/ui/Modal/Modal.tsx` with backdrop, focus trap, keyboard ESC handling, ARIA attributes. Create `index.ts` barrel. Used by Checkout and other features for confirmations. |
| 9 | **Implement ErrorBoundary component** | 4h | Create `src/components/common/ErrorBoundary/ErrorBoundary.tsx` as React class component with `componentDidCatch`. Display fallback UI with retry option. Wrap route children in App.tsx. |
| 10 | **Implement ProtectedRoute component** | 4h | Create `src/components/common/ProtectedRoute/ProtectedRoute.tsx`. Check auth store for session. Redirect unauthenticated users to /login. Wrap dashboard routes in App.tsx. |
| 12 | **Write missing unit and integration tests** | 16h | Create `tests/unit/components/ui/Button.test.tsx` (Button variants, click handlers, disabled state). Create `tests/integration/ordering/menuFlow.test.tsx` (menu load → filter → search). Create `tests/integration/ordering/cartFlow.test.tsx` (add to cart → update quantity → checkout). |

### 7.3 Low Priority — Optimization and Documentation

| # | Task | Hours | Action Steps |
|---|------|-------|-------------|
| 11 | **Update readme.MD with project documentation** | 2h | Replace placeholder "adf" content with project overview, tech stack, setup instructions, feature description (ingredient display), available scripts, and contributing guide. |
| 13 | **Create feature documentation** | 7h | Create `docs/features/ordering.md` (ordering flow documentation), `docs/features/ingredients.md` (ingredient display feature docs), `docs/api/menu-endpoints.md` (API contract documentation with request/response examples). |
| 14 | **Configure real API environment** | 3h | Update `src/utils/api.ts` to use `VITE_API_BASE_URL` from `.env`. Modify menuStore `fetchMenu` to call real API when `VITE_ENABLE_MOCK_DATA=false`. Add error handling for network failures. |

### 7.4 Total Remaining Hours Verification

| Priority | Tasks | Hours |
|----------|-------|-------|
| High | Tasks 1-3 | 28h |
| Medium | Tasks 4-10, 12 | 76h |
| Low | Tasks 11, 13-14 | 12h |
| **Total** | **14 tasks** | **116h** |

---

## 8. Technology Stack Reference

| Layer | Technology | Version |
|-------|-----------|---------|
| Build Tool | Vite | 7.3.1 |
| Language | TypeScript | 5.9.3 |
| UI Library | React | 19.2.4 |
| Routing | React Router | 7.12.2 |
| State Management | Zustand | 5.0.11 |
| CSS Framework | Tailwind CSS | 4.1.18 |
| Validation | Zod | 3.25.67 |
| Icons | Lucide React | 0.469.0 |
| Date Utilities | date-fns | 4.1.0 |
| CSS Utilities | clsx | 2.1.1 |
| Test Runner | Vitest | 3.2.4 |
| Testing Library | @testing-library/react | 16.3.0 |
| Linting | ESLint | 9.28.0 |
| Formatting | Prettier | 3.5.3 |

---

## 9. Repository Statistics

| Metric | Value |
|--------|-------|
| Total commits on branch | 9 |
| Files changed vs base | 59 |
| Lines added | 11,768 |
| Source files (src/) | 41 |
| Test files | 5 |
| Configuration files | 9 |
| Total project lines (non-generated) | ~5,141 |
| Production bundle JS | 269.17 kB (84.17 kB gzip) |
| Production bundle CSS | 30.41 kB (5.94 kB gzip) |
| Test execution time | 4.25 seconds |
| Test count | 60 passing, 0 failing |
| TypeScript errors | 0 |
| ESLint errors | 0 |
| npm vulnerabilities | 0 |

---

## 10. Git Commit History

| Hash | Author | Message |
|------|--------|---------|
| `ce9be60` | Blitzy Agent | fix: add ESLint config, fix lint errors, add missing config files |
| `7bc382b` | Blitzy Agent | chore: update dependencies to match Agent Action Plan specifications |
| `7fb7b07` | Blitzy Agent | Adding Blitzy Technical Specifications |
| `2c4452f` | Blitzy Agent | Adding Blitzy Project Guide: Project Status and Human Tasks Remaining |
| `4606eff` | Blitzy Agent | Implement Burger Restaurant Website with ingredient feature |
| `1fa6b0d` | Blitzy Agent | Setup: Add project configuration and dependencies |

---

## 11. Architecture Notes

### 11.1 Directory Structure
```
├── package.json                          # Dependencies and scripts
├── vite.config.ts                        # Vite 7.3 build configuration
├── tsconfig.json                         # TypeScript 5.9 strict config
├── vitest.config.ts                      # Test runner configuration
├── eslint.config.js                      # ESLint 9 flat config
├── index.html                            # SPA entry point
├── src/
│   ├── main.tsx                          # React 19 mount
│   ├── App.tsx                           # Root component + routing
│   ├── styles/global.css                 # Tailwind CSS imports
│   ├── types/                            # TypeScript interfaces
│   │   ├── menu.types.ts                 # MenuItem with ingredients[]
│   │   ├── cart.types.ts                 # Cart state types
│   │   ├── order.types.ts               # Order types
│   │   ├── auth.types.ts                # Authentication types
│   │   └── reservation.types.ts         # Reservation types
│   ├── features/ordering/               # Feature module
│   │   ├── components/
│   │   │   ├── MenuItemCard/            # Item card + IngredientList
│   │   │   ├── MenuList/                # Category-filtered grid
│   │   │   └── CartDrawer/              # Cart sidebar
│   │   ├── hooks/                       # useCart, useMenu
│   │   └── store/                       # cartStore, menuStore (Zustand)
│   ├── components/                      # Shared components
│   │   ├── ui/                          # Button, Input
│   │   ├── layout/                      # Header, Footer, Navigation
│   │   └── common/                      # LoadingSpinner
│   ├── data/                            # Mock menu items + categories
│   ├── pages/                           # HomePage, MenuPage
│   └── utils/                           # validation, formatters, api
└── tests/                               # Test suites
    ├── setup.ts                         # Test environment config
    └── unit/features/ordering/          # 4 test files (60 tests)
```

### 11.2 Data Flow for Ingredient Display
1. `MenuPage` renders → calls `useMenu()` hook
2. `useMenu()` triggers `menuStore.fetchMenu()` → loads `mockMenuItems` (with ingredients arrays)
3. `MenuPage` passes filtered items to `MenuList` component
4. `MenuList` renders `MenuItemCard` for each item
5. `MenuItemCard` checks `item.ingredients?.length > 0` → renders `IngredientList`
6. `IngredientList` displays up to 5 ingredient pills with "+N more" overflow

### 11.3 Key Design Decisions
- **Ingredients as optional `string[]`**: Backward-compatible; items without ingredients render cleanly
- **Zustand over Context**: Lighter weight, no provider wrapper needed, persist middleware for cart
- **Mock data in source**: Development-ready without backend; easily swapped via environment flag
- **Placeholder routes**: All routes configured in App.tsx; missing pages show "coming soon" rather than 404
- **Feature-based structure**: Ordering feature self-contained with components, hooks, and stores
