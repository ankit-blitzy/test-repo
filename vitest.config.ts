/**
 * Vitest Test Framework Configuration
 *
 * This configuration file sets up the Vitest test runner for the Burger House
 * restaurant web application. It integrates with React, TypeScript, and provides
 * a jsdom environment for DOM testing.
 *
 * Features:
 * - jsdom environment for DOM manipulation testing
 * - Global test APIs (describe, it, expect, etc.) without explicit imports
 * - React plugin for JSX transformation and Fast Refresh during tests
 * - V8 coverage provider for code coverage reports
 * - Setup file integration for test environment configuration
 *
 * Dependencies:
 * - vitest ^4.0.17: Test runner framework
 * - @vitejs/plugin-react ^4.4.1: React support with JSX transformation
 * - @testing-library/jest-dom: Extended DOM matchers (via setup file)
 * - @testing-library/react: React component testing utilities (via setup file)
 *
 * Usage:
 * - Run tests: npm test
 * - Run with coverage: npm test -- --coverage
 * - Run in watch mode: npm test -- --watch
 *
 * @see src/test/setup.ts for test environment setup including localStorage mock
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Vitest configuration exported as default
 *
 * This configuration object defines how Vitest should run tests
 * for the Burger House application.
 */
export default defineConfig({
  /**
   * Vite plugins array
   *
   * The React plugin is included to enable:
   * - JSX transformation for React components during test compilation
   * - Fast Refresh support for development testing
   * - Proper handling of React-specific syntax
   */
  plugins: [react()],

  /**
   * Vitest-specific test configuration
   */
  test: {
    /**
     * Enable global test APIs
     *
     * When true, Vitest exposes test APIs (describe, it, expect, vi, etc.)
     * globally without requiring explicit imports in each test file.
     * This provides a cleaner testing experience similar to Jest.
     */
    globals: true,

    /**
     * Test environment
     *
     * Uses jsdom to simulate a browser-like DOM environment.
     * This is required for:
     * - Testing React components with DOM manipulation
     * - Simulating user interactions (clicks, form submissions)
     * - Testing localStorage and other browser APIs
     * - React Testing Library DOM queries
     */
    environment: 'jsdom',

    /**
     * Setup files executed before tests
     *
     * References the test setup file that provides:
     * - @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
     * - Automatic cleanup after each test via @testing-library/react
     * - localStorage mock for authentication service testing
     * - Mock reset utilities for test isolation
     */
    setupFiles: ['./src/test/setup.ts'],

    /**
     * Test file inclusion patterns
     *
     * Glob pattern that matches test files in the src directory.
     * Supports multiple file extensions to accommodate various test setups:
     * - JavaScript: .js, .mjs, .cjs
     * - TypeScript: .ts, .mts, .cts
     * - React: .jsx, .tsx
     *
     * Test files must include either .test or .spec in the filename.
     * Examples: auth.test.ts, menu.spec.tsx, utils.test.js
     */
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    /**
     * Code coverage configuration
     *
     * Uses V8's built-in code coverage for performance.
     * V8 provider advantages:
     * - Native Node.js integration
     * - Faster execution than Istanbul
     * - Accurate source map support
     *
     * Run with: npm test -- --coverage
     */
    coverage: {
      provider: 'v8'
    }
  }
})
