"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_EVENT = "local-storage-change";

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler);
  };
}

function getServerSnapshot() {
  return "";
}

export function useLocalStorage(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) ?? "";
      } catch {
        return "";
      }
    },
    getServerSnapshot
  );

  const setValue = useCallback(
    (newValue: string) => {
      try {
        localStorage.setItem(key, newValue);
        window.dispatchEvent(new Event(STORAGE_EVENT));
      } catch {
        // ignore
      }
    },
    [key]
  );

  return [value, setValue] as const;
}
