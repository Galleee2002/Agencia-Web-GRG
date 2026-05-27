"use client";

import type { ReactNode } from "react";

import { FloatingContactCta } from "@/components/organisms/FloatingContactCta/FloatingContactCta";
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
        {/* CTA flotante visible solo en desktop (esquina inferior derecha) */}
        <FloatingContactCta />
        {/* Settings flotante visible solo en mobile (en desktop va inline en el nav) */}
        <FloatingSettings placement="floating" />
      </I18nProvider>
    </ThemeProvider>
  );
}
