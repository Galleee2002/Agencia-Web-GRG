"use client";

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
};

export function HeroBeamsBackground() {
  const { isMenuOpen } = useMenuOverlay();

  return (
    <div className={styles.heroBackdrop} aria-hidden>
      <Plasma
        color={HERO_PLASMA_LIGHT.color}
        speed={HERO_PLASMA_LIGHT.speed}
        direction={HERO_PLASMA_LIGHT.direction}
        scale={HERO_PLASMA_LIGHT.scale}
        opacity={HERO_PLASMA_LIGHT.opacity}
        mouseInteractive
        paused={isMenuOpen}
      />
    </div>
  );
}
