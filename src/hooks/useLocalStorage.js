import { useCallback, useEffect, useRef, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const initialValueRef = useRef(initialValue);
  // Always start with initialValue for SSR consistency — hydrate from localStorage in useEffect
  const [storedValue, setStoredValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const keyRef = useRef(key);

  // Hydrate from localStorage on mount / when key changes.
  useEffect(() => {
    const isKeyChange = keyRef.current !== key;
    keyRef.current = key;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setStoredValue(JSON.parse(raw));
      } else if (isKeyChange) {
        setStoredValue(initialValueRef.current);
      }
    } catch {
      setStoredValue(initialValueRef.current);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  // Persist to localStorage when the value changes.
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore storage quota errors.
    }
  }, [hydrated, key, storedValue]);

  const setValue = useCallback((updater) => {
    setStoredValue((prev) => {
      const nextValue = typeof updater === 'function' ? updater(prev) : updater;
      return nextValue;
    });
  }, []);

  return [storedValue, setValue, hydrated];
}
