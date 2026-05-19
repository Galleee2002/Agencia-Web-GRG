"use client";

import { useMenuOverlay } from "@/contexts/MenuOverlayContext";

import Plasma from "./Plasma";
import styles from "./Hero.module.scss";

export function HeroBeamsBackground() {
  const { isMenuOpen } = useMenuOverlay();

  return (
    <div className={styles.heroBackdrop} aria-hidden>
      <Plasma
        color="#0099ff"
        speed={0.6}
        direction="reverse"
        scale={0.72}
        opacity={0.8}
        mouseInteractive
        paused={isMenuOpen}
      />
    </div>
  );
}
