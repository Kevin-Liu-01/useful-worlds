import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook that mirrors `useState` but persists the value in
 * `localStorage` under the given key.  SSR-safe: returns `initialValue`
 * on the server and hydrates from storage after mount.
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      /* localStorage unavailable or corrupt — keep initialValue */
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* quota exceeded or unavailable — still update in-memory */
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
