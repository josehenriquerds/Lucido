﻿export const isBrowser = typeof window !== "undefined";

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[storage] Unable to read key "${key}"`, error);
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[storage] Unable to write key "${key}"`, error);
  }
}

export function removeStorage(key: string) {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Unable to remove key "${key}"`, error);
  }
}
