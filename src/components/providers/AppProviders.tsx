"use client";

import type { ReactNode } from "react";

import { FloatingSettings } from "@/components/organisms/FloatingSettings/FloatingSettings";

import { I18nProvider } from "./I18nProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
      <FloatingSettings />
    </I18nProvider>
  );
}
