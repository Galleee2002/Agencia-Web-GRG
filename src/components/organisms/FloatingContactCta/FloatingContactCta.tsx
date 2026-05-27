"use client";

import type { MouseEvent } from "react";
import { MessageSquare, MessageSquareMore } from "lucide-react";

import { useI18n } from "@/components/providers/I18nProvider";

import styles from "./FloatingContactCta.module.scss";

const CONTACT_HREF = "/#contact";
const CONTACT_ID = "contact";
const SCROLL_DURATION_MS = 900;

/** Ease in/out cúbico — coincide con el feel del resto de animaciones del sitio. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smooth scroll manual con RAF. Lo hacemos a mano (en vez de
 * `scrollIntoView({behavior:'smooth'})` o `window.scrollTo({behavior:'smooth'})`)
 * porque:
 *  - El sitio tiene secciones que se renderizan al entrar al viewport y
 *    cambian el alto del documento mientras el navegador interpola; los
 *    smooth scrolls nativos quedan "anclados" lejos del destino real.
 *  - Forzamos un layout completo saltando instantáneamente al destino y
 *    volviendo al origen en el mismo frame; el navegador no llega a pintar
 *    el salto pero sí materializa lazy renders y mide la altura real del
 *    footer, dejándonos un destino estable para animar.
 */
function measureDestination(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const absoluteBottom = rect.bottom + window.scrollY;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(Math.max(0, absoluteBottom - window.innerHeight), maxScroll);
}

function smoothScrollTargetBottomToViewportBottom(targetId: string) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const startY = window.scrollY;

  /* Pre-warm trick: saltamos al fondo del documento y volvemos en el mismo
   * task. Esto materializa cualquier sección lazy entre el usuario y el
   * destino (componentes con whileInView, ResizeObserver del footer, etc.)
   * sin que el navegador llegue a pintar el salto. Así la medición que sigue
   * usa un layout estable. */
  const docMax = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  window.scrollTo(0, docMax);
  const destination = measureDestination(target);
  window.scrollTo(0, startY);

  if (Math.abs(destination - startY) < 1) return;

  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / SCROLL_DURATION_MS);
    const eased = easeInOutCubic(progress);
    const next = startY + (destination - startY) * eased;
    window.scrollTo(0, next);
    if (progress < 1) {
      requestAnimationFrame(step);
      return;
    }
    window.scrollTo(0, measureDestination(target));
  };

  requestAnimationFrame(step);
}

export function FloatingContactCta() {
  const { t } = useI18n();
  const label = t("nav.cta");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (!document.getElementById(CONTACT_ID)) return;

    event.preventDefault();
    smoothScrollTargetBottomToViewportBottom(CONTACT_ID);

    if (window.location.hash !== `#${CONTACT_ID}`) {
      window.history.replaceState(null, "", `#${CONTACT_ID}`);
    }
  };

  return (
    <a
      className={styles.pill}
      href={CONTACT_HREF}
      aria-label={`${label}, ir a contacto`}
      onClick={handleClick}
    >
      <span className={styles.iconStack} aria-hidden>
        <MessageSquare
          className={`${styles.icon} ${styles.iconRest}`}
          size={20}
          strokeWidth={1.75}
        />
        <MessageSquareMore
          className={`${styles.icon} ${styles.iconHover}`}
          size={20}
          strokeWidth={1.75}
        />
      </span>
    </a>
  );
}
