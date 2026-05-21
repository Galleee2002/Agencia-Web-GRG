import type { Locale } from "./types";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "./types";

type Listener = () => void;

let localeSnapshot: Locale = DEFAULT_LOCALE;
const listeners = new Set<Listener>();

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

if (typeof window !== "undefined") {
  localeSnapshot = readStoredLocale();
}

export function subscribeLocale(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLocaleSnapshot(): Locale {
  return localeSnapshot;
}

export function getServerLocaleSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function setLocaleSnapshot(next: Locale): void {
  if (next === localeSnapshot) return;
  localeSnapshot = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = next;
  }
  listeners.forEach((listener) => listener());
}
