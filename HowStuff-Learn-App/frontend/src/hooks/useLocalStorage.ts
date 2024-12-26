import { useState, useEffect } from 'react';

function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
    // Get initial value from localStorage or use initialValue
    const getInitialValue = () => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            }

            return initialValue instanceof Function ? initialValue() : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(getInitialValue);

    // Update localStorage when state changes
    const setValue = (value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new Event('local-storage'));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Sync state across tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                setStoredValue(JSON.parse(e.newValue));
            } else if (e.key === key) {
                // If value was removed
                setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
            }
        };

        // Custom event for same-tab updates
        const handleCustomEvent = () => {
            const item = localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleCustomEvent);
        };
    }, [key, initialValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;
