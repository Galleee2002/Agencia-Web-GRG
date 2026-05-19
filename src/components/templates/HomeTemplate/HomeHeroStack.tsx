"use client";

import { MenuOverlayProvider } from "@/contexts/MenuOverlayContext";
import type { ReactNode } from "react";

export function HomeHeroStack({ children }: { children: ReactNode }) {
  return <MenuOverlayProvider>{children}</MenuOverlayProvider>;
}
