import { useCallback, useEffect, useState } from "react";

export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, (value: T | ((prev: T) => T)) => void, T] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [immediateValue, delay]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setImmediateValue(value);
  }, []);

  return [debouncedValue, setValue, immediateValue];
}
