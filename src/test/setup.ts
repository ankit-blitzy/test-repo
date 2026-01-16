/**
 * Vitest Test Environment Setup
 * 
 * This file configures the test environment for all Vitest tests in the
 * Burger House restaurant application. It provides:
 * - Extended DOM matchers from @testing-library/jest-dom
 * - Automatic cleanup after each test via @testing-library/react
 * - localStorage mock for authentication service tests
 * - Mock reset utilities for test isolation
 * 
 * Configuration Integration:
 * This file is referenced in vitest.config.ts via setupFiles: ['./src/test/setup.ts']
 * and executes before any test file runs.
 */

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

/**
 * Mock localStorage Implementation
 * 
 * Creates a fully functional localStorage mock that stores actual values.
 * This is necessary because jsdom doesn't provide a complete localStorage
 * implementation by default.
 * 
 * Features:
 * - getItem: Retrieves stored value or null if not found
 * - setItem: Stores value as string (matches real localStorage behavior)
 * - removeItem: Removes item from store
 * - clear: Clears all stored items
 * - length: Returns count of stored items
 * - key: Returns key at given index for iteration
 */
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    /**
     * Retrieves the value associated with the given key
     * @param key - The key to look up
     * @returns The stored value as string, or null if not found
     */
    getItem: (key: string): string | null => {
      return store[key] || null
    },
    
    /**
     * Stores a value associated with the given key
     * @param key - The key to store under
     * @param value - The value to store (converted to string)
     */
    setItem: (key: string, value: string): void => {
      store[key] = value.toString()
    },
    
    /**
     * Removes the item associated with the given key
     * @param key - The key to remove
     */
    removeItem: (key: string): void => {
      delete store[key]
    },
    
    /**
     * Clears all items from the store
     */
    clear: (): void => {
      store = {}
    },
    
    /**
     * Returns the number of items currently stored
     */
    get length(): number {
      return Object.keys(store).length
    },
    
    /**
     * Returns the key at the given index
     * @param index - The index of the key to retrieve
     * @returns The key at the given index, or null if out of bounds
     */
    key: (index: number): string | null => {
      const keys = Object.keys(store)
      return keys[index] || null
    }
  }
})()

/**
 * Setup localStorage mock globally before all tests
 * 
 * This runs once before any test file executes, ensuring the
 * localStorage mock is available throughout the test suite.
 */
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  })
})

/**
 * Cleanup after each test
 * 
 * Performs two essential cleanup operations:
 * 1. cleanup() - Unmounts React trees mounted with render() to prevent
 *    memory leaks and ensure test isolation
 * 2. localStorage.clear() - Clears all stored data to ensure tests
 *    don't leak state to subsequent tests
 * 3. vi.clearAllMocks() - Resets all mock implementations and call counts
 *    to ensure clean state for each test
 */
afterEach(() => {
  // Clean up React Testing Library rendered components
  cleanup()
  
  // Clear localStorage state between tests
  localStorage.clear()
  
  // Reset all Vitest mock state
  vi.clearAllMocks()
})
