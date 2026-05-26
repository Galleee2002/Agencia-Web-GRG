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

/** Gris claro de alto contraste sobre #252525 para que el plasma se distinga bien. */
const HERO_PLASMA_DARK = {
  color: "#e6ecf2",
  speed: 0.55,
  direction: "reverse" as const,
  scale: 0.76,
  opacity: 0.62,
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
