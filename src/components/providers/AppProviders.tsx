"use client";

import type { ReactNode } from "react";

import { FloatingContactCta } from "@/components/organisms/FloatingContactCta/FloatingContactCta";
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
        {/* CTA flotante visible solo en desktop (esquina inferior derecha) */}
        <FloatingContactCta />
        {/* Settings: desktop inline en el nav; mobile en el dock del menú */}
      </I18nProvider>
    </ThemeProvider>
  );
}
