"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  setThemeCookie,
  THEME_COOKIE_NAME,
} from "@/lib/themeCookie";

export type Theme = "light" | "dark";

const STORAGE_KEY = THEME_COOKIE_NAME;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

function readThemeFromCookie(): Theme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)site-theme=(dark|light)(?:;|$)/,
  );
  if (match?.[1] === "dark" || match?.[1] === "light") {
    return match[1];
  }
  return null;
}

function resolveTheme(): Theme {
  const fromCookie = readThemeFromCookie();
  if (fromCookie) return fromCookie;
  const stored = readStoredTheme();
  if (stored) return stored;
  return "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useLayoutEffect(() => {
    const initial = resolveTheme();
    setThemeState(initial);
    applyTheme(initial);
    setThemeCookie(initial);
    try {
      localStorage.setItem(STORAGE_KEY, initial);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    setThemeCookie(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
