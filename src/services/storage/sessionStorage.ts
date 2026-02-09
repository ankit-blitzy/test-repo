/**
 * Session Storage utility service.
 * Provides type-safe wrapper around browser sessionStorage with error handling.
 * Used for storing authentication tokens scoped to the browser tab session.
 */

/**
 * Retrieves a value from sessionStorage and deserializes it.
 * @param key - Storage key
 * @returns Deserialized value or null if not found or on error
 */
export function getSessionStorageItem<T>(key: string): T | null {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch {
    console.warn(`Error reading sessionStorage key "${key}"`);
    return null;
  }
}

/**
 * Serializes and stores a value in sessionStorage.
 * @param key - Storage key
 * @param value - Value to store (will be JSON serialized)
 */
export function setSessionStorageItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
  } catch {
    console.warn(`Error writing sessionStorage key "${key}"`);
  }
}

/**
 * Removes an item from sessionStorage.
 * @param key - Storage key to remove
 */
export function removeSessionStorageItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    console.warn(`Error removing sessionStorage key "${key}"`);
  }
}

/**
 * Clears all items from sessionStorage.
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear();
  } catch {
    console.warn('Error clearing sessionStorage');
  }
}
