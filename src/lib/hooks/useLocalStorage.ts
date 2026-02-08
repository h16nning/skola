import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    return JSON.stringify(getStorageValue(key, defaultValue));
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback(() => {
    return JSON.stringify(defaultValue);
  }, [defaultValue]);

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [value, setInternalValue] = useState<T>(() => {
    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      setInternalValue(JSON.parse(storedValue) as T);
    } catch {
      setInternalValue(defaultValue);
    }
  }, [storedValue, defaultValue]);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setInternalValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event("storage"));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [key, value]
  );

  return [value, setValue];
}
