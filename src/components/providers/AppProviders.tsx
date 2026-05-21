"use client";

import type { ReactNode } from "react";

import { FloatingSettings } from "@/components/organisms/FloatingSettings/FloatingSettings";

import { I18nProvider } from "./I18nProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <FloatingSettings />
      </I18nProvider>
    </ThemeProvider>
  );
}
