import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
}

export function setItem<T>(key: string, value: T | null): void {
  if (value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
  } else {
      localStorage.removeItem(key);
  }
}
