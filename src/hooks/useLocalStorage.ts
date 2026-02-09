/**
 * Custom hook for synchronized localStorage state management.
 * Provides a useState-like API that persists to localStorage.
 * Automatically serializes/deserializes values and handles errors.
 */

import { useState, useCallback } from 'react';
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '@/services/storage/localStorage';

/**
 * Hook that syncs React state with localStorage.
 * @param key - localStorage key
 * @param initialValue - Default value when no stored value exists
 * @returns Tuple of [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getLocalStorageItem<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prevValue) => {
        const nextValue = value instanceof Function ? value(prevValue) : value;
        setLocalStorageItem(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    removeLocalStorageItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
