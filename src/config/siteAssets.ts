import type { Theme } from "@/components/providers/ThemeProvider";

export const SITE_LOGO_DARK = "/logo.svg";
export const SITE_LOGO_LIGHT = "/logo-negro.svg";

export function siteLogoForTheme(theme: Theme): string {
  return theme === "dark" ? SITE_LOGO_DARK : SITE_LOGO_LIGHT;
}
