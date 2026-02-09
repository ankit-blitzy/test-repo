/**
 * Local Storage utility service.
 * Provides type-safe wrapper around browser localStorage with error handling.
 * Used for persisting cart data and user preferences across browser sessions.
 */

/**
 * Retrieves a value from localStorage and deserializes it.
 * @param key - Storage key
 * @returns Deserialized value or null if not found or on error
 */
export function getLocalStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch {
    console.warn(`Error reading localStorage key "${key}"`);
    return null;
  }
}

/**
 * Serializes and stores a value in localStorage.
 * @param key - Storage key
 * @param value - Value to store (will be JSON serialized)
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch {
    console.warn(`Error writing localStorage key "${key}"`);
  }
}

/**
 * Removes an item from localStorage.
 * @param key - Storage key to remove
 */
export function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`Error removing localStorage key "${key}"`);
  }
}

/**
 * Clears all items from localStorage.
 * Use with caution - this removes all stored data.
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch {
    console.warn('Error clearing localStorage');
  }
}
