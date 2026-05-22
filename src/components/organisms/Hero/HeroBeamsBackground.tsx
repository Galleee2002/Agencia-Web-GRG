"use client";

import { useMemo } from "react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useMenuOverlay } from "@/contexts/MenuOverlayContext";

import Plasma from "./Plasma";
import styles from "./Hero.module.scss";

/** Plasma en tonos claros sobre el fondo blanco del hero en light mode. */
const HERO_PLASMA_LIGHT = {
  color: "#d4e4f8",
  speed: 0.55,
  direction: "reverse" as const,
  scale: 0.76,
  opacity: 0.34,
} as const;

/** Gris más claro y algo más de opacidad para que se lea sobre #252525. */
const HERO_PLASMA_DARK = {
  color: "#b8c8dc",
  speed: 0.55,
  direction: "reverse" as const,
  scale: 0.76,
  opacity: 0.46,
} as const;

export function HeroBeamsBackground() {
  const { isMenuOpen } = useMenuOverlay();
  const { theme } = useTheme();
  const plasma = useMemo(
    () => (theme === "dark" ? HERO_PLASMA_DARK : HERO_PLASMA_LIGHT),
    [theme],
  );

  return (
    <div className={styles.heroBackdrop} aria-hidden>
      <Plasma
        color={plasma.color}
        speed={plasma.speed}
        direction={plasma.direction}
        scale={plasma.scale}
        opacity={plasma.opacity}
        mouseInteractive
        paused={isMenuOpen}
      />
    </div>
  );
}
