"use client";

import type { ReactNode } from "react";

import { FloatingSettings } from "@/components/organisms/FloatingSettings/FloatingSettings";
import type { Theme } from "@/components/providers/ThemeProvider";

import { I18nProvider } from "./I18nProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <I18nProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <FloatingSettings />
      </I18nProvider>
    </ThemeProvider>
  );
}
