import type { Theme } from "@/components/providers/ThemeProvider";

export const THEME_COOKIE_NAME = "site-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function setThemeCookie(theme: Theme): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? ";Secure"
      : "";
  document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=${THEME_COOKIE_MAX_AGE};SameSite=Lax${secure}`;
}

export function parseThemeCookie(value: string | undefined): Theme | null {
  if (value === "dark" || value === "light") return value;
  return null;
}
