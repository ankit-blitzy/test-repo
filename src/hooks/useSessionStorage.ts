/**
 * Custom hook for synchronized sessionStorage state management.
 * Provides a useState-like API that persists to sessionStorage.
 * Used primarily for authentication token management.
 */

import { useState, useCallback } from 'react';
import { getSessionStorageItem, setSessionStorageItem, removeSessionStorageItem } from '@/services/storage/sessionStorage';

/**
 * Hook that syncs React state with sessionStorage.
 * @param key - sessionStorage key
 * @param initialValue - Default value when no stored value exists
 * @returns Tuple of [storedValue, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getSessionStorageItem<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prevValue) => {
        const nextValue = value instanceof Function ? value(prevValue) : value;
        setSessionStorageItem(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    removeSessionStorageItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
